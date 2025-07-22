
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdvancedFilters, { FilterState } from './AdvancedFilters';
import AIFeedbackPanel from './AIFeedbackPanel';

interface UserAnalytics {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  totalAttempts: number;
  completions: number;
  completionRate: number;
  avgTimeSpent?: number;
  difficultySuggestion?: string;
}

const DetailedAnalyticsSection = () => {
  const [userData, setUserData] = useState<UserAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: undefined,
    course: 'all',
    userRole: 'all',
    completionStatus: 'all',
    timeframe: '30d'
  });

  useEffect(() => {
    const fetchDetailedData = async () => {
      try {
        setLoading(true);
        
        // Fetch user progress with lesson and module information
        let query = supabase
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

        // Apply filters
        if (filters.completionStatus === 'completed') {
          query = query.eq('completed', true);
        } else if (filters.completionStatus === 'in-progress') {
          query = query.eq('completed', false);
        }

        const { data: progressData } = await query;

        // Process data to generate analytics
        const lessonStats = progressData?.reduce((acc, progress) => {
          const lessonId = progress.lesson_id;
          const lessonTitle = progress.lessons?.title || 'Unknown Lesson';
          const moduleTitle = progress.lessons?.modules?.title || 'Unknown Module';
          
          if (!acc[lessonId]) {
            acc[lessonId] = {
              lessonId,
              lessonTitle,
              moduleTitle,
              totalAttempts: 0,
              completions: 0,
              completionRate: 0
            };
          }
          
          acc[lessonId].totalAttempts += 1;
          if (progress.completed) {
            acc[lessonId].completions += 1;
          }
          
          acc[lessonId].completionRate = (acc[lessonId].completions / acc[lessonId].totalAttempts) * 100;
          
          return acc;
        }, {} as Record<string, UserAnalytics>) || {};

        setUserData(Object.values(lessonStats).sort((a, b) => b.totalAttempts - a.totalAttempts));
      } catch (error) {
        console.error('Error fetching detailed analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedData();
  }, [filters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const csvData = userData.map(row => ({
      'Lesson': row.lessonTitle,
      'Module': row.moduleTitle,
      'Total Attempts': row.totalAttempts,
      'Completions': row.completions,
      'Completion Rate (%)': Math.round(row.completionRate)
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(csvData[0] || {}).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Detailed Analytics</h2>
          <p className="text-blue-200/80">Learning performance insights and AI recommendations</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-white/10 rounded-lg"></div>
          <div className="h-64 bg-white/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Detailed Analytics</h2>
        <p className="text-blue-200/80">Learning performance insights and AI recommendations</p>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Performance Table */}
        <div className="lg:col-span-2">
          <div className="analytics-container bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-1">
            <div className="data-table bg-white rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lesson Performance</h3>
                <p className="text-sm text-gray-600">Detailed completion and engagement metrics</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Lesson</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Module</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Attempts</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          No data available. User interactions will appear here as they engage with lessons.
                        </td>
                      </tr>
                    ) : (
                      userData.map((row, index) => (
                        <tr key={row.lessonId} className={`data-row ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                          <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate" title={row.lessonTitle}>
                            {row.lessonTitle}
                          </td>
                          <td className="py-3 px-4 text-gray-700 max-w-xs truncate" title={row.moduleTitle}>
                            {row.moduleTitle}
                          </td>
                          <td className="py-3 px-4 text-gray-700">{row.totalAttempts}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              row.completionRate > 70 ? 'bg-emerald-100 text-emerald-700' :
                              row.completionRate > 40 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {Math.round(row.completionRate)}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* AI Feedback Panel */}
        <div className="lg:col-span-1">
          <AIFeedbackPanel />
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalyticsSection;
