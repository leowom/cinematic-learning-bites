
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, CheckCircle, BookOpen, ChevronRight, Settings, Users, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useCourseData } from '@/hooks/useCourseData';

const AllCoursesIndex = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<{first_name?: string} | null>(null);

  const { allCourses, loading } = useCourseData(user?.id);

  // Motivational phrases array
  const motivationalPhrases = [
    "Cosa approfondiamo oggi?",
    "Il prossimo passo del tuo percorso ti aspetta.",
    "Continua a costruire le tue competenze, un modulo alla volta.",
    "Sei a un clic da una nuova scoperta.",
    "Studiare con costanza è il tuo superpotere.",
    "Un giorno. Una lezione. Una nuova abilità.",
    "Ogni sessione conta. Inizia quando vuoi.",
    "Hai già fatto tanto. Oggi puoi fare ancora meglio.",
    "Imparare è un viaggio: quale tappa affronti oggi?",
    "Bentornato al centro di comando del tuo apprendimento."
  ];

  const getRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    return motivationalPhrases[randomIndex];
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
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

  const getCourseProgress = (course: any) => {
    const totalLessons = course.modules.reduce((acc: number, module: any) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc: number, module: any) => 
      acc + module.lessons.filter((lesson: any) => lesson.completed).length, 0);
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const getProgressColor = (rate: number) => {
    if (rate === 100) return 'bg-emerald-500';
    if (rate > 0) return 'bg-blue-500';
    return 'bg-slate-600';
  };

  const getCourseStatus = (progress: number) => {
    if (progress === 100) return { text: 'Completato', color: 'text-emerald-400', icon: CheckCircle };
    if (progress > 0) return { text: 'In corso', color: 'text-blue-400', icon: Play };
    return { text: 'Nuovo', color: 'text-slate-400', icon: BookOpen };
  };

  if (loading) {
    return (
      <div className="prompt-lab-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Caricamento corsi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-lab-container">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">I Miei Corsi</h1>
                <p className="text-slate-300">Tutti i corsi disponibili per il tuo apprendimento</p>
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
                <div className="text-3xl font-bold text-white">{allCourses.length}</div>
                <div className="text-sm text-slate-400">Corsi disponibili</div>
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
                {getRandomPhrase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <main className="p-8 max-w-6xl mx-auto">
          {allCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nessun corso disponibile</h3>
              <p className="text-slate-400 mb-6">I corsi appariranno qui non appena saranno pubblicati.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => {
                const progress = getCourseProgress(course);
                const status = getCourseStatus(progress);
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={course.id}
                    className="step-card glassmorphism-base overflow-hidden cursor-pointer hover:bg-slate-800/40 transition-all duration-200 group"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    {/* Course Header */}
                    <div className="p-6 border-b border-slate-700/40">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors truncate">
                              {course.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`w-4 h-4 ${status.color}`} />
                              <span className={`text-sm ${status.color}`}>{status.text}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progresso</span>
                          <span className="text-white font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700/60 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Stats */}
                    <div className="p-4 bg-slate-800/20">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-white">{course.modules.length}</div>
                          <div className="text-xs text-slate-400">Moduli</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {course.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0)}
                          </div>
                          <div className="text-xs text-slate-400">Lezioni</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="flex items-center text-slate-400 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {course.total_duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllCoursesIndex;
