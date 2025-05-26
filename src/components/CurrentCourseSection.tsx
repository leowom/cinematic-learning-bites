
import React from 'react';
import GlassmorphismCard from './GlassmorphismCard';
import ProgressRing3D from './ProgressRing3D';
import { Play, BookOpen } from 'lucide-react';

const CurrentCourseSection = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Il Tuo Corso Attuale
      </h2>
      
      <GlassmorphismCard size="large" className="transform hover:scale-[1.01] transition-all duration-500">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Course Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-white/60 font-medium">IN CORSO</div>
                <div className="text-xl font-bold text-white">Machine Learning</div>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-white leading-tight">
              Fondamenti di Machine Learning
            </h3>
            
            <p className="text-white/70 text-lg leading-relaxed">
              Scopri i concetti fondamentali dell'apprendimento automatico e 
              implementa algoritmi di classificazione e regressione.
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Progresso del corso</span>
                <span className="text-white font-medium">68%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full w-[68%] transition-all duration-1000" />
              </div>
            </div>
            
            <button className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-6 py-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Continua la Prossima Lezione</span>
            </button>
          </div>
          
          {/* Progress Ring */}
          <div className="flex justify-center">
            <ProgressRing3D progress={68} />
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default CurrentCourseSection;
