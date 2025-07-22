import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseData, targetAudience } = await req.json();
    
    if (!courseData) {
      throw new Error('courseData is required');
    }

    console.log('Starting course save process...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate unique IDs
    const courseId = `course-ai-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    console.log('Generated course ID:', courseId);

    // Insert course
    const { error: courseError } = await supabase
      .from('courses')
      .insert({
        id: courseId,
        title: courseData.courseTitle,
        description: courseData.description || `Corso generato automaticamente con AI - ${courseData.courseTitle}`,
        total_duration: courseData.totalDuration || '8-12 ore',
        level: targetAudience === 'principianti' ? 'beginner' : 
               targetAudience === 'intermedi' ? 'intermediate' : 
               targetAudience === 'avanzati' ? 'advanced' : 'beginner',
        target_role: 'all',
        prerequisites: [],
        tags: ['AI-Generated', 'Micro-Learning']
      });

    if (courseError) {
      console.error('Course insert error:', courseError);
      throw new Error(`Errore inserimento corso: ${courseError.message}`);
    }

    console.log('Course inserted successfully');

    // Insert modules and lessons
    for (let moduleIndex = 0; moduleIndex < courseData.modules.length; moduleIndex++) {
      const moduleData = courseData.modules[moduleIndex];
      const moduleId = `module-ai-${Date.now()}-${moduleIndex}-${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`Processing module ${moduleIndex + 1}: ${moduleData.moduleTitle}`);

      // Insert module
      const { error: moduleError } = await supabase
        .from('modules')
        .insert({
          id: moduleId,
          course_id: courseId,
          title: moduleData.moduleTitle,
          description: moduleData.description || `Modulo ${moduleIndex + 1} del corso`,
          total_duration: moduleData.duration || `${Math.ceil(moduleData.lessons.length * 15)} min`,
          order_index: moduleIndex + 1
        });

      if (moduleError) {
        console.error('Module insert error:', moduleError);
        throw new Error(`Errore inserimento modulo ${moduleIndex + 1}: ${moduleError.message}`);
      }

      // Insert lessons for this module
      for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
        const lessonData = moduleData.lessons[lessonIndex];
        const lessonId = `lesson-ai-${Date.now()}-${moduleIndex}-${lessonIndex}-${Math.random().toString(36).substring(2, 8)}`;
        
        console.log(`Processing lesson ${lessonIndex + 1}: ${lessonData.lessonTitle}`);

        // Insert lesson
        const { error: lessonError } = await supabase
          .from('lessons')
          .insert({
            id: lessonId,
            module_id: moduleId,
            title: lessonData.lessonTitle,
            description: lessonData.content.substring(0, 200) + (lessonData.content.length > 200 ? '...' : ''),
            duration: lessonData.duration || '10-15 min',
            route: `/lesson/${lessonData.lessonTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`,
            order_index: lessonIndex + 1
          });

        if (lessonError) {
          console.error('Lesson insert error:', lessonError);
          throw new Error(`Errore inserimento lezione ${lessonIndex + 1}: ${lessonError.message}`);
        }

        // Insert quiz questions for this lesson
        for (let quizIndex = 0; quizIndex < lessonData.quiz.length; quizIndex++) {
          const quizData = lessonData.quiz[quizIndex];
          
          console.log(`Processing quiz question ${quizIndex + 1} for lesson ${lessonData.lessonTitle}`);

          const { error: quizError } = await supabase
            .from('quiz_questions')
            .insert({
              lesson_id: lessonId,
              question_text: quizData.question,
              question_type: 'multiple_choice',
              options: quizData.options,
              correct_answer: quizData.correctAnswer,
              explanation: quizData.explanation || 'Spiegazione generata automaticamente',
              order_index: quizIndex + 1
            });

          if (quizError) {
            console.error('Quiz insert error:', quizError);
            // Don't throw error for quiz, just log it
            console.log(`Warning: Quiz question ${quizIndex + 1} not inserted for lesson ${lessonData.lessonTitle}`);
          }
        }
      }
    }

    // Insert final test questions as quiz questions for the last lesson if they exist
    if (courseData.finalTest && courseData.finalTest.length > 0) {
      console.log('Processing final test questions...');
      
      // Find the last lesson to attach final test
      const lastModule = courseData.modules[courseData.modules.length - 1];
      const lastLesson = lastModule.lessons[lastModule.lessons.length - 1];
      const lastLessonId = `lesson-ai-${Date.now()}-${courseData.modules.length - 1}-${lastModule.lessons.length - 1}-${Math.random().toString(36).substring(2, 8)}`;

      // We need to find the actual lesson ID from database
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', `module-ai-${Date.now()}-${courseData.modules.length - 1}-${Math.random().toString(36).substring(2, 10)}`)
        .order('order_index', { ascending: false })
        .limit(1);

      if (lessonsData && lessonsData.length > 0) {
        for (let finalIndex = 0; finalIndex < courseData.finalTest.length; finalIndex++) {
          const finalQuestion = courseData.finalTest[finalIndex];
          
          await supabase
            .from('quiz_questions')
            .insert({
              lesson_id: lessonsData[0].id,
              question_text: `[TEST FINALE] ${finalQuestion.question}`,
              question_type: 'multiple_choice',
              options: finalQuestion.options,
              correct_answer: finalQuestion.correctAnswer,
              explanation: finalQuestion.explanation || 'Domanda del test finale',
              order_index: 100 + finalIndex // High order to separate from lesson questions
            });
        }
      }
    }

    console.log('Course saved successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        courseId: courseId,
        message: 'Corso salvato e pubblicato con successo!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in save-course function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Errore durante il salvataggio del corso'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});