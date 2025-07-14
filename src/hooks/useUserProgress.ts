import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useUserProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const markLessonComplete = async (lessonId: string, userId: string) => {
    if (!userId) return false;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      toast({
        title: "Progresso salvato",
        description: "La lezione è stata completata con successo!",
      });

      return true;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare il progresso.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const markLessonAccessed = async (lessonId: string, userId: string) => {
    if (!userId) return;

    try {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          last_accessed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  };

  const resetProgress = async (userId: string) => {
    if (!userId) return false;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Progresso azzerato",
        description: "Tutti i progressi sono stati rimossi.",
      });

      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast({
        title: "Errore",
        description: "Non è stato possibile azzerare il progresso.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    markLessonComplete,
    markLessonAccessed,
    resetProgress,
    updating
  };
};