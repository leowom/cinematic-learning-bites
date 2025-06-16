
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, ArrowRight, Brain, Building, Headphones, Briefcase, TrendingUp } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const RoleSelectionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [selectedRole, setSelectedRole] = useState(promptData.role || '');
  const [experience, setExperience] = useState(promptData.experience || 5);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const roles = [
    {
      id: 'customer-service',
      title: 'Responsabile Customer Service',
      icon: Headphones,
      description: 'Gestione completa del servizio clienti e risoluzione problematiche',
      qualities: ['Empatia', 'Problem-solving', 'Comunicazione efficace'],
      impact: 'Migliora customer satisfaction del 40%'
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      icon: TrendingUp,
      description: 'Analisi processi aziendali e ottimizzazione workflow operativi',
      qualities: ['Analisi dati', 'Process improvement', 'Strategic thinking'],
      impact: 'Ottimizza efficienza operativa del 35%'
    },
    {
      id: 'project-manager',
      title: 'Project Manager',
      icon: Briefcase,
      description: 'Coordinamento progetti e gestione team multidisciplinari',
      qualities: ['Leadership', 'Pianificazione', 'Risk management'],
      impact: 'Accelera delivery progetti del 30%'
    },
    {
      id: 'sales-director',
      title: 'Direttore Vendite',
      icon: Building,
      description: 'Sviluppo strategie commerciali e gestione pipeline vendite',
      qualities: ['Negoziazione', 'Strategic planning', 'Team building'],
      impact: 'Incrementa conversioni del 45%'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    updatePromptData('role', roleId);
    setShowAnalysis(true);
    
    // Update quality score based on role selection
    const baseScore = 3;
    updatePromptData('qualityScore', baseScore);
  };

  const handleExperienceChange = (value: number) => {
    setExperience(value);
    updatePromptData('experience', value);
    
    // Update quality score based on experience
    const experienceBonus = Math.min(value * 0.3, 2);
    updatePromptData('qualityScore', (promptData.qualityScore || 3) + experienceBonus);
  };

  const getSelectedRole = () => {
    return roles.find(role => role.id === selectedRole);
  };

  const getExperienceLevel = () => {
    if (experience <= 2) return { label: 'Junior', color: 'text-orange-300' };
    if (experience <= 5) return { label: 'Mid-level', color: 'text-slate-300' };
    if (experience <= 8) return { label: 'Senior', color: 'text-emerald-300' };
    return { label: 'Expert', color: 'text-blue-300' };
  };

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Users className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Definizione del Ruolo Professionale
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            L'assegnazione di un ruolo specifico all'AI stabilisce il contesto di competenza e autorità per le risposte. 
            Un ruolo ben definito trasforma l'AI da assistente generico a consulente specializzato.
          </p>
          
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3 element-spacing">
              <div className="text-rose-300 font-medium sub-element-spacing">Impatto della Specificità del Ruolo:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 sub-element-spacing">Senza Ruolo:</div>
                  <div className="text-slate-300">"Come gestisco questa situazione?"</div>
                  <div className="text-slate-400 text-xs">Risposta generica senza autorità</div>
                </div>
                <div>
                  <div className="text-slate-400 sub-element-spacing">Con Ruolo:</div>
                  <div className="text-slate-300">"Come responsabile customer service..."</div>
                  <div className="text-emerald-400 text-xs">Risposta esperta e attuabile</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium element-spacing">Seleziona il Ruolo Professionale:</h3>
          <div className="grid grid-cols-1 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <div
                  key={role.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-700/60 border-slate-600 ring-1 ring-slate-500'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50'
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-slate-600/60' : 'bg-slate-800/60'
                    }`}>
                      <Icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between sub-element-spacing">
                        <h4 className="text-slate-200 font-medium">{role.title}</h4>
                        {isSelected && <CheckCircle className="w-5 h-5 text-emerald-300" />}
                      </div>
                      <p className="text-slate-400 text-sm sub-element-spacing">{role.description}</p>
                      <div className="flex flex-wrap gap-2 sub-element-spacing">
                        {role.qualities.map((quality) => (
                          <span
                            key={quality}
                            className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded border border-slate-600/50"
                          >
                            {quality}
                          </span>
                        ))}
                      </div>
                      <div className="text-emerald-400/80 text-xs">{role.impact}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedRole && (
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
            <h3 className="text-slate-200 font-medium element-spacing">Livello di Esperienza:</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Anni di esperienza:</span>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-300 font-medium">{experience} anni</span>
                  <span className={`text-sm font-medium ${getExperienceLevel().color}`}>
                    ({getExperienceLevel().label})
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={experience}
                  onChange={(e) => handleExperienceChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1 anno</span>
                  <span>5 anni</span>
                  <span>10+ anni</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAnalysis && selectedRole && (
          <div className="space-y-4 animate-fade-in section-spacing">
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium sub-element-spacing flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Analisi dell'Autorità del Ruolo:</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-slate-400 sub-element-spacing">Ruolo</div>
                  <div className="text-slate-200 text-lg font-medium">{getSelectedRole()?.title}</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 sub-element-spacing">Esperienza</div>
                  <div className={`text-lg font-medium ${getExperienceLevel().color}`}>
                    {experience} anni
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 sub-element-spacing">Livello</div>
                  <div className={`text-lg font-medium ${getExperienceLevel().color}`}>
                    {getExperienceLevel().label}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="text-slate-200 font-medium sub-element-spacing">Esempio di Trasformazione:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-rose-300 font-medium sub-element-spacing">Prima:</div>
                  <div className="text-slate-400">"Aiutami con questo problema"</div>
                </div>
                <div>
                  <div className="text-emerald-300 font-medium sub-element-spacing">Dopo:</div>
                  <div className="text-slate-300">
                    "Sei {getSelectedRole()?.title} con {experience} anni di esperienza. 
                    Fornisci una soluzione professionale per..."
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
              <span className="text-emerald-300 font-medium">Punteggio Qualità: +{(3 + Math.min(experience * 0.3, 2)).toFixed(1)} punti!</span>
              <span className="text-slate-300 text-sm ml-2">
                Ruolo definito stabilisce autorità e competenza specifica.
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={!selectedRole}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 border border-slate-600 flex items-center space-x-2"
          >
            <span>Procedi al Contesto Aziendale</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #64748b;
          border: 2px solid #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #94a3b8;
          border-color: #64748b;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #64748b;
          border: 2px solid #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
      `}</style>
    </div>
  );
};

export default RoleSelectionStep;
