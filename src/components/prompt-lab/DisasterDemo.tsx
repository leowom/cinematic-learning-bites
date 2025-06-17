
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, ArrowRight, Zap } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const DisasterDemo: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [microprompt, setMicroprompt] = useState(promptData.microprompt2 || '');

  const badExamples = [
    {
      title: "Prompt Troppo Generico",
      prompt: "Aiutami con le email",
      response: "Ecco alcuni consigli generali per gestire le email: 1) Controlla la posta regolarmente 2) Usa oggetti chiari 3) Mantieni le email concise...",
      problems: ["Nessun contesto specifico", "Risposta troppo generica", "Non actionable"]
    },
    {
      title: "Manca il Ruolo Professionale",
      prompt: "Come rispondo a un cliente arrabbiato?",
      response: "Puoi provare a essere gentile e comprensivo. Ascolta le sue preoccupazioni e cerca di risolvere il problema...",
      problems: ["Nessuna autorità/competenza", "Consigli vaghi", "Non settore-specifico"]
    },
    {
      title: "Obiettivo Poco Chiaro",
      prompt: "Migliora questa comunicazione aziendale",
      response: "La comunicazione potrebbe essere migliorata in vari modi. Potresti considerare di renderla più chiara, più coinvolgente...",
      problems: ["Obiettivo indefinito", "Nessun criterio di successo", "Output non strutturato"]
    }
  ];

  const handleMicropromptChange = (text: string) => {
    setMicroprompt(text);
    updatePromptData('microprompt2', text);
    updatePromptData('disasterUnderstood', true);
  };

  const nextExample = () => {
    if (currentExample < badExamples.length - 1) {
      setCurrentExample(currentExample + 1);
    }
  };

  const prevExample = () => {
    if (currentExample > 0) {
      setCurrentExample(currentExample - 1);
    }
  };

  const example = badExamples[currentExample];

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="p-2 bg-rose-900/40 rounded-lg border border-rose-700/50">
          <Zap className="w-5 h-5 text-rose-300" />
        </div>
        <div>
          <h2 className="text-slate-200 font-medium text-lg">
            Errori Comuni nel Prompt Engineering
          </h2>
          <p className="text-slate-400 text-sm">Impara dai problemi tipici per evitarli</p>
        </div>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Prima di costruire prompt efficaci, è essenziale comprendere i problemi più comuni. 
            Questi esempi mostrano come prompt mal strutturati producano risultati insoddisfacenti.
          </p>
          
          <div className="bg-rose-900/20 border border-rose-700/40 rounded-xl p-4 element-spacing">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <AlertTriangle className="w-4 h-4 text-rose-300" />
              <span className="text-rose-300 text-sm font-medium">Conseguenze dei Prompt Inefficaci:</span>
            </div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Perdita di tempo con risposte inutili</li>
              <li>• Frustrazione e diminuzione della produttività</li>
              <li>• Risultati inconsistenti e inaffidabili</li>
              <li>• Mancanza di fiducia negli strumenti AI</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 section-spacing">
          <div className="flex items-center justify-between element-spacing">
            <h3 className="text-slate-200 font-medium">
              Esempio {currentExample + 1} di {badExamples.length}: {example.title}
            </h3>
            <div className="flex space-x-2">
              <Button
                onClick={prevExample}
                disabled={currentExample === 0}
                variant="outline"
                size="sm"
                className="text-slate-400 border-slate-600 hover:bg-slate-700/60"
              >
                ← Precedente
              </Button>
              <Button
                onClick={nextExample}
                disabled={currentExample === badExamples.length - 1}
                variant="outline"
                size="sm"
                className="text-slate-400 border-slate-600 hover:bg-slate-700/60"
              >
                Successivo →
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm sub-element-spacing">Prompt dell'Utente:</div>
              <div className="text-slate-200 font-mono text-sm bg-slate-800/60 p-3 rounded border border-slate-700/30">
                "{example.prompt}"
              </div>
            </div>

            <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm sub-element-spacing">Risposta AI (Inadeguata):</div>
              <div className="text-slate-300 text-sm bg-slate-800/60 p-3 rounded border border-slate-700/30 italic">
                {example.response}
              </div>
            </div>

            <div className="bg-rose-900/20 border border-rose-700/30 rounded-lg p-4">
              <div className="text-rose-300 text-sm font-medium sub-element-spacing">Problemi Identificati:</div>
              <ul className="text-slate-300 text-sm space-y-1">
                {example.problems.map((problem, index) => (
                  <li key={index}>• {problem}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {currentExample === badExamples.length - 1 && (
          <div className="animate-fade-in section-spacing">
            <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-4 element-spacing">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <Brain className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-medium">Lezione Chiave:</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Un prompt efficace deve sempre includere: <strong>ruolo specifico</strong>, <strong>contesto chiaro</strong>, 
                e <strong>obiettivi misurabili</strong>. Senza questi elementi, anche l'AI più avanzata produce risultati mediocri.
              </p>
            </div>

            <MicropromptWriter
              title="Pratica: Riscrivi un Prompt Problematico"
              instruction="Prendi uno degli esempi sopra e riscrivilo includendo ruolo, contesto e obiettivo specifico:"
              placeholder="Prendi un esempio sopra e miglioralo aggiungendo: ruolo (Sei un...), contesto (In una situazione di...), obiettivo (Il tuo compito è...)..."
              example="Sei un responsabile customer service con 5 anni di esperienza in e-commerce. Un cliente ha ricevuto un prodotto difettoso e richiede un rimborso immediato via email. Redigi una risposta professionale che: 1) Riconosca il problema 2) Offra una soluzione concreta 3) Mantenga la relazione positiva"
              context="role"
              onTextChange={handleMicropromptChange}
              value={microprompt}
            />
          </div>
        )}

        {microprompt && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
            >
              <span>Procedi alla Definizione del Ruolo</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterDemo;
