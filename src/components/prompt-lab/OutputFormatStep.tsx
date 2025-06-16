
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, CheckCircle, ArrowRight, Sparkles, Target } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const OutputFormatStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [formatSections, setFormatSections] = useState([
    { id: 'greeting', label: '1. Saluto personalizzato', order: 1, active: true },
    { id: 'acknowledgment', label: '2. Riconoscimento problema', order: 2, active: true },
    { id: 'solution', label: '3. Soluzione proposta', order: 3, active: true },
    { id: 'timeline', label: '4. Timeline e next steps', order: 4, active: true },
    { id: 'contact', label: '5. Informazioni di contatto', order: 5, active: false },
    { id: 'closing', label: '6. Chiusura cordiale', order: 6, active: true }
  ]);

  const handleSectionToggle = (sectionId: string) => {
    const newSections = formatSections.map(section =>
      section.id === sectionId 
        ? { ...section, active: !section.active }
        : section
    );
    setFormatSections(newSections);
    updatePromptData('outputFormat', newSections.filter(s => s.active).map(s => s.label));
  };

  const generateFormatPreview = () => {
    const activeSections = formatSections.filter(s => s.active);
    return activeSections.map(section => {
      switch (section.id) {
        case 'greeting':
          return 'Gentile [NOME_CLIENTE],';
        case 'acknowledgment':
          return 'Ho ricevuto la sua email riguardo [PROBLEMA] e comprendo la sua situazione.';
        case 'solution':
          return '[SOLUZIONE_PROPOSTA] - procederemo immediatamente per risolvere la questione.';
        case 'timeline':
          return 'Procederemo entro [TIMELINE] giorni lavorativi e la terremo aggiornata sui progressi.';
        case 'contact':
          return 'Per ulteriori informazioni può contattarci al [CONTATTO] o rispondere a questa email.';
        case 'closing':
          return 'Cordiali saluti,\n[NOME_OPERATORE]\n[AZIENDA]';
        default:
          return '';
      }
    }).join('\n\n');
  };

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <FileText className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Struttura del Formato Output
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Definisci la struttura della risposta. Trascina per riordinare, clicca per attivare/disattivare sezioni.
          </p>
          
          <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4 element-spacing">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <Target className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-300 text-sm font-medium">Impatto della Struttura:</span>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed">
              Una struttura ben definita garantisce completezza, coerenza e professionalità in ogni risposta generata dall'AI.
            </div>
          </div>
        </div>
        
        {/* Draggable format sections */}
        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium element-spacing">Sezioni del Formato:</h3>
          <div className="space-y-2">
            {formatSections.map((section) => (
              <div
                key={section.id}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                  section.active
                    ? 'bg-slate-700/60 border-slate-600 ring-1 ring-slate-500'
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50 opacity-60'
                }`}
                onClick={() => handleSectionToggle(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-3 cursor-move">═══</span>
                    <span className={`${section.active ? 'text-slate-200' : 'text-slate-400'}`}>
                      {section.label}
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded border ${
                    section.active 
                      ? 'bg-emerald-500 border-emerald-400' 
                      : 'border-slate-600'
                  }`}>
                    {section.active && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add custom section */}
        <div className="section-spacing">
          <button className="w-full bg-slate-800/40 border-2 border-dashed border-slate-700/50 rounded-lg p-3 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-all duration-200 flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Aggiungi sezione personalizzata</span>
          </button>
        </div>
        
        {/* Format preview */}
        <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
          <h4 className="text-slate-200 font-medium element-spacing flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Anteprima Formato:</span>
          </h4>
          <div className="bg-slate-900/60 rounded-lg p-3 max-h-64 overflow-y-auto">
            <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
              {generateFormatPreview()}
            </pre>
          </div>
        </div>

        {/* Format optimization tips */}
        <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
          <h4 className="text-slate-200 font-medium sub-element-spacing">💡 Ottimizzazione Formato:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="text-emerald-400 mr-2">✅</span>
              <span className="text-slate-300">Struttura chiara e logica</span>
            </div>
            <div className="flex items-start">
              <span className="text-emerald-400 mr-2">✅</span>
              <span className="text-slate-300">Placeholder specifici per personalizzazione</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-400 mr-2">💡</span>
              <span className="text-slate-300">Considera di aggiungere una sezione di follow-up per casi complessi</span>
            </div>
          </div>
        </div>

        {/* Final quality check */}
        <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4 section-spacing">
          <h4 className="text-emerald-300 font-medium sub-element-spacing">🎯 Controllo Qualità Finale:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Completezza:</span>
                <span className="text-emerald-400 font-bold">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Personalizzazione:</span>
                <span className="text-emerald-400 font-bold">90%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Professionalità:</span>
                <span className="text-emerald-400 font-bold">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Efficacia:</span>
                <span className="text-emerald-400 font-bold">88%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complete button */}
        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            className="bg-emerald-700 hover:bg-emerald-600 text-slate-200 px-8 py-3 rounded-lg font-medium transition-all duration-300 text-lg border border-emerald-600 flex items-center space-x-2"
          >
            <span>🎉 Completa Prompt!</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OutputFormatStep;
