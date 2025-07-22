import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Plus, Edit3, Trash2, GripVertical, 
  FileText, Video, Image, Brain, Save, ArrowLeft,
  Eye, Users, Clock, Target, Sparkles, Upload, Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  total_duration: string;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  total_duration: string;
  order_index: number;
  created_at: string;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  duration: string;
  route: string;
  order_index: number;
  created_at: string;
}

const CourseBuilder = () => {
  const navigate = useNavigate();
  const { canManageContent, loading } = useUserRole();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    total_duration: ''
  });
  
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    total_duration: ''
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    duration: '',
    route: '',
    type: 'theory' // theory, exercise, quiz, video
  });

  // AI Content Generation states
  const [isAIGenerateOpen, setIsAIGenerateOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiAudience, setAiAudience] = useState('principianti');

  // Redirect if not authorized
  if (!loading && !canManageContent()) {
    navigate('/admin-lms');
    return null;
  }

  // Load data
  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadModules(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i corsi",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setModules(data || []);
      
      // Load lessons for all modules
      if (data && data.length > 0) {
        const moduleIds = data.map(m => m.id);
        loadLessons(moduleIds);
      } else {
        setLessons([]);
      }
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const loadLessons = async (moduleIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const createCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          id: `course-${Date.now()}`,
          title: newCourse.title,
          description: newCourse.description,
          total_duration: newCourse.total_duration
        }])
        .select()
        .single();

      if (error) throw error;

      setCourses(prev => [data, ...prev]);
      setNewCourse({ title: '', description: '', total_duration: '' });
      setIsCreateCourseOpen(false);
      
      toast({
        title: "Successo",
        description: "Corso creato con successo",
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare il corso",
        variant: "destructive",
      });
    }
  };

  const createModule = async () => {
    if (!selectedCourse) return;

    try {
      const nextOrderIndex = modules.length + 1;
      const { data, error } = await supabase
        .from('modules')
        .insert([{
          id: `module-${Date.now()}`,
          course_id: selectedCourse.id,
          title: newModule.title,
          description: newModule.description,
          total_duration: newModule.total_duration,
          order_index: nextOrderIndex
        }])
        .select()
        .single();

      if (error) throw error;

      setModules(prev => [...prev, data]);
      setNewModule({ title: '', description: '', total_duration: '' });
      setIsCreateModuleOpen(false);
      
      toast({
        title: "Successo",
        description: "Modulo creato con successo",
      });
    } catch (error) {
      console.error('Error creating module:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare il modulo",
        variant: "destructive",
      });
    }
  };

  const createLesson = async (moduleId: string) => {
    try {
      const moduleLessons = lessons.filter(l => l.module_id === moduleId);
      const nextOrderIndex = moduleLessons.length + 1;
      
      const { data, error } = await supabase
        .from('lessons')
        .insert([{
          id: `lesson-${Date.now()}`,
          module_id: moduleId,
          title: newLesson.title,
          description: newLesson.description,
          duration: newLesson.duration,
          route: newLesson.route || `/${newLesson.title.toLowerCase().replace(/\s+/g, '-')}`,
          order_index: nextOrderIndex
        }])
        .select()
        .single();

      if (error) throw error;

      setLessons(prev => [...prev, data]);
      setNewLesson({ title: '', description: '', duration: '', route: '', type: 'theory' });
      setIsCreateLessonOpen(false);
      
      toast({
        title: "Successo",
        description: "Lezione creata con successo",
      });
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare la lezione",
        variant: "destructive",
      });
    }
  };

  const generateModulesWithAI = async () => {
    if (!selectedCourse || !aiContent.trim()) return;

    setAiGenerating(true);
    try {
      const response = await fetch(`https://dnircioicebnrdwifmkl.functions.supabase.co/ai-content-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_modules',
          content: aiContent,
          topic: aiTopic,
          targetAudience: aiAudience
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Create modules and lessons from AI response
      for (const moduleData of data.modules) {
        const moduleOrderIndex = modules.length + 1;
        
        const { data: newModule, error: moduleError } = await supabase
          .from('modules')
          .insert([{
            id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            course_id: selectedCourse.id,
            title: moduleData.title,
            description: moduleData.description,
            total_duration: moduleData.duration,
            order_index: moduleOrderIndex
          }])
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Create lessons for this module
        for (let i = 0; i < moduleData.lessons.length; i++) {
          const lessonData = moduleData.lessons[i];
          await supabase
            .from('lessons')
            .insert([{
              id: `lesson-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
              module_id: newModule.id,
              title: lessonData.title,
              description: lessonData.description,
              duration: lessonData.duration,
              route: `/${lessonData.title.toLowerCase().replace(/\s+/g, '-')}`,
              order_index: i + 1
            }]);
        }

        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between modules
      }

      // Reload data
      await loadModules(selectedCourse.id);
      setAiContent('');
      setIsAIGenerateOpen(false);
      
      toast({
        title: "🎉 Successo",
        description: `${data.modules.length} moduli generati automaticamente dall'AI!`,
      });
    } catch (error) {
      console.error('Error generating modules:', error);
      toast({
        title: "Errore",
        description: "Impossibile generare i moduli con AI",
        variant: "destructive",
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const deleteCourse = async () => {
    if (!courseToDelete) return;
    
    setDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await supabase.functions.invoke('delete-course', {
        body: { courseId: courseToDelete.id }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete course');
      }

      // Remove course from local state
      setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
      
      // Clear selection if deleted course was selected
      if (selectedCourse?.id === courseToDelete.id) {
        setSelectedCourse(null);
        setModules([]);
        setLessons([]);
      }
      
      setCourseToDelete(null);
      setIsDeleteCourseOpen(false);
      
      toast({
        title: "Successo",
        description: "Corso eliminato con successo",
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Impossibile eliminare il corso",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteCourseOpen(true);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'exercise': return <Brain className="w-4 h-4" />;
      case 'quiz': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading Course Builder...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/admin-lms')} 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard Admin
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium text-xl">
              Course Builder
            </div>
            <div className="text-slate-400 text-sm">
              Editor visuale per gestire corsi, moduli e lezioni
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigate('/admin/course-builder-ai')}
              className="bg-emerald-600 hover:bg-emerald-700"
              size="sm"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              AI Course Builder
            </Button>
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">
              Editor Avanzato
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Courses List */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200 h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Corsi
                  </CardTitle>
                  <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
                      <DialogHeader>
                        <DialogTitle>Crea Nuovo Corso</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Titolo</Label>
                          <Input 
                            value={newCourse.title}
                            onChange={(e) => setNewCourse(prev => ({...prev, title: e.target.value}))}
                            placeholder="Nome del corso"
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label>Descrizione</Label>
                          <Textarea 
                            value={newCourse.description}
                            onChange={(e) => setNewCourse(prev => ({...prev, description: e.target.value}))}
                            placeholder="Descrizione del corso"
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label>Durata Totale</Label>
                          <Input 
                            value={newCourse.total_duration}
                            onChange={(e) => setNewCourse(prev => ({...prev, total_duration: e.target.value}))}
                            placeholder="es. 3h 45m"
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <Button onClick={createCourse} className="w-full bg-emerald-600 hover:bg-emerald-700">
                          <Save className="w-4 h-4 mr-2" />
                          Crea Corso
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCourse?.id === course.id 
                          ? 'bg-emerald-600/20 border-emerald-500/50' 
                          : 'bg-slate-700/30 hover:bg-slate-700/50'
                      } border`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-slate-200 truncate">{course.title}</div>
                          <div className="text-xs text-slate-400 mt-1">{course.total_duration}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {course.description?.substring(0, 80)}...
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(course);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Editor */}
          <div className="col-span-12 lg:col-span-8">
            {selectedCourse ? (
              <div className="space-y-6">
                {/* Course Info */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Editing: {selectedCourse.title}</span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Save className="w-4 h-4 mr-2" />
                          Salva
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {selectedCourse.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedCourse.total_duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {modules.length} moduli
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {lessons.length} lezioni
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Modules */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Moduli del Corso</CardTitle>
                      <div className="flex space-x-2">
                        <Dialog open={isAIGenerateOpen} onOpenChange={setIsAIGenerateOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Genera con AI
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
                                Genera Moduli con AI
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Argomento del corso</Label>
                                <Input 
                                  value={aiTopic}
                                  onChange={(e) => setAiTopic(e.target.value)}
                                  placeholder="es. Prompt Engineering, Marketing Digitale..."
                                  className="bg-slate-700 border-slate-600"
                                />
                              </div>
                              <div>
                                <Label>Audience target</Label>
                                <Select value={aiAudience} onValueChange={setAiAudience}>
                                  <SelectTrigger className="bg-slate-700 border-slate-600">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="principianti">Principianti</SelectItem>
                                    <SelectItem value="intermedio">Livello Intermedio</SelectItem>
                                    <SelectItem value="avanzato">Livello Avanzato</SelectItem>
                                    <SelectItem value="professionisti">Professionisti</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Contenuto di base (testo, documenti, obiettivi)</Label>
                                <Textarea 
                                  value={aiContent}
                                  onChange={(e) => setAiContent(e.target.value)}
                                  placeholder="Incolla qui il testo da cui generare i moduli, oppure descrivi gli obiettivi del corso..."
                                  rows={8}
                                  className="bg-slate-700 border-slate-600"
                                />
                              </div>
                              <Button 
                                onClick={generateModulesWithAI} 
                                disabled={aiGenerating || !aiContent.trim()}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                              >
                                {aiGenerating ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Generazione in corso...
                                  </div>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Genera Moduli Automaticamente
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isCreateModuleOpen} onOpenChange={setIsCreateModuleOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Aggiungi Modulo
                            </Button>
                          </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
                          <DialogHeader>
                            <DialogTitle>Crea Nuovo Modulo</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Titolo</Label>
                              <Input 
                                value={newModule.title}
                                onChange={(e) => setNewModule(prev => ({...prev, title: e.target.value}))}
                                placeholder="Nome del modulo"
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                            <div>
                              <Label>Descrizione</Label>
                              <Textarea 
                                value={newModule.description}
                                onChange={(e) => setNewModule(prev => ({...prev, description: e.target.value}))}
                                placeholder="Descrizione del modulo"
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                            <div>
                              <Label>Durata Totale</Label>
                              <Input 
                                value={newModule.total_duration}
                                onChange={(e) => setNewModule(prev => ({...prev, total_duration: e.target.value}))}
                                placeholder="es. 1h 30m"
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                            <Button onClick={createModule} className="w-full bg-blue-600 hover:bg-blue-700">
                              <Save className="w-4 h-4 mr-2" />
                              Crea Modulo
                            </Button>
                          </div>
                        </DialogContent>
                         </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {modules.map((module) => {
                        const moduleLessons = lessons.filter(l => l.module_id === module.id);
                        
                        return (
                          <div
                            key={module.id}
                            className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/40"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                                <div>
                                  <div className="font-medium text-slate-200">{module.title}</div>
                                  <div className="text-xs text-slate-400">{module.total_duration} • {moduleLessons.length} lezioni</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
                                    <DialogHeader>
                                      <DialogTitle>Aggiungi Lezione a "{module.title}"</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Titolo</Label>
                                        <Input 
                                          value={newLesson.title}
                                          onChange={(e) => setNewLesson(prev => ({...prev, title: e.target.value}))}
                                          placeholder="Nome della lezione"
                                          className="bg-slate-700 border-slate-600"
                                        />
                                      </div>
                                      <div>
                                        <Label>Tipo Lezione</Label>
                                        <Select 
                                          value={newLesson.type} 
                                          onValueChange={(value) => setNewLesson(prev => ({...prev, type: value}))}
                                        >
                                          <SelectTrigger className="bg-slate-700 border-slate-600">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-slate-700 border-slate-600">
                                            <SelectItem value="theory">Teoria</SelectItem>
                                            <SelectItem value="exercise">Esercizio</SelectItem>
                                            <SelectItem value="quiz">Quiz</SelectItem>
                                            <SelectItem value="video">Video</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Descrizione</Label>
                                        <Textarea 
                                          value={newLesson.description}
                                          onChange={(e) => setNewLesson(prev => ({...prev, description: e.target.value}))}
                                          placeholder="Descrizione della lezione"
                                          className="bg-slate-700 border-slate-600"
                                        />
                                      </div>
                                      <div>
                                        <Label>Durata</Label>
                                        <Input 
                                          value={newLesson.duration}
                                          onChange={(e) => setNewLesson(prev => ({...prev, duration: e.target.value}))}
                                          placeholder="es. 25m"
                                          className="bg-slate-700 border-slate-600"
                                        />
                                      </div>
                                      <div>
                                        <Label>Route</Label>
                                        <Input 
                                          value={newLesson.route}
                                          onChange={(e) => setNewLesson(prev => ({...prev, route: e.target.value}))}
                                          placeholder="/nome-lezione (opzionale)"
                                          className="bg-slate-700 border-slate-600"
                                        />
                                      </div>
                                      <Button onClick={() => createLesson(module.id)} className="w-full bg-purple-600 hover:bg-purple-700">
                                        <Save className="w-4 h-4 mr-2" />
                                        Crea Lezione
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="text-xs text-slate-400 mb-3">{module.description}</div>

                            {/* Lessons in this module */}
                            <div className="space-y-2 ml-6">
                              {moduleLessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-600/40"
                                >
                                  <div className="flex items-center space-x-3">
                                    <GripVertical className="w-3 h-3 text-slate-500 cursor-grab" />
                                    {getLessonIcon(newLesson.type)}
                                    <div>
                                      <div className="text-sm text-slate-200">{lesson.title}</div>
                                      <div className="text-xs text-slate-400">{lesson.duration}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button size="sm" variant="ghost" className="text-slate-400 h-6 w-6 p-0">
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-red-400 h-6 w-6 p-0">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-slate-300 text-lg font-medium mb-2">Seleziona un Corso</h3>
                  <p className="text-slate-500">Scegli un corso dalla lista per iniziare ad editare</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Delete Course Confirmation Dialog */}
        <Dialog open={isDeleteCourseOpen} onOpenChange={setIsDeleteCourseOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
            <DialogHeader>
              <DialogTitle className="text-red-400">Elimina Corso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-slate-300">
                Sei sicuro di voler eliminare il corso <strong>"{courseToDelete?.title}"</strong>?
              </div>
              <div className="text-sm text-slate-400 bg-slate-700/50 p-3 rounded-lg">
                <strong>Attenzione:</strong> Questa azione eliminerà permanentemente:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Il corso e tutti i suoi moduli</li>
                  <li>Tutte le lezioni e i contenuti</li>
                  <li>I quiz e le domande associate</li>
                  <li>Il progresso degli studenti per questo corso</li>
                  <li>Le iscrizioni al corso</li>
                </ul>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => setIsDeleteCourseOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annulla
                </Button>
                <Button
                  onClick={deleteCourse}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Eliminando...
                    </div>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Elimina Definitivamente
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CourseBuilder;