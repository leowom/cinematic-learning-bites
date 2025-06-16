
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeStep from './onboarding/WelcomeStep';
import ProfileBuilderStep from './onboarding/ProfileBuilderStep';
import AssessmentStep from './onboarding/AssessmentStep';
import PersonalizationStep from './onboarding/PersonalizationStep';

const OnboardingVertical = () => {
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

  useEffect(() => {
    // Smooth scroll behavior for vertical progression
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Intersection Observer for step reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('step-reveal');
        }
      });
    }, observerOptions);

    // Observe all step elements
    const steps = document.querySelectorAll('.onboarding-step');
    steps.forEach((step) => observer.observe(step));

    return () => {
      steps.forEach((step) => observer.unobserve(step));
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [currentStep]);

  const handleStepComplete = (stepData: any) => {
    console.log('Step completed with data:', stepData);
    setUserProfile(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      // Improved scroll to next step with better timing and fallback
      setTimeout(() => {
        const nextStep = document.getElementById(`step-${currentStep + 1}`);
        if (nextStep) {
          // Calculate optimal scroll position
          const stepRect = nextStep.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const scrollTop = window.pageYOffset + stepRect.top - (windowHeight * 0.1);
          
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }, 500);
    } else {
      // Onboarding complete, navigate to dashboard
      console.log('Onboarding completed with profile:', userProfile);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-x-hidden">
      {/* Background Ambient Layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-amber-500/8 rounded-full blur-2xl animate-float" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-green-500/6 rounded-full blur-xl animate-glow" />
      </div>

      {/* Progress Indicator - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-amber-500 transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Vertical Step Progression */}
      <div className="relative z-10 pb-20">
        {/* Step 1: Welcome Professional */}
        <section 
          id="step-1" 
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-1000 ${
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
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-1000 ${
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
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-1000 ${
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
          className={`onboarding-step min-h-screen flex items-center justify-center px-4 lg:px-6 transition-opacity duration-1000 ${
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
