import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, Wand2, Eye, Save, Edit3, 
  ArrowLeft, Plus, Book, Brain, Target, Clock,
  CheckCircle, AlertCircle, Download, Trash2, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import our new enhanced components
import AIStatusChecker from '@/components/CourseBuilderAI/AIStatusChecker';
import PDFProcessor from '@/components/CourseBuilderAI/PDFProcessor';
import CoursePreviewEnhanced from '@/components/CourseBuilderAI/CoursePreviewEnhanced';

interface GeneratedCourse {
  courseTitle: string;
  totalDuration: string;
  description: string;
  modules: {
    moduleTitle: string;
    description: string;
    duration: string;
    lessons: {
      lessonTitle: string;
      content: string;
      duration: string;
      slides: string[];
      examples: string[];
      quiz: {
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
      }[];
    }[];
    learningObjectives: string[];
  }[];
  finalTest: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

interface ParsedPDF {
  cleanedText: string;
  wordCount: number;
  mainTopics: string[];
  suggestedTitle: string;
}

const CourseBuilderAI = () => {
  const navigate = useNavigate();
  const { canManageContent, loading } = useUserRole();
  const { toast } = useToast();

  // States
  const [activeTab, setActiveTab] = useState<'upload' | 'generate' | 'preview' | 'edit'>('upload');
  const [inputMethod, setInputMethod] = useState<'pdf' | 'text'>('pdf');
  const [rawText, setRawText] = useState('');
  const [parsedContent, setParsedContent] = useState<ParsedPDF | null>(null);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Configuration
  const [config, setConfig] = useState({
    topic: '',
    targetAudience: 'principianti',
    moduleCount: 4,
    lessonPerModule: 3
  });

  // File handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Redirect if not authorized
  if (!loading && !canManageContent()) {
    navigate('/admin-lms');
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Errore",
        description: "Seleziona solo file PDF",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File troppo grande",
        description: "Il file deve essere più piccolo di 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    toast({
      title: "File caricato",
      description: `${file.name} pronto per l'elaborazione`,
    });
  };

  const generateFullCourse = async () => {
    if (!parsedContent && !rawText.trim()) {
      toast({
        title: "Errore",
        description: "Prima analizza il contenuto",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Generazione corso completo con AI...');

    try {
      const contentToUse = parsedContent?.cleanedText || rawText;
      
      console.log('🚀 Starting full course generation with enhanced prompts...');
      
      const response = await supabase.functions.invoke('ai-content-generator', {
        body: {
          action: 'generate_full_course',
          content: contentToUse,
          topic: config.topic,
          targetAudience: config.targetAudience,
          moduleCount: config.moduleCount,
          lessonPerModule: config.lessonPerModule
        }
      });

      console.log('🎯 AI Generator Response:', response);

      if (response.error) {
        console.error('❌ AI Generation Error:', response.error);
        throw new Error(response.error.message || 'Errore nella generazione AI');
      }

      if (!response.data) {
        throw new Error('Nessun dato ricevuto dalla funzione AI');
      }

      // Validate the generated course structure
      if (!response.data.courseTitle || !response.data.modules || response.data.modules.length === 0) {
        throw new Error('Struttura del corso generata non valida');
      }

      setGeneratedCourse(response.data);
      setActiveTab('preview');
      
      toast({
        title: "🎉 Corso generato con successo!",
        description: `${response.data.modules.length} moduli con micro-learning creati`,
      });

    } catch (error) {
      console.error('❌ Error generating course:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile generare il corso",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const saveCourseToDatabase = async () => {
    if (!generatedCourse) return;

    setIsProcessing(true);
    setProcessingStep('Salvataggio nel database...');

    try {
      console.log('💾 Saving course to database...');

      const response = await supabase.functions.invoke('save-course', {
        body: {
          courseData: generatedCourse,
          targetAudience: config.targetAudience
        }
      });

      console.log('💾 Save Response:', response);

      if (response.error) {
        throw new Error(response.error.message || 'Errore nella chiamata alla funzione di salvataggio');
      }

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Errore durante il salvataggio del corso');
      }

      toast({
        title: "🚀 Corso pubblicato!",
        description: "Il corso è stato salvato e pubblicato con successo nel sistema",
      });

      // Navigate back to course builder
      navigate('/admin/course-builder');

    } catch (error) {
      console.error('❌ Error saving course:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile salvare il corso nel database",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setRawText('');
    setParsedContent(null);
    setGeneratedCourse(null);
    setActiveTab('upload');
    setConfig({
      topic: '',
      targetAudience: 'principianti',
      moduleCount: 4,
      lessonPerModule: 3
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading AI Course Builder...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/admin/course-builder')} 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Course Builder
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium text-xl flex items-center">
              <Brain className="w-6 h-6 mr-2 text-emerald-400" />
              AI Course Builder Enhanced
            </div>
            <div className="text-slate-400 text-sm">
              Generazione automatica avanzata con micro-learning
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">
              <Zap className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
            <Button onClick={resetAll} variant="outline" size="sm" className="text-slate-300 border-slate-600">
              <Trash2 className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="mb-6">
          <AIStatusChecker />
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="bg-slate-800 border-slate-700 text-slate-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <div>
                  <div className="font-medium">Elaborazione AI in corso...</div>
                  <div className="text-sm text-slate-400">{processingStep}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="upload" className="data-[state=active]:bg-emerald-600">
              <Upload className="w-4 h-4 mr-2" />
              1. Upload
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-emerald-600" disabled={!parsedContent && !rawText}>
              <Wand2 className="w-4 h-4 mr-2" />
              2. Genera
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-emerald-600" disabled={!generatedCourse}>
              <Eye className="w-4 h-4 mr-2" />
              3. Anteprima
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-emerald-600" disabled={!generatedCourse}>
              <Edit3 className="w-4 h-4 mr-2" />
              4. Modifica
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Carica Contenuto Avanzato
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Upload PDF o inserisci testo per generazione AI avanzata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    onClick={() => setInputMethod('pdf')}
                    variant={inputMethod === 'pdf' ? 'default' : 'outline'}
                    className={inputMethod === 'pdf' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-600 text-slate-300'}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Carica PDF
                  </Button>
                  <Button
                    onClick={() => setInputMethod('text')}
                    variant={inputMethod === 'text' ? 'default' : 'outline'}
                    className={inputMethod === 'text' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-600 text-slate-300'}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Testo Manuale
                  </Button>
                </div>

                {inputMethod === 'pdf' ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <div className="text-lg font-medium text-slate-200">
                          {selectedFile ? selectedFile.name : 'Clicca per caricare PDF'}
                        </div>
                        <div className="text-sm text-slate-400 mt-2">
                          Massimo 10MB - Elaborazione AI avanzata
                        </div>
                      </label>
                    </div>

                    {selectedFile && (
                      <PDFProcessor
                        selectedFile={selectedFile}
                        onProcessed={(parsedContent) => {
                          setParsedContent(parsedContent);
                          setConfig(prev => ({
                            ...prev,
                            topic: prev.topic || parsedContent.suggestedTitle
                          }));
                          setActiveTab('generate');
                        }}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label className="text-slate-300">Incolla il contenuto del documento</Label>
                    <Textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Incolla qui il contenuto che vuoi trasformare in corso..."
                      className="bg-slate-700 border-slate-600 text-slate-200 min-h-[200px]"
                    />
                    <div className="text-sm text-slate-400">
                      Parole: {rawText.split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                    
                    {rawText.trim() && (
                      <Button 
                        onClick={() => setActiveTab('generate')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Procedi alla Generazione
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                <CardHeader>
                  <CardTitle>Configurazione Corso Avanzata</CardTitle>
                  <CardDescription className="text-slate-400">
                    Personalizza la generazione AI del corso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Titolo/Argomento</Label>
                    <Input
                      value={config.topic}
                      onChange={(e) => setConfig(prev => ({...prev, topic: e.target.value}))}
                      placeholder="Titolo del corso o argomento principale"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select value={config.targetAudience} onValueChange={(value) => setConfig(prev => ({...prev, targetAudience: value}))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="principianti">Principianti</SelectItem>
                        <SelectItem value="intermedi">Livello Intermedio</SelectItem>
                        <SelectItem value="avanzati">Livello Avanzato</SelectItem>
                        <SelectItem value="professionali">Professionisti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Numero Moduli</Label>
                      <Select value={config.moduleCount.toString()} onValueChange={(value) => setConfig(prev => ({...prev, moduleCount: parseInt(value)}))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="3">3 moduli</SelectItem>
                          <SelectItem value="4">4 moduli</SelectItem>
                          <SelectItem value="5">5 moduli</SelectItem>
                          <SelectItem value="6">6 moduli</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Lezioni per Modulo</Label>
                      <Select value={config.lessonPerModule.toString()} onValueChange={(value) => setConfig(prev => ({...prev, lessonPerModule: parseInt(value)}))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="2">2-3 lezioni</SelectItem>
                          <SelectItem value="3">3-4 lezioni</SelectItem>
                          <SelectItem value="4">4-5 lezioni</SelectItem>
                          <SelectItem value="5">5-6 lezioni</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={generateFullCourse} 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={!parsedContent && !rawText.trim()}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Genera Corso Completo con AI
                  </Button>
                </CardContent>
              </Card>

              {parsedContent && (
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                      Contenuto Analizzato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <div className="text-sm text-slate-400">Parole</div>
                        <div className="text-xl font-bold text-emerald-400">{parsedContent.wordCount}</div>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <div className="text-sm text-slate-400">Argomenti</div>
                        <div className="text-xl font-bold text-emerald-400">{parsedContent.mainTopics?.length || 0}</div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Titolo Suggerito</Label>
                      <div className="mt-1 p-2 bg-slate-700/30 rounded text-sm text-slate-200">
                        {parsedContent.suggestedTitle}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Argomenti Principali</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {parsedContent.mainTopics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-emerald-300 border-emerald-500/50">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Preview Tab - Enhanced */}
          <TabsContent value="preview" className="space-y-6">
            {generatedCourse && (
              <CoursePreviewEnhanced
                generatedCourse={generatedCourse}
                onSave={saveCourseToDatabase}
                onEdit={() => setActiveTab('edit')}
                isSaving={isProcessing}
              />
            )}
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle>Modalità Modifica Avanzata</CardTitle>
                <CardDescription className="text-slate-400">
                  Editor completo per personalizzazione corso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Edit3 className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                  <div className="text-lg font-medium text-slate-200 mb-2">
                    Editor Avanzato in Sviluppo
                  </div>
                  <div className="text-slate-400 mb-4">
                    La modalità di modifica avanzata sarà disponibile nella prossima versione.
                    Per ora puoi rigenerare il corso con parametri diversi o salvare come è.
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => setActiveTab('generate')} variant="outline" className="border-slate-600 text-slate-300">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Torna alla Generazione
                    </Button>
                    <Button onClick={saveCourseToDatabase} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 mr-2" />
                      Salva Comunque
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilderAI;
