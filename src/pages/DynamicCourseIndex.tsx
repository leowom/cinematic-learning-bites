
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, CheckCircle, Lock, BookOpen, ChevronRight, Settings, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useCourseData } from '@/hooks/useCourseData';
import { useUserProgress } from '@/hooks/useUserProgress';

const DynamicCourseIndex = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<{first_name?: string} | null>(null);

  const { courseData, loading, overallProgress, refetch } = useCourseData(user?.id, courseId);
  const { markLessonComplete, markLessonAccessed } = useUserProgress();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLessonClick = async (lesson: any) => {
    if (lesson.locked) return;
    
    if (user?.id) {
      await markLessonAccessed(lesson.id, user.id);
    }
    
    navigate(`/course/${courseId}/lesson/${lesson.id}`);
  };

  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-blue-400" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-500" />;
    }
  };

  const getProgressColor = (rate: number) => {
    if (rate === 100) return 'bg-emerald-500';
    if (rate > 0) return 'bg-blue-500';
    return 'bg-slate-600';
  };

  if (loading) {
    return (
      <div className="prompt-lab-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Caricamento corso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="prompt-lab-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Corso non trovato</p>
            <button
              onClick={() => navigate('/course-index')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Torna ai corsi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalLessons = courseData.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = courseData.modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.completed).length, 0);

  return (
    <div className="prompt-lab-container">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/course-index')}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-white"
                title="Torna ai corsi"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{courseData.title}</h1>
                <p className="text-slate-300">{courseData.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-white"
                title="Impostazioni"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{overallProgress}%</div>
                <div className="text-sm text-slate-400">Completato</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{completedLessons}</div>
                <div className="text-sm text-slate-400">di {totalLessons} lezioni</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {user && (
        <div className="bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/30 py-6 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                Bentornato, {userProfile?.first_name || 'Studente'}! 👋
              </h2>
              <p className="text-slate-300 text-lg">
                Continua il tuo percorso di apprendimento con questo corso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <main className="p-8 max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Course Overview */}
            <div className="step-card glassmorphism-base p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Panoramica del Corso</h2>
              <p className="text-slate-300 mb-6">
                {courseData.description}
              </p>
              
              <div className="w-full bg-slate-700/60 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="text-sm text-slate-400 text-center">
                Progresso complessivo: {overallProgress}%
              </div>
            </div>

            {/* Modules */}
            {courseData?.modules.map((module) => (
              <div key={module.id} className="step-card glassmorphism-base overflow-hidden">
                <div className="p-6 border-b border-slate-700/40">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {getStatusIcon(module.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {module.title}
                        </h3>
                        <p className="text-slate-300 text-sm mb-2">
                          {module.description}
                        </p>
                        <div className="flex items-center text-slate-400 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {module.total_duration}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-white mb-1">
                        {module.completion_rate}% completo
                      </div>
                      <div className="w-24 bg-slate-700/60 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(module.completion_rate)}`}
                          style={{ width: `${module.completion_rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-slate-700/40">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-4 transition-all duration-200 cursor-pointer ${
                        lesson.locked 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-slate-800/40'
                      } ${lesson.completed ? 'bg-emerald-900/20' : ''}`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {lesson.locked ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                          )}
                          
                          <div>
                            <h4 className={`font-medium ${
                              lesson.completed ? 'text-emerald-300' : 'text-white'
                            }`}>
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-slate-400">
                              {lesson.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-slate-400 text-sm">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}
                          </div>
                          {!lesson.locked && !lesson.completed && user && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markLessonComplete(lesson.id, user.id).then((success) => {
                                  if (success) refetch();
                                });
                              }}
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                            >
                              Completa
                            </button>
                          )}
                          {!lesson.locked && (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DynamicCourseIndex;
