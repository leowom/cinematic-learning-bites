
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassmorphismCard from './GlassmorphismCard';
import ProgressRing3D from './ProgressRing3D';
import { useCourseData } from '@/hooks/useCourseData';
import { supabase } from '@/integrations/supabase/client';
import { Play, BookOpen, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const CurrentCourseSection = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { courseData, loading, overallProgress } = useCourseData(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const nextCourse = () => {
    if (isTransitioning || !courseData) return;
    setIsTransitioning(true);
    setExpandedDescription(false);
    setTimeout(() => {
      setCurrentIndex(0); // Since we only have one course now
      setIsTransitioning(false);
    }, 150);
  };

  const prevCourse = () => {
    if (isTransitioning || !courseData) return;
    setIsTransitioning(true);
    setExpandedDescription(false);
    setTimeout(() => {
      setCurrentIndex(0); // Since we only have one course now
      setIsTransitioning(false);
    }, 150);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (e.deltaX > 0) {
        nextCourse();
      } else {
        prevCourse();
      }
    }
  };

  // Get next available lesson
  const getNextLesson = () => {
    if (!courseData) return null;
    
    for (const module of courseData.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed && !lesson.locked) {
          return lesson;
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const descriptionLimit = 100;
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">I Tuoi Corsi Attivi</h2>
        <div className="text-white/60">Caricamento...</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">I Tuoi Corsi Attivi</h2>
        <div className="text-white/60">Nessun corso disponibile</div>
      </div>
    );
  }

  const shouldTruncate = courseData.description && courseData.description.length > descriptionLimit;

  return (
    <div className="max-w-6xl mx-auto relative" onWheel={handleWheel}>
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        I Tuoi Corsi Attivi
      </h2>
      
        {/* Course Card - Single Course Display */}
        <div className="relative overflow-hidden">
          <div className="perspective-1000">
            <GlassmorphismCard 
              size="large" 
              className={`transform transition-all duration-500 ease-out h-[420px] ${
                isTransitioning ? 'scale-95 opacity-80 rotateY-12' : 'scale-100 opacity-100 rotateY-0'
              }`}
              style={{
                transform: `translateZ(${isTransitioning ? '-50px' : '0px'}) rotateY(${isTransitioning ? '12deg' : '0deg'})`,
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="grid md:grid-cols-2 gap-6 items-stretch h-full">
                {/* Course Info */}
                <div className="flex flex-col justify-between h-full py-2">
                  {/* Header Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transform transition-all duration-500">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-white/60 font-medium">IN CORSO</div>
                        <div className="text-lg font-bold text-white">AI & Prompting</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {courseData.title}
                    </h3>
                    
                    <div className="text-white/70 text-sm leading-relaxed">
                      <p>
                        {shouldTruncate && !expandedDescription
                          ? `${courseData.description?.slice(0, descriptionLimit)}...`
                          : courseData.description
                        }
                      </p>
                      {shouldTruncate && (
                        <button
                          onClick={() => setExpandedDescription(!expandedDescription)}
                          className="flex items-center space-x-1 text-blue-300 hover:text-blue-200 text-xs mt-1 transition-colors"
                        >
                          <span>{expandedDescription ? 'Mostra meno' : 'Leggi di più'}</span>
                          {expandedDescription ? 
                            <ChevronUp className="w-3 h-3" /> : 
                            <ChevronDown className="w-3 h-3" />
                          }
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Progresso del corso</span>
                      <span className="text-white font-medium">{overallProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Action Button - Always Visible */}
                  <button 
                    onClick={() => {
                      if (nextLesson) {
                        navigate(nextLesson.route);
                      } else {
                        navigate('/course-index');
                      }
                    }}
                    className="group flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl px-5 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 mt-4"
                  >
                    <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">
                      {nextLesson ? `Continua: ${nextLesson.title}` : 'Visualizza corso'}
                    </span>
                  </button>
                </div>
                
                {/* Progress Ring */}
                <div className="flex justify-center items-center h-full">
                  <ProgressRing3D progress={overallProgress} size={240} />
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </div>
    </div>
  );
};

export default CurrentCourseSection;
