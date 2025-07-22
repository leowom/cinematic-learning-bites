import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, Wand2, Eye, Save, Edit3, 
  ArrowLeft, Plus, Book, Brain, Target, Clock,
  CheckCircle, AlertCircle, Download, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const extractTextFromPDF = async (): Promise<string> => {
    if (!selectedFile) throw new Error('Nessun file selezionato');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Convert to base64 for transmission
          let binary = '';
          uint8Array.forEach(byte => binary += String.fromCharCode(byte));
          const base64 = btoa(binary);
          
          // For now, we'll use a simple text extraction approach
          // In production, you'd want proper PDF parsing
          const text = `Contenuto estratto dal PDF: ${selectedFile.name}
          
Nota: Questo è un esempio di testo estratto. In un'implementazione reale, 
qui ci sarebbe il contenuto completo del PDF usando una libreria di parsing PDF.

Per questo esempio, puoi incollare manualmente il contenuto del PDF nella tab 'Testo Manuale'.`;
          
          resolve(text);
        } catch (error) {
          reject(new Error('Errore nell\'estrazione del testo dal PDF'));
        }
      };
      reader.onerror = () => reject(new Error('Errore nella lettura del file'));
      reader.readAsArrayBuffer(selectedFile);
    });
  };

  const parsePDFContent = async () => {
    if (!selectedFile && !rawText.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci contenuto o carica un PDF",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Estrazione e pulizia testo...');

    try {
      let contentToProcess = rawText;
      
      if (selectedFile && inputMethod === 'pdf') {
        contentToProcess = await extractTextFromPDF();
      }

      const response = await supabase.functions.invoke('ai-content-generator', {
        body: {
          action: 'parse_pdf',
          pdfContent: contentToProcess
        }
      });

      if (response.error) throw new Error(response.error.message);

      setParsedContent(response.data);
      
      // Auto-populate config with suggestions
      setConfig(prev => ({
        ...prev,
        topic: prev.topic || response.data.suggestedTitle
      }));

      setActiveTab('generate');
      toast({
        title: "✨ Contenuto analizzato",
        description: `${response.data.wordCount} parole estratte e pulite`,
      });

    } catch (error) {
      console.error('Error parsing content:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile elaborare il contenuto",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
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
    setProcessingStep('Generazione corso con AI...');

    try {
      const contentToUse = parsedContent?.cleanedText || rawText;
      
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

      if (response.error) throw new Error(response.error.message);

      setGeneratedCourse(response.data);
      setActiveTab('preview');
      
      toast({
        title: "🎉 Corso generato!",
        description: `${response.data.modules.length} moduli con micro-learning`,
      });

    } catch (error) {
      console.error('Error generating course:', error);
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
      // Create course
      const courseId = `course-${Date.now()}`;
      const { error: courseError } = await supabase
        .from('courses')
        .insert({
          id: courseId,
          title: generatedCourse.courseTitle,
          description: generatedCourse.description,
          total_duration: generatedCourse.totalDuration,
          level: config.targetAudience === 'principianti' ? 'beginner' : 
                config.targetAudience === 'intermedi' ? 'intermediate' : 'advanced'
        });

      if (courseError) throw courseError;

      // Create modules and lessons
      for (let moduleIndex = 0; moduleIndex < generatedCourse.modules.length; moduleIndex++) {
        const moduleData = generatedCourse.modules[moduleIndex];
        const moduleId = `module-${Date.now()}-${moduleIndex}`;
        
        // Create module
        const { error: moduleError } = await supabase
          .from('modules')
          .insert({
            id: moduleId,
            course_id: courseId,
            title: moduleData.moduleTitle,
            description: moduleData.description,
            total_duration: moduleData.duration,
            order_index: moduleIndex + 1
          });

        if (moduleError) throw moduleError;

        // Create lessons for this module
        for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
          const lessonData = moduleData.lessons[lessonIndex];
          const lessonId = `lesson-${Date.now()}-${moduleIndex}-${lessonIndex}`;
          
          const { error: lessonError } = await supabase
            .from('lessons')
            .insert({
              id: lessonId,
              module_id: moduleId,
              title: lessonData.lessonTitle,
              description: lessonData.content.substring(0, 200) + '...',
              duration: lessonData.duration,
              route: `/${lessonData.lessonTitle.toLowerCase().replace(/\s+/g, '-')}`,
              order_index: lessonIndex + 1
            });

          if (lessonError) throw lessonError;

          // Create quiz questions for this lesson
          for (let quizIndex = 0; quizIndex < lessonData.quiz.length; quizIndex++) {
            const quizData = lessonData.quiz[quizIndex];
            
            await supabase
              .from('quiz_questions')
              .insert({
                lesson_id: lessonId,
                question_text: quizData.question,
                question_type: 'multiple_choice',
                options: quizData.options,
                correct_answer: quizData.correctAnswer,
                explanation: quizData.explanation,
                order_index: quizIndex + 1
              });
          }
        }
      }

      toast({
        title: "🚀 Corso pubblicato!",
        description: "Il corso è stato salvato e pubblicato con successo",
      });

      // Navigate to course list or dashboard
      navigate('/admin/course-builder');

    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il corso nel database",
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
              AI Course Builder
            </div>
            <div className="text-slate-400 text-sm">
              Genera corsi automaticamente da PDF o testo con micro-learning
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">
              <Wand2 className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Button onClick={resetAll} variant="outline" size="sm" className="text-slate-300 border-slate-600">
              <Trash2 className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="bg-slate-800 border-slate-700 text-slate-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <div>
                  <div className="font-medium">Elaborazione in corso...</div>
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
                  Carica Contenuto
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Carica un PDF o inserisci il testo manualmente per generare il corso
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
                          Massimo 10MB - Solo file PDF
                        </div>
                      </label>
                    </div>

                    {selectedFile && (
                      <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-emerald-400" />
                          <div>
                            <div className="font-medium">{selectedFile.name}</div>
                            <div className="text-sm text-slate-400">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button onClick={() => setSelectedFile(null)} variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label className="text-slate-300">Incolla il testo del contenuto</Label>
                    <Textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Incolla qui il contenuto del documento che vuoi trasformare in corso..."
                      className="bg-slate-700 border-slate-600 text-slate-200 min-h-[200px]"
                    />
                    <div className="text-sm text-slate-400">
                      Parole: {rawText.split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={parsePDFContent} 
                  disabled={!selectedFile && !rawText.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analizza Contenuto
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                <CardHeader>
                  <CardTitle>Configurazione Corso</CardTitle>
                  <CardDescription className="text-slate-400">
                    Personalizza la struttura del corso generato
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
                    Genera Corso Completo
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
                        <div className="text-xl font-bold text-emerald-400">{parsedContent.mainTopics.length}</div>
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

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            {generatedCourse && (
              <div className="space-y-6">
                {/* Course Overview */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{generatedCourse.courseTitle}</CardTitle>
                        <CardDescription className="text-slate-400 mt-2">
                          {generatedCourse.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-slate-300">
                          <Clock className="w-4 h-4 mr-2" />
                          {generatedCourse.totalDuration}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {generatedCourse.modules.length} moduli • {generatedCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} lezioni
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Course Modules */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle>Struttura del Corso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="space-y-4">
                      {generatedCourse.modules.map((module, moduleIndex) => (
                        <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`} className="border-slate-600">
                          <AccordionTrigger className="text-slate-200 hover:text-slate-100">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="text-left">
                                <div className="font-medium">{module.moduleTitle}</div>
                                <div className="text-sm text-slate-400">{module.description}</div>
                              </div>
                              <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">
                                {module.lessons.length} lezioni
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            {/* Learning Objectives */}
                            <div className="bg-slate-700/30 p-4 rounded-lg">
                              <h4 className="font-medium text-slate-200 mb-2 flex items-center">
                                <Target className="w-4 h-4 mr-2 text-emerald-400" />
                                Obiettivi di Apprendimento
                              </h4>
                              <ul className="text-sm text-slate-300 space-y-1">
                                {module.learningObjectives.map((objective, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-emerald-400 mr-2">•</span>
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Lessons */}
                            <div className="space-y-3">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="bg-slate-700/20 p-4 rounded-lg border border-slate-600/50">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-slate-200">{lesson.lessonTitle}</h4>
                                    <Badge variant="outline" className="text-slate-300 border-slate-500">
                                      {lesson.duration}
                                    </Badge>
                                  </div>
                                  
                                  <div className="text-sm text-slate-300 mb-3 leading-relaxed">
                                    {lesson.content}
                                  </div>

                                  {/* Slides */}
                                  <div className="mb-3">
                                    <div className="text-sm font-medium text-slate-200 mb-2">📊 Slide Script:</div>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                      {lesson.slides.map((slide, slideIndex) => (
                                        <li key={slideIndex} className="flex items-start">
                                          <span className="text-emerald-400 mr-2">•</span>
                                          {slide}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Examples */}
                                  <div className="mb-3">
                                    <div className="text-sm font-medium text-slate-200 mb-2">💡 Esempi:</div>
                                    <div className="text-sm text-slate-300 space-y-2">
                                      {lesson.examples.map((example, exampleIndex) => (
                                        <div key={exampleIndex} className="bg-slate-700/30 p-2 rounded text-xs">
                                          {example}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Quiz */}
                                  <div>
                                    <div className="text-sm font-medium text-slate-200 mb-2">❓ Quiz:</div>
                                    {lesson.quiz.map((quiz, quizIndex) => (
                                      <div key={quizIndex} className="bg-slate-700/30 p-3 rounded text-sm">
                                        <div className="text-slate-200 mb-2 font-medium">{quiz.question}</div>
                                        <div className="space-y-1 mb-2">
                                          {quiz.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className={`text-xs p-1 rounded ${
                                              option === quiz.correctAnswer ? 'bg-emerald-600/20 text-emerald-300' : 'text-slate-400'
                                            }`}>
                                              {String.fromCharCode(65 + optionIndex)}) {option}
                                            </div>
                                          ))}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                          💬 {quiz.explanation}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Final Test */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-emerald-400" />
                      Test Finale
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {generatedCourse.finalTest.map((question, index) => (
                      <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                        <div className="font-medium text-slate-200 mb-3">
                          {index + 1}. {question.question}
                        </div>
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className={`text-sm p-2 rounded ${
                              option === question.correctAnswer ? 'bg-emerald-600/20 text-emerald-300' : 'text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + optionIndex)}) {option}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-slate-400">
                          💬 {question.explanation}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setActiveTab('edit')} variant="outline" className="border-slate-600 text-slate-300">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifica Prima di Salvare
                  </Button>
                  <Button onClick={saveCourseToDatabase} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salva e Pubblica Corso
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle>Modalità Modifica</CardTitle>
                <CardDescription className="text-slate-400">
                  Personalizza il corso prima di pubblicarlo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Edit3 className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                  <div className="text-lg font-medium text-slate-200 mb-2">
                    Editor Avanzato
                  </div>
                  <div className="text-slate-400 mb-4">
                    La modalità di modifica avanzata sarà disponibile nella prossima versione.
                    Per ora puoi rigenerare il corso con parametri diversi.
                  </div>
                  <Button onClick={() => setActiveTab('generate')} variant="outline" className="border-slate-600 text-slate-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Torna alla Generazione
                  </Button>
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