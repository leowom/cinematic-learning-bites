
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, CheckCircle, Lock, BookOpen, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  route: string;
  description: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  completionRate: number;
  status: 'not-started' | 'in-progress' | 'completed';
  lessons: Lesson[];
}

const CourseIndex = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<{first_name?: string} | null>(null);

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

  // Get random motivational phrase
  const getRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    return motivationalPhrases[randomIndex];
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
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

  const modules: Module[] = [
    {
      id: 'introduzione',
      title: 'Introduzione',
      description: 'Scopri i fondamenti dell\'intelligenza artificiale e come può trasformare il tuo lavoro',
      totalDuration: '13:54',
      completionRate: 100,
      status: 'completed',
      lessons: [
        {
          id: 1,
          title: "Introduzione all'AI",
          duration: "13:54",
          completed: true,
          locked: false,
          route: '/introduzione',
          description: "Scopri i fondamenti dell'intelligenza artificiale"
        }
      ]
    },
    {
      id: 'modulo-1',
      title: 'Modulo 1 - LLM Fundamentals',
      description: 'Comprendi il funzionamento dei Large Language Models e come utilizzarli efficacemente',
      totalDuration: '63:12',
      completionRate: 33,
      status: 'in-progress',
      lessons: [
        {
          id: 1,
          title: "Dentro un LLM: cosa fa e come parlarci",
          duration: "8:12",
          completed: true,
          locked: false,
          route: '/llm-fundamentals',
          description: "Esplora il funzionamento interno dei Large Language Models"
        },
        {
          id: 2,
          title: "Scopri come l'IA può aiutarti nel tuo lavoro",
          duration: "25:00",
          completed: false,
          locked: false,
          route: '/ai-work-helper',
          description: "Esperienza interattiva per personalizzare l'AI al tuo lavoro"
        },
        {
          id: 3,
          title: "Iterazione e Miglioramento dei Prompt",
          duration: "30:00",
          completed: false,
          locked: false,
          route: '/prompt-iteration',
          description: "Impara l'arte del prompt engineering iterativo"
        }
      ]
    },
    {
      id: 'modulo-2',
      title: 'Modulo 2 - Prompting',
      description: 'Padroneggia le tecniche avanzate di prompting per ottenere risultati ottimali',
      totalDuration: '120:36',
      completionRate: 100,
      status: 'completed',
      lessons: [
        {
          id: 1,
          title: "Prompting",
          duration: "10:00",
          completed: true,
          locked: false,
          route: '/prompting',
          description: "Introduzione alle tecniche di prompting"
        },
        {
          id: 2,
          title: "Il potere del contesto nel prompting",
          duration: "10:00",
          completed: true,
          locked: false,
          route: '/contesto',
          description: "Come utilizzare il contesto per migliorare i prompt"
        },
        {
          id: 3,
          title: "Prompting Avanzato e Strategie di Comunicazione",
          duration: "25:36",
          completed: true,
          locked: false,
          route: '/ai-tutorial-interactive',
          description: "Tecniche avanzate per una comunicazione efficace con l'AI"
        },
        {
          id: 4,
          title: "Role Instruction",
          duration: "10:00",
          completed: true,
          locked: false,
          route: '/role-instruction',
          description: "Come definire ruoli specifici per l'AI"
        },
        {
          id: 5,
          title: "Edit Output",
          duration: "10:00",
          completed: true,
          locked: false,
          route: '/edit-output',
          description: "Tecniche per modificare e migliorare gli output"
        },
        {
          id: 6,
          title: "Test Finale - Prompt Engineering Lab",
          duration: "45:00",
          completed: true,
          locked: false,
          route: '/prompt-lab',
          description: "Laboratorio completo di ingegneria dei prompt"
        }
      ]
    },
    {
      id: 'modulo-3',
      title: 'Modulo 3 - Applicazioni Avanzate',
      description: 'Applica l\'AI a casi d\'uso specifici e crea soluzioni innovative',
      totalDuration: '45:00',
      completionRate: 67,
      status: 'in-progress',
      lessons: [
        {
          id: 1,
          title: "PDF + Prompt Engineering",
          duration: "15:00",
          completed: true,
          locked: false,
          route: '/module3-pdf-prompt',
          description: "Analisi intelligente di documenti PDF"
        },
        {
          id: 2,
          title: "Text-to-Image con AI",
          duration: "15:00",
          completed: true,
          locked: false,
          route: '/module3-image-generator',
          description: "Generazione di immagini da prompt testuali"
        },
        {
          id: 3,
          title: "Code by Prompt",
          duration: "15:00",
          completed: false,
          locked: false,
          route: '/module3-code-by-prompt',
          description: "Crea app funzionanti con l'AI"
        }
      ]
    }
  ];

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = modules.reduce((acc, module) => 
    acc + module.lessons.filter(l => l.completed).length, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.locked) {
      navigate(lesson.route);
    }
  };

  const getStatusIcon = (status: Module['status']) => {
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

  return (
    <div className="prompt-lab-container">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left side - Course info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/85e8a1d7-8421-46a8-88ef-d4a3206a8fe7.png" 
                  alt="Course Icon" 
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI & LLM Fundamentals</h1>
                <p className="text-slate-300">Corso completo sull'Intelligenza Artificiale</p>
              </div>
            </div>
            
            {/* Right side - Stats */}
            <div className="flex items-center space-x-6">
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
                {getRandomPhrase()}
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
                Impara i concetti fondamentali dell'Intelligenza Artificiale e dei Large Language Models. 
                Scopri come utilizzare e integrare modelli AI nelle tue applicazioni professionali.
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
            {modules.map((module) => (
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
                          {module.totalDuration}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-white mb-1">
                        {module.completionRate}% completo
                      </div>
                      <div className="w-24 bg-slate-700/60 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(module.completionRate)}`}
                          style={{ width: `${module.completionRate}%` }}
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

export default CourseIndex;
