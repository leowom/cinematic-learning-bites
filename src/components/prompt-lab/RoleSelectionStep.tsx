
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Star, Award, Brain } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const RoleSelectionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [roleText, setRoleText] = useState(promptData.role || '');
  const [qualityScore, setQualityScore] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  const handleRoleChange = (text: string) => {
    setRoleText(text);
    updatePromptData('role', text);
  };

  const handleQualityChange = (score: number, canProceedValue: boolean) => {
    setQualityScore(score);
    setCanProceed(canProceedValue);
    updatePromptData('qualityScore', score);
  };

  const handleComplete = () => {
    if (canProceed) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-700/50">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            🎭 Definizione del Ruolo
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Definisci chi è l'AI assistant e qual è il suo livello di expertise. Un ruolo ben definito stabilisce autorità e competenza.
          </p>
        </div>
      </div>

      {/* Theory Box */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
        <h3 className="text-blue-300 font-medium mb-3 flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          📚 Concetti Chiave
        </h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-slate-200 font-medium mb-2">🎯 Elementi del Ruolo Perfetto:</h4>
            <ul className="text-slate-300 space-y-1 ml-4">
              <li>• <strong>Identità chiara:</strong> "Sei un..." seguito dal ruolo specifico</li>
              <li>• <strong>Esperienza quantificata:</strong> Numero di anni nel settore</li>
              <li>• <strong>Competenze specifiche:</strong> Aree di expertise rilevanti</li>
              <li>• <strong>Autorità:</strong> Credenziali che giustificano la competenza</li>
            </ul>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-4">
            <h4 className="text-emerald-300 font-medium mb-2">✅ Esempio Efficace:</h4>
            <p className="text-slate-300 font-mono text-xs">
              "Sei un responsabile customer service con 8 anni di esperienza nel settore e-commerce, 
              specializzato nella risoluzione di problematiche complesse e nella gestione di reclami di alto valore."
            </p>
          </div>
        </div>
      </div>

      {/* Writing Exercise */}
      <MicropromptWriter
        title="Scrivi il Ruolo del tuo AI Assistant"
        instruction="Definisci chi è l'AI assistant, quanti anni di esperienza ha e in cosa è specializzato. Inizia sempre con 'Sei un...' per stabilire chiaramente l'identità."
        placeholder="Sei un responsabile customer service con..."
        example="Sei un responsabile customer service con 8 anni di esperienza nel settore e-commerce, specializzato nella risoluzione di problematiche complesse e nella gestione di reclami di alto valore."
        context="role"
        onTextChange={handleRoleChange}
        value={roleText}
        onQualityChange={handleQualityChange}
      />

      {/* Progress Indicator */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= qualityScore ? 'text-emerald-400 fill-emerald-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-300 text-sm">
              Qualità: {qualityScore}/5 {canProceed ? '✅' : '⏳'}
            </span>
          </div>
          
          <Button 
            onClick={handleComplete}
            disabled={!canProceed}
            className={`${
              canProceed 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canProceed ? (
              <>
                <Award className="w-4 h-4 mr-2" />
                Continua
              </>
            ) : (
              'Migliora per Continuare'
            )}
          </Button>
        </div>
        
        {!canProceed && qualityScore > 0 && (
          <div className="mt-3 p-3 bg-orange-900/30 border border-orange-700/50 rounded-lg">
            <p className="text-orange-200 text-sm">
              ⚠️ Punteggio insufficiente per procedere. Minimo richiesto: 4/5
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionStep;
