
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, Eye } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const DisasterDemo: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [viewedExamples, setViewedExamples] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    setViewedExamples(prev => new Set(prev).add(currentExample));
  }, [currentExample]);

  const examples = [
    {
      title: "Categoria 1: Prompt Vaghi",
      prompt: "Rispondi alle email dei clienti",
      response: "Ok, risponderò alle email.",
      context: "E-commerce",
      problems: [
        "❌ Nessun contesto specifico del business",
        "❌ Ruolo e competenze non definiti", 
        "❌ Tone non specificato",
        "❌ Nessuna indicazione su formato o lunghezza"
      ]
    },
    {
      title: "Categoria 2: Troppo Generico",
      prompt: "Sei un assistente che aiuta i clienti con i loro problemi di vendita",
      response: "Ciao! Come posso aiutarti con le vendite oggi?",
      context: "Software Enterprise",
      problems: [
        "❌ Non specifica il tipo di prodotto venduto",
        "❌ Processo di vendita non definito",
        "❌ Target customer non specificato",
        "❌ Metriche di successo mancanti"
      ]
    },
    {
      title: "Categoria 3: Senza Struttura",
      prompt: "Rispondi educatamente ai clienti dell'azienda tech che hanno problemi con abbonamenti e fatturazione",
      response: "Mi dispiace per il problema. Ti aiuterò volentieri.",
      context: "Piattaforma SaaS",
      problems: [
        "❌ Step di troubleshooting non definiti",
        "❌ Accesso ai sistemi non specificato",
        "❌ Autorizzazioni per rimborsi mancanti",
        "❌ Template di risposta non strutturati"
      ]
    }
  ];

  const handleViewExample = (index: number) => {
    setCurrentExample(index);
    setViewedExamples(prev => new Set(prev).add(index));
  };

  const canProceed = viewedExamples.size === examples.length;

  const handleComplete = () => {
    updatePromptData('disasterUnderstood', true);
    onComplete();
  };

  const getCategoryColor = (title: string) => {
    if (title.includes("Categoria 1")) return "border-red-700/40 bg-red-900/20";
    if (title.includes("Categoria 2")) return "border-orange-700/40 bg-orange-900/20";
    if (title.includes("Categoria 3")) return "border-yellow-700/40 bg-yellow-900/20";
    return "border-slate-700/40 bg-slate-800/60";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-orange-400" />
          <h2 className="text-3xl font-bold text-white">Esempi di Prompt Disastrosi</h2>
        </div>
        <p className="text-slate-300 text-lg">
          Prima di creare prompt efficaci, vediamo cosa NON funziona in diversi contesti aziendali. 
          <span className="text-orange-400 font-medium"> Devi visualizzare tutti i {examples.length} esempi per continuare.</span>
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {examples.map((_, index) => (
          <button
            key={index}
            onClick={() => handleViewExample(index)}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all text-xs font-medium ${
              viewedExamples.has(index)
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : currentExample === index
                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500'
            }`}
          >
            {viewedExamples.has(index) ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>

      {/* Current Example */}
      <div className={`border rounded-xl p-6 ${getCategoryColor(examples[currentExample].title)}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {examples[currentExample].title}
            </h3>
            <span className="text-xs bg-slate-700/60 px-3 py-1 rounded-full text-slate-300">
              Contesto: {examples[currentExample].context}
            </span>
          </div>

          {/* Prompt Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              Prompt Utilizzato:
            </h4>
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
              <p className="text-red-200 font-mono text-sm">
                "{examples[currentExample].prompt}"
              </p>
            </div>
          </div>

          {/* Response Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              Risposta AI Risultante:
            </h4>
            <div className="bg-orange-900/30 border border-orange-700/50 rounded-lg p-4">
              <p className="text-orange-200">
                "{examples[currentExample].response}"
              </p>
            </div>
          </div>

          {/* Problems Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              Problemi Identificati:
            </h4>
            <div className="space-y-2">
              {examples[currentExample].problems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-red-400 text-sm">{problem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => handleViewExample(Math.max(0, currentExample - 1))}
          disabled={currentExample === 0}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Precedente
        </Button>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Esempio {currentExample + 1} di {examples.length}
          </p>
          {!canProceed && (
            <p className="text-orange-400 text-xs mt-1">
              Visualizza tutti gli esempi per continuare
            </p>
          )}
        </div>

        <Button
          onClick={() => handleViewExample(Math.min(examples.length - 1, currentExample + 1))}
          disabled={currentExample === examples.length - 1}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
        >
          Successivo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Continue Button */}
      {canProceed && (
        <div className="text-center pt-6">
          <Button
            onClick={handleComplete}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg px-8 py-3"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Ho Capito i Problemi - Continua
          </Button>
        </div>
      )}
    </div>
  );
};

export default DisasterDemo;
