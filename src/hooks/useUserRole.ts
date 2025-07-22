import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'instructor' | 'student';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
}

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }

        // Fetch user profile with role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setUserRole('student'); // Default to student if no profile found
          setUserProfile(null);
        } else {
          setUserRole(profile.role as UserRole);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole('student');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const isAdmin = () => userRole === 'admin';
  const isInstructor = () => userRole === 'instructor';
  const isStudent = () => userRole === 'student';
  const canManageContent = () => userRole === 'admin' || userRole === 'instructor';

  return {
    userRole,
    userProfile,
    loading,
    isAdmin,
    isInstructor,
    isStudent,
    canManageContent
  };
};