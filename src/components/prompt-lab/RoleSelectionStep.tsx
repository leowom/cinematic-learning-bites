
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const RoleSelectionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  const roles = [
    {
      id: 'customer-service',
      emoji: '👔',
      title: 'Customer Service Expert',
      description: 'Specializzato in email automation',
      context: 'Gestisce comunicazioni clienti con empatia e professionalità',
      experience: '8+ anni'
    },
    {
      id: 'sales-manager',
      emoji: '📈',
      title: 'Sales Manager',
      description: 'Esperto in conversioni e lead',
      context: 'Trasforma prospect in clienti con strategie persuasive',
      experience: '5+ anni'
    },
    {
      id: 'content-creator',
      emoji: '✍️',
      title: 'Content Creator',
      description: 'Specialista in storytelling',
      context: 'Crea contenuti coinvolgenti per tutti i canali digital',
      experience: '6+ anni'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    const selectedRole = roles.find(r => r.id === roleId);
    updatePromptData('role', selectedRole?.title || '');
    updatePromptData('qualityScore', 4);
    setShowBeforeAfter(true);
  };

  const beforeResponse = `Grazie per la tua email. Mi dispiace per il problema. Cosa posso fare per aiutarti?`;

  const afterResponse = `Gentile Marco,

Mi scuso sinceramente per il difetto del prodotto ricevuto. Come manager del customer service con 8 anni di esperienza, prendo questa situazione molto seriamente.

Le offro rimborso completo o sostituzione immediata. Quale preferisce?

Cordiali saluti,
[Nome] - Customer Service Manager`;

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center relative z-10">
        🎭 STEP 2/7: Diamo all'AI una identità professionale
      </h2>
      
      <div className="relative z-10 space-y-6">
        <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-2">💡 INSIGHT:</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            L'AI non sa chi dovrebbe essere! Senza ruolo = risposta generica da "anyone". 
            Con ruolo = risposta da professional specifico con expertise credibile.
          </p>
        </div>

        <div>
          <h3 className="text-white font-medium mb-3">👔 Scegli il ruolo più appropriato:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`bg-slate-800/60 border rounded-xl p-4 cursor-pointer hover:bg-slate-700/80 hover:border-blue-400/50 hover:scale-105 transition-all duration-200 ${
                  promptData.role === role.title 
                    ? 'border-blue-400/50 bg-slate-700/80' 
                    : 'border-white/20'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{role.emoji}</div>
                  <h4 className="text-white font-semibold mb-1">{role.title}</h4>
                  <p className="text-white/60 text-sm mb-2">{role.description}</p>
                  <p className="text-white/50 text-xs mb-1">{role.context}</p>
                  <span className="text-blue-400 text-xs font-medium">Exp: {role.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {promptData.role && (
          <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10">
            <label className="text-white/70 text-sm mb-2 block">
              ⚙️ Personalizza esperienza: {promptData.experience} anni
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={promptData.experience}
              onChange={(e) => updatePromptData('experience', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-white/50 text-xs mt-1">
              <span>Junior (1-3)</span>
              <span>Senior (4-8)</span>
              <span>Expert (9-15)</span>
            </div>
          </div>
        )}

        {showBeforeAfter && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-amber-400 font-medium">✨ IMPROVEMENTS IMMEDIATE:</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-red-400 text-sm mb-2">❌ SENZA RUOLO (prima):</h4>
                <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-3">
                  <p className="text-white/80 text-sm">{beforeResponse}</p>
                </div>
              </div>
              <div>
                <h4 className="text-green-400 text-sm mb-2">✅ CON RUOLO SPECIFICO (dopo):</h4>
                <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap">
                    {afterResponse}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-amber-400/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-medium mb-2">📈 Before → After:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-red-400">"Grazie per email" →</div>
                  <div className="text-red-400">"Cosa posso fare?" →</div>
                  <div className="text-red-400">Tone casual →</div>
                  <div className="text-red-400">No authority →</div>
                </div>
                <div className="space-y-1">
                  <div className="text-green-400">"Mi scuso sinceramente"</div>
                  <div className="text-green-400">"Le offro rimborso/sostituzione"</div>
                  <div className="text-green-400">Tone professionale</div>
                  <div className="text-green-400">Expertise credibile</div>
                </div>
              </div>
            </div>

            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
              <p className="text-green-400 text-sm">
                🎯 <strong>Quality Score: +2 punti!</strong> Il ruolo specifico ha trasformato una risposta 
                generica in una professionale con autorità credibile.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={!promptData.role}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            Fantastico! Ma possiamo migliorare ancora... →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
