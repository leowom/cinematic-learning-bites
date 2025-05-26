
import React, { useState } from 'react';
import GlassmorphismCard from './GlassmorphismCard';
import ProgressRing3D from './ProgressRing3D';
import { Play, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  category: string;
  nextLesson: string;
  color: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Fondamenti di Machine Learning",
    description: "Scopri i concetti fondamentali dell'apprendimento automatico e implementa algoritmi di classificazione e regressione.",
    progress: 68,
    category: "Machine Learning",
    nextLesson: "Algoritmi di Classificazione",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Data Science con Python",
    description: "Impara ad analizzare e visualizzare dati utilizzando Python, Pandas e le librerie più avanzate.",
    progress: 42,
    category: "Data Science",
    nextLesson: "Visualizzazione Avanzata",
    color: "from-green-500 to-green-600"
  },
  {
    id: 3,
    title: "Deep Learning Fundamentals",
    description: "Esplora le reti neurali profonde e costruisci modelli AI per computer vision e NLP.",
    progress: 25,
    category: "Deep Learning",
    nextLesson: "Reti Neurali Convoluzionali",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 4,
    title: "Cloud Computing AWS",
    description: "Padroneggia i servizi AWS per deploying applicazioni scalabili nel cloud.",
    progress: 85,
    category: "Cloud Computing",
    nextLesson: "Kubernetes Avanzato",
    color: "from-orange-500 to-orange-600"
  }
];

const CurrentCourseSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextCourse = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % courses.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevCourse = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
      setIsTransitioning(false);
    }, 150);
  };

  const currentCourse = courses[currentIndex];

  return (
    <div className="max-w-6xl mx-auto relative">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        I Tuoi Corsi Attivi
      </h2>
      
      {/* Navigation Buttons */}
      <button
        onClick={prevCourse}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-x-1"
        disabled={isTransitioning}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextCourse}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:translate-x-1"
        disabled={isTransitioning}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Course Carousel Container */}
      <div className="relative overflow-hidden px-16">
        <div className="perspective-1000">
          <GlassmorphismCard 
            size="large" 
            className={`transform transition-all duration-500 ease-out ${
              isTransitioning ? 'scale-95 opacity-80 rotateY-12' : 'scale-100 opacity-100 rotateY-0'
            }`}
            style={{
              transform: `translateZ(${isTransitioning ? '-50px' : '0px'}) rotateY(${isTransitioning ? '12deg' : '0deg'})`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Course Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentCourse.color} flex items-center justify-center transform transition-all duration-500`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60 font-medium">IN CORSO</div>
                    <div className="text-xl font-bold text-white">{currentCourse.category}</div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white leading-tight">
                  {currentCourse.title}
                </h3>
                
                <p className="text-white/70 text-lg leading-relaxed">
                  {currentCourse.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Progresso del corso</span>
                    <span className="text-white font-medium">{currentCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${currentCourse.color.replace('to-', 'to-').replace('-600', '-400')} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${currentCourse.progress}%` }}
                    />
                  </div>
                </div>
                
                <button className={`group flex items-center space-x-3 bg-gradient-to-r ${currentCourse.color} hover:shadow-xl px-6 py-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105`}>
                  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>Continua: {currentCourse.nextLesson}</span>
                </button>
              </div>
              
              {/* Progress Ring */}
              <div className="flex justify-center">
                <ProgressRing3D progress={currentCourse.progress} />
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Course Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 150);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mouse wheel scroll handler */}
      <div 
        className="absolute inset-0 z-10"
        onWheel={(e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            if (e.deltaX > 0) {
              nextCourse();
            } else {
              prevCourse();
            }
          }
        }}
        style={{ pointerEvents: 'none' }}
      >
        <div className="w-full h-full" style={{ pointerEvents: 'auto' }} />
      </div>
    </div>
  );
};

export default CurrentCourseSection;
