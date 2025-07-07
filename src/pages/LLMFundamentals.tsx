import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const LLMFundamentals = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);

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

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={() => navigate('/introduzione')}
                    variant="ghost"
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                  >
                    ← Modulo Precedente
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Completa Modulo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMFundamentals;