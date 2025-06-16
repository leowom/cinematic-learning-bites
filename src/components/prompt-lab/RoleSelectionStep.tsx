
import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const RoleSelectionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const roles = [
    {
      id: 'customer-service',
      emoji: '👔',
      title: 'Customer Service Expert',
      description: 'Specializzato in email automation',
      context: 'Gestisce comunicazioni clienti con empatia e professionalità'
    },
    {
      id: 'sales-manager',
      emoji: '📈',
      title: 'Sales Manager',
      description: 'Esperto in conversioni e lead',
      context: 'Trasforma prospect in clienti con strategie persuasive'
    },
    {
      id: 'content-creator',
      emoji: '✍️',
      title: 'Content Creator',
      description: 'Specialista in storytelling',
      context: 'Crea contenuti coinvolgenti per tutti i canali digital'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    const selectedRole = roles.find(r => r.id === roleId);
    updatePromptData('role', selectedRole?.title || '');
  };

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center relative z-10">
        🎭 STEP 1/5: Chi è il tuo AI Assistant?
      </h2>
      
      <p className="text-white/70 mb-6 relative z-10">
        Definisci il ruolo specifico dell'AI per ottenere risposte più accurate e contestualizzate.
      </p>
      
      {/* Role selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
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
              <h3 className="text-white font-semibold mb-1">{role.title}</h3>
              <p className="text-white/60 text-sm mb-2">{role.description}</p>
              <p className="text-white/50 text-xs">{role.context}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Experience slider */}
      <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10 mb-6 relative z-10">
        <label className="text-white/70 text-sm mb-2 block">
          Anni di esperienza: {promptData.experience}
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

      {/* Continue button */}
      <div className="flex justify-end relative z-10">
        <Button
          onClick={onComplete}
          disabled={!promptData.role}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continua Step 2 →
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
