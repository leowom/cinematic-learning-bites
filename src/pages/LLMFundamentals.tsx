import React, { useState } from 'react';
import { Home, RotateCcw, User, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import CourseSidebar from '@/components/CourseSidebar';

const LLMFundamentals = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['modulo-1']);

  const quizQuestions = [
    {
      id: 0,
      question: "ChatGPT è come:",
      options: [
        { id: 'A', text: 'Un motore di ricerca che trova risposte su internet' },
        { id: 'B', text: 'Un assistente che genera risposte basandosi sul suo training' },
        { id: 'C', text: 'Una persona che sa tutto' }
      ],
      correct: 'B'
    },
    {
      id: 1,
      question: "Quando ChatGPT non capisce, è meglio:",
      options: [
        { id: 'A', text: 'Ripetere la stessa domanda più volte' },
        { id: 'B', text: 'Riformulare con più dettagli' },
        { id: 'C', text: 'Arrabbiarsi e cambiare argomento' }
      ],
      correct: 'B'
    },
    {
      id: 2,
      question: "Chiarezza nella comunicazione: Quale richiesta è più efficace?",
      options: [
        { id: 'A', text: '"Aiutami con il lavoro"' },
        { id: 'B', text: '"Scrivi un riassunto di 200 parole su..."' },
        { id: 'C', text: '"Puoi fare quella cosa che serve?"' }
      ],
      correct: 'B'
    },
    {
      id: 3,
      question: "Per ottenere il formato giusto devi:",
      options: [
        { id: 'A', text: 'Sperare che ChatGPT indovini' },
        { id: 'B', text: 'Specificare chiaramente cosa vuoi' },
        { id: 'C', text: 'Continuare a provare finché non funziona' }
      ],
      correct: 'B'
    },
    {
      id: 4,
      question: "Gestione aspettative: Se la prima risposta non è perfetta:",
      options: [
        { id: 'A', text: 'ChatGPT è rotto' },
        { id: 'B', text: 'È normale, posso guidarlo verso quello che voglio' },
        { id: 'C', text: 'Devo cambiare strumento' }
      ],
      correct: 'B'
    },
    {
      id: 5,
      question: "ChatGPT funziona meglio quando:",
      options: [
        { id: 'A', text: 'Gli dai istruzioni precise e contesto' },
        { id: 'B', text: 'Gli parli come a un amico' },
        { id: 'C', text: 'Gli fai una domanda veloce senza spiegazioni' }
      ],
      correct: 'A'
    },
    {
      id: 6,
      question: "Mentalità corretta: L'AI è uno strumento che:",
      options: [
        { id: 'A', text: 'Pensa come un umano' },
        { id: 'B', text: 'Segue le istruzioni che gli dai' },
        { id: 'C', text: 'Sa sempre cosa vuoi senza spiegazioni' }
      ],
      correct: 'B'
    },
    {
      id: 7,
      question: "Cosa aspettarsi da ChatGPT:",
      options: [
        { id: 'A', text: 'Perfezione al primo tentativo' },
        { id: 'B', text: 'Un buon punto di partenza da rifinire' },
        { id: 'C', text: 'Che legga nella tua mente' }
      ],
      correct: 'B'
    }
  ];

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });
    return correct;
  };

  const submitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuizCompleted(false);
    setScore(0);
  };

  const isQuizComplete = Object.keys(answers).length === quizQuestions.length;

  const allModules = [
    {
      id: 'introduzione',
      title: 'Introduzione',
      description: 'Introduzione all\'AI',
      duration: '13:54',
      completed: true,
      route: '/introduzione',
      lessons: [
        {
          id: 0,
          title: "Introduzione all'AI",
          duration: "13:54",
          completed: true,
          current: false,
          description: "Scopri i fondamenti dell'intelligenza artificiale e come può trasformare il tuo business"
        }
      ]
    },
    {
      id: 'modulo-1',
      title: 'Modulo 1 - LLM Fundamentals',
      description: 'Fondamenti dei Large Language Models',
      duration: '8:12',
      completed: false,
      route: '/llm-fundamentals',
      lessons: [
        {
          id: 0,
          title: "Dentro un LLM: cosa fa e come parlarci in modo efficace",
          duration: "8:12",
          completed: false,
          current: true,
          description: "Esplora il funzionamento interno dei Large Language Models e impara le tecniche più efficaci per comunicare con l'AI"
        }
      ]
    }
  ];

  const lessons = allModules.find(m => m.id === 'modulo-1')?.lessons || [];
  const currentLessonData = lessons[currentLesson];
  
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

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden" style={{background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'}}>
      {/* Compact Header */}
      <div className="flex items-center justify-between py-2 px-6 bg-slate-800/30 border-b border-slate-700/40">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
        >
          <Home className="w-4 h-4 mr-2" />
          Dashboard
        </Button>

        <div className="text-center">
          <div className="text-slate-200 font-medium text-sm">LLM Fundamentals</div>
          <div className="text-slate-400 text-xs">Passo 1 di 1</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-slate-300 text-xs">Progresso: {Math.round(progressPercentage)}%</div>
          <div className="w-20 bg-slate-700/60 rounded-full h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        <CourseSidebar 
          currentModuleId="modulo-1"
          currentLessonId="0"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content - Horizontal Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            
            {/* Left Column - Video */}
            <div className="flex-1 min-w-0 p-4">
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 h-full flex flex-col">
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-white mb-1">
                    {currentLessonData.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-slate-400 text-xs">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      AI Expert
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {currentLessonData.duration}
                    </div>
                  </div>
                </div>

                {/* Video Player - Takes most space */}
                <div className="flex-1 relative bg-black rounded-lg overflow-hidden mb-3">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/hMh0bPpC_EY?rel=0&modestbranding=1"
                    title={currentLessonData.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Bottom Navigation */}
                {!showQuiz ? (
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => navigate('/introduzione')}
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                    >
                      ← Precedente
                    </Button>
                    <Button
                      onClick={() => setShowQuiz(true)}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Inizia Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => setShowQuiz(false)}
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                    >
                      ← Torna al Video
                    </Button>
                    {quizCompleted && score >= 4 && (
                      <Button
                        onClick={() => navigate('/ai-work-helper')}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Modulo 1.2 →
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Description & Quiz */}
            <div className="w-1/2 min-w-0 p-4 overflow-y-auto">
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 h-full">
                
                {!showQuiz ? (
                  <>
                    {/* Descrizione Compatta */}
                    <h3 className="text-lg font-semibold text-white mb-2">Descrizione</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      {currentLessonData.description}. Approfondiremo l'architettura dei Large Language Models 
                      e le migliori pratiche per una comunicazione efficace.
                    </p>
                    
                    <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-3">
                      <h4 className="text-purple-300 font-medium mb-2 text-sm">🧠 Argomenti</h4>
                      <ul className="text-slate-300 text-xs space-y-1">
                        <li>• Architettura e meccanismi degli LLM</li>
                        <li>• Tecniche di prompt engineering</li>
                        <li>• Limitazioni e bias dei modelli</li>
                        <li>• Strategie per conversazioni efficaci</li>
                        <li>• Best practices per diversi task</li>
                      </ul>
                    </div>
                  </>
                ) : !quizCompleted ? (
                  <>
                    <div className="flex items-center mb-3">
                      <Award className="w-4 h-4 mr-2 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">Quiz di Validazione</h3>
                    </div>
                    
                    <div className="space-y-3 mb-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {quizQuestions.map((question, index) => (
                        <div key={question.id} className="bg-slate-700/30 border border-slate-600/40 rounded-lg p-3">
                          <h4 className="text-white font-medium mb-2 text-sm">
                            {index + 1}. {question.question}
                          </h4>
                          
                          <RadioGroup
                            value={answers[question.id] || ''}
                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                            className="space-y-1"
                          >
                            {question.options.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value={option.id} 
                                  id={`q${question.id}_${option.id}`}
                                  className="border-slate-400 text-blue-400"
                                />
                                <Label 
                                  htmlFor={`q${question.id}_${option.id}`}
                                  className="text-slate-200 cursor-pointer flex-1 hover:text-white transition-colors text-xs"
                                >
                                  <span className="font-medium text-blue-300 mr-1">{option.id})</span>
                                  {option.text}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={submitQuiz}
                      disabled={!isQuizComplete}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                    >
                      Invia Risposte ({Object.keys(answers).length}/{quizQuestions.length})
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <Award className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                      <h3 className="text-lg font-bold text-white mb-2">Quiz Completato!</h3>
                      <p className="text-slate-300 text-sm">
                        Punteggio: <span className="text-emerald-400 font-bold">{score}/{quizQuestions.length}</span>
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
                        score >= 6 
                          ? 'bg-emerald-900/30 border border-emerald-600/50 text-emerald-300' 
                          : score >= 4 
                          ? 'bg-yellow-900/30 border border-yellow-600/50 text-yellow-300'
                          : 'bg-red-900/30 border border-red-600/50 text-red-300'
                      }`}>
                        {score >= 6 ? '🎉 Eccellente!' : score >= 4 ? '👍 Buon Lavoro!' : '📚 Rivedi il Materiale'}
                      </div>
                    </div>
                    
                    {score < 6 && (
                      <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3 mb-4">
                        <p className="text-blue-300 text-xs">
                          💡 Rivedi il video per consolidare le conoscenze
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Button
                        onClick={resetQuiz}
                        variant="ghost"
                        size="sm"
                        className="w-full text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                      >
                        <RotateCcw className="w-3 h-3 mr-2" />
                        Riprova Quiz
                      </Button>
                      {score >= 4 && (
                        <Button
                          onClick={() => navigate('/ai-work-helper')}
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Modulo 1.2 →
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMFundamentals;