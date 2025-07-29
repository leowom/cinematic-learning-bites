import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCourseCache } from './useCourseCache';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  route: string;
  description: string;
  order_index: number;
  content?: string;
  slides?: string[];
  examples?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  completionRate: number;
  status: 'not-started' | 'in-progress' | 'completed';
  lessons: Lesson[];
  order_index: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  modules: Module[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  route: string;
  duration: string;
  order_index: number;
  module_id: string;
  completed: boolean;
  locked: boolean;
  current: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
  status: 'completed' | 'in-progress' | 'locked';
  completed_lessons: number;
  total_lessons: number;
  completion_rate: number;
  total_duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  total_duration: string;
  modules: Module[];
  completed_lessons: number;
  total_lessons: number;
}

export const useCourseData = (userId: string | null, courseId?: string) => {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const { fetchAllCourses, fetchCourseData, fetchUserProgress } = useCourseCache();

  useEffect(() => {
    if (courseId) {
      fetchSpecificCourse(courseId);
    } else {
      fetchDefaultCourse();
    }
  }, [userId, courseId]);

  // Fetch specific course by ID
  const fetchSpecificCourse = async (id: string) => {
    setLoading(true);
    try {
      const course = await fetchCourseData(id);
      if (course && userId) {
        const processedCourse = await processCourseData(course, userId);
        setCourseData(processedCourse);
        setOverallProgress(calculateProgress(processedCourse));
      }
    } catch (error) {
      console.error('Error fetching specific course:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all courses and set default
  const fetchDefaultCourse = async () => {
    setLoading(true);
    try {
      const courses = await fetchAllCourses();

      if (courses && courses.length > 0) {
        setAllCourses(courses);
        
        // Process and set the first course as default
        if (userId) {
          const processedCourse = await processCourseData(courses[0], userId);
          setCourseData(processedCourse);
          setOverallProgress(calculateProgress(processedCourse));
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to fetch course by ID - now uses cache
  const fetchCourseById = async (id: string) => {
    return await fetchCourseData(id);
  };

  const processCourseData = async (course: any, userId: string | null): Promise<Course> => {
    if (!userId) {
      return {
        ...course,
        modules: course.modules?.map((module: any) => ({
          ...module,
          lessons: module.lessons?.map((lesson: any) => ({
            ...lesson,
            completed: false,
            locked: lesson.order_index > 1,
            current: lesson.order_index === 1
          })) || [],
          status: 'locked' as const,
          completed_lessons: 0,
          total_lessons: module.lessons?.length || 0,
          completion_rate: 0
        })) || [],
        completed_lessons: 0,
        total_lessons: course.modules?.reduce((total: number, module: any) => 
          total + (module.lessons?.length || 0), 0) || 0
      };
    }

    // Fetch user progress for all lessons in this course
    const userProgress = await fetchUserProgress(userId);

    const progressMap = new Map(
      userProgress.map((progress: any) => [progress.lesson_id, progress])
    );

    let courseCompletedLessons = 0;
    let courseTotalLessons = 0;

    const processedModules = course.modules?.map((module: any, moduleIndex: number) => {
      const sortedLessons = module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || [];
      let moduleCompletedLessons = 0;

      const processedLessons = sortedLessons.map((lesson: any, lessonIndex: number) => {
        const progress = progressMap.get(lesson.id);
        const completed = progress?.completed || false;
        
        if (completed) {
          moduleCompletedLessons++;
          courseCompletedLessons++;
        }
        courseTotalLessons++;

        // Determine if lesson is locked
        let locked = false;
        if (moduleIndex === 0 && lessonIndex === 0) {
          locked = false; // First lesson is never locked
        } else if (lessonIndex === 0) {
          // First lesson of subsequent modules - check if previous module is completed
          const prevModule = course.modules[moduleIndex - 1];
          const prevModuleLessons = prevModule?.lessons?.length || 0;
          let prevModuleCompleted = 0;
          
          prevModule?.lessons?.forEach((prevLesson: any) => {
            if (progressMap.get(prevLesson.id)?.completed) {
              prevModuleCompleted++;
            }
          });
          
          locked = prevModuleCompleted < prevModuleLessons;
        } else {
          // Check if previous lesson in same module is completed
          const prevLesson = sortedLessons[lessonIndex - 1];
          locked = !progressMap.get(prevLesson.id)?.completed;
        }

        return {
          ...lesson,
          completed,
          locked,
          current: !completed && !locked
        };
      });

      const moduleStatus = moduleCompletedLessons === sortedLessons.length ? 'completed' : 
                          moduleCompletedLessons > 0 ? 'in-progress' : 'locked';
      
      const completionRate = sortedLessons.length > 0 ? 
        Math.round((moduleCompletedLessons / sortedLessons.length) * 100) : 0;

      return {
        ...module,
        lessons: processedLessons,
        status: moduleStatus,
        completed_lessons: moduleCompletedLessons,
        total_lessons: sortedLessons.length,
        completion_rate: completionRate
      };
    }) || [];

    return {
      ...course,
      modules: processedModules,
      completed_lessons: courseCompletedLessons,
      total_lessons: courseTotalLessons
    };
  };

  const calculateProgress = (course: Course): number => {
    if (!course || course.total_lessons === 0) return 0;
    return Math.round((course.completed_lessons / course.total_lessons) * 100);
  };

  // Auto-enroll user in course if not already enrolled
  const autoEnrollUser = async (userId: string, courseId: string) => {
    try {
      const { data: existingEnrollment } = await supabase
        .from('user_enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (!existingEnrollment) {
        await supabase
          .from('user_enrollments')
          .insert({
            user_id: userId,
            course_id: courseId,
            enrolled_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error enrolling user:', error);
    }
  };

  const refetch = () => {
    if (courseId) {
      fetchSpecificCourse(courseId);
    } else {
      fetchDefaultCourse();
    }
  };

  const switchCourse = (courseId: string) => {
    fetchSpecificCourse(courseId);
  };

  return {
    courseData,
    allCourses,
    loading,
    overallProgress,
    refetch,
    switchCourse
  };
};
