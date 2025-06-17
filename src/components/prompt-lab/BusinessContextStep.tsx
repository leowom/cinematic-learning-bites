
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, Star, Award, Brain } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const BusinessContextStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [contextText, setContextText] = useState(promptData.context || '');
  const [qualityScore, setQualityScore] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  const handleContextChange = (text: string) => {
    setContextText(text);
    updatePromptData('context', text);
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
            <Building className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            🏢 Contesto Aziendale
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Fornisci il contesto operativo in cui l'AI assistant dovrà lavorare. Questo include settore, clienti, e situazioni tipiche.
          </p>
        </div>
      </div>

      {/* Theory Box */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
        <h3 className="text-blue-300 font-medium mb-3 flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          📚 Contesto Efficace
        </h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-slate-200 font-medium mb-2">🎯 Informazioni Essenziali:</h4>
            <ul className="text-slate-300 space-y-1 ml-4">
              <li>• <strong>Settore/Business:</strong> Tipo di azienda e mercato</li>
              <li>• <strong>Clienti:</strong> Chi sono e cosa si aspettano</li>
              <li>• <strong>Situazioni tipiche:</strong> Problemi ricorrenti</li>
              <li>• <strong>Vincoli aziendali:</strong> Policy e limitazioni</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Writing Exercise */}
      <MicropromptWriter
        title="Descrivi il Contesto Aziendale"
        instruction="Fornisci dettagli sul settore, tipo di clienti, situazioni operative tipiche e eventuali vincoli o policy aziendali specifiche."
        placeholder="La tua azienda opera nel settore..."
        example="La tua azienda è un e-commerce di elettronica con oltre 50.000 clienti attivi. I clienti sono principalmente privati e piccole aziende che acquistano dispositivi tech. Le problematiche più frequenti riguardano spedizioni, resi entro 30 giorni, e supporto tecnico post-vendita. L'azienda ha una policy di rimborso flessibile e punta sulla soddisfazione del cliente."
        context="context"
        onTextChange={handleContextChange}
        value={contextText}
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

export default BusinessContextStep;
