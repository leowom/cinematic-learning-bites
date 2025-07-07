import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const LLMFundamentals = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

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

  const lessons = [
    {
      id: 0,
      title: "Dentro un LLM: cosa fa e come parlarci in modo efficace",
      duration: "8:12",
      completed: false,
      current: true,
      description: "Esplora il funzionamento interno dei Large Language Models e impara le tecniche più efficaci per comunicare con l'AI"
    }
  ];

  const currentLessonData = lessons[currentLesson];
  const progressPercentage = (lessons.filter(l => l.completed).length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'}}>
      <div className="prompt-lab-container">
        {/* Header - Same as Prompt Lab */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium">
              LLM Fundamentals
            </div>
            <div className="text-slate-400 text-sm">
              Passo 1 di 1
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: {Math.round(progressPercentage)}%
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Lista Lezioni */}
          <div className="col-span-12 lg:col-span-4">
            <div className="step-card glassmorphism-base">
              <div className="section-spacing">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                  Contenuti del Corso
                </h3>
                
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                        lesson.current 
                          ? 'bg-blue-900/30 border-blue-500/50 shadow-lg' 
                          : lesson.completed
                          ? 'bg-emerald-900/20 border-emerald-700/40 hover:bg-emerald-900/30'
                          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setCurrentLesson(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : lesson.current ? (
                            <Play className="w-5 h-5 text-blue-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                          )}
                          <span className={`font-medium text-sm ${
                            lesson.current ? 'text-blue-300' : lesson.completed ? 'text-emerald-300' : 'text-slate-300'
                          }`}>
                            Lezione {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center text-slate-400 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {lesson.duration}
                        </div>
                      </div>
                      <h4 className={`font-semibold text-sm mb-1 ${
                        lesson.current ? 'text-white' : 'text-slate-200'
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Video Player */}
          <div className="col-span-12 lg:col-span-8">
            <div className="step-card glassmorphism-base">
              <div className="section-spacing">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {currentLessonData.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-slate-400 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      AI Expert
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentLessonData.duration}
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
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

                {/* Descrizione */}
                <div className="element-spacing">
                  <h3 className="text-lg font-semibold text-white mb-3">Descrizione della Lezione</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {currentLessonData.description}. In questo modulo approfondiremo l'architettura 
                    e il funzionamento dei Large Language Models, scoprendo le migliori pratiche 
                    per una comunicazione efficace e strategie avanzate di prompt engineering.
                  </p>
                  
                  <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-4">
                    <h4 className="text-purple-300 font-medium mb-2">🧠 Argomenti Trattati</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Architettura e meccanismi di funzionamento degli LLM</li>
                      <li>• Tecniche di prompt engineering per risultati ottimali</li>
                      <li>• Limitazioni e bias dei modelli linguistici</li>
                      <li>• Strategie per conversazioni più efficaci con l'AI</li>
                      <li>• Best practices per diverse tipologie di task</li>
                    </ul>
                  </div>
                </div>

                {/* Quiz Section */}
                {!showQuiz ? (
                  <div className="flex justify-between items-center mt-6">
                    <Button
                      onClick={() => navigate('/introduzione')}
                      variant="ghost"
                      className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                    >
                      ← Modulo Precedente
                    </Button>
                    <Button
                      onClick={() => setShowQuiz(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Inizia Quiz di Validazione
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6">
                    {!quizCompleted ? (
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                        <div className="flex items-center mb-6">
                          <Award className="w-6 h-6 mr-3 text-yellow-400" />
                          <h3 className="text-xl font-semibold text-white">Quiz di Validazione</h3>
                        </div>
                        
                        <div className="space-y-6">
                          {quizQuestions.map((question, index) => (
                            <div key={question.id} className="bg-slate-700/30 border border-slate-600/40 rounded-lg p-5">
                              <h4 className="text-white font-medium mb-4 text-lg">
                                {index + 1}. {question.question}
                              </h4>
                              
                              <RadioGroup
                                value={answers[question.id] || ''}
                                onValueChange={(value) => handleAnswerChange(question.id, value)}
                                className="space-y-3"
                              >
                                {question.options.map((option) => (
                                  <div key={option.id} className="flex items-center space-x-3">
                                    <RadioGroupItem 
                                      value={option.id} 
                                      id={`q${question.id}_${option.id}`}
                                      className="border-slate-400 text-blue-400"
                                    />
                                    <Label 
                                      htmlFor={`q${question.id}_${option.id}`}
                                      className="text-slate-200 cursor-pointer flex-1 hover:text-white transition-colors"
                                    >
                                      <span className="font-medium text-blue-300 mr-2">{option.id})</span>
                                      {option.text}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-8">
                          <Button
                            onClick={() => setShowQuiz(false)}
                            variant="ghost"
                            className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                          >
                            ← Torna al Video
                          </Button>
                          <Button
                            onClick={submitQuiz}
                            disabled={!isQuizComplete}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Invia Risposte ({Object.keys(answers).length}/{quizQuestions.length})
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
                        <div className="mb-6">
                          <Award className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                          <h3 className="text-2xl font-bold text-white mb-2">Quiz Completato!</h3>
                          <p className="text-slate-300 text-lg">
                            Hai risposto correttamente a <span className="text-emerald-400 font-bold">{score}</span> domande su {quizQuestions.length}
                          </p>
                        </div>
                        
                        <div className="mb-6">
                          <div className={`inline-block px-6 py-3 rounded-lg font-semibold text-lg ${
                            score >= 6 
                              ? 'bg-emerald-900/30 border border-emerald-600/50 text-emerald-300' 
                              : score >= 4 
                              ? 'bg-yellow-900/30 border border-yellow-600/50 text-yellow-300'
                              : 'bg-red-900/30 border border-red-600/50 text-red-300'
                          }`}>
                            {score >= 6 ? '🎉 Eccellente!' : score >= 4 ? '👍 Buon Lavoro!' : '📚 Rivedi il Materiale'}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {score < 6 && (
                            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4 mb-4">
                              <p className="text-blue-300 text-sm">
                                💡 Consiglio: Rivedi il video per consolidare le tue conoscenze sugli LLM
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-center gap-4">
                            <Button
                              onClick={resetQuiz}
                              variant="ghost"
                              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Riprova Quiz
                            </Button>
                            {score >= 4 && (
                              <Button
                                onClick={() => navigate('/ai-tutorial-interactive')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Prossimo Tutorial →
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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