import React, { useState } from 'react';
import { Send, Image, Download, RefreshCw, Loader2, Copy, Check, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import CourseSidebar from '@/components/CourseSidebar';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

const Module3ImageGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const suggestedPrompts = [
    "Logo moderno geometrico per startup B2B",
    "Infografica stilizzata sul ciclo di vendita",
    "Illustrazione flat di ufficio coworking",
    "Icona minimalista per app di produttività",
    "Banner social media per evento tech",
    "Mascotte cartoon per brand giovane"
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt richiesto",
        description: "Inserisci un prompt per generare l'immagine",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setCurrentImage('');

    try {
      console.log('🎨 Generating image with prompt:', prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-image-openai', {
        body: {
          prompt: prompt.trim(),
          size: "1024x1024"
        }
      });

      if (error) {
        throw new Error(error.message || 'Errore nella generazione');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const imageUrl = data.imageUrl;
      setCurrentImage(imageUrl);

      // Add to history
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        imageUrl,
        timestamp: new Date()
      };

      setGeneratedImages(prev => [newImage, ...prev.slice(0, 4)]); // Keep last 5

      toast({
        title: "Immagine generata!",
        description: "La tua immagine è pronta"
      });

    } catch (error) {
      console.error('❌ Error generating image:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile generare l'immagine",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `learningbites-ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download avviato",
        description: "L'immagine è stata scaricata"
      });
    }
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copiato!",
      description: "Prompt copiato negli appunti"
    });
  };

  const handleRetryWithImage = (imageData: GeneratedImage) => {
    setPrompt(imageData.prompt);
    setCurrentImage(imageData.imageUrl);
  };


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
              Modulo 3.1 - Text-to-Image AI
            </div>
            <div className="text-slate-400 text-sm">
              From Text to Vision
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: 70%
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '70%' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Sidebar */}
          <CourseSidebar 
            currentModuleId="modulo-3"
            currentLessonId="1"
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                🖼️ LearningBites AI — Generazione Immagini
              </h1>
              <p className="text-slate-300 text-lg">
                MODULO 3.1 – From Text to Vision: crea immagini AI con prompt iterativi
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Prompt Input */}
              <GlassmorphismCard>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" />
              ✍️ Scrivi il tuo prompt creativo:
            </h3>
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descrivi l'immagine che vuoi creare..."
              className="min-h-[120px] mb-4 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
            />

            {/* Suggested Prompts */}
            <div className="mb-6">
              <p className="text-slate-400 text-sm mb-3">💡 Esempi di prompt:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedPrompts.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrompt(suggestion)}
                    className="text-xs text-slate-300 bg-slate-800/30 hover:bg-slate-700/50 h-auto py-2 px-3 text-left justify-start"
                  >
                    "{suggestion}"
                  </Button>
                ))}
              </div>
            </div>

              <Button
                onClick={handleGenerateImage}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4 mr-2" />
                    🔁 Genera Immagine
                  </>
                )}
              </Button>
              </GlassmorphismCard>

              {/* Right Panel - Image Preview */}
              <GlassmorphismCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">
                  🖼️ Anteprima immagine
                </h3>
                {currentImage && (
                  <Button
                    onClick={handleDownloadImage}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>

              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
                    <p className="text-slate-300">Generando la tua immagine...</p>
                  </div>
                ) : currentImage ? (
                  <div className="w-full">
                    <img
                      src={currentImage}
                      alt="Generated image"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>L'immagine generata apparirà qui</p>
                  </div>
                )}
              </div>

              {currentImage && (
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => setPrompt('')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Migliora il prompt
                  </Button>
                </div>
              )}
              </GlassmorphismCard>
            </div>

            {/* History */}
            {generatedImages.length > 0 && (
              <GlassmorphismCard className="mt-8">
              <h3 className="text-white text-lg font-semibold mb-4">
                📝 Cronologia generazioni
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((image) => (
                  <div key={image.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <img
                      src={image.imageUrl}
                      alt="Generated"
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                      "{image.prompt}"
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRetryWithImage(image)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1"
                        size="sm"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Usa
                      </Button>
                      <Button
                        onClick={() => handleCopyPrompt(image.prompt)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        size="sm"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              </GlassmorphismCard>
            )}

            {/* Instructions */}
            <GlassmorphismCard size="small" className="mt-6">
              <h4 className="text-white font-semibold mb-3">🎯 Come funziona:</h4>
              <ol className="text-slate-300 text-sm space-y-2">
                <li>1. <strong>Scrivi il prompt:</strong> Descrivi l'immagine che vuoi creare</li>
                <li>2. <strong>Genera:</strong> L'AI creerà l'immagine basandosi sul tuo prompt</li>
                <li>3. <strong>Analizza:</strong> L'immagine rispecchia la tua visione?</li>
                <li>4. <strong>Itera:</strong> Migliora il prompt aggiungendo dettagli specifici</li>
                <li>5. <strong>Scarica:</strong> Salva il risultato finale</li>
              </ol>
            </GlassmorphismCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module3ImageGenerator;