import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const IntroduzioneCourse = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);

  const lessons = [
    {
      id: 0,
      title: "Introduzione all'AI",
      duration: "13:54",
      completed: true,
      current: true,
      description: "Scopri i fondamenti dell'intelligenza artificiale e come può trasformare il tuo business"
    },
    {
      id: 1, 
      title: "La Roadmap verso $10,000/mese",
      duration: "33:38",
      completed: false,
      current: false,
      description: "Strategia completa per monetizzare le competenze AI"
    },
    {
      id: 2,
      title: "Selezione della Nicchia",
      duration: "24:16", 
      completed: false,
      current: false,
      description: "Come identificare la specializzazione più profittevole"
    },
    {
      id: 3,
      title: "Creare Offerte Irresistibili",
      duration: "26:23",
      completed: false,
      current: false,
      description: "Sviluppa proposte di valore che i clienti non possono rifiutare"
    },
    {
      id: 4,
      title: "Impostare l'Agenzia per il Successo",
      duration: "41:19",
      completed: false,
      current: false,
      description: "Struttura organizzativa e processi per la crescita scalabile"
    },
    {
      id: 5,
      title: "Massimizzare l'Efficienza",
      duration: "43:48",
      completed: false,
      current: false,
      description: "Ottimizzazione dei processi interni e dell'infrastruttura"
    }
  ];

  const currentLessonData = lessons[currentLesson];
  const progressPercentage = (lessons.filter(l => l.completed).length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="prompt-lab-container">
        {/* Header */}
        <div className="step-card glassmorphism-base">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna alla Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Agency Accelerator</h1>
                <p className="text-slate-400">Modulo Introduttivo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Progresso Corso</p>
                <p className="text-lg font-semibold text-emerald-400">{Math.round(progressPercentage)}% completato</p>
              </div>
              <div className="w-24">
                <Progress value={progressPercentage} className="bg-slate-700" />
              </div>
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
                      Iman Gadzhi
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
                    src="https://www.youtube.com/embed/Yq0QkCxoTHM?rel=0&modestbranding=1"
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
                    {currentLessonData.description}. In questo video fondamentale, 
                    esploreremo i concetti chiave che definiranno il tuo percorso verso il successo 
                    nell'ecosistema dell'intelligenza artificiale.
                  </p>
                  
                  <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2">💡 Punti Chiave</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Comprensione dei fondamenti dell'AI applicata al business</li>
                      <li>• Identificazione delle opportunità di mercato emergenti</li>
                      <li>• Framework strategico per l'implementazione pratica</li>
                      <li>• Metodologie per la creazione di valore sostenibile</li>
                    </ul>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
                    disabled={currentLesson === 0}
                    variant="outline"
                    className="text-slate-300 border-slate-600 hover:bg-slate-700/50 disabled:opacity-50"
                  >
                    Lezione Precedente
                  </Button>
                  
                  <Button
                    onClick={() => currentLesson < lessons.length - 1 && setCurrentLesson(currentLesson + 1)}
                    disabled={currentLesson === lessons.length - 1}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Prossima Lezione
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

export default IntroduzioneCourse;