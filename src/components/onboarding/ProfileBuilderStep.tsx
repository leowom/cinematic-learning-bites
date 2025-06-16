
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from '../GlassmorphismCard';

interface ProfileBuilderStepProps {
  onComplete: (data: any) => void;
  isActive: boolean;
  userData: any;
}

const ProfileBuilderStep: React.FC<ProfileBuilderStepProps> = ({ onComplete, isActive, userData }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [experience, setExperience] = useState(3);

  const roles = [
    { id: 'manager', label: 'Manager', icon: '👔' },
    { id: 'developer', label: 'Developer', icon: '💻' },
    { id: 'designer', label: 'Designer', icon: '🎨' },
    { id: 'consultant', label: 'Consultant', icon: '📋' },
    { id: 'entrepreneur', label: 'Entrepreneur', icon: '🚀' },
    { id: 'analyst', label: 'Analyst', icon: '📊' }
  ];

  const industries = [
    { id: 'tech', label: 'Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'consulting', label: 'Consulting' },
    { id: 'retail', label: 'Retail' },
    { id: 'manufacturing', label: 'Manufacturing' }
  ];

  const handleComplete = () => {
    if (selectedRole && selectedIndustry) {
      onComplete({
        role: selectedRole,
        industry: selectedIndustry,
        experience: experience
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Costruiamo il tuo profilo professionale
        </h2>
        <p className="text-xl text-white/70">
          Personalizza Learning Bites per il tuo contesto aziendale
        </p>
      </div>

      {/* Bentobox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Role Selection */}
        <GlassmorphismCard 
          className={`transform transition-all duration-1000 ${
            isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
          }`}
          size="large"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">Il tuo ruolo</h3>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === role.id
                    ? 'bg-blue-500/20 border-blue-400/50 shadow-lg translate-z-10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-2xl mb-2">{role.icon}</div>
                <div className="text-white font-medium">{role.label}</div>
              </button>
            ))}
          </div>
        </GlassmorphismCard>

        {/* Industry Selection */}
        <GlassmorphismCard 
          className={`transform transition-all duration-1000 delay-200 ${
            isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
          }`}
          size="large"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">Settore aziendale</h3>
          <div className="space-y-3">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`w-full p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-102 ${
                  selectedIndustry === industry.id
                    ? 'bg-amber-500/20 border-amber-400/50 shadow-lg translate-z-10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-white font-medium">{industry.label}</div>
              </button>
            ))}
          </div>
        </GlassmorphismCard>
      </div>

      {/* Experience Slider */}
      <GlassmorphismCard 
        className={`mb-20 transform transition-all duration-1000 delay-400 ${
          isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        size="medium"
      >
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-12">Anni di esperienza professionale</h3>
          <div className="flex items-center space-x-6">
            <span className="text-white/70">0</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="20"
                value={experience}
                onChange={(e) => setExperience(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500/80 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                {experience} anni
              </div>
            </div>
            <span className="text-white/70">20+</span>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Continue Button */}
      <div className="text-center">
        <Button 
          onClick={handleComplete}
          disabled={!selectedRole || !selectedIndustry}
          size="lg"
          className={`text-xl px-12 py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 shadow-2xl transform transition-all duration-300 ${
            selectedRole && selectedIndustry 
              ? 'hover:scale-105 opacity-100' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Continua Assessment
        </Button>
      </div>
    </div>
  );
};

export default ProfileBuilderStep;
