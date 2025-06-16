
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="h-full bg-slate-50/95 border-l border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-white/80">
        <div className="flex items-center gap-2 mb-2">
          <StickyNote className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Note Personali</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {stepTitles[currentStep - 1]}
        </Badge>
      </div>

      <div className="p-4 space-y-4 h-[calc(100%-80px)] overflow-y-auto">
        {/* Quick Notes */}
        <Card className="bg-white/60">
          <CardHeader className="pb-2">
            <h4 className="text-sm font-medium text-gray-700">Note Rapide</h4>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {quickNotes.map((note, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => addQuickNote(note)}
                  className="h-auto p-2 text-xs justify-start hover:bg-blue-50"
                >
                  {note}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes Textarea */}
        <div className="flex-1">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Scrivi qui le tue note e riflessioni durante la lezione..."
            className="w-full h-80 p-3 border border-gray-200 rounded-lg resize-none text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notes Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
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
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Cancella Tutto
          </Button>
        </div>

        {/* Progress Summary */}
        <Card className="bg-blue-50/60 border-blue-200">
          <CardContent className="p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Progresso Lezione
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-blue-700">Step corrente:</span>
                <span className="font-medium text-blue-800">{currentStep}/3</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotesPanel;
