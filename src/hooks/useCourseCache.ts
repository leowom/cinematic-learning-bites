import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CourseCache {
  courses: any[];
  courseData: Record<string, any>;
  userProgress: Record<string, any[]>;
  lastFetch: Record<string, number>;
}

// Global cache to share between components
let globalCache: CourseCache = {
  courses: [],
  courseData: {},
  userProgress: {},
  lastFetch: {}
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCourseCache = () => {
  const [cache, setCache] = useState<CourseCache>(globalCache);
  const [loading, setLoading] = useState(false);

  const isCacheValid = useCallback((key: string) => {
    const lastFetch = cache.lastFetch[key];
    return lastFetch && (Date.now() - lastFetch) < CACHE_DURATION;
  }, [cache.lastFetch]);

  const fetchAllCourses = useCallback(async () => {
    if (isCacheValid('courses') && cache.courses.length > 0) {
      return cache.courses;
    }

    try {
      setLoading(true);
      const { data: courses } = await supabase
        .from('courses')
        .select('*,modules(*,lessons(*))')
        .order('created_at', { ascending: false });

      const newCache = {
        ...cache,
        courses: courses || [],
        lastFetch: { ...cache.lastFetch, courses: Date.now() }
      };

      globalCache = newCache;
      setCache(newCache);
      return courses || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cache, isCacheValid]);

  const fetchCourseData = useCallback(async (courseId: string) => {
    if (isCacheValid(`course_${courseId}`) && cache.courseData[courseId]) {
      return cache.courseData[courseId];
    }

    try {
      setLoading(true);
      const { data: course } = await supabase
        .from('courses')
        .select('*,modules(*,lessons(*))')
        .eq('id', courseId)
        .single();

      const newCache = {
        ...cache,
        courseData: { ...cache.courseData, [courseId]: course },
        lastFetch: { ...cache.lastFetch, [`course_${courseId}`]: Date.now() }
      };

      globalCache = newCache;
      setCache(newCache);
      return course;
    } catch (error) {
      console.error('Error fetching course data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache, isCacheValid]);

  const fetchUserProgress = useCallback(async (userId: string) => {
    if (isCacheValid(`progress_${userId}`) && cache.userProgress[userId]) {
      return cache.userProgress[userId];
    }

    try {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      const newCache = {
        ...cache,
        userProgress: { ...cache.userProgress, [userId]: progress || [] },
        lastFetch: { ...cache.lastFetch, [`progress_${userId}`]: Date.now() }
      };

      globalCache = newCache;
      setCache(newCache);
      return progress || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }, [cache, isCacheValid]);

  const invalidateCache = useCallback((key?: string) => {
    if (key) {
      const newCache = {
        ...cache,
        lastFetch: { ...cache.lastFetch, [key]: 0 }
      };
      globalCache = newCache;
      setCache(newCache);
    } else {
      const newCache = {
        courses: [],
        courseData: {},
        userProgress: {},
        lastFetch: {}
      };
      globalCache = newCache;
      setCache(newCache);
    }
  }, [cache]);

  return {
    fetchAllCourses,
    fetchCourseData,
    fetchUserProgress,
    invalidateCache,
    loading,
    cache
  };
};