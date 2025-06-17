
import React, { useState } from 'react';
import { Edit3, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AICoach from './AICoach';

interface Props {
  title: string;
  placeholder: string;
  template?: string;
  context: 'role' | 'context' | 'tasks' | 'tone' | 'format';
  onTextChange: (text: string) => void;
  value: string;
}

const HandsOnWriter: React.FC<Props> = ({ 
  title, 
  placeholder, 
  template, 
  context, 
  onTextChange, 
  value 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = () => {
    if (template) {
      onTextChange(template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-200 font-medium flex items-center space-x-2">
          <Edit3 className="w-4 h-4" />
          <span>{title}</span>
        </h3>
        
        {template && (
          <Button
            onClick={handleCopyTemplate}
            variant="outline"
            size="sm"
            className="text-slate-300 border-slate-600 hover:bg-slate-700/60"
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? 'Copiato!' : 'Usa Template'}
          </Button>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-700/60 border border-slate-600/50 rounded-lg p-4 text-slate-200 placeholder-slate-400 resize-none h-32 focus:border-slate-500 focus:outline-none"
        rows={4}
      />
      
      <AICoach 
        userInput={value} 
        context={context} 
      />
      
      {template && (
        <div className="mt-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
          <div className="text-slate-400 text-xs mb-2">💡 Template di esempio:</div>
          <div className="text-slate-300 text-sm font-mono whitespace-pre-wrap">
            {template}
          </div>
        </div>
      )}
    </div>
  );
};

export default HandsOnWriter;
