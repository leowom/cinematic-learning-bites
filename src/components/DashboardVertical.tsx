
import React, { useEffect, useRef } from 'react';
import HeroSection3D from './HeroSection3D';
import CurrentCourseSection from './CurrentCourseSection';
import BentoGrid from './BentoGrid';
import FloatingActions from './FloatingActions';

const DashboardVertical = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = containerRef.current?.querySelectorAll('.reveal-section');
    sections?.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.3) transparent'
      }}
    >
      {/* Ambient Background Layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      {/* Content Sections */}
      <div className="relative z-10 space-y-24 pb-32">
        {/* Hero Section */}
        <section className="reveal-section opacity-0 transition-all duration-1000">
          <HeroSection3D />
        </section>

        {/* Current Course Section */}
        <section className="reveal-section opacity-0 transition-all duration-1000 px-6">
          <CurrentCourseSection />
        </section>

        {/* Bento Grid */}
        <section className="reveal-section opacity-0 transition-all duration-1000 px-6">
          <BentoGrid />
        </section>

        {/* Floating Actions */}
        <section className="reveal-section opacity-0 transition-all duration-1000">
          <FloatingActions />
        </section>
      </div>
    </div>
  );
};

export default DashboardVertical;
