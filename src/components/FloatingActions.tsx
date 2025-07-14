
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassmorphismCard from './GlassmorphismCard';
import { useCourseData } from '@/hooks/useCourseData';
import { supabase } from '@/integrations/supabase/client';
import { Play, Search, BarChart3 } from 'lucide-react';

const FloatingActions = () => {
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

  // Get next available lesson
  const getNextLesson = () => {
    if (!courseData) return null;
    
    for (const module of courseData.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed && !lesson.locked) {
          return lesson;
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  const actions = [
    {
      icon: Play,
      label: 'Continua corso',
      subtitle: 'Thinking with AI',
      gradient: 'from-blue-500 to-blue-600',
      onClick: () => {
        if (nextLesson) {
          navigate(nextLesson.route);
        } else {
          navigate('/course-index');
        }
      }
    },
    {
      icon: Search,
      label: 'Esplora nuovi',
      subtitle: 'Corsi disponibili',
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => navigate('/course-index')
    },
    {
      icon: BarChart3,
      label: 'Vedi statistiche',
      subtitle: 'I tuoi progressi',
      gradient: 'from-green-500 to-green-600',
      onClick: () => navigate('/analytics')
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6">
      <GlassmorphismCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          Azioni Rapide
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium group-hover:text-white transition-colors">
                    {action.label}
                  </div>
                  <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    {action.subtitle}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default FloatingActions;
