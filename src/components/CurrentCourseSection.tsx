import React, { useState } from 'react';
import GlassmorphismCard from './GlassmorphismCard';
import ProgressRing3D from './ProgressRing3D';
import { Play, BookOpen, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expandedDescription, setExpandedDescription] = useState(false);

  const nextCourse = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setExpandedDescription(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % courses.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevCourse = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setExpandedDescription(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
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

  const currentCourse = courses[currentIndex];
  const descriptionLimit = 100;
  const shouldTruncate = currentCourse.description.length > descriptionLimit;

  return (
    <div className="max-w-6xl mx-auto relative" onWheel={handleWheel}>
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        I Tuoi Corsi Attivi
      </h2>
      
      {/* Course Carousel Container with CSS Grid */}
      <div className="grid grid-cols-[60px_1fr_60px] items-center gap-4">
        {/* Left Navigation */}
        <button
          onClick={prevCourse}
          className="justify-self-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-x-1"
          disabled={isTransitioning}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Course Card Container - Fixed Height */}
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
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentCourse.color} flex items-center justify-center transform transition-all duration-500`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-white/60 font-medium">IN CORSO</div>
                        <div className="text-lg font-bold text-white">{currentCourse.category}</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {currentCourse.title}
                    </h3>
                    
                    <div className="text-white/70 text-sm leading-relaxed">
                      <p>
                        {shouldTruncate && !expandedDescription
                          ? `${currentCourse.description.slice(0, descriptionLimit)}...`
                          : currentCourse.description
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
                      <span className="text-white font-medium">{currentCourse.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${currentCourse.color.replace('to-', 'to-').replace('-600', '-400')} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${currentCourse.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Action Button - Always Visible */}
                  <button className={`group flex items-center space-x-3 bg-gradient-to-r ${currentCourse.color} hover:shadow-xl px-5 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 mt-4`}>
                    <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">Continua: {currentCourse.nextLesson}</span>
                  </button>
                </div>
                
                {/* Progress Ring */}
                <div className="flex justify-center items-center h-full">
                  <ProgressRing3D progress={currentCourse.progress} size={240} />
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </div>

        {/* Right Navigation */}
        <button
          onClick={nextCourse}
          className="justify-self-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:translate-x-1"
          disabled={isTransitioning}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Course Indicators */}
      <div className="flex justify-center space-x-2 mt-8">
        {courses.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setExpandedDescription(false);
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
  );
};

export default CurrentCourseSection;
