
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Clock, Users, Target, CheckCircle, 
  Play, Download, Edit, Save, Eye 
} from 'lucide-react';

interface CoursePreviewProps {
  generatedCourse: any;
  onSave: () => void;
  onEdit: () => void;
  isSaving: boolean;
}

const CoursePreviewEnhanced: React.FC<CoursePreviewProps> = ({
  generatedCourse,
  onSave,
  onEdit,
  isSaving
}) => {
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);

  if (!generatedCourse) return null;

  const currentModule = generatedCourse.modules[selectedModule];
  const currentLesson = currentModule?.lessons[selectedLesson];

  return (
    <div className="space-y-6">
      {/* Course Overview Header */}
      <Card className="bg-gradient-to-r from-slate-800/80 to-slate-700/40 border-slate-600/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white mb-2">
                {generatedCourse.courseTitle}
              </CardTitle>
              <p className="text-slate-300 text-base">
                {generatedCourse.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center text-slate-300 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {generatedCourse.totalDuration}
                </div>
                <div className="flex items-center text-slate-400 text-xs mt-1">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {generatedCourse.modules.length} moduli
                  <span className="mx-2">•</span>
                  {generatedCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} lezioni
                </div>
              </div>
              <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">
                <Target className="w-3 h-3 mr-1" />
                Micro-Learning
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Navigation */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Struttura Corso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {generatedCourse.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedModule(moduleIndex);
                    setSelectedLesson(0);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedModule === moduleIndex
                      ? 'border-blue-400 bg-blue-900/20'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium text-white text-sm">
                    Modulo {moduleIndex + 1}: {module.moduleTitle}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {module.lessons.length} lezioni • {module.duration}
                  </div>
                </button>
                
                {selectedModule === moduleIndex && (
                  <div className="ml-4 space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lessonIndex}
                        onClick={() => setSelectedLesson(lessonIndex)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedLesson === lessonIndex
                            ? 'bg-blue-800/30 text-blue-200'
                            : 'text-slate-300 hover:bg-slate-700/30'
                        }`}
                      >
                        {lesson.lessonTitle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lesson Content Preview */}
        <div className="lg:col-span-2 space-y-4">
          {currentLesson && (
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    {currentLesson.lessonTitle}
                  </CardTitle>
                  <Badge variant="outline" className="text-slate-300">
                    {currentLesson.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                    <TabsTrigger value="content">Contenuto</TabsTrigger>
                    <TabsTrigger value="slides">Slide</TabsTrigger>
                    <TabsTrigger value="examples">Esempi</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-4">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 leading-relaxed">
                        {currentLesson.content}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="slides" className="mt-4">
                    <ul className="space-y-2">
                      {currentLesson.slides.map((slide, index) => (
                        <li key={index} className="flex items-start space-x-3 p-2 bg-slate-700/30 rounded">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-300 text-sm">{slide}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="examples" className="mt-4">
                    <div className="space-y-3">
                      {currentLesson.examples.map((example, index) => (
                        <div key={index} className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded">
                          <div className="text-emerald-400 text-xs font-medium mb-1">
                            Esempio {index + 1}
                          </div>
                          <p className="text-slate-300 text-sm">{example}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quiz" className="mt-4">
                    <div className="space-y-4">
                      {currentLesson.quiz.map((question, index) => (
                        <div key={index} className="p-4 bg-slate-700/30 rounded border border-slate-600/50">
                          <div className="font-medium text-white mb-3">
                            {index + 1}. {question.question}
                          </div>
                          <div className="space-y-2 mb-3">
                            {question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex} 
                                className={`text-sm p-2 rounded ${
                                  option === question.correctAnswer
                                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                                    : 'text-slate-400 bg-slate-800/30'
                                }`}
                              >
                                {String.fromCharCode(65 + optionIndex)}) {option}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-slate-400">
                            💡 {question.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <Button 
          onClick={onEdit} 
          variant="outline" 
          className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifica Contenuti
        </Button>
        
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 px-8"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvataggio...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salva e Pubblica Corso
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CoursePreviewEnhanced;
