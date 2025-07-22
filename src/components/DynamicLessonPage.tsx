
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCourseData } from '@/hooks/useCourseData';
import { useUserProgress } from '@/hooks/useUserProgress';
import CourseSidebar from '@/components/CourseSidebar';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const DynamicLessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { courseData, loading } = useCourseData(user?.id, courseId);
  const { markLessonComplete, markLessonAccessed } = useUserProgress();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (courseData && lessonId) {
      // Find current lesson and module
      let foundLesson = null;
      let foundModule = null;

      for (const module of courseData.modules) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
          foundLesson = lesson;
          foundModule = module;
          break;
        }
      }

      setCurrentLesson(foundLesson);
      setCurrentModule(foundModule);

      // Mark lesson as accessed
      if (foundLesson && user?.id) {
        markLessonAccessed(foundLesson.id, user.id);
      }

      // Fetch quiz questions for this lesson
      fetchQuizQuestions(lessonId);
    }
  }, [courseData, lessonId, user?.id]);

  const fetchQuizQuestions = async (lessonId: string) => {
    try {
      const { data: questions } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      setQuizQuestions(questions || []);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    }
  };

  const handleCompleteLesson = async () => {
    if (currentLesson && user?.id) {
      const success = await markLessonComplete(currentLesson.id, user.id);
      if (success) {
        // Navigate to next lesson or show completion
        navigateToNextLesson();
      }
    }
  };

  const navigateToNextLesson = () => {
    if (!courseData || !currentModule) return;

    const currentModuleIndex = courseData.modules.findIndex(m => m.id === currentModule.id);
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);

    // Try to find next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[currentLessonIndex + 1];
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    } else if (currentModuleIndex < courseData.modules.length - 1) {
      // Move to first lesson of next module
      const nextModule = courseData.modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0) {
        navigate(`/course/${courseId}/lesson/${nextModule.lessons[0].id}`);
      }
    } else {
      // Course completed
      navigate(`/course/${courseId}`);
    }
  };

  const navigateToPreviousLesson = () => {
    if (!courseData || !currentModule) return;

    const currentModuleIndex = courseData.modules.findIndex(m => m.id === currentModule.id);
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);

    // Try to find previous lesson in current module
    if (currentLessonIndex > 0) {
      const prevLesson = currentModule.lessons[currentLessonIndex - 1];
      navigate(`/course/${courseId}/lesson/${prevLesson.id}`);
    } else if (currentModuleIndex > 0) {
      // Move to last lesson of previous module
      const prevModule = courseData.modules[currentModuleIndex - 1];
      if (prevModule.lessons.length > 0) {
        const lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
        navigate(`/course/${courseId}/lesson/${lastLesson.id}`);
      }
    }
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit quiz and complete lesson
      handleCompleteLesson();
      setShowQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="prompt-lab-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Caricamento lezione...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="prompt-lab-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Lezione non trovata</p>
            <Button onClick={() => navigate(`/course/${courseId}`)} className="mt-4">
              Torna al corso
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-lab-container">
      <div className="flex min-h-screen">
        <CourseSidebar 
          currentModuleId={currentModule?.id}
          currentLessonId={lessonId}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="text-slate-300 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Indice corso
                  </Button>
                  <div className="text-sm text-slate-400">
                    {currentModule?.title}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {currentLesson.completed && (
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completato
                    </Badge>
                  )}
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {currentLesson.duration}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="p-8 max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Lesson Header */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  {currentLesson.title}
                </h1>
                <p className="text-slate-300 text-lg">
                  {currentLesson.description}
                </p>
              </div>

              {!showQuiz ? (
                <>
                  {/* Lesson Content */}
                  {currentLesson.content && (
                    <Card className="step-card glassmorphism-base">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                          Contenuto della Lezione
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-slate-300 leading-relaxed">
                            {currentLesson.content}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Slides */}
                  {currentLesson.slides && currentLesson.slides.length > 0 && (
                    <Card className="step-card glassmorphism-base">
                      <CardHeader>
                        <CardTitle className="text-white">Punti Chiave</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {currentLesson.slides.map((slide: string, index: number) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-slate-300">{slide}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Examples */}
                  {currentLesson.examples && currentLesson.examples.length > 0 && (
                    <Card className="step-card glassmorphism-base">
                      <CardHeader>
                        <CardTitle className="text-white">Esempi Pratici</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentLesson.examples.map((example: string, index: number) => (
                            <div key={index} className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/40">
                              <p className="text-slate-300">{example}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-8">
                    <Button
                      variant="outline"
                      onClick={navigateToPreviousLesson}
                      className="text-slate-300 border-slate-600 hover:bg-slate-700/50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Lezione precedente
                    </Button>

                    <div className="flex items-center space-x-4">
                      {quizQuestions.length > 0 && (
                        <Button
                          onClick={() => setShowQuiz(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Inizia Quiz
                        </Button>
                      )}
                      
                      {quizQuestions.length === 0 && (
                        <Button
                          onClick={handleCompleteLesson}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Completa Lezione
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Quiz Section */
                <Card className="step-card glassmorphism-base">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Quiz - Domanda {currentQuestionIndex + 1} di {quizQuestions.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {quizQuestions[currentQuestionIndex] && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-white">
                          {quizQuestions[currentQuestionIndex].question_text}
                        </h3>
                        
                        <div className="space-y-3">
                          {quizQuestions[currentQuestionIndex].options.map((option: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => handleQuizAnswer(option)}
                              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                                selectedAnswers[currentQuestionIndex] === option
                                  ? 'border-blue-400 bg-blue-900/20 text-blue-300'
                                  : 'border-slate-600 bg-slate-800/40 text-slate-300 hover:border-slate-500'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setShowQuiz(false)}
                            className="text-slate-300 border-slate-600"
                          >
                            Torna alla lezione
                          </Button>
                          
                          <Button
                            onClick={handleNextQuestion}
                            disabled={!selectedAnswers[currentQuestionIndex]}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {currentQuestionIndex < quizQuestions.length - 1 ? 'Prossima domanda' : 'Completa quiz'}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DynamicLessonPage;
