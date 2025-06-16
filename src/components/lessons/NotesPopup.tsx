
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, BookOpen } from 'lucide-react';

interface NotesPopupProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  currentStep: number;
}

const NotesPopup: React.FC<NotesPopupProps> = ({ 
  notes, 
  onNotesChange, 
  currentStep 
}) => {
  const stepTitles = [
    'Problema Reale',
    'Prompt Builder', 
    'Test & Implementazione'
  ];

  const quickNotes = [
    '💡 Insight importante',
    '⚠️ Da ricordare',
    '🔧 Implementare',
    '📊 Metrica da tracciare',
    '🎯 Obiettivo chiave',
    '✨ Best practice'
  ];

  const addQuickNote = (note: string) => {
    const timestamp = new Date().toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const newNote = `${note} [${timestamp}]\n`;
    onNotesChange(notes + newNote);
  };

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-white/20 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Note Personali</h3>
        </div>
        <Badge variant="outline" className="bg-blue-500/20 border-blue-400/30 text-blue-200">
          {stepTitles[currentStep - 1]}
        </Badge>
      </div>

      {/* Quick Notes */}
      <div className="bg-slate-800/40 border border-white/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-200 mb-3">Note Rapide</h4>
        <div className="grid grid-cols-1 gap-2">
          {quickNotes.map((note, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => addQuickNote(note)}
              className="h-auto p-2 text-xs justify-start hover:bg-white/10 text-blue-200 hover:text-white transition-colors"
            >
              {note}
            </Button>
          ))}
        </div>
      </div>

      {/* Notes Textarea */}
      <div>
        <label className="text-sm font-medium text-blue-200 mb-2 block">
          Le tue riflessioni:
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Scrivi qui i tuoi appunti e riflessioni durante la lezione..."
          className="w-full h-40 p-3 border border-white/20 rounded-lg resize-none text-sm bg-slate-900/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30"
          onClick={() => {
            const blob = new Blob([notes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `learning-bites-note-${Date.now()}.txt`;
            a.click();
          }}
          disabled={!notes.trim()}
        >
          <Download className="w-4 h-4 mr-1" />
          Scarica
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNotesChange('')}
          disabled={!notes.trim()}
          className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Summary */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-200 mb-2">
          Progresso Lezione
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-blue-300">Step completato:</span>
            <span className="font-medium text-white">{currentStep}/3</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPopup;
