import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Brain, AlertTriangle, TrendingUp, BookOpen, Users } from 'lucide-react';

interface ContentInsight {
  id: string;
  type: 'difficulty' | 'engagement' | 'completion' | 'popular';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  lessonId?: string;
}

const AIFeedbackPanel = () => {
  const [insights, setInsights] = useState<ContentInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        // Fetch user progress and quiz data for analysis
        const { data: progressData } = await supabase
          .from('user_progress')
          .select(`
            lesson_id,
            completed,
            last_accessed_at,
            lessons (
              title,
              module_id,
              modules (
                title,
                course_id
              )
            )
          `);

        const { data: quizResults } = await supabase
          .from('quiz_results')
          .select(`
            lesson_id,
            is_correct,
            completed_at
          `);

        // Generate AI-driven insights based on data patterns
        const generatedInsights: ContentInsight[] = [];

        // Analyze completion rates by lesson
        const lessonStats = progressData?.reduce((acc, progress) => {
          const lessonId = progress.lesson_id;
          if (!acc[lessonId]) {
            acc[lessonId] = {
              total: 0,
              completed: 0,
              title: progress.lessons?.title || 'Unknown',
              lastAccessed: []
            };
          }
          acc[lessonId].total += 1;
          if (progress.completed) acc[lessonId].completed += 1;
          acc[lessonId].lastAccessed.push(progress.last_accessed_at);
          return acc;
        }, {} as any) || {};

        // Identify low completion rate lessons
        Object.entries(lessonStats).forEach(([lessonId, stats]: [string, any]) => {
          const completionRate = (stats.completed / stats.total) * 100;
          if (completionRate < 50 && stats.total > 2) {
            generatedInsights.push({
              id: `low-completion-${lessonId}`,
              type: 'difficulty',
              title: 'Low Completion Rate Detected',
              description: `"${stats.title}" has a ${Math.round(completionRate)}% completion rate. Consider simplifying content or adding more guidance.`,
              action: 'Review lesson difficulty',
              priority: 'high',
              lessonId
            });
          }
        });

        // Analyze quiz performance
        const quizStats = quizResults?.reduce((acc, result) => {
          const lessonId = result.lesson_id;
          if (!acc[lessonId]) {
            acc[lessonId] = { total: 0, correct: 0 };
          }
          acc[lessonId].total += 1;
          if (result.is_correct) acc[lessonId].correct += 1;
          return acc;
        }, {} as any) || {};

        Object.entries(quizStats).forEach(([lessonId, stats]: [string, any]) => {
          const accuracy = (stats.correct / stats.total) * 100;
          if (accuracy < 60 && stats.total > 5) {
            generatedInsights.push({
              id: `low-quiz-${lessonId}`,
              type: 'difficulty',
              title: 'Quiz Performance Issue',
              description: `Quiz accuracy for this lesson is ${Math.round(accuracy)}%. Questions may be too difficult or content needs clarification.`,
              action: 'Review quiz questions',
              priority: 'medium',
              lessonId
            });
          }
        });

        // Identify popular content
        const popularLessons = Object.entries(lessonStats)
          .filter(([_, stats]: [string, any]) => stats.total > 3)
          .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.total - a.total)
          .slice(0, 2);

        popularLessons.forEach(([lessonId, stats]: [string, any]) => {
          generatedInsights.push({
            id: `popular-${lessonId}`,
            type: 'popular',
            title: 'High Engagement Content',
            description: `"${stats.title}" is very popular with ${stats.total} learning sessions. Consider creating similar content.`,
            action: 'Expand similar content',
            priority: 'low',
            lessonId
          });
        });

        // Add engagement insights
        if (progressData && progressData.length > 0) {
          const avgSessions = progressData.length / new Set(progressData.map(p => p.lesson_id)).size;
          if (avgSessions > 2) {
            generatedInsights.push({
              id: 'high-engagement',
              type: 'engagement',
              title: 'Strong User Engagement',
              description: `Users are actively engaging with content (${avgSessions.toFixed(1)} sessions per lesson on average).`,
              action: 'Maintain current quality',
              priority: 'low'
            });
          }
        }

        setInsights(generatedInsights.slice(0, 6)); // Limit to 6 insights
      } catch (error) {
        console.error('Error generating insights:', error);
        // Add fallback insights
        setInsights([
          {
            id: 'fallback-1',
            type: 'engagement',
            title: 'Learning Analytics Active',
            description: 'Your platform is collecting valuable learning data for continuous improvement.',
            action: 'Continue monitoring',
            priority: 'low'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'difficulty': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'engagement': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'completion': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'popular': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <Card className="analytics-container bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Content Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="analytics-container bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Content Insights
        </CardTitle>
        <p className="text-blue-200/80 text-sm">
          AI-powered recommendations for content optimization
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">
                Collecting data for insights... Check back after more user activity.
              </p>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(insight.priority)} backdrop-blur-sm`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">
                        Priority: {insight.priority}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFeedbackPanel;