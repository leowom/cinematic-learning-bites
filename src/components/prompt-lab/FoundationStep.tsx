
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Target, Users, Cog } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const FoundationStep: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="p-2 bg-blue-900/40 rounded-lg border border-blue-700/50">
          <Brain className="w-5 h-5 text-blue-300" />
        </div>
        <div>
          <h2 className="text-slate-200 font-medium text-lg">
            Fondamenti del Prompt Engineering
          </h2>
          <p className="text-slate-400 text-sm">Le basi per comunicare efficacemente con l'AI</p>
        </div>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Il prompt engineering è l'arte di comunicare chiaramente con l'intelligenza artificiale. 
            Un prompt ben strutturato può trasformare risultati mediocri in output eccezionali.
          </p>
          
          <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-4 element-spacing">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <Target className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-300 text-sm font-medium">Perché è Importante:</span>
            </div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• <strong>Precisione:</strong> Risultati più accurati e utili</li>
              <li>• <strong>Efficienza:</strong> Meno tentativi per ottenere ciò che serve</li>
              <li>• <strong>Consistenza:</strong> Output prevedibili e affidabili</li>
              <li>• <strong>Professionalità:</strong> Comunicazione di qualità aziendale</li>
            </ul>
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium sub-element-spacing">I 5 Pilastri di un Prompt Efficace:</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-3 sub-element-spacing">
                <div className="w-8 h-8 bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="text-slate-200 font-medium">1. Ruolo Specifico</div>
                  <div className="text-slate-400 text-sm">Chi deve essere l'AI? Esperienza e competenze</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-3 sub-element-spacing">
                <div className="w-8 h-8 bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <span className="text-purple-300 text-sm font-bold">📍</span>
                </div>
                <div>
                  <div className="text-slate-200 font-medium">2. Contesto Aziendale</div>
                  <div className="text-slate-400 text-sm">Settore, situazione, vincoli operativi</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-3 sub-element-spacing">
                <div className="w-8 h-8 bg-green-900/40 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-300" />
                </div>
                <div>
                  <div className="text-slate-200 font-medium">3. Task Specifici</div>
                  <div className="text-slate-400 text-sm">Obiettivi misurabili e actionable</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-3 sub-element-spacing">
                <div className="w-8 h-8 bg-orange-900/40 rounded-lg flex items-center justify-center">
                  <Cog className="w-4 h-4 text-orange-300" />
                </div>
                <div>
                  <div className="text-slate-200 font-medium">4. Stile e Vincoli</div>
                  <div className="text-slate-400 text-sm">Tone, limitazioni, requisiti specifici</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-3 sub-element-spacing">
                <div className="w-8 h-8 bg-rose-900/40 rounded-lg flex items-center justify-center">
                  <span className="text-rose-300 text-sm font-bold">📋</span>
                </div>
                <div>
                  <div className="text-slate-200 font-medium">5. Formato Output</div>
                  <div className="text-slate-400 text-sm">Struttura, sezioni, template desiderato</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 section-spacing">
          <div className="text-center">
            <div className="text-blue-300 font-medium sub-element-spacing">
              🎯 Obiettivo del Lab
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Nelle prossime fasi costruirai un prompt professionale passo dopo passo, 
              imparando ogni elemento e mettendolo in pratica con esercizi guidati dall'AI Coach.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
          >
            <span>Inizia il Percorso</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoundationStep;
