
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import { StickyNote, Download, Trash2 } from 'lucide-react';

interface NotesPanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  currentStep: number;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ 
  notes, 
  onNotesChange, 
  currentStep 
}) => {
  const stepTitles = [
    'Problema Reale',
    'Prompt Engineering', 
    'Implementazione'
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

  const clearNotes = () => {
    onNotesChange('');
  };

  return (
    <div className="h-full">
      <GlassmorphismCard className="h-full" size="large">
        <div className="border-b border-white/20 pb-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="w-5 h-5 text-blue-300" />
            <h3 className="font-semibold text-white">Note Personali</h3>
          </div>
          <Badge variant="outline" className="text-xs bg-white/10 border-white/30 text-blue-200">
            {stepTitles[currentStep - 1]}
          </Badge>
        </div>

        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Quick Notes */}
          <GlassmorphismCard size="small" className="bg-white/5">
            <h4 className="text-sm font-medium text-blue-200 mb-3">Note Rapide</h4>
            <div className="grid grid-cols-1 gap-2">
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
          </GlassmorphismCard>

          {/* Notes Textarea */}
          <div className="flex-1">
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Scrivi qui le tue note e riflessioni durante la lezione..."
              className="w-full h-80 p-3 border border-white/20 rounded-lg resize-none text-sm bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          {/* Notes Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 bg-white/10 border-white/30 text-blue-200 hover:bg-white/20 hover:text-white"
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
              <Download className="w-4 h-4" />
              Scarica Note
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotes}
              disabled={!notes.trim()}
              className="w-full justify-start gap-2 text-red-300 hover:text-red-200 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Cancella Tutto
            </Button>
          </div>

          {/* Progress Summary */}
          <GlassmorphismCard size="small" className="bg-blue-500/20 border-blue-300/30">
            <h4 className="text-sm font-medium text-blue-200 mb-2">
              Progresso Lezione
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-blue-300">Step corrente:</span>
                <span className="font-medium text-white">{currentStep}/3</span>
              </div>
              <div className="w-full bg-blue-800/50 rounded-full h-1.5">
                <div 
                  className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default NotesPanel;
