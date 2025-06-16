
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2 } from 'lucide-react';

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
    '📊 Metrica da tracciare'
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
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <Badge variant="outline" className="bg-white/10 border-white/30 text-blue-200">
        {stepTitles[currentStep - 1]}
      </Badge>

      {/* Quick Notes */}
      <div className="bg-white/5 border border-white/20 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-200 mb-2">Note Rapide</h4>
        <div className="grid grid-cols-1 gap-1">
          {quickNotes.map((note, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => addQuickNote(note)}
              className="h-auto p-2 text-xs justify-start hover:bg-white/10 text-blue-200 hover:text-white"
            >
              {note}
            </Button>
          ))}
        </div>
      </div>

      {/* Notes Textarea */}
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Scrivi qui le tue note..."
        className="w-full h-32 p-3 border border-white/20 rounded-lg resize-none text-sm bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-white/10 border-white/30 text-blue-200 hover:bg-white/20"
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
    </div>
  );
};

export default NotesPopup;
