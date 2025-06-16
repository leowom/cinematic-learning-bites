
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Save, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (shouldSave: boolean) => void;
  hasUnsavedChanges: boolean;
}

const ExitConfirmDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  hasUnsavedChanges
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-900/40 rounded-lg border border-orange-700/50">
            <AlertTriangle className="w-5 h-5 text-orange-300" />
          </div>
          <div>
            <h3 className="text-slate-200 font-medium text-lg">
              Conferma Uscita
            </h3>
            <p className="text-slate-400 text-sm">
              Stai per uscire dal Prompt Engineering Lab
            </p>
          </div>
        </div>

        {hasUnsavedChanges ? (
          <div className="bg-orange-900/20 border border-orange-700/40 rounded-lg p-4 mb-6">
            <p className="text-orange-200 text-sm">
              <strong>Attenzione:</strong> Hai modifiche non salvate. Vuoi salvarle prima di uscire?
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-slate-300 text-sm">
              Il tuo progresso è stato salvato automaticamente. Puoi riprendere da dove hai interrotto.
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          {hasUnsavedChanges && (
            <Button
              onClick={() => onConfirm(true)}
              className="bg-emerald-700 hover:bg-emerald-600 text-white w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Salva e Esci
            </Button>
          )}
          
          <Button
            onClick={() => onConfirm(false)}
            variant="outline"
            className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 w-full"
          >
            <X className="w-4 h-4 mr-2" />
            {hasUnsavedChanges ? 'Esci senza Salvare' : 'Esci'}
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 w-full"
          >
            Continua nel Lab
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmDialog;
