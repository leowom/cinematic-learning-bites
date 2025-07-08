import React, { useState, useRef } from 'react';
import { Upload, Send, Copy, Check, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useOpenAI } from '@/hooks/useOpenAI';
import { supabase } from '@/integrations/supabase/client';
import GlassmorphismCard from '@/components/GlassmorphismCard';
const Module3PDFPrompt: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [extractionMethod, setExtractionMethod] = useState<string>('');
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  const {
    testPromptWithGPT
  } = useOpenAI();
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast({
        title: "Errore",
        description: "Seleziona un file PDF valido",
        variant: "destructive"
      });
      return;
    }
    setPdfFile(file);
    setIsExtracting(true);
    try {
      // Usa l'edge function per estrarre il testo
      const formData = new FormData();
      formData.append('pdf', file);
      const {
        data,
        error
      } = await supabase.functions.invoke('extract-pdf-text', {
        body: formData
      });
      if (error) {
        throw new Error(error.message || 'Errore nella richiesta al server');
      }
      if (data.error) {
        throw new Error(data.error);
      }
      setPdfText(data.text);
      setExtractionMethod(data.info?.extractionMethod || 'unknown');
      toast({
        title: "File caricato!",
        description: "PDF caricato completamente e pronto per l'elaborazione"
      });
    } catch (error) {
      console.error('Errore estrazione PDF:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile estrarre il testo dal PDF",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };
  const handleSendPrompt = async () => {
    if (!pdfText || !prompt.trim()) {
      toast({
        title: "Campi mancanti",
        description: "Carica un PDF e scrivi un prompt prima di continuare",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    setResponse('');
    try {
      const fullPrompt = `Il contenuto del PDF è: "${pdfText.substring(0, 8000)}..." 

Richiesta: ${prompt}`;
      const result = await testPromptWithGPT(fullPrompt, {
        type: 'pdf_analysis',
        context: 'document_processing'
      });
      setResponse(result.response);
      toast({
        title: "Risposta generata!",
        description: "L'AI ha analizzato il tuo documento"
      });
    } catch (error) {
      console.error('Errore OpenAI:', error);
      toast({
        title: "Errore",
        description: "Impossibile processare la richiesta",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiato!",
        description: "Risposta copiata negli appunti"
      });
    }
  };
  const suggestedPrompts = ["Riassumilo in 5 punti chiave", "Estrai tutte le date e informazioni importanti", "Spiegamelo con linguaggio semplice", "Crea un riassunto esecutivo per il management", "Identifica i rischi e le opportunità principali", "Estrai tutti i numeri e statistiche", "Riformula per una presentazione"];
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
    background: 'linear-gradient(135deg, #1a2434 0%, #0f1419 50%, #1a2434 100%)'
  }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧠 LearningBites AI
          </h1>
          <p className="text-slate-300 text-lg">
            MODULO 3 – Prompt to Value: trasforma i tuoi file in risultati concreti
          </p>
        </div>

        {/* Main Interface */}
        <GlassmorphismCard className="mb-6">
          {/* PDF Upload Section */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              📎 Carica un documento PDF
            </h3>
            
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              
              {!pdfFile ? <div>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mb-2 hover:bg-slate-700 transition-colors" disabled={isExtracting}>
                    {isExtracting ? <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Caricamento...
                      </> : <>
                        <Upload className="w-4 h-4 mr-2" />
                        Seleziona PDF
                      </>}
                  </Button>
                  <p className="text-slate-400 text-sm">
                    Carica un documento PDF per iniziare (max 10MB)
                  </p>
                </div> : <div className="text-green-400">
                  <Check className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">{pdfFile.name}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => fileInputRef.current?.click()} variant="ghost" size="sm">
                      Cambia PDF
                    </Button>
                    {pdfText.length > 100 && <Button onClick={() => setShowTextPreview(!showTextPreview)} variant="ghost" size="sm">
                        {showTextPreview ? 'Nascondi' : 'Mostra'} anteprima
                      </Button>}
                  </div>
                  {showTextPreview && pdfText && <div className="mt-3 p-3 bg-slate-800/30 border border-slate-600 rounded text-xs text-slate-300 max-h-40 overflow-y-auto">
                      <div className="font-medium mb-2">Anteprima testo estratto:</div>
                      <div className="whitespace-pre-wrap">
                        {pdfText.substring(0, 500)}
                        {pdfText.length > 500 && '...'}
                      </div>
                    </div>}
                </div>}
            </div>
          </div>

          {/* Prompt Section */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              ✍️ Scrivi cosa vuoi ottenere dal documento:
            </h3>
            
            <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Es: 'Riassumi il PDF in 5 bullet point' o 'Spiegamelo come a un ragazzo di 15 anni'" className="min-h-[100px] mb-4 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400" disabled={!pdfText} />

            {/* Prompt Suggestions */}
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">💡 Suggerimenti:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((suggestion, index) => <Button key={index} variant="ghost" size="sm" onClick={() => setPrompt(suggestion)} className="text-xs text-slate-300 bg-slate-800/50 hover:bg-slate-700/50" disabled={!pdfText}>
                    {suggestion}
                  </Button>)}
              </div>
            </div>

            <Button onClick={handleSendPrompt} disabled={!pdfText || !prompt.trim() || isProcessing} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              {isProcessing ? <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </> : <>
                  <Send className="w-4 h-4 mr-2" />
                  🔁 Invia prompt
                </>}
            </Button>
          </div>

          {/* Response Section */}
          {(response || isProcessing) && <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">
                  🧾 Output AI
                </h3>
                {response && <Button onClick={handleCopyResponse} variant="outline" size="sm">
                    {copied ? <>
                        <Check className="w-4 h-4 mr-2" />
                        Copiato!
                      </> : <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copia
                      </>}
                  </Button>}
              </div>
              
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 min-h-[200px]">
                {isProcessing ? <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                    <span className="ml-3 text-slate-300">Generando risposta...</span>
                  </div> : <div className="text-slate-200 whitespace-pre-wrap">
                    {response}
                  </div>}
              </div>
              
              {response && <div className="mt-4 flex gap-3">
                  <Button onClick={() => {
              setPrompt('');
              setResponse('');
            }} variant="outline" size="sm">
                    Migliora il prompt
                  </Button>
                  <Button onClick={() => {
              setPdfFile(null);
              setPdfText('');
              setExtractionMethod('');
              setPrompt('');
              setResponse('');
              setShowTextPreview(false);
            }} variant="outline" size="sm">
                    Nuovo documento
                  </Button>
                </div>}
            </div>}
        </GlassmorphismCard>

        {/* Instructions */}
        <GlassmorphismCard size="small">
          <h4 className="text-white font-semibold mb-3">🎯 Come funziona:</h4>
          <ol className="text-slate-300 text-sm space-y-2">
            <li>1. <strong>Carica il tuo PDF:</strong> Il sistema legge automaticamente il contenuto</li>
            <li>2. <strong>Descrivi cosa vuoi:</strong> Scrivi la tua richiesta in linguaggio naturale</li>
            <li>3. <strong>Ricevi la risposta:</strong> L'AI analizza il documento e risponde alla tua richiesta</li>
            <li>4. <strong>Copia o migliora:</strong> Usa il risultato o affina la richiesta</li>
          </ol>
        </GlassmorphismCard>
      </div>
    </div>;
};
export default Module3PDFPrompt;