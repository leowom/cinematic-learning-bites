
import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const BusinessContextStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const businessTypes = [
    { id: 'ecommerce', label: 'E-commerce', active: false },
    { id: 'saas', label: 'SaaS', active: false },
    { id: 'consulting', label: 'Consulting', active: false },
    { id: 'healthcare', label: 'Healthcare', active: false },
    { id: 'education', label: 'Education', active: false },
    { id: 'finance', label: 'Finance', active: false }
  ];

  const handleBusinessTypeSelect = (type: string) => {
    updatePromptData('businessType', type);
    generateContext(type);
  };

  const generateContext = (businessType: string) => {
    const contexts = {
      'ecommerce': 'PMI di fashion & lifestyle con 50-200 email/giorno che soffre di tempi di risposta lenti e necessita automazione per gestire resi, tracking ordini e supporto clienti.',
      'saas': 'Software company B2B con customer base internazionale che gestisce richieste tecniche, onboarding utenti e renewal subscriptions con focus su retention.',
      'consulting': 'Agenzia di consulenza strategica che gestisce comunicazioni con clienti C-level, proposal follow-up e scheduling meeting con alta personalizzazione.',
      'healthcare': 'Clinica privata che gestisce prenotazioni, promemoria pazienti, risultati esami e comunicazioni mediche con massima privacy e compliance.',
      'education': 'Istituto formativo online che gestisce iscrizioni corsi, supporto studenti, certificazioni e comunicazioni docenti con approccio educativo.',
      'finance': 'Consulenza finanziaria che gestisce richieste investimenti, aggiornamenti portfolio e compliance normativa con massima precisione.'
    };
    
    updatePromptData('context', contexts[businessType as keyof typeof contexts] || '');
  };

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center relative z-10">
        🌍 STEP 2/5: Contesto Business
      </h2>
      
      <p className="text-white/70 mb-6 relative z-10">
        Definisci il tipo di business per adattare il linguaggio e gli approcci alle specifiche esigenze del settore.
      </p>
      
      {/* Business type selection */}
      <div className="mb-6 relative z-10">
        <label className="text-white/70 mb-3 block">🏢 Tipo di azienda:</label>
        <div className="flex flex-wrap gap-3">
          {businessTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleBusinessTypeSelect(type.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                promptData.businessType === type.id
                  ? 'bg-blue-600/40 border border-blue-400/50 text-white'
                  : 'bg-slate-700/60 border border-white/20 text-white/70 hover:bg-slate-600/80'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Auto-generated context preview */}
      {promptData.context && (
        <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4 mb-6 relative z-10">
          <h4 className="text-white font-medium mb-2 flex items-center">
            🎁 Context Preview:
          </h4>
          <p className="text-white/70 text-sm leading-relaxed">
            "{promptData.context}"
          </p>
        </div>
      )}

      {/* Volume and complexity indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10">
          <label className="text-white/70 text-sm mb-2 block">📊 Volume email/giorno:</label>
          <select 
            className="w-full bg-slate-700/60 border border-white/20 rounded text-white p-2"
            onChange={(e) => updatePromptData('emailVolume', e.target.value)}
          >
            <option value="">Seleziona volume</option>
            <option value="low">1-50 (Basso)</option>
            <option value="medium">51-200 (Medio)</option>
            <option value="high">201-500 (Alto)</option>
            <option value="enterprise">500+ (Enterprise)</option>
          </select>
        </div>
        
        <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10">
          <label className="text-white/70 text-sm mb-2 block">⚡ Urgenza media:</label>
          <select 
            className="w-full bg-slate-700/60 border border-white/20 rounded text-white p-2"
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

      {/* Continue button */}
      <div className="flex justify-end relative z-10">
        <Button
          onClick={onComplete}
          disabled={!promptData.businessType}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          Continua Step 3 →
        </Button>
      </div>
    </div>
  );
};

export default BusinessContextStep;
