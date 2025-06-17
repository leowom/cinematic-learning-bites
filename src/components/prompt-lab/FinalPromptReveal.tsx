
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Copy, CheckCircle, Download } from 'lucide-react';

interface Props {
  promptData: any;
  onComplete: () => void;
}

const FinalPromptReveal: React.FC<Props> = ({ promptData, onComplete }) => {
  const generateFinalPrompt = () => {
    let prompt = '';
    
    if (promptData.userWrittenRole) {
      prompt += `${promptData.userWrittenRole}\n\n`;
    }
    
    if (promptData.userWrittenContext) {
      prompt += `CONTESTO:\n${promptData.userWrittenContext}\n\n`;
    }
    
    if (promptData.userWrittenTasks) {
      prompt += `TASK:\n${promptData.userWrittenTasks}\n\n`;
    }
    
    if (promptData.userWrittenTone) {
      prompt += `CONSTRAINTS:\n${promptData.userWrittenTone}\n\n`;
    }
    
    if (promptData.userWrittenFormat) {
      prompt += `OUTPUT FORMAT:\n${promptData.userWrittenFormat}`;
    }
    
    return prompt;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generateFinalPrompt());
  };

  const handleDownloadPrompt = () => {
    const element = document.createElement('a');
    const file = new Blob([generateFinalPrompt()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'my-ai-prompt.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-700/50">
            <Eye className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            🎉 Il Tuo Prompt Completo
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Ecco il prompt professionale che hai creato seguendo la metodologia step-by-step. È pronto per essere utilizzato in ambito aziendale!
          </p>
        </div>
      </div>

      {/* Final Prompt Display */}
      <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-emerald-300 font-medium flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            📋 Prompt Finale
          </h3>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleCopyPrompt}
              size="sm"
              className="bg-emerald-700/60 hover:bg-emerald-600/80 text-emerald-200 border border-emerald-600/50"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copia
            </Button>
            
            <Button
              onClick={handleDownloadPrompt}
              size="sm"
              className="bg-emerald-700/60 hover:bg-emerald-600/80 text-emerald-200 border border-emerald-600/50"
            >
              <Download className="w-3 h-3 mr-1" />
              Scarica
            </Button>
          </div>
        </div>
        
        <div className="bg-slate-800/60 border border-emerald-600/30 rounded-lg p-4">
          <pre className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed font-mono">
            {generateFinalPrompt()}
          </pre>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/40 rounded-lg p-3">
            <div className="text-emerald-400 font-bold text-lg">{generateFinalPrompt().length}</div>
            <div className="text-slate-400 text-xs">Caratteri</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <div className="text-emerald-400 font-bold text-lg">~{Math.ceil(generateFinalPrompt().length / 4)}</div>
            <div className="text-slate-400 text-xs">Token stimati</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <div className="text-emerald-400 font-bold text-lg">A+</div>
            <div className="text-slate-400 text-xs">Qualità</div>
          </div>
        </div>
      </div>

      {/* Key Elements Summary */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-6">
        <h3 className="text-slate-200 font-medium mb-4">✅ Elementi Chiave Inclusi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promptData.userWrittenRole && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-sm">Ruolo e esperienza definiti</span>
            </div>
          )}
          {promptData.userWrittenContext && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-sm">Contesto aziendale specifico</span>
            </div>
          )}
          {promptData.userWrittenTasks && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-sm">Task misurabili e actionable</span>
            </div>
          )}
          {promptData.userWrittenTone && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-sm">Tone e constraints chiari</span>
            </div>
          )}
          {promptData.userWrittenFormat && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-sm">Formato output strutturato</span>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
        <h3 className="text-blue-300 font-medium mb-3">🚀 Prossimi Passi</h3>
        <ul className="text-slate-300 space-y-2 text-sm">
          <li>• Testa il prompt con diversi scenari aziendali</li>
          <li>• Monitora le performance e ottimizza se necessario</li>
          <li>• Condividi con il team per feedback e miglioramenti</li>
          <li>• Integra nei workflow aziendali esistenti</li>
        </ul>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <Button
          onClick={onComplete}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Completa la Lezione
        </Button>
      </div>
    </div>
  );
};

export default FinalPromptReveal;
