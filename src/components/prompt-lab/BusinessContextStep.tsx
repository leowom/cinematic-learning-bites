
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    { id: 'consulting', label: 'Consulting', active: false },
    { id: 'healthcare', label: 'Healthcare', active: false },
    { id: 'education', label: 'Education', active: false },
    { id: 'finance', label: 'Finance', active: false }
  ];

  const handleBusinessTypeSelect = (type: string) => {
    updatePromptData('businessType', type);
    generateContext(type);
    setShowProgression(true);
    updatePromptData('qualityScore', 6);
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

  const progressionLevels = [
    {
      level: "📊 LIVELLO 1 - Solo ruolo",
      description: '"Sei un customer service manager con esperienza"',
      result: "→ Risposta professionale ma generica"
    },
    {
      level: "📊 LIVELLO 2 - + Info azienda",
      description: '+ "per azienda e-commerce di abbigliamento"',
      result: "→ Menziona policy tessuti, care instructions"
    },
    {
      level: "📊 LIVELLO 3 - + Policy specifiche",
      description: '+ "Rimborsi entro 30 giorni, spediz gratis >€50"',
      result: "→ Applica policy corrette, offre spedizione"
    },
    {
      level: "📊 LIVELLO 4 - + Volume/pressione",
      description: '+ "500 email/giorno, clienti spesso frustrati"',
      result: "→ Tone più empatico, gestione de-escalation"
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center relative z-10">
        🌍 STEP 3/7: L'AI ha bisogno di sapere la situazione!
      </h2>
      
      <div className="relative z-10 space-y-6">
        <div className="bg-amber-600/20 border border-amber-400/30 rounded-lg p-4">
          <h3 className="text-amber-400 font-medium mb-2">🤔 DOMANDA:</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-2">
            Perché l'AI ha risposto in modo generico anche con ruolo professionale?
          </p>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-blue-400 font-medium">💡 RISPOSTA:</span>
            <span className="text-white/80 text-sm ml-2">Non sa niente della TUA azienda!</span>
          </div>
        </div>

        {!showProgression && (
          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-3">🧪 ESPERIMENTO:</h3>
            <p className="text-white/80 text-sm mb-3">
              Aggiungiamo contesto step by step e vediamo come migliora la risposta!
            </p>
            <div className="space-y-2">
              {progressionLevels.map((level, index) => (
                <div key={index} className="bg-slate-800/40 rounded-lg p-3">
                  <div className="text-blue-400 text-sm font-medium">{level.level}</div>
                  <div className="text-white/70 text-xs mt-1">{level.description}</div>
                  <div className="text-green-400 text-xs mt-1">{level.result}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <label className="text-white/70 mb-3 block">🏢 Seleziona il tipo di azienda:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {businessTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleBusinessTypeSelect(type.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
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
        
        {promptData.context && (
          <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              🎁 Context Auto-Generated:
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              "{promptData.context}"
            </p>
          </div>
        )}

        {showProgression && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-3">📈 PROGRESSIVE BUILDING RISULTATI:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Solo ruolo:</span>
                  <span className="text-yellow-400">Generico ma professionale</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">+ Business type:</span>
                  <span className="text-green-400">Industry-specific knowledge</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">+ Context completo:</span>
                  <span className="text-green-400">Policy-aware responses</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10">
                <label className="text-white/70 text-sm mb-2 block">📊 Volume email/giorno:</label>
                <select 
                  className="w-full bg-slate-700/60 border border-white/20 rounded text-white p-2 text-sm"
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
                  className="w-full bg-slate-700/60 border border-white/20 rounded text-white p-2 text-sm"
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

            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
              <span className="text-green-400 font-medium">🎯 Quality Score: +2 punti!</span>
              <span className="text-white/80 text-sm ml-2">
                Il contesto specifico ha trasformato risposte generiche in soluzioni business-aware!
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={!promptData.businessType}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            Incredibile! Ma come diciamo COSA fare? →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessContextStep;
