
import React, { useState } from 'react';
import { Edit3, Copy, Check, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  instruction: string;
  placeholder: string;
  example?: string;
  context: 'role' | 'context' | 'tasks' | 'tone' | 'format';
  onTextChange: (text: string) => void;
  value: string;
}

const MicropromptWriter: React.FC<Props> = ({ 
  title, 
  instruction,
  placeholder, 
  example, 
  context, 
  onTextChange, 
  value 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyExample = () => {
    if (example) {
      onTextChange(example);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSimpleFeedback = () => {
    if (!value.trim()) return null;
    
    const wordCount = value.trim().split(' ').length;
    let feedback = '';
    let color = 'text-slate-400';
    
    if (context === 'role') {
      if (value.toLowerCase().includes('sei un') || value.toLowerCase().includes('you are')) {
        feedback = '✅ Ottimo! Hai definito il ruolo correttamente';
        color = 'text-emerald-400';
      } else {
        feedback = '💡 Prova a iniziare con "Sei un..."';
        color = 'text-orange-400';
      }
    } else if (wordCount < 5) {
      feedback = '💡 Aggiungi più dettagli';
      color = 'text-orange-400';
    } else {
      feedback = '✅ Buon livello di dettaglio!';
      color = 'text-emerald-400';
    }
    
    return { feedback, color };
  };

  const feedbackData = getSimpleFeedback();

  return (
    <div className="bg-blue-900/15 border border-blue-700/30 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-blue-300 font-medium flex items-center space-x-2">
          <Edit3 className="w-4 h-4" />
          <span>🖊️ {title}</span>
        </h4>
        
        {example && (
          <Button
            onClick={handleCopyExample}
            variant="outline"
            size="sm"
            className="text-blue-300 border-blue-600 hover:bg-blue-800/60 text-xs"
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? 'Copiato!' : 'Usa Esempio'}
          </Button>
        )}
      </div>

      <p className="text-blue-200 text-sm mb-3">{instruction}</p>

      <textarea
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800/60 border border-blue-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 resize-none h-20 focus:border-blue-500 focus:outline-none text-sm"
        rows={3}
      />
      
      {feedbackData && (
        <div className={`mt-2 text-xs ${feedbackData.color} flex items-center space-x-1`}>
          <Brain className="w-3 h-3" />
          <span>{feedbackData.feedback}</span>
        </div>
      )}
      
      {example && (
        <div className="mt-3 p-2 bg-slate-800/40 rounded-lg border border-blue-600/20">
          <div className="text-blue-400 text-xs mb-1">💡 Esempio:</div>
          <div className="text-slate-300 text-xs font-mono">
            {example}
          </div>
        </div>
      )}
    </div>
  );
};

export default MicropromptWriter;
