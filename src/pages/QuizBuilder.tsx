import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Plus, Edit3, Trash2, Save, ArrowLeft, 
  FileQuestion, CheckCircle, XCircle, Circle,
  Brain, Timer, Award, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  explanation?: string;
  order_index: number;
}

interface Lesson {
  id: string;
  title: string;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

interface Course {
  id: string;
  title: string;
}

const QuizBuilder = () => {
  const navigate = useNavigate();
  const { canManageContent, loading } = useUserRole();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: ''
  });

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');

  // Redirect if not authorized
  if (!loading && !canManageContent()) {
    navigate('/admin-lms');
    return null;
  }

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadModules(selectedCourseId);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedModuleId) {
      loadLessons(selectedModuleId);
    }
  }, [selectedModuleId]);

  useEffect(() => {
    if (selectedLesson) {
      loadQuizQuestions(selectedLesson.id);
    }
  }, [selectedLesson]);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, course_id')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const loadLessons = async (moduleId: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, module_id')
        .eq('module_id', moduleId)
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
      setLoadingData(false);
    } catch (error) {
      console.error('Error loading lessons:', error);
      setLoadingData(false);
    }
  };

  const loadQuizQuestions = async (lessonId: string) => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      if (error) throw error;
      setQuizQuestions(data || []);
    } catch (error) {
      console.error('Error loading quiz questions:', error);
    }
  };

  const createQuestion = async () => {
    if (!selectedLesson) return;

    try {
      const nextOrderIndex = quizQuestions.length + 1;
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert([{
          lesson_id: selectedLesson.id,
          question_text: newQuestion.question_text,
          question_type: newQuestion.question_type,
          options: newQuestion.question_type === 'multiple_choice' ? JSON.stringify(newQuestion.options.filter(opt => opt.trim())) : null,
          correct_answer: newQuestion.correct_answer,
          explanation: newQuestion.explanation || null,
          order_index: nextOrderIndex
        }])
        .select()
        .single();

      if (error) throw error;

      setQuizQuestions(prev => [...prev, data]);
      resetNewQuestion();
      setIsCreateQuestionOpen(false);
      
      toast({
        title: "Successo",
        description: "Domanda creata con successo",
      });
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare la domanda",
        variant: "destructive",
      });
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      setQuizQuestions(prev => prev.filter(q => q.id !== questionId));
      
      toast({
        title: "Successo",
        description: "Domanda eliminata",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare la domanda",
        variant: "destructive",
      });
    }
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: ''
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    if (newQuestion.options.length < 6) {
      setNewQuestion(prev => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  const removeOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      const newOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion(prev => ({ ...prev, options: newOptions }));
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <Circle className="w-4 h-4" />;
      case 'true_false': return <CheckCircle className="w-4 h-4" />;
      case 'short_answer': return <FileQuestion className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Scelta Multipla';
      case 'true_false': return 'Vero/Falso';
      case 'short_answer': return 'Risposta Breve';
      default: return type;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading Quiz Builder...</div>
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
              Quiz Builder
            </div>
            <div className="text-slate-400 text-sm">
              Crea e gestisci quiz e assessments per i tuoi corsi
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-300 border-blue-500/50">
              Assessments
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Course/Lesson Selection */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Seleziona Lezione
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Scegli la lezione per cui creare i quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Corso</Label>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Seleziona corso" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCourseId && (
                  <div>
                    <Label className="text-slate-300">Modulo</Label>
                    <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Seleziona modulo" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {modules.map(module => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedModuleId && (
                  <div>
                    <Label className="text-slate-300">Lezione</Label>
                    <Select 
                      value={selectedLesson?.id || ''} 
                      onValueChange={(value) => {
                        const lesson = lessons.find(l => l.id === value);
                        setSelectedLesson(lesson || null);
                      }}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Seleziona lezione" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {lessons.map(lesson => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedLesson && (
                  <div className="pt-4 border-t border-slate-600">
                    <div className="text-sm text-slate-300 mb-2">Lezione selezionata:</div>
                    <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                      <div className="font-medium text-slate-200">{selectedLesson.title}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {quizQuestions.length} domande create
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {selectedLesson && (
              <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Statistiche Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{quizQuestions.length}</div>
                      <div className="text-xs text-slate-400">Domande</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {quizQuestions.filter(q => q.question_type === 'multiple_choice').length}
                      </div>
                      <div className="text-xs text-slate-400">Scelta Multipla</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quiz Editor */}
          <div className="col-span-12 lg:col-span-8">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* Header with Add Button */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">
                          Quiz per: {selectedLesson.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Gestisci le domande per questa lezione
                        </CardDescription>
                      </div>
                      <Dialog open={isCreateQuestionOpen} onOpenChange={setIsCreateQuestionOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuova Domanda
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Crea Nuova Domanda</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Tipo Domanda</Label>
                              <Select 
                                value={newQuestion.question_type} 
                                onValueChange={(value: any) => setNewQuestion(prev => ({...prev, question_type: value}))}
                              >
                                <SelectTrigger className="bg-slate-700 border-slate-600">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="multiple_choice">Scelta Multipla</SelectItem>
                                  <SelectItem value="true_false">Vero/Falso</SelectItem>
                                  <SelectItem value="short_answer">Risposta Breve</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Testo della Domanda</Label>
                              <Textarea 
                                value={newQuestion.question_text}
                                onChange={(e) => setNewQuestion(prev => ({...prev, question_text: e.target.value}))}
                                placeholder="Inserisci la domanda..."
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>

                            {/* Options for Multiple Choice */}
                            {newQuestion.question_type === 'multiple_choice' && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label>Opzioni di Risposta</Label>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={addOption}
                                    disabled={newQuestion.options.length >= 6}
                                    className="text-slate-300 border-slate-600"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Aggiungi
                                  </Button>
                                </div>
                                <RadioGroup 
                                  value={newQuestion.correct_answer} 
                                  onValueChange={(value) => setNewQuestion(prev => ({...prev, correct_answer: value}))}
                                  className="space-y-2"
                                >
                                  {newQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`option-${index}`} />
                                      </div>
                                      <Input 
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        placeholder={`Opzione ${index + 1}`}
                                        className="flex-1 bg-slate-700 border-slate-600"
                                      />
                                      {newQuestion.options.length > 2 && (
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          onClick={() => removeOption(index)}
                                          className="text-red-400"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </RadioGroup>
                                <div className="text-xs text-slate-400 mt-2">
                                  Seleziona il radio button accanto alla risposta corretta
                                </div>
                              </div>
                            )}

                            {/* True/False Options */}
                            {newQuestion.question_type === 'true_false' && (
                              <div>
                                <Label>Risposta Corretta</Label>
                                <RadioGroup 
                                  value={newQuestion.correct_answer} 
                                  onValueChange={(value) => setNewQuestion(prev => ({...prev, correct_answer: value}))}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Vero" id="true" />
                                    <Label htmlFor="true">Vero</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Falso" id="false" />
                                    <Label htmlFor="false">Falso</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            )}

                            {/* Short Answer */}
                            {newQuestion.question_type === 'short_answer' && (
                              <div>
                                <Label>Risposta Corretta</Label>
                                <Input 
                                  value={newQuestion.correct_answer}
                                  onChange={(e) => setNewQuestion(prev => ({...prev, correct_answer: e.target.value}))}
                                  placeholder="Inserisci la risposta corretta..."
                                  className="bg-slate-700 border-slate-600"
                                />
                              </div>
                            )}

                            <div>
                              <Label>Spiegazione (opzionale)</Label>
                              <Textarea 
                                value={newQuestion.explanation}
                                onChange={(e) => setNewQuestion(prev => ({...prev, explanation: e.target.value}))}
                                placeholder="Spiega perché questa è la risposta corretta..."
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>

                            <Button 
                              onClick={createQuestion} 
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              disabled={!newQuestion.question_text || !newQuestion.correct_answer}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Crea Domanda
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>

                {/* Questions List */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white">Domande del Quiz</CardTitle>
                    <CardDescription className="text-slate-400">
                      {quizQuestions.length} domande create
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {quizQuestions.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nessuna domanda creata ancora</p>
                        <p className="text-sm">Clicca su "Nuova Domanda" per iniziare</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quizQuestions.map((question, index) => (
                          <div
                            key={question.id}
                            className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/40"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3">
                                <Badge variant="outline" className="text-xs">
                                  #{index + 1}
                                </Badge>
                                <div className="flex items-center space-x-2">
                                  {getQuestionTypeIcon(question.question_type)}
                                  <Badge variant="secondary" className="text-xs">
                                    {getQuestionTypeLabel(question.question_type)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-400 border-slate-600"
                                  onClick={() => deleteQuestion(question.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="text-slate-200 font-medium mb-2">
                              {question.question_text}
                            </div>

                            {question.question_type === 'multiple_choice' && question.options && (
                              <div className="space-y-1 ml-4">
                                {(typeof question.options === 'string' ? JSON.parse(question.options) : question.options || []).map((option: string, optIndex: number) => (
                                  <div 
                                    key={optIndex} 
                                    className={`text-sm flex items-center space-x-2 ${
                                      option === question.correct_answer 
                                        ? 'text-green-400 font-medium' 
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {option === question.correct_answer ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <Circle className="w-3 h-3" />
                                    )}
                                    <span>{option}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.question_type === 'true_false' || question.question_type === 'short_answer' ? (
                              <div className="text-sm text-green-400 ml-4 flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3" />
                                <span>Risposta corretta: {question.correct_answer}</span>
                              </div>
                            ) : null}

                            {question.explanation && (
                              <div className="mt-3 p-2 bg-slate-600/20 rounded text-xs text-slate-300">
                                <strong>Spiegazione:</strong> {question.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-slate-300 text-lg font-medium mb-2">Seleziona una Lezione</h3>
                  <p className="text-slate-500">Scegli corso, modulo e lezione per creare i quiz</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;