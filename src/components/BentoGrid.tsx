
import React, { useState, useEffect } from 'react';
import GlassmorphismCard from './GlassmorphismCard';
import { useCourseData } from '@/hooks/useCourseData';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Trophy, BarChart3, Target } from 'lucide-react';

const BentoGrid = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { courseData, loading, overallProgress } = useCourseData(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        I Tuoi Progressi
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* I Miei Corsi */}
        <GlassmorphismCard className="md:col-span-1 group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">I Miei Corsi</h3>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="text-white/60 text-sm">Caricamento...</div>
            ) : courseData ? (
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                <div className="text-white font-medium">{courseData.title}</div>
                <div className="text-sm text-white/60">{overallProgress}% completato</div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-white/60 text-sm">Nessun corso disponibile</div>
            )}
            
            {courseData && courseData.modules.map((module, index) => (
              <div key={module.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white font-medium">{module.title}</div>
                <div className="text-sm text-white/60">{Math.round(module.completion_rate)}% completato</div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ${
                      index === 0 ? 'bg-green-400' : index === 1 ? 'bg-purple-400' : 'bg-orange-400'
                    }`}
                    style={{ width: `${module.completion_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassmorphismCard>

        {/* Top Performance */}
        <GlassmorphismCard className="md:col-span-1">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Top Performance</h3>
            <div className="text-2xl font-bold text-amber-400 mb-1">Top 15%</div>
            <div className="text-sm text-white/70">della tua azienda!</div>
            
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-xs text-amber-300 font-medium">🏆 Achievement sbloccato</div>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Learning Progress */}
        <GlassmorphismCard className="md:col-span-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Progress Overview</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Thinking with AI</span>
                <span className="text-white font-medium">{overallProgress || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${overallProgress || 0}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Settimane di Studio</span>
                <span className="text-green-400 font-medium">
                  {courseData ? Math.ceil(overallProgress / 15) : 0} settimane
                </span>
              </div>
              <div className="flex space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded ${
                      i < Math.ceil((overallProgress || 0) / 15) ? 'bg-green-400/80' : 'bg-white/20'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Weekly Challenges */}
        <GlassmorphismCard className="md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Sfide Settimanali</h3>
                <div className="text-sm text-white/60">1 di 3 completate</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="w-3 h-8 bg-purple-400 rounded"></div>
              <div className="w-3 h-8 bg-white/20 rounded"></div>
              <div className="w-3 h-8 bg-white/20 rounded"></div>
            </div>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
};

export default BentoGrid;
