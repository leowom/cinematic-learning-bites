
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight, Play, CheckCircle } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const DisasterDemo: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [showingResults, setShowingResults] = useState(false);
  const [allExamplesViewed, setAllExamplesViewed] = useState(false);

  const examples = [
    {
      title: "❌ Prompt Generico",
      prompt: "Aiutami con l'email del cliente",
      result: "Certo! Come posso aiutarti con l'email? Puoi fornirmi più dettagli?",
      problems: [
        "Troppo vago e inutile",
        "Non sa cosa fare",
        "Richiede input aggiuntivi"
      ]
    },
    {
      title: "❌ Prompt Incompleto", 
      prompt: "Rispondi al cliente che ha fatto un reclamo",
      result: "Gentile Cliente, abbiamo ricevuto il suo reclamo. Cordiali saluti.",
      problems: [
        "Non analizza il contenuto",
        "Risposta generica",
        "Nessuna soluzione proposta"
      ]
    },
    {
      title: "❌ Prompt Senza Vincoli",
      prompt: "Sei un customer service agent. Analizza questa email e rispondi.",
      result: "Grazie per la sua email. Il nostro team tecnico risolverà tutto entro 6 mesi. Nel frattempo può provare a spegnere e riaccendere il dispositivo 847 volte.",
      problems: [
        "Promesse irrealistiche",
        "Tono inappropriato", 
        "Nessun controllo qualità"
      ]
    }
  ];

  const handleNext = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample(currentExample + 1);
      setShowingResults(false);
    } else {
      setAllExamplesViewed(true);
    }
  };

  const handleShowResult = () => {
    setShowingResults(true);
  };

  const markComplete = () => {
    updatePromptData('disasterUnderstood', true);
    onComplete();
  };

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <AlertTriangle className="w-6 h-6 text-amber-400" />
        <h2 className="text-xl font-medium text-slate-200">
          Demo: Cosa NON Fare
        </h2>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed">
            Prima di imparare come creare prompt efficaci, vediamo alcuni esempi di prompt che NON funzionano 
            e i problemi che causano nel mondo reale.
          </p>
        </div>

        {!allExamplesViewed ? (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-300 font-medium">
                {examples[currentExample].title}
              </h3>
              <span className="text-sm text-slate-400">
                Esempio {currentExample + 1} di {examples.length}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-red-600/30 rounded-lg p-4">
                <h4 className="text-slate-300 text-sm font-medium mb-2">📝 Prompt utilizzato:</h4>
                <p className="text-red-200 italic font-mono text-sm">
                  "{examples[currentExample].prompt}"
                </p>
              </div>

              {!showingResults ? (
                <div className="text-center">
                  <Button
                    onClick={handleShowResult}
                    className="bg-red-700/60 hover:bg-red-600/80 text-red-200 border border-red-600/50"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Vedi il Risultato Disastroso
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-slate-800/60 border border-red-600/30 rounded-lg p-4">
                    <h4 className="text-slate-300 text-sm font-medium mb-2">🤖 Risposta AI:</h4>
                    <p className="text-slate-200 text-sm">
                      {examples[currentExample].result}
                    </p>
                  </div>

                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                    <h4 className="text-red-300 text-sm font-medium mb-2">⚠️ Problemi identificati:</h4>
                    <ul className="space-y-1">
                      {examples[currentExample].problems.map((problem, index) => (
                        <li key={index} className="text-red-200 text-sm flex items-start">
                          <span className="text-red-400 mr-2">•</span>
                          {problem}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleNext}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
                    >
                      {currentExample < examples.length - 1 ? (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Prossimo Esempio
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Ho Capito i Problemi
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-emerald-300 font-medium">
                  ✅ Lezione Appresa
                </h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-emerald-200 text-sm">
                  Hai visto come prompt mal costruiti portano a risultati inaffidabili e potenzialmente dannosi per il business.
                </p>
                
                <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
                  <h4 className="text-emerald-300 text-sm font-medium mb-2">🎯 Cosa abbiamo imparato:</h4>
                  <ul className="space-y-1 text-emerald-200 text-sm">
                    <li>• I prompt vaghi generano risposte inutili</li>
                    <li>• Senza contesto, l'AI non può dare risposte specifiche</li>
                    <li>• Senza vincoli, l'AI può fare promesse irrealistiche</li>
                    <li>• La qualità del prompt determina la qualità del risultato</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={markComplete}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Iniziamo a Costruire Prompt Efficaci
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterDemo;
