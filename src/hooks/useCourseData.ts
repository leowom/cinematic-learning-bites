
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useCourseData = (userId: string | null, courseId?: string) => {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (courseId) {
      fetchSpecificCourse(courseId);
    } else {
      fetchDefaultCourse();
    }
  }, [userId, courseId]);

  const fetchSpecificCourse = async (id: string) => {
    try {
      setLoading(true);
      const course = await fetchCourseById(id);
      if (course) {
        setCourseData(course);
        calculateProgress(course);
        
        // Auto-enroll user if not already enrolled
        if (userId) {
          await autoEnrollUser(userId, id);
        }
      }
    } catch (error) {
      console.error('Error fetching specific course:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultCourse = async () => {
    try {
      setLoading(true);
      
      // Fetch all courses
      const { data: courses } = await supabase
        .from('courses')
        .select(`
          *,
          modules (
            *,
            lessons (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (!courses || courses.length === 0) return;

      const processedCourses = await Promise.all(
        courses.map(course => processCourseData(course, userId))
      );

      setAllCourses(processedCourses);
      
      // Set the most recent course as default, or the hardcoded one if it exists
      const defaultCourse = processedCourses.find(c => c.id === 'corso-prompting') || processedCourses[0];
      if (defaultCourse) {
        setCourseData(defaultCourse);
        calculateProgress(defaultCourse);
        
        // Auto-enroll user if not already enrolled
        if (userId) {
          await autoEnrollUser(userId, defaultCourse.id);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseById = async (id: string) => {
    const { data: course } = await supabase
      .from('courses')
      .select(`
        *,
        modules (
          *,
          lessons (*)
        )
      `)
      .eq('id', id)
      .single();

    if (!course) return null;
    return await processCourseData(course, userId);
  };

  const processCourseData = async (course: any, userId: string | null) => {
    // Fetch user progress only if user is logged in
    let userProgress = null;
    if (userId) {
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);
      userProgress = data;
    }

    // Process the data
    const processedModules = course.modules
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((module: any) => {
        const sortedLessons = module.lessons
          .sort((a: any, b: any) => a.order_index - b.order_index);

        const lessonsWithProgress = sortedLessons.map((lesson: any, index: number) => {
          const progress = userProgress?.find(p => p.lesson_id === lesson.id);
          const completed = progress?.completed || false;
          
          // Determine if lesson is locked
          let locked = false;
          if (index > 0) {
            // Check if previous lesson is completed
            const prevLesson = sortedLessons[index - 1];
            const prevProgress = userProgress?.find(p => p.lesson_id === prevLesson.id);
            locked = !prevProgress?.completed;
          }

          return {
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration || '10 min',
            completed,
            locked,
            route: lesson.route || `/course/${course.id}/lesson/${lesson.id}`,
            description: lesson.description || '',
            order_index: lesson.order_index,
            content: lesson.content,
            slides: lesson.slides,
            examples: lesson.examples
          };
        });

        const completedLessons = lessonsWithProgress.filter(l => l.completed).length;
        const totalLessons = lessonsWithProgress.length;
        const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
        if (completionRate === 100) status = 'completed';
        else if (completionRate > 0) status = 'in-progress';

        return {
          id: module.id,
          title: module.title,
          description: module.description || '',
          totalDuration: module.total_duration || '60 min',
          completionRate,
          status,
          lessons: lessonsWithProgress,
          order_index: module.order_index
        };
      });

    return {
      id: course.id,
      title: course.title,
      description: course.description || '',
      totalDuration: course.total_duration || '2 ore',
      modules: processedModules
    };
  };

  const calculateProgress = (course: Course) => {
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => lesson.completed).length, 0);
    const overall = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    setOverallProgress(overall);
  };

  const autoEnrollUser = async (userId: string, courseId: string) => {
    try {
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('user_enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (!existingEnrollment) {
        // Auto-enroll the user
        await supabase
          .from('user_enrollments')
          .insert({
            user_id: userId,
            course_id: courseId,
            status: 'active'
          });
      }
    } catch (error) {
      console.error('Error with auto-enrollment:', error);
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
    refetch: courseId ? () => fetchSpecificCourse(courseId) : fetchDefaultCourse,
    switchCourse
  };
};
