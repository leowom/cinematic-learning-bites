import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreloadComponents } from '@/hooks/usePreloadComponents';
import WelcomeStep from './onboarding/WelcomeStep';
import ProfileBuilderStep from './onboarding/ProfileBuilderStep';
import AssessmentStep from './onboarding/AssessmentStep';
import PersonalizationStep from './onboarding/PersonalizationStep';

const OnboardingVertical = () => {
  // Use preloading hook for better performance
  usePreloadComponents();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    role: '',
    industry: '',
    experience: 0,
    preferences: [],
    assessmentAnswers: {},
    assignedWorkflow: '',
    learningProfile: {}
  });
  const navigate = useNavigate();

  // Memoized scroll function to prevent recreations
  const scrollToStep = useCallback((stepNumber: number) => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      const nextStep = document.getElementById(`step-${stepNumber}`);
      if (nextStep) {
        const stepRect = nextStep.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset + stepRect.top - (windowHeight * 0.1);
        
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    });
  }, []);

  useEffect(() => {
    // Optimized intersection observer with better performance settings
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      // Batch DOM updates to prevent layout thrashing
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('step-reveal');
          }
        });
      });
    }, observerOptions);

    // Observe all step elements
    const steps = document.querySelectorAll('.onboarding-step');
    steps.forEach((step) => observer.observe(step));

    return () => {
      steps.forEach((step) => observer.unobserve(step));
    };
  }, []);

  const handleStepComplete = useCallback((stepData: any) => {
    console.log('Step completed with data:', stepData);
    
    // Batch state updates to prevent multiple re-renders
    setUserProfile(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < 4) {
      // Use flushSync for immediate state update, then smooth scroll
      requestAnimationFrame(() => {
        setCurrentStep(prev => prev + 1);
        // Reduced timeout for better perceived performance
        setTimeout(() => scrollToStep(currentStep + 1), 200);
      });
    } else {
      console.log('Onboarding completed with profile:', userProfile);
      setTimeout(() => navigate('/'), 1000);
    }
  }, [currentStep, scrollToStep, navigate, userProfile]);

  // Memoized progress calculation
  const progressPercentage = useMemo(() => (currentStep / 4) * 100, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-x-hidden">
      {/* Optimized Background Layers - Reduced complexity */}
      <div className="fixed inset-0 z-0 will-change-transform">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl opacity-60" 
             style={{ animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-amber-500/6 rounded-full blur-2xl opacity-50" 
             style={{ animation: 'pulse 6s ease-in-out infinite 1s' }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-green-500/4 rounded-full blur-xl opacity-40" 
             style={{ animation: 'pulse 5s ease-in-out infinite 2s' }} />
      </div>

      {/* Optimized Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20 will-change-transform">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-amber-500 transition-all duration-700 ease-out"
          style={{ 
            width: `${progressPercentage}%`,
            transform: 'translateZ(0)' // Force GPU layer
          }}
        />
      </div>

      {/* Optimized Vertical Step Progression */}
      <div className="relative z-10 pb-20">
        {/* Step 1: Welcome Professional */}
        <section 
          id="step-1" 
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-700 ease-out will-change-transform ${
            currentStep >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}
          style={{ contain: 'layout style paint' }}
        >
          <WelcomeStep 
            onComplete={handleStepComplete}
            isActive={currentStep === 1}
          />
        </section>

        {/* Step 2: Profile Builder */}
        <section 
          id="step-2" 
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-700 ease-out will-change-transform ${
            currentStep >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}
          style={{ contain: 'layout style paint' }}
        >
          <ProfileBuilderStep 
            onComplete={handleStepComplete}
            isActive={currentStep === 2}
            userData={userProfile}
          />
        </section>

        {/* Step 3: Learning Style Assessment */}
        <section 
          id="step-3" 
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-700 ease-out will-change-transform ${
            currentStep >= 3 ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}
          style={{ contain: 'layout style paint' }}
        >
          <AssessmentStep 
            onComplete={handleStepComplete}
            isActive={currentStep === 3}
            userData={userProfile}
          />
        </section>

        {/* Step 4: AI Personalization */}
        <section 
          id="step-4" 
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-700 ease-out will-change-transform ${
            currentStep >= 4 ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}
          style={{ contain: 'layout style paint' }}
        >
          <PersonalizationStep 
            onComplete={handleStepComplete}
            isActive={currentStep === 4}
            userData={userProfile}
          />
        </section>
      </div>
    </div>
  );
};

export default OnboardingVertical;
