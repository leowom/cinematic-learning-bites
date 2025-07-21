import { useNavigate } from 'react-router-dom';
import { useCourseData } from './useCourseData';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNavigation = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { courseData } = useCourseData(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Get all lessons in order across all modules
  const getAllLessonsInOrder = () => {
    if (!courseData) return [];
    
    const allLessons = courseData.modules
      .sort((a, b) => a.order_index - b.order_index)
      .flatMap(module => 
        module.lessons.sort((a, b) => a.order_index - b.order_index)
      );
    
    return allLessons;
  };

  // Get next lesson based on current route
  const getNextLesson = (currentRoute: string) => {
    const allLessons = getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex(lesson => lesson.route === currentRoute);
    
    if (currentIndex === -1 || currentIndex === allLessons.length - 1) {
      return null; // Current lesson not found or it's the last lesson
    }
    
    return allLessons[currentIndex + 1];
  };

  // Get previous lesson based on current route
  const getPreviousLesson = (currentRoute: string) => {
    const allLessons = getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex(lesson => lesson.route === currentRoute);
    
    if (currentIndex <= 0) {
      return null; // Current lesson not found or it's the first lesson
    }
    
    return allLessons[currentIndex - 1];
  };

  // Navigate to next lesson
  const goToNextLesson = (currentRoute: string) => {
    const nextLesson = getNextLesson(currentRoute);
    if (nextLesson) {
      navigate(nextLesson.route);
    }
  };

  // Navigate to previous lesson
  const goToPreviousLesson = (currentRoute: string) => {
    const previousLesson = getPreviousLesson(currentRoute);
    if (previousLesson) {
      navigate(previousLesson.route);
    }
  };

  return {
    getAllLessonsInOrder,
    getNextLesson,
    getPreviousLesson,
    goToNextLesson,
    goToPreviousLesson,
    courseData
  };
};