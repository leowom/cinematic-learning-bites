
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 relative z-10">
        📤 STEP 5/5: Output Structure
      </h2>
      
      <p className="text-white/70 mb-6 relative z-10">
        Definisci la struttura della risposta. Trascina per riordinare, clicca per attivare/disattivare sezioni.
      </p>
      
      {/* Draggable format sections */}
      <div className="space-y-2 mb-6 relative z-10">
        {formatSections.map((section) => (
          <div
            key={section.id}
            className={`rounded-lg p-3 cursor-pointer transition-all duration-200 flex items-center justify-between ${
              section.active
                ? 'bg-slate-800/60 border border-white/20 hover:bg-slate-700/80'
                : 'bg-slate-800/30 border border-white/10 opacity-60'
            }`}
            onClick={() => handleSectionToggle(section.id)}
          >
            <div className="flex items-center">
              <span className="text-white/60 mr-3 cursor-move">═══</span>
              <span className={`${section.active ? 'text-white' : 'text-white/50'}`}>
                {section.label}
              </span>
            </div>
            <div className={`w-4 h-4 rounded border ${
              section.active 
                ? 'bg-green-500 border-green-400' 
                : 'border-white/30'
            }`}>
              {section.active && (
                <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add custom section */}
      <div className="mb-6 relative z-10">
        <button className="w-full bg-slate-800/40 border-2 border-dashed border-white/20 rounded-lg p-3 text-white/60 hover:border-white/40 hover:text-white/80 transition-all duration-200">
          + Aggiungi sezione personalizzata
        </button>
      </div>
      
      {/* Format preview */}
      <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4 mb-6 relative z-10">
        <h4 className="text-white font-medium mb-3 flex items-center">
          📄 Format Preview:
        </h4>
        <div className="bg-slate-900/60 rounded-lg p-3 max-h-64 overflow-y-auto">
          <pre className="font-mono text-sm text-white/80 whitespace-pre-wrap">
            {generateFormatPreview()}
          </pre>
        </div>
      </div>

      {/* Format optimization tips */}
      <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-4 mb-6 relative z-10">
        <h4 className="text-blue-400 font-medium mb-2">💡 Ottimizzazione Format:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <span className="text-green-400 mr-2">✅</span>
            <span className="text-white/70">Struttura chiara e logica</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-400 mr-2">✅</span>
            <span className="text-white/70">Placeholder specifici per personalizzazione</span>
          </div>
          <div className="flex items-start">
            <span className="text-amber-400 mr-2">💡</span>
            <span className="text-white/70">Considera di aggiungere una sezione di follow-up per casi complessi</span>
          </div>
        </div>
      </div>

      {/* Final quality check */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-400/30 rounded-lg p-4 mb-6 relative z-10">
        <h4 className="text-green-400 font-medium mb-2">🎯 Quality Check Finale:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Completezza:</span>
              <span className="text-green-400 font-bold">95%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Personalizzazione:</span>
              <span className="text-green-400 font-bold">90%</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Professionalità:</span>
              <span className="text-green-400 font-bold">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Efficacia:</span>
              <span className="text-green-400 font-bold">88%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete button */}
      <div className="flex justify-end relative z-10">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 text-lg"
        >
          🎉 Completa Prompt!
        </Button>
      </div>
    </div>
  );
};

export default OutputFormatStep;
