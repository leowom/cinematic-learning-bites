
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

  // Simplified scroll function to reduce main thread work
  const scrollToStep = useCallback((stepNumber: number) => {
    const nextStep = document.getElementById(`step-${stepNumber}`);
    if (nextStep) {
      nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Simplified intersection observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('step-reveal');
        }
      });
    }, { threshold: 0.3 });

    const steps = document.querySelectorAll('.onboarding-step');
    steps.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  const handleStepComplete = useCallback((stepData: any) => {
    console.log('Step completed with data:', stepData);
    
    setUserProfile(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setTimeout(() => scrollToStep(currentStep + 1), 100);
    } else {
      console.log('Onboarding completed with profile:', userProfile);
      setTimeout(() => navigate('/'), 500);
    }
  }, [currentStep, scrollToStep, navigate, userProfile]);

  // Simplified progress calculation
  const progressPercentage = useMemo(() => (currentStep / 4) * 100, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-x-hidden">
      {/* Simplified Background - Reduced animation complexity */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-amber-500/4 rounded-full blur-2xl opacity-30" />
      </div>

      {/* Simplified Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-amber-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Simplified Step Progression */}
      <div className="relative z-10 pb-20">
        {/* Step 1: Welcome Professional */}
        <section 
          id="step-1" 
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-500 ${
            currentStep >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}
        >
          <WelcomeStep 
            onComplete={handleStepComplete}
            isActive={currentStep === 1}
          />
        </section>

        {/* Step 2: Profile Builder */}
        <section 
          id="step-2" 
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-500 ${
            currentStep >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}
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
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-500 ${
            currentStep >= 3 ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}
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
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-500 ${
            currentStep >= 4 ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}
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
