
import React, { useState } from 'react';
import { Edit3, Copy, Check, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenAICoach from './OpenAICoach';

interface Props {
  title: string;
  instruction: string;
  placeholder: string;
  example?: string;
  context: 'role' | 'context' | 'tasks' | 'tone' | 'format';
  onTextChange: (text: string) => void;
  value: string;
  onQualityChange?: (score: number, canProceed: boolean) => void;
  updatePromptData?: (field: string, value: any) => void;
}

const MicropromptWriter: React.FC<Props> = ({ 
  title, 
  instruction,
  placeholder, 
  example, 
  context, 
  onTextChange, 
  value,
  onQualityChange,
  updatePromptData
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyExample = () => {
    if (example) {
      onTextChange(example);
      // Salva anche nel campo userWritten appropriato
      if (updatePromptData) {
        const fieldName = `userWritten${context.charAt(0).toUpperCase() + context.slice(1)}`;
        updatePromptData(fieldName, example);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTextChange = (text: string) => {
    onTextChange(text);
    // Salva nel campo userWritten appropriato
    if (updatePromptData) {
      const fieldName = `userWritten${context.charAt(0).toUpperCase() + context.slice(1)}`;
      updatePromptData(fieldName, text);
    }
  };

  const handleScoreChange = (score: number, canProceed: boolean) => {
    onQualityChange?.(score, canProceed);
  };

  const handleRetry = () => {
    // Focus sulla textarea per incoraggiare il miglioramento
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <div className="bg-blue-900/15 border border-blue-700/30 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-blue-300 font-medium flex items-center space-x-2">
          <Edit3 className="w-4 h-4" />
          <span>🖊️ {title}</span>
        </h4>
      </div>

      <p className="text-blue-200 text-sm mb-3">{instruction}</p>

      {/* Esempio posizionato SOPRA l'area di scrittura */}
      {example && (
        <div className="mb-3 p-3 bg-slate-800/40 rounded-lg border border-blue-600/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Esempio da seguire:</span>
            </div>
            <Button
              onClick={handleCopyExample}
              size="sm"
              className="bg-blue-700/60 hover:bg-blue-600/80 text-blue-200 border border-blue-600/50 text-xs px-2 py-1"
            >
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? 'Copiato!' : 'Usa Esempio'}
            </Button>
          </div>
          <div className="text-slate-300 text-xs font-mono whitespace-pre-wrap">
            {example}
          </div>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800/60 border border-blue-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 resize-none h-24 focus:border-blue-500 focus:outline-none text-sm"
        rows={4}
      />
      
      <OpenAICoach 
        userInput={value} 
        context={context}
        onScoreChange={handleScoreChange}
        onRetryRequest={handleRetry}
      />
    </div>
  );
};

export default MicropromptWriter;
