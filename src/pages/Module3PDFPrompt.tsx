import React, { useState, useRef } from 'react';
import { Upload, Send, Copy, Check, FileText, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useOpenAI } from '@/hooks/useOpenAI';
import { supabase } from '@/integrations/supabase/client';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import CourseSidebar from '@/components/CourseSidebar';
const Module3PDFPrompt: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [pdfReady, setPdfReady] = useState(false);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
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
        // Se l'errore indica che l'estrazione PDF non è supportata, mostra un messaggio specifico
        if (data.error.includes('Estrazione testo PDF non supportata')) {
          toast({
            title: "Funzionalità temporaneamente non disponibile",
            description: "Al momento l'estrazione automatica del testo dai PDF non è supportata. Copia manualmente il testo dal PDF e incollalo nel campo sottostante.",
            variant: "destructive"
          });
          
          // Mostra un'area di testo per inserire manualmente il contenuto
          setPdfFile(null);
          setPdfText('');
          setPdfReady(false);
          setShowTextInput(true);
          return;
        }
        
        throw new Error(data.error);
      }
      setPdfText(data.textContent || '');
      setPdfReady(data.ready);
      toast({
        title: "File caricato!",
        description: "PDF pronto per l'analisi AI"
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
    if ((!pdfReady && !showTextInput) || !prompt.trim()) {
      toast({
        title: "Campi mancanti",
        description: "Inserisci il contenuto del documento e scrivi un prompt prima di continuare",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    setResponse('');
    try {
      const fullPrompt = `DOCUMENTO_TESTO: ${pdfText}
USER_REQUEST: ${prompt}`;
      
      const result = await testPromptWithGPT(fullPrompt, {
        type: 'text_analysis',
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f1419 50%, #1a2434 100%)'
    }}>
      <div className="prompt-lab-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium">
              Modulo 3.0 - PDF + Prompt
            </div>
            <div className="text-slate-400 text-sm">
              Prompt to Value
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: 60%
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '60%' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Sidebar */}
          <CourseSidebar 
            currentModuleId="modulo-3"
            currentLessonId="0"
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto">
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
              📎 Carica un documento PDF o inserisci il testo manualmente
            </h3>
            
            {!showTextInput ? (
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                
                {!pdfFile ? (
                  <div>
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white mb-2 transition-colors" disabled={isExtracting}>
                      {isExtracting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Caricamento...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Seleziona PDF
                        </>
                      )}
                    </Button>
                    <p className="text-slate-400 text-sm mb-2">
                      Carica un documento PDF per iniziare (max 10MB)
                    </p>
                    <Button 
                      onClick={() => setShowTextInput(true)} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="sm"
                    >
                      Oppure inserisci il testo manualmente
                    </Button>
                  </div>
                ) : (
                  <div className="text-green-400">
                    <Check className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium text-slate-300">{pdfFile.name}</p>
                    
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" size="sm">
                        Cambia PDF
                      </Button>
                    </div>
                    <p className="text-emerald-400 text-xs mt-2">
                      ✅ PDF pronto per l'analisi AI
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-300 text-sm">
                      💡 Copia e incolla il testo dal tuo documento PDF qui:
                    </p>
                    <Button 
                      onClick={() => {
                        setShowTextInput(false);
                        setPdfText('');
                        setPdfReady(false);
                      }} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="sm"
                    >
                      Carica PDF invece
                    </Button>
                  </div>
                <Textarea
                  value={pdfText}
                  onChange={(e) => {
                    setPdfText(e.target.value);
                    setPdfReady(e.target.value.length > 10);
                  }}
                  placeholder="Incolla qui il contenuto del tuo documento PDF..."
                  className="min-h-[200px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                />
                {pdfText.length > 10 && (
                  <p className="text-emerald-400 text-sm">
                    ✅ Testo pronto per l'analisi AI ({pdfText.length} caratteri)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Prompt Section */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              ✍️ Scrivi cosa vuoi ottenere dal documento:
            </h3>
            
            <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Es: 'Riassumi il PDF in 5 bullet point' o 'Spiegamelo come a un ragazzo di 15 anni'" className="min-h-[100px] mb-4 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400" disabled={!pdfReady} />

            {/* Prompt Suggestions */}
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">💡 Suggerimenti:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((suggestion, index) => <Button key={index} className="bg-blue-600 hover:bg-blue-700 text-white text-xs" size="sm" onClick={() => setPrompt(suggestion)} disabled={!pdfReady}>
                    {suggestion}
                  </Button>)}
              </div>
            </div>

            <Button onClick={handleSendPrompt} disabled={!pdfReady || !prompt.trim() || isProcessing} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
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
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-3 text-slate-300">Generando risposta...</span>
                  </div> : <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
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
              setPdfReady(false);
              setPrompt('');
              setResponse('');
              setShowTextInput(false);
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default Module3PDFPrompt;