
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Key, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentKey?: string;
}

const APIKeyModal: React.FC<Props> = ({ isOpen, onClose, onSave, currentKey = '' }) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  const isValidKey = apiKey.startsWith('sk-') && apiKey.length > 20;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Configura OpenAI API</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-white/70 text-sm mb-3">
              Per usare l'AI testing reale, inserisci la tua OpenAI API key:
            </p>
            
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-slate-800/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
                >
                  {showKey ? 'Nascondi' : 'Mostra'}
                </button>
              </div>
              
              {!isValidKey && apiKey && (
                <p className="text-red-400 text-xs">
                  La API key deve iniziare con "sk-" ed essere valida
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-3">
            <h4 className="text-blue-400 font-medium text-sm mb-1">Come ottenere la API key:</h4>
            <ol className="text-white/80 text-xs space-y-1 list-decimal list-inside">
              <li>Vai su platform.openai.com</li>
              <li>Crea un account o accedi</li>
              <li>Vai in "API Keys" e genera una nuova key</li>
              <li>Aggiungi credito (min. $5-10) per i test</li>
            </ol>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs mt-2"
            >
              <span>Apri OpenAI Platform</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-amber-600/20 border border-amber-400/30 rounded-lg p-3">
            <p className="text-amber-400 text-xs">
              <strong>Sicurezza:</strong> La tua API key viene salvata solo nel browser locale 
              e non viene mai inviata ai nostri server.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/30 text-white hover:bg-white/10"
          >
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValidKey}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50"
          >
            Salva API Key
          </Button>
        </div>
      </div>
    </div>
  );
};

export default APIKeyModal;
