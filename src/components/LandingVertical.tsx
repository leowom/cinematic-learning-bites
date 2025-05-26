
import React, { useEffect } from 'react';
import HeroGlassmorphism from './HeroGlassmorphism';
import FeatureBentobox from './FeatureBentobox';
import SocialProofGlass from './SocialProofGlass';
import CTAFloating from './CTAFloating';

const LandingVertical = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Intersection Observer for scroll reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section-reveal');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-x-hidden">
      {/* Hero Section - Full Viewport */}
      <section className="section-reveal">
        <HeroGlassmorphism />
      </section>

      {/* Features Section - Bentobox Grid */}
      <section className="section-reveal">
        <FeatureBentobox />
      </section>

      {/* Social Proof Section */}
      <section className="section-reveal">
        <SocialProofGlass />
      </section>

      {/* Final CTA Section */}
      <section className="section-reveal">
        <CTAFloating />
      </section>

      {/* Professional Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-bold text-white mb-4">Learning Bites</div>
          <p className="text-white/60 mb-8">Trasformando il futuro attraverso l'apprendimento intelligente</p>
          <div className="flex justify-center gap-8 text-white/50">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingVertical;
