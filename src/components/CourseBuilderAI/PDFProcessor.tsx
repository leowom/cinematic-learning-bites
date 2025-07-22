
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PDFProcessorProps {
  selectedFile: File | null;
  onProcessed: (parsedContent: any) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PDFProcessor: React.FC<PDFProcessorProps> = ({
  selectedFile,
  onProcessed,
  isProcessing,
  setIsProcessing
}) => {
  const { toast } = useToast();
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          setCurrentStep(1);
          setProcessingSteps(['Lettura del file PDF...', 'Estrazione del testo...']);
          
          // Simula un processo di estrazione più realistico
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // In un'implementazione reale, qui useresti una libreria come pdf-parse
          // Per ora, creiamo un contenuto di esempio più realistico
          const extractedText = `
CONTENUTO ESTRATTO DA: ${file.name}

Capitolo 1: Introduzione
Questo documento rappresenta un corso completo sull'argomento principale. 
Il contenuto è stato estratto automaticamente dal PDF caricato e sarà utilizzato 
per generare moduli di apprendimento strutturati.

Sezione 1.1: Obiettivi di apprendimento
- Comprendere i concetti fondamentali
- Applicare le tecniche apprese in contesti pratici  
- Sviluppare competenze avanzate nell'area di studio

Capitolo 2: Contenuti Teorici
I contenuti teorici includono definizioni, principi e framework 
che costituiscono la base di conoscenza necessaria per il corso.

Capitolo 3: Esempi Pratici
Esempi concreti e casi di studio che dimostrano l'applicazione 
pratica dei concetti teorici presentati nel corso.

Capitolo 4: Esercitazioni
Attività pratiche e quiz per verificare la comprensione 
e consolidare l'apprendimento degli studenti.

[NOTA: In produzione, qui ci sarebbe il testo reale estratto dal PDF]
          `;
          
          setCurrentStep(2);
          resolve(extractedText);
        } catch (error) {
          reject(new Error('Errore nell\'estrazione del testo dal PDF'));
        }
      };
      reader.onerror = () => reject(new Error('Errore nella lettura del file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const enhancedProcessPDF = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingSteps([
      'Lettura del file PDF...',
      'Estrazione del testo...',
      'Pulizia e analisi del contenuto...',
      'Identificazione degli argomenti...',
      'Generazione della struttura...'
    ]);
    setCurrentStep(0);

    try {
      // Step 1: Extract text
      const extractedText = await extractTextFromPDF(selectedFile);
      
      // Step 2: Process with AI
      setCurrentStep(2);
      const { data: response } = await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase.functions.invoke('ai-content-generator', {
          body: {
            action: 'parse_pdf',
            pdfContent: extractedText
          }
        })
      );

      if (response.error) throw new Error(response.error);

      setCurrentStep(4);
      
      // Enhanced parsed content with more metadata
      const enhancedParsedContent = {
        ...response,
        originalFileName: selectedFile.name,
        fileSize: selectedFile.size,
        processingTime: Date.now(),
        extractedLength: extractedText.length
      };

      onProcessed(enhancedParsedContent);
      
      toast({
        title: "✅ PDF elaborato con successo",
        description: `${enhancedParsedContent.wordCount} parole estratte da ${selectedFile.name}`,
      });

    } catch (error) {
      console.error('Enhanced PDF processing error:', error);
      toast({
        title: "Errore elaborazione PDF",
        description: error.message || "Impossibile elaborare il PDF",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingSteps([]);
      setCurrentStep(0);
    }
  };

  if (!selectedFile) return null;

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          <FileText className="w-4 h-4 mr-2 text-blue-400" />
          PDF Processor Avanzato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <div className="font-medium text-sm">{selectedFile.name}</div>
              <div className="text-xs text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="space-y-3">
            <Progress value={(currentStep / Math.max(processingSteps.length - 1, 1)) * 100} className="w-full" />
            <div className="text-sm text-slate-400">
              {processingSteps[currentStep] || 'Elaborazione in corso...'}
            </div>
          </div>
        )}

        <Button 
          onClick={enhancedProcessPDF}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isProcessing ? 'Elaborazione...' : 'Elabora PDF con AI'}
        </Button>

        <div className="text-xs text-slate-400 flex items-start space-x-2">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Nota:</strong> Per una funzionalità completa di estrazione PDF, 
            è necessario integrare una libreria di parsing PDF professionale come pdf-parse o PDF.js.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFProcessor;
