import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, ArrowRight, Bot, MessageCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
const AITutorialInteractive = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [userPrompts, setUserPrompts] = useState<string[]>(['', '', '', '', '']);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const steps = [{
    id: 0,
    title: "Uso generale dell'AI",
    suggestedPrompt: "Come si usa ChatGPT?",
    placeholder: "Prova a chiedere come si usa ChatGPT...",
    simulatedResponse: "Ciao! Sono un assistente AI e posso aiutarti in molti modi diversi:\n\n• **Scrivere testi**: email, lettere, articoli, post sui social\n• **Spiegare concetti**: argomenti complessi in modo semplice\n• **Tradurre**: testi in diverse lingue\n• **Organizzare idee**: creare liste, piani, strutture\n• **Risolvere problemi**: step-by-step per task complessi\n\nBasta scrivermi quello che ti serve e cercherò di aiutarti nel modo migliore!",
    feedback: "Ottimo! L'AI può essere il tuo assistente personale per tantissimi compiti quotidiani. Puoi chiedergli di scrivere, spiegarti concetti, tradurre e molto altro!",
    tips: "💡 Prova a essere specifico nelle tue richieste per ottenere risposte più utili."
  }, {
    id: 1,
    title: "Scrittura testi",
    suggestedPrompt: "Puoi scrivere un'email per scusarmi con un cliente?",
    placeholder: "Chiedi di scrivere un'email di scuse...",
    simulatedResponse: "Ecco una bozza di email professionale:\n\n**Oggetto**: Scuse per il disagio causato\n\nGentile [Nome Cliente],\n\nLe scrivo per scusarmi sinceramente per l'inconveniente che ha dovuto affrontare. Riconosco che la situazione non ha soddisfatto le sue aspettative e me ne assumo la piena responsabilità.\n\nStiamo già lavorando per risolvere il problema e implementare misure preventive. La ricontatterò entro [tempo] con un aggiornamento dettagliato.\n\nGrazie per la sua pazienza e comprensione.\n\nCordiali saluti,\n[Il suo nome]",
    feedback: "Perfetto! L'AI può aiutarti a scrivere testi professionali. Puoi sempre chiedere di modificare il tono, aggiungere dettagli specifici o cambiare la lunghezza.",
    tips: "💡 Puoi specificare: tono (formale/informale), lunghezza, destinatario, situazione specifica."
  }, {
    id: 2,
    title: "Spiegazione step-by-step",
    suggestedPrompt: "Come creo una fattura con Excel, passo dopo passo?",
    placeholder: "Chiedi come fare qualcosa passo per passo...",
    simulatedResponse: "Ecco come creare una fattura in Excel passo dopo passo:\n\n**Step 1**: Apri Excel e crea un nuovo documento\n**Step 2**: Nell'intestazione scrivi:\n   - Nome della tua azienda (A1)\n   - Indirizzo e contatti (A2-A4)\n\n**Step 3**: Aggiungi \"FATTURA N°\" e il numero (E1)\n**Step 4**: Inserisci data di emissione (E2)\n\n**Step 5**: Crea una sezione cliente:\n   - \"Fatturato a:\" (A6)\n   - Nome e indirizzo cliente (A7-A9)\n\n**Step 6**: Crea la tabella prodotti/servizi:\n   - Colonne: Descrizione | Quantità | Prezzo | Totale\n   - Parti dalla riga 12\n\n**Step 7**: Aggiungi formule per i calcoli automatici\n**Step 8**: Inserisci subtotale, IVA e totale finale\n**Step 9**: Salva il file come modello per future fatture",
    feedback: "Eccellente! L'AI è perfetto per spiegazioni dettagliate. Puoi sempre chiedere di semplificare un passaggio, aggiungere esempi o convertire in checklist.",
    tips: "💡 Puoi chiedere: 'spiegamelo più semplicemente', 'dammi un esempio pratico', 'trasformalo in checklist'."
  }, {
    id: 3,
    title: "Traduzione",
    suggestedPrompt: "Traduci in inglese: grazie per la disponibilità.",
    placeholder: "Chiedi di tradurre qualcosa...",
    simulatedResponse: "**Traduzione in inglese:**\n\"Thank you for your availability.\"\n\n**Varianti alternative:**\n• \"Thank you for being available\" (più informale)\n• \"Thank you for your time and availability\" (più completa)\n• \"I appreciate your availability\" (più formale)\n\n**Contesto d'uso:**\nQuesta frase è perfetta per email professionali, messaggi di ringraziamento dopo meeting o quando qualcuno si è reso disponibile per aiutarti.",
    feedback: "Perfetto! L'AI non solo traduce, ma ti offre anche varianti e contesto. Puoi chiedere adattamenti per situazioni formali o informali.",
    tips: "💡 Puoi chiedere: sinonimi, adattamento al contesto, registri linguistici diversi (formale/informale)."
  }, {
    id: 4,
    title: "Cultura generale / curiosità",
    suggestedPrompt: "Come funziona la previsione meteo in modo semplice?",
    placeholder: "Chiedi di spiegarti qualcosa di interessante...",
    simulatedResponse: "Le previsioni meteo funzionano così:\n\n🌡️ **Raccolta dati**: Migliaia di stazioni meteorologiche in tutto il mondo misurano costantemente:\n   - Temperatura\n   - Pressione atmosferica\n   - Umidità\n   - Velocità del vento\n\n🛰️ **Satelliti e radar**: Monitorano le nuvole, le precipitazioni e i movimenti delle masse d'aria dall'alto.\n\n🖥️ **Supercomputer**: Elaborano tutti questi dati usando modelli matematici complessi che simulano l'atmosfera.\n\n📊 **Modelli di previsione**: I computer calcolano come evolverà il tempo nelle prossime ore/giorni basandosi sui pattern storici.\n\n🎯 **Precisione**: Le previsioni sono accurate al 90% per il giorno successivo, ma l'accuratezza diminuisce per periodi più lunghi.\n\n**In sintesi**: È come un puzzle gigante dove ogni pezzo di dato aiuta a vedere il quadro completo del tempo futuro!",
    feedback: "Fantastico! L'AI può spiegare concetti complessi in modo accessibile e interessante. Puoi sempre chiedere approfondimenti o esempi pratici.",
    tips: "💡 Puoi sempre dire: 'spiegamelo con un esempio', 'rendilo ancora più semplice', 'dammi più dettagli su...'."
  }];
  const handlePromptSubmit = () => {
    if (currentPrompt.trim()) {
      const newPrompts = [...userPrompts];
      newPrompts[currentStep] = currentPrompt;
      setUserPrompts(newPrompts);
      const newCompleted = [...completedSteps];
      newCompleted[currentStep] = true;
      setCompletedSteps(newCompleted);
      setCurrentPrompt('');
    }
  };
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentPrompt('');
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentPrompt('');
    }
  };
  const isCompleted = completedSteps.every(step => step);
  const currentStepData = steps[currentStep];
  if (showTutorial) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
        <div className="prompt-lab-container">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>

            <div className="text-center">
              <div className="text-slate-200 font-medium">
                Tutorial Interattivo AI
              </div>
              <div className="text-slate-400 text-sm">
                Primi passi guidati
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-sm">
                5 Esercizi Pratici
              </div>
            </div>
          </div>

          {/* Tutorial Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base text-center">
              <div className="section-spacing">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Bot className="w-10 h-10 text-blue-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    🔰 Tutorial interattivo – Primi passi con LearningBitesAI
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    Impara a usare l'AI attraverso 5 esercizi pratici e guidati. 
                    Sperimenterai le funzioni più comuni di un assistente AI: scrivere, tradurre, 
                    spiegare concetti e molto altro.
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-blue-300 font-semibold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Cosa imparerai:
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">•</span>
                      Come fare domande efficaci all'AI
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">•</span>
                      Scrivere email e testi professionali
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">•</span>
                      Ottenere spiegazioni passo-passo
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">•</span>
                      Tradurre e adattare testi
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">•</span>
                      Esplorare argomenti di interesse
                    </li>
                  </ul>
                </div>

                

                <Button onClick={() => setShowTutorial(false)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3">
                  Inizia il Tutorial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
    background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
  }}>
      <div className="prompt-lab-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard')} variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium">
              Tutorial Interattivo AI
            </div>
            <div className="text-slate-400 text-sm">
              Passo {currentStep + 1} di {steps.length}
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: {completedSteps.filter(Boolean).length}/{steps.length}
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{
              width: `${completedSteps.filter(Boolean).length / steps.length * 100}%`
            }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Steps Progress */}
          <div className="col-span-12 lg:col-span-4">
            <div className="step-card glassmorphism-base">
              <div className="section-spacing">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                  Esercizi Tutorial
                </h3>
                
                <div className="space-y-3">
                  {steps.map((step, index) => <div key={step.id} className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${index === currentStep ? 'bg-blue-900/30 border-blue-500/50 shadow-lg' : completedSteps[index] ? 'bg-emerald-900/20 border-emerald-700/40 hover:bg-emerald-900/30' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'}`} onClick={() => setCurrentStep(index)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {completedSteps[index] ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : index === currentStep ? <Play className="w-5 h-5 text-blue-400" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-500" />}
                          <span className={`font-medium text-sm ${index === currentStep ? 'text-blue-300' : completedSteps[index] ? 'text-emerald-300' : 'text-slate-300'}`}>
                            Esercizio {index + 1}
                          </span>
                        </div>
                      </div>
                      <h4 className={`font-semibold text-sm ${index === currentStep ? 'text-white' : 'text-slate-200'}`}>
                        {step.title}
                      </h4>
                    </div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Chat Interface */}
          <div className="col-span-12 lg:col-span-8">
            <div className="step-card glassmorphism-base">
              <div className="section-spacing">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {currentStepData.title}
                    </h2>
                    <Badge variant="outline" className="text-blue-300 border-blue-500/50">
                      {currentStep + 1}/{steps.length}
                    </Badge>
                  </div>
                  
                  {!completedSteps[currentStep] && <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4 mb-6">
                      <p className="text-blue-300 text-sm mb-2">💡 <strong>Prompt suggerito:</strong></p>
                      <p className="text-slate-300 text-sm italic">"{currentStepData.suggestedPrompt}"</p>
                    </div>}
                </div>

                {/* Chat Area */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                  {completedSteps[currentStep] ? <div className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                          <p className="text-sm">{userPrompts[currentStep]}</p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex justify-start">
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3 max-w-[80%]">
                          <div className="flex items-center mb-2">
                            <Bot className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">LearningBitesAI</span>
                          </div>
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {currentStepData.simulatedResponse}
                          </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-4">
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-emerald-300 text-sm font-medium mb-2">Ottimo lavoro!</p>
                            <p className="text-slate-300 text-sm mb-2">{currentStepData.feedback}</p>
                            <p className="text-slate-400 text-xs">{currentStepData.tips}</p>
                          </div>
                        </div>
                      </div>
                    </div> : <div className="flex items-center justify-center h-full text-slate-400">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Scrivi il tuo prompt qui sotto per iniziare...</p>
                      </div>
                    </div>}
                </div>

                {/* Input Area */}
                <div className="mb-4">
                  <div className="relative">
                    <Textarea value={currentPrompt} onChange={e => setCurrentPrompt(e.target.value)} placeholder={currentStepData.placeholder} className="bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-400 min-h-[80px] resize-none" onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handlePromptSubmit();
                    }
                  }} />
                    <Button onClick={handlePromptSubmit} disabled={!currentPrompt.trim()} className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50" size="sm">
                      Invia
                    </Button>
                  </div>
                  {!completedSteps[currentStep] && <Button onClick={() => setCurrentPrompt(currentStepData.suggestedPrompt)} variant="ghost" size="sm" className="mt-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                      Usa prompt suggerito
                    </Button>}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button onClick={prevStep} disabled={currentStep === 0} variant="ghost" className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 disabled:opacity-50">
                    ← Precedente
                  </Button>
                  
                  {isCompleted ? <Button onClick={() => navigate('/dashboard')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Award className="w-4 h-4 mr-2" />
                      Completa Tutorial
                    </Button> : <Button onClick={nextStep} disabled={currentStep === steps.length - 1 || !completedSteps[currentStep]} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                      Successivo →
                    </Button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default AITutorialInteractive;