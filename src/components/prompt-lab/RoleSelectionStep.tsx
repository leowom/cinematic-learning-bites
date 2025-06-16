
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const RoleSelectionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [experience, setExperience] = useState(5);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const roles = [
    { id: 'customer-service', name: 'Responsabile Customer Service', sector: 'Servizio Clienti' },
    { id: 'sales-manager', name: 'Manager Vendite', sector: 'Commerciale' },
    { id: 'hr-specialist', name: 'Specialista Risorse Umane', sector: 'HR' },
    { id: 'marketing-lead', name: 'Marketing Lead', sector: 'Marketing' },
    { id: 'project-manager', name: 'Project Manager', sector: 'Gestione Progetti' },
    { id: 'business-analyst', name: 'Business Analyst', sector: 'Analisi Business' }
  ];

  const handleRoleSelect = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    setSelectedRole(roleId);
    updatePromptData('role', role?.name || '');
    setShowAnalysis(true);
    updatePromptData('qualityScore', 3);
  };

  const handleExperienceChange = (value: number) => {
    setExperience(value);
    updatePromptData('experience', value);
  };

  const getExperienceLabel = (years: number) => {
    if (years < 3) return 'Junior';
    if (years < 7) return 'Middle';
    if (years < 12) return 'Senior';
    return 'Expert';
  };

  const getAuthorityLevel = (years: number) => {
    if (years < 3) return { level: 'Limitata', color: 'text-orange-300' };
    if (years < 7) return { level: 'Buona', color: 'text-emerald-300' };
    if (years < 12) return { level: 'Elevata', color: 'text-emerald-300' };
    return { level: 'Massima', color: 'text-emerald-300' };
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
            Il primo elemento fondamentale per un prompt efficace è la definizione di un ruolo professionale specifico. 
            Questo stabilisce l'autorità e il contesto per le risposte AI.
          </p>
          
          <div className="bg-orange-900/15 border border-orange-700/30 rounded-lg p-4 element-spacing">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <AlertTriangle className="w-4 h-4 text-orange-300" />
              <span className="text-orange-300 text-sm font-medium">Perché è Critico:</span>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed">
              Senza un ruolo definito, l'AI risponde come un assistente generico. Con un ruolo specifico, 
              attinge a conoscenze specialistiche e adotta il tono appropriato del settore.
            </div>
          </div>
        </div>

        <div className="section-spacing">
          <label className="text-slate-200 font-medium element-spacing block">Seleziona il ruolo professionale:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`p-3 rounded-lg transition-all duration-200 text-left border ${
                  selectedRole === role.id
                    ? 'bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                <div className="font-medium text-sm sub-element-spacing">{role.name}</div>
                <div className="text-slate-400 text-xs">{role.sector}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedRole && (
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
            <h4 className="text-slate-200 font-medium element-spacing flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Livello di Esperienza:</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between sub-element-spacing">
                  <span className="text-slate-300 text-sm">Anni di esperienza: {experience}</span>
                  <span className={`text-sm font-medium ${getAuthorityLevel(experience).color}`}>
                    {getExperienceLabel(experience)} - Autorità {getAuthorityLevel(experience).level}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={experience}
                  onChange={(e) => handleExperienceChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-slate-400 text-xs mt-1">
                  <span>1 anno</span>
                  <span>10 anni</span>
                  <span>20+ anni</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAnalysis && (
          <div className="space-y-4 animate-fade-in section-spacing">
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium sub-element-spacing flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Analisi dell'Impatto:</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-slate-300 font-medium">Prima (Senza Ruolo):</div>
                  <ul className="text-slate-400 space-y-1">
                    <li>• Risposta generica</li>
                    <li>• Nessuna autorità</li>
                    <li>• Tono inconsistente</li>
                    <li>• Consigli superficiali</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-300 font-medium">Dopo (Con Ruolo):</div>
                  <ul className="text-emerald-300 space-y-1">
                    <li>• Expertise settoriale</li>
                    <li>• Credibilità professionale</li>
                    <li>• Linguaggio appropriato</li>
                    <li>• Soluzioni specifiche</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="text-slate-200 font-medium sub-element-spacing">Esempio di Trasformazione:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-900/40 rounded-lg p-3">
                  <div className="text-orange-300 font-medium sub-element-spacing">Generico:</div>
                  <div className="text-slate-400">"Gestisci meglio le email"</div>
                </div>
                <div className="bg-slate-900/40 rounded-lg p-3">
                  <div className="text-emerald-300 font-medium sub-element-spacing">Con Ruolo:</div>
                  <div className="text-slate-300">"Da Manager con 8 anni di esperienza: implementa workflow di triage, utilizza template pre-approvati, stabilisci SLA chiari"</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
              <span className="text-emerald-300 font-medium">Punteggio Qualità: +3 punti!</span>
              <span className="text-slate-300 text-sm ml-2">
                Il ruolo professionale trasforma risposte generiche in expertise settoriale.
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
    </div>
  );
};

export default RoleSelectionStep;
