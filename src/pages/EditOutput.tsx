import React, { useState, useRef, useEffect } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, ArrowRight, Bot, MessageCircle, Lightbulb, ChevronDown, ChevronRight, Menu, Edit3, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import CourseSidebar from '@/components/CourseSidebar';
import { useNavigation } from '@/hooks/useNavigation';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase } from '@/integrations/supabase/client';

const EditOutput = () => {
  const navigate = useNavigate();
  const { getNextLesson, getPreviousLesson } = useNavigation();
  const { markLessonComplete } = useUserProgress();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(0); // 0: first exercise, 1: second exercise, 2: completion
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string, timestamp?: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  const initialPrompt = "Cos'è l'Intelligenza Artificiale Generativa?";
  const initialResponse = "L'intelligenza artificiale generativa è una branca dell'AI che si occupa di creare nuovi contenuti come testi, immagini, musica o codice, partendo da dati esistenti. Utilizza modelli linguistici di grandi dimensioni (LLM) per imparare e replicare la struttura del linguaggio umano o di altri segnali digitali.";

  const simplifiedResponse = "L'intelligenza artificiale generativa è una tecnologia che può creare cose nuove, come testi, immagini o musica. Lo fa imparando da tanti esempi già esistenti. È come un programma molto intelligente che ha letto milioni di cose e ora riesce a scriverne di nuove da solo.";

  const childFriendlyResponse = "L'intelligenza artificiale generativa è come un robot che legge tanti libri e poi ne inventa uno nuovo tutto da solo. Non copia, ma crea cose nuove, come storie, disegni o canzoni, proprio come fanno le persone creative.";

  const exercises = [
    {
      title: "Esercizio 1: Semplificare",
      description: "Chiedi all'AI di rendere più semplice la risposta",
      targetPrompt: "semplice",
      targetResponse: simplifiedResponse,
      instruction: "Prova a dire 'Rendilo più semplice'"
    },
    {
      title: "Esercizio 2: Spiegazione per bambini", 
      description: "Chiedi all'AI di spiegare come a un bambino",
      targetPrompt: "bambino",
      targetResponse: childFriendlyResponse,
      instruction: "Prova a dire 'Spiegamelo come se avessi 10 anni'"
    }
  ];

  const tooltips = [
    "Puoi chiedere all'AI di riscrivere, semplificare o adattare la risposta al tuo pubblico.",
    "Non servono prompt perfetti. Basta dire cosa vuoi in modo chiaro.",
    "ChatGPT è una conversazione, non un generatore a colpo singolo!"
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  // Handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const startExercise = () => {
    setShowTutorial(false);
    setCurrentExercise(0);
    // Initialize chat with the first prompt and response
    setChatMessages([
      { type: 'user', content: initialPrompt },
      { type: 'ai', content: initialResponse }
    ]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { type: 'user' as const, content: userInput }];
    setChatMessages(newMessages);
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      let aiResponse = "";
      const input = userInput.toLowerCase();
      const currentEx = exercises[currentExercise];

      if (currentExercise === 0 && (input.includes('semplice') || input.includes('semplicemente') || input.includes('più facile'))) {
        aiResponse = simplifiedResponse;
        setExerciseCompleted(true);
      } else if (currentExercise === 1 && (input.includes('10 anni') || input.includes('bambino') || input.includes('bambini') || input.includes('semplice per'))) {
        aiResponse = childFriendlyResponse;
        setExerciseCompleted(true);
      } else {
        aiResponse = `Perfetto! ${currentEx.instruction} per vedere come l'AI adatta la risposta!`;
      }

      setChatMessages([...newMessages, { type: 'ai', content: aiResponse }]);
      setIsLoading(false);
      setUserInput('');
      
      // Show tooltip after successful interaction
      if (exerciseCompleted) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 2000);
  };

  const nextExercise = async () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseCompleted(false);
      setChatMessages([
        { type: 'user', content: initialPrompt },
        { type: 'ai', content: initialResponse }
      ]);
    } else {
      // Mark lesson as complete and go to next lesson
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await markLessonComplete('edit-output', user.id);
        }
      } catch (error) {
        console.error('Error marking lesson complete:', error);
      }
      
      // Go to next lesson in the course
      const nextLesson = getNextLesson('/ai-interactive/edit-output');
      if (nextLesson) {
        navigate(nextLesson.route);
      } else {
        // If no next lesson, show completion message or navigate to dashboard
        navigate('/dashboard');
      }
    }
  };

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
        background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
      }}>
        <div className="prompt-lab-container">
          {/* Header */}
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
                Modulo 2.4 – Chiedere modifiche all'output
              </div>
              <div className="text-slate-400 text-sm">
                Esercizio Interattivo
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-sm">
                Pratica Guidata
              </div>
            </div>
          </div>

          {/* Tutorial Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base text-center">
              <div className="section-spacing">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Edit3 className="w-10 h-10 text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    ✏️ Chiedere modifiche all'output
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    Ora è il tuo turno! Sperimenta l'interazione iterativa con l'AI per affinare 
                    e migliorare le risposte in base alle tue esigenze specifiche.
                  </p>
                </div>

                <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-green-300 font-semibold mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Come funziona:
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">1.</span>
                      L'AI risponderà a una domanda iniziale
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">2.</span>
                      Tu chiederai di modificare la risposta
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">3.</span>
                      L'AI adatterà l'output alle tue richieste
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-4 mb-8 text-left max-w-2xl mx-auto">
                  <p className="text-yellow-300 text-sm">
                    <strong>💡 Suggerimenti:</strong> Prova a dire "Rendilo più semplice" o 
                    "Spiegamelo come se avessi 10 anni" per vedere come l'AI adatta la risposta!
                  </p>
                </div>

                <Button
                  onClick={startExercise}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
                >
                  Inizia a Chattare
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="prompt-lab-container">
        {/* Header */}
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
              {currentExercise === 2 ? 'Modulo 2.4 – Completato!' : exercises[currentExercise]?.title || 'Modulo 2.4 – Chiedere modifiche all\'output'}
            </div>
            <div className="text-slate-400 text-sm">
              {currentExercise === 2 ? 'Congratulazioni!' : `Esercizio ${currentExercise + 1} di ${exercises.length}`}
            </div>
          </div>

          <div className="text-right">
            <Badge variant="outline" className={`${exerciseCompleted ? 'text-emerald-300 border-emerald-500/50' : 'text-green-300 border-green-500/50'}`}>
              {exerciseCompleted ? 'Completato!' : 'In Corso'}
            </Badge>
          </div>
        </div>

        <div className="flex gap-6 relative">
          <CourseSidebar 
            currentModuleId="modulo-2"
            currentLessonId={4}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content - Chat Interface */}
          <div className="flex-1 min-w-0">
            <div className="step-card glassmorphism-base h-full">
              <div className="section-spacing h-full flex flex-col">
                 {/* Main Content - Chat Interface or Completion Screen */}
                 {currentExercise === 2 ? (
                   // Completion Screen
                   <div className="text-center">
                     <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                       <Award className="w-10 h-10 text-emerald-400" />
                     </div>
                     <h2 className="text-3xl font-bold text-white mb-4">
                       🎉 Congratulazioni!
                     </h2>
                     <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                       Hai completato con successo entrambi gli esercizi del Modulo 2.4!
                       Ora sai come chiedere all'AI di modificare e adattare le risposte alle tue esigenze specifiche.
                     </p>

                     <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                       <h3 className="text-emerald-300 font-semibold mb-4">🎯 Cosa hai imparato:</h3>
                       <ul className="text-slate-300 space-y-2">
                         <li className="flex items-start">
                           <span className="text-emerald-400 mr-2">✓</span>
                           Come semplificare risposte complesse
                         </li>
                         <li className="flex items-start">
                           <span className="text-emerald-400 mr-2">✓</span>
                           Come adattare il linguaggio per diversi pubblici
                         </li>
                         <li className="flex items-start">
                           <span className="text-emerald-400 mr-2">✓</span>
                           L'importanza dell'interazione iterativa con l'AI
                         </li>
                       </ul>
                     </div>

                     <div className="text-left bg-slate-800/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                       <p className="text-slate-300 text-sm mb-2">💡 Ricorda: Non serve riscrivere da zero. Basta dire:</p>
                       <ul className="text-slate-400 text-sm space-y-1">
                         <li>• "Semplifica"</li>
                         <li>• "Fallo più tecnico"</li>
                         <li>• "Fammelo in bullet"</li>
                         <li>• "Scrivilo per LinkedIn"</li>
                       </ul>
                       <p className="text-emerald-300 text-sm mt-2 font-medium">L'AI ti segue, se la guidi.</p>
                     </div>

                      <Button
                        onClick={() => {
                          const nextLesson = getNextLesson('/ai-interactive/edit-output');
                          if (nextLesson) {
                            navigate(nextLesson.route);
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3"
                      >
                        Prossimo →
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                   </div>
                 ) : (
                   // Chat Interface
                   <>
                     <div className="mb-4">
                       <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                         <Edit3 className="w-6 h-6 mr-3 text-green-400" />
                         {exercises[currentExercise]?.title}
                       </h2>
                       <p className="text-slate-400 text-sm">
                         {exercises[currentExercise]?.description}
                       </p>
                     </div>

                      {/* Tooltip */}
                      {showTooltip && (
                        <div className="mb-4 bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-3 animate-fade-in">
                          <p className="text-emerald-300 text-sm flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            {tooltips[Math.floor(Math.random() * tooltips.length)]}
                          </p>
                        </div>
                      )}

                      {/* Chat Area */}
                      <div ref={chatContainerRef} className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4 overflow-y-auto min-h-[400px] max-h-[500px]">
                        <div className="space-y-4">
                         {chatMessages.map((message, index) => (
                           <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                               message.type === 'user' 
                                 ? 'bg-blue-600 text-white' 
                                 : 'bg-slate-700/50 text-slate-200'
                             }`}>
                               {message.type === 'ai' && (
                                 <div className="flex items-center mb-2">
                                   <Bot className="w-4 h-4 mr-2 text-green-400" />
                                   <span className="text-green-400 text-sm font-medium">AI Assistant</span>
                                 </div>
                               )}
                               <p className="text-sm whitespace-pre-line">{message.content}</p>
                             </div>
                           </div>
                         ))}

                         {/* Loading State */}
                         {isLoading && (
                           <div className="flex justify-start">
                             <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3 max-w-[80%]">
                               <div className="flex items-center mb-2">
                                 <Bot className="w-4 h-4 mr-2 text-green-400" />
                                 <span className="text-green-400 text-sm font-medium">AI Assistant</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <div className="flex space-x-1">
                                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                 </div>
                                 <span className="text-slate-400 text-xs">Sto pensando...</span>
                               </div>
                             </div>
                           </div>
                         )}

                         {/* Empty State */}
                         {chatMessages.length === 0 && (
                           <div className="flex items-center justify-center h-full text-slate-400">
                             <div className="text-center">
                               <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                               <p>La conversazione inizierà automaticamente...</p>
                             </div>
                           </div>
                         )}
                       </div>
                     </div>

                     {/* Input Area */}
                      {!exerciseCompleted && (
                        <div className="space-y-4">
                       <div className="flex space-x-2">
                         <Textarea
                           value={userInput}
                           onChange={(e) => setUserInput(e.target.value)}
                           placeholder={`Scrivi qui la tua richiesta (es. '${exercises[currentExercise]?.instruction}')...`}
                           className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 resize-none focus:border-green-500/50 focus:ring-green-500/20"
                           rows={2}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               handleSendMessage();
                             }
                           }}
                           disabled={exerciseCompleted}
                         />
                         <Button
                           onClick={handleSendMessage}
                           disabled={!userInput.trim() || isLoading || exerciseCompleted}
                           className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed self-end"
                         >
                           <Send className="w-4 h-4" />
                         </Button>
                       </div>

                       {/* Suggestions */}
                       {!exerciseCompleted && chatMessages.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                           {currentExercise === 0 && (
                             <Button
                               onClick={() => setUserInput("Rendilo più semplice")}
                               variant="outline"
                               size="sm"
                               className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 text-xs"
                             >
                               💡 Rendilo più semplice
                             </Button>
                           )}
                           {currentExercise === 1 && (
                             <Button
                               onClick={() => setUserInput("Spiegamelo come se avessi 10 anni")}
                               variant="outline"
                               size="sm"
                               className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 text-xs"
                             >
                               👶 Come per un bambino
                             </Button>
                           )}
                         </div>
                       )}

                        </div>
                      )}
                      
                      {/* Navigation */}
                      <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                        <Button
                          onClick={() => {
                            const prevLesson = getPreviousLesson('/ai-interactive/edit-output');
                            if (prevLesson) {
                              navigate(prevLesson.route);
                            }
                          }}
                          variant="ghost"
                          className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                        >
                          ← Precedente
                        </Button>
                        
                        {exerciseCompleted ? (
                          <div className="text-center">
                            <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-4 mb-4 max-w-lg">
                              <div className="flex items-center mb-2">
                                <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                                <h3 className="text-emerald-300 font-semibold">Esercizio completato!</h3>
                              </div>
                              <p className="text-slate-300 text-sm">
                                Perfetto! Hai imparato come {currentExercise === 0 ? 'semplificare' : 'adattare il linguaggio per bambini'} le risposte dell'AI.
                              </p>
                            </div>
                            <Button
                              onClick={nextExercise}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {currentExercise < exercises.length - 1 ? 'Prossimo Esercizio' : 'Completa Modulo'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-slate-400 text-sm">
                            {exercises[currentExercise]?.instruction}
                          </div>
                        )}
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOutput;