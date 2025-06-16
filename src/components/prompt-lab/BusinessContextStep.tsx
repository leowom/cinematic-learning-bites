
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const BusinessContextStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [showProgression, setShowProgression] = useState(false);

  const businessTypes = [
    { id: 'ecommerce', label: 'E-commerce', active: false },
    { id: 'saas', label: 'SaaS', active: false },
    { id: 'consulting', label: 'Consulenza', active: false },
    { id: 'healthcare', label: 'Sanitario', active: false },
    { id: 'education', label: 'Formazione', active: false },
    { id: 'finance', label: 'Finanziario', active: false }
  ];

  const handleBusinessTypeSelect = (type: string) => {
    updatePromptData('businessType', type);
    generateContext(type);
    setShowProgression(true);
    updatePromptData('qualityScore', 6);
  };

  const generateContext = (businessType: string) => {
    const contexts = {
      'ecommerce': 'PMI di fashion e lifestyle con 50-200 email al giorno che richiede tempi di risposta rapidi e automazione per gestire resi, tracking ordini e supporto clienti.',
      'saas': 'Azienda software B2B con customer base internazionale che gestisce richieste tecniche, onboarding utenti e rinnovi subscription con focus sulla retention.',
      'consulting': 'Agenzia di consulenza strategica che gestisce comunicazioni con clienti C-level, follow-up di proposte e programmazione meeting con alta personalizzazione.',
      'healthcare': 'Clinica privata che gestisce prenotazioni, promemoria pazienti, risultati esami e comunicazioni mediche con massima privacy e compliance.',
      'education': 'Istituto formativo online che gestisce iscrizioni corsi, supporto studenti, certificazioni e comunicazioni docenti con approccio educativo.',
      'finance': 'Consulenza finanziaria che gestisce richieste investimenti, aggiornamenti portfolio e compliance normativa con massima precisione.'
    };
    
    updatePromptData('context', contexts[businessType as keyof typeof contexts] || '');
  };

  const progressionLevels = [
    {
      level: "Livello 1 - Solo ruolo",
      description: '"Sei un customer service manager con esperienza"',
      result: "→ Risposta professionale ma generica"
    },
    {
      level: "Livello 2 - Informazioni azienda",
      description: '+ "per azienda e-commerce di abbigliamento"',
      result: "→ Menziona policy tessuti e istruzioni di cura"
    },
    {
      level: "Livello 3 - Policy specifiche",
      description: '+ "Rimborsi entro 30 giorni, spedizione gratuita sopra 50€"',
      result: "→ Applica policy corrette, offre spedizione"
    },
    {
      level: "Livello 4 - Volume e pressione",
      description: '+ "500 email al giorno, clienti spesso frustrati"',
      result: "→ Tono più empatico, gestione de-escalation"
    }
  ];

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Building className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Definizione del Contesto Business
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            L'AI necessita di comprendere il contesto aziendale specifico per fornire risposte appropriate e contestuali.
          </p>
          
          <div className="bg-orange-900/15 border border-orange-700/30 rounded-lg p-4 element-spacing">
            <h3 className="text-orange-300 font-medium mb-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Problema Comune:</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed sub-element-spacing">
              Anche con un ruolo professionale definito, l'AI produce risposte generiche perché manca il contesto del business specifico.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-orange-300 font-medium text-sm">Soluzione:</span>
              <span className="text-slate-300 text-sm ml-2">Fornire informazioni dettagliate sull'azienda e il settore di riferimento.</span>
            </div>
          </div>

          {!showProgression && (
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
              <h3 className="text-slate-200 font-medium mb-3 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Progressione della Qualità:</span>
              </h3>
              <div className="space-y-2">
                {progressionLevels.map((level, index) => (
                  <div key={index} className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
                    <div className="text-slate-200 text-sm font-medium sub-element-spacing">{level.level}</div>
                    <div className="text-slate-400 text-xs sub-element-spacing">{level.description}</div>
                    <div className="text-emerald-300 text-xs">{level.result}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="section-spacing">
          <label className="text-slate-200 font-medium element-spacing block">Seleziona il tipo di business:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {businessTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleBusinessTypeSelect(type.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm border ${
                  promptData.businessType === type.id
                    ? 'bg-slate-700 border border-slate-600 text-slate-200'
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        {promptData.context && (
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
            <h4 className="text-slate-200 font-medium element-spacing flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>Contesto Generato Automaticamente:</span>
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              "{promptData.context}"
            </p>
          </div>
        )}

        {showProgression && (
          <div className="space-y-4 animate-fade-in section-spacing">
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium mb-3 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Risultati della Costruzione Progressiva:</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Solo ruolo:</span>
                  <span className="text-orange-300">Generico ma professionale</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Con tipo di business:</span>
                  <span className="text-emerald-300">Conoscenza settoriale</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Con contesto completo:</span>
                  <span className="text-emerald-300">Risposte policy-aware</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40">
                <label className="text-slate-300 text-sm element-spacing block">Volume email giornaliero:</label>
                <select 
                  className="w-full bg-slate-700/60 border border-slate-700/50 rounded text-slate-200 p-2 text-sm"
                  onChange={(e) => updatePromptData('emailVolume', e.target.value)}
                >
                  <option value="">Seleziona volume</option>
                  <option value="low">1-50 (Basso)</option>
                  <option value="medium">51-200 (Medio)</option>
                  <option value="high">201-500 (Alto)</option>
                  <option value="enterprise">500+ (Enterprise)</option>
                </select>
              </div>
              
              <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40">
                <label className="text-slate-300 text-sm element-spacing block">Livello di urgenza medio:</label>
                <select 
                  className="w-full bg-slate-700/60 border border-slate-700/50 rounded text-slate-200 p-2 text-sm"
                  onChange={(e) => updatePromptData('urgencyLevel', e.target.value)}
                >
                  <option value="">Seleziona urgenza</option>
                  <option value="low">Bassa (risposta in 24h)</option>
                  <option value="medium">Media (risposta in 4h)</option>
                  <option value="high">Alta (risposta in 1h)</option>
                  <option value="critical">Critica (risposta immediata)</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
              <span className="text-emerald-300 font-medium">Punteggio Qualità: +2 punti!</span>
              <span className="text-slate-300 text-sm ml-2">
                Il contesto specifico trasforma risposte generiche in soluzioni business-aware.
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={!promptData.businessType}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 border border-slate-600 flex items-center space-x-2"
          >
            <span>Continua con la Definizione dei Task</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessContextStep;
