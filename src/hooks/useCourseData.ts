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

export const useCourseData = (userId: string | null) => {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchCourseData();
  }, [userId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course data
      const { data: courses } = await supabase
        .from('courses')
        .select(`
          *,
          modules (
            *,
            lessons (*)
          )
        `)
        .eq('id', 'corso-prompting')
        .single();

      if (!courses) return;

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
      const processedModules = courses.modules
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
              duration: lesson.duration,
              completed,
              locked,
              route: lesson.route,
              description: lesson.description,
              order_index: lesson.order_index
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
            description: module.description,
            totalDuration: module.total_duration,
            completionRate,
            status,
            lessons: lessonsWithProgress,
            order_index: module.order_index
          };
        });

      // Calculate overall progress
      const totalLessons = processedModules.reduce((acc, module) => acc + module.lessons.length, 0);
      const completedLessons = processedModules.reduce((acc, module) => 
        acc + module.lessons.filter(lesson => lesson.completed).length, 0);
      const overall = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      setCourseData({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        totalDuration: courses.total_duration,
        modules: processedModules
      });

      setOverallProgress(overall);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    courseData,
    loading,
    overallProgress,
    refetch: fetchCourseData
  };
};