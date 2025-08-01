import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Play, CheckCircle, Clock, BookOpen, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCourseData } from '@/hooks/useCourseData';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  current: boolean;
  description: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  route: string;
  lessons: Lesson[];
}

interface CourseSidebarProps {
  currentModuleId?: string;
  currentLessonId?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ 
  currentModuleId, 
  currentLessonId, 
  collapsed = false, 
  onToggleCollapse 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { courseData, loading } = useCourseData(userId);
  const { markLessonAccessed } = useUserProgress();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Auto-expand the module containing the current lesson
  useEffect(() => {
    if (courseData && courseData.modules.length > 0) {
      // Find which module contains the current route
      const currentModule = courseData.modules.find(module =>
        module.lessons.some(lesson => lesson.route === location.pathname)
      );
      
      if (currentModule) {
        setExpandedModules(prev => {
          // Only add if not already present
          if (!prev.includes(currentModule.id)) {
            return [...prev, currentModule.id];
          }
          return prev;
        });
      }
    }
  }, [courseData, location.pathname]); // Removed expandedModules from dependencies

  // Usa i dati dal database quando disponibili
  const allModules: Module[] = courseData ? courseData.modules.map(module => ({
    id: module.id,
    title: module.title,
    description: module.description || '',
    duration: module.total_duration,
    completed: module.status === 'completed',
    route: module.lessons[0]?.route || `/${module.id}`,
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      completed: lesson.completed,
      current: location.pathname === lesson.route || lesson.id === currentLessonId,
      description: lesson.description || ''
    }))
  })) : [];

  const totalLessons = allModules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = allModules.reduce((acc, module) => 
    acc + module.lessons.filter(l => l.completed).length, 0);
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const navigateToModule = (route: string) => {
    navigate(route);
  };

  const handleLessonNavigation = async (lessonId: string) => {
    // Trova la lesson usando i dati dal database
    const module = courseData?.modules.find(m => m.lessons.some(l => l.id === lessonId));
    const lesson = module?.lessons.find(l => l.id === lessonId);
    
    if (!lesson) return;

    // Segna la lezione come acceduta se l'utente è loggato
    if (userId) {
      await markLessonAccessed(lesson.id, userId);
    }
    
    // Naviga alla route della lezione
    navigate(lesson.route);
  };

  return (
    <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'} flex-shrink-0`}>
      <div className="step-card glassmorphism-base sticky top-4 h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
        {collapsed ? (
          /* Collapsed State - Beautiful Progress View */
          <div className="flex flex-col items-center justify-start p-3 h-full">
            {/* Toggle Button at Top */}
            <Button
              onClick={onToggleCollapse}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 p-2 mb-6 rounded-lg"
            >
              <Menu className="w-4 h-4" />
            </Button>

            {/* Progress Circle */}
            <div className="relative w-12 h-12 mb-4">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPercentage / 100)}`}
                  className="text-emerald-400 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-400">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>

            {/* Mini Module Indicators */}
            <div className="flex flex-col space-y-2 w-full">
              {allModules.map((module) => {
                const isCurrentModule = currentModuleId === module.id || 
                  module.lessons.some(lesson => lesson.current);
                
                return (
                  <div
                    key={module.id}
                    className={`w-full h-2 rounded-full transition-all duration-200 cursor-pointer ${
                      isCurrentModule
                        ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                        : module.completed
                        ? 'bg-emerald-400'
                        : 'bg-slate-600'
                    }`}
                    onClick={() => navigateToModule(module.route)}
                    title={module.title}
                  />
                );
              })}
            </div>

            {/* Play Button for Current Module */}
            <div className="mt-auto mb-4">
              <Button
                onClick={() => {
                  const currentModule = allModules.find(m => 
                    m.id === currentModuleId || m.lessons.some(l => l.current)
                  );
                  if (currentModule) {
                    navigateToModule(currentModule.route);
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-2 rounded-lg"
              >
                <Play className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Expanded State - Full View */
          <>
            <div className="flex items-center justify-between mb-4 p-4 flex-shrink-0 border-b border-slate-700/40">
              <h3 className="text-lg font-semibold text-white flex items-center truncate">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                Corso Completo
              </h3>
              <Button
                onClick={onToggleCollapse}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 p-2 flex-shrink-0"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col flex-1 min-h-0 p-4 pt-0">
              {/* Progress Overview */}
              <div className="mb-4 p-4 bg-slate-800/40 rounded-lg border border-slate-700/30 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 text-sm font-medium">Progresso Totale</span>
                  <span className="text-emerald-400 text-sm font-bold">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2 mb-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 text-center">
                  {completedLessons} di {totalLessons} lezioni completate
                </div>
              </div>

              {/* Modules List */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-3 pr-2">
                  {allModules.map((module) => {
                    const isCurrentModule = currentModuleId === module.id || 
                      module.lessons.some(lesson => lesson.current);
                    
                    return (
                      <div key={module.id} className="border border-slate-700/40 rounded-lg overflow-hidden bg-slate-800/20">
                        <div
                          className={`p-4 cursor-pointer transition-all duration-200 ${
                            isCurrentModule
                              ? 'bg-blue-900/30 border-l-4 border-blue-400' 
                              : module.completed
                              ? 'bg-emerald-900/20 hover:bg-emerald-900/30 border-l-4 border-emerald-400'
                              : 'bg-slate-800/40 hover:bg-slate-700/50 border-l-4 border-slate-600'
                          }`}
                          onClick={() => toggleModule(module.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                              <div className="flex-shrink-0 mt-0.5">
                                {module.completed ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                                ) : isCurrentModule ? (
                                  <Play className="w-5 h-5 text-blue-400" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold text-sm leading-tight mb-1 ${
                                  isCurrentModule ? 'text-white' : 'text-slate-200'
                                }`}>
                                  {module.title}
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {module.description}
                                </p>
                                <div className="flex items-center text-slate-500 text-xs mt-2">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {module.duration}
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              {expandedModules.includes(module.id) ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {expandedModules.includes(module.id) && (
                          <div className="border-t border-slate-700/40 bg-slate-900/30">
                            {module.lessons.map((lesson, index) => (
                              <div
                                key={lesson.id}
                                className={`p-4 pl-16 cursor-pointer transition-all duration-200 border-l-4 ${
                                  lesson.current
                                    ? 'bg-blue-800/20 border-blue-400'
                                    : lesson.completed
                                    ? 'bg-emerald-800/10 hover:bg-emerald-800/20 border-emerald-400/50'
                                    : 'hover:bg-slate-700/20 border-transparent'
                                }`}
                                onClick={() => handleLessonNavigation(lesson.id)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0 pr-3">
                                    <h5 className={`text-sm font-medium leading-tight ${
                                      lesson.current ? 'text-blue-300' : 'text-slate-300'
                                    }`}>
                                      {lesson.title}
                                    </h5>
                                  </div>
                                  <div className="flex items-center text-slate-500 text-xs flex-shrink-0">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {lesson.duration}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;