
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const RoleSelectionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  const roles = [
    {
      id: 'customer-service',
      title: 'Customer Service Specialist',
      description: 'Email automation and client relations',
      context: 'Manages customer communications with empathy and professionalism',
      experience: '8+ years'
    },
    {
      id: 'sales-manager',
      title: 'Sales Manager',
      description: 'Conversion optimization and lead management',
      context: 'Transforms prospects into clients through strategic communication',
      experience: '5+ years'
    },
    {
      id: 'content-creator',
      title: 'Content Strategist',
      description: 'Digital storytelling and engagement',
      context: 'Creates compelling content across all digital channels',
      experience: '6+ years'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    const selectedRole = roles.find(r => r.id === roleId);
    updatePromptData('role', selectedRole?.title || '');
    updatePromptData('qualityScore', 4);
    setShowBeforeAfter(true);
  };

  const beforeResponse = `Thank you for your email. I apologize for the issue. How can I assist you?`;

  const afterResponse = `Dear Marco,

I sincerely apologize for the defective product you received. As a Customer Service Specialist with 8 years of experience, I take this matter seriously.

I am offering you either a full refund or immediate replacement. Which option would you prefer?

Best regards,
[Name] - Customer Service Team`;

  return (
    <div className="bg-slate-900/90 border border-slate-700/50 rounded-xl p-6 shadow-xl shadow-black/10 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-800/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Users className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Establishing AI Role and Authority
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
          <h3 className="text-slate-300 font-medium mb-2">Key Principle:</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            AI systems require defined roles to establish context and authority. Without role specification, 
            responses lack professional credibility and specific expertise.
          </p>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium mb-3">Select appropriate professional role:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`bg-slate-800/40 border rounded-lg p-4 cursor-pointer hover:bg-slate-700/60 hover:border-slate-600/50 transition-all duration-200 ${
                  promptData.role === role.title 
                    ? 'border-slate-600/50 bg-slate-700/60' 
                    : 'border-slate-700/40'
                }`}
              >
                <div className="text-center">
                  <h4 className="text-slate-200 font-medium mb-1">{role.title}</h4>
                  <p className="text-slate-400 text-sm mb-2">{role.description}</p>
                  <p className="text-slate-500 text-xs mb-1">{role.context}</p>
                  <span className="text-slate-300 text-xs font-medium">Experience: {role.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {promptData.role && (
          <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4">
            <label className="text-slate-400 text-sm mb-2 block">
              Experience Level: {promptData.experience} years
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={promptData.experience}
              onChange={(e) => updatePromptData('experience', parseInt(e.target.value))}
              className="w-full accent-slate-500"
            />
            <div className="flex justify-between text-slate-500 text-xs mt-1">
              <span>Junior (1-3)</span>
              <span>Senior (4-8)</span>
              <span>Expert (9-15)</span>
            </div>
          </div>
        )}

        {showBeforeAfter && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-orange-300 font-medium">Quality Improvement Demonstration:</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-rose-300 text-sm mb-2 flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Without Role Definition:</span>
                </h4>
                <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3">
                  <p className="text-slate-300 text-sm">{beforeResponse}</p>
                </div>
              </div>
              <div>
                <h4 className="text-emerald-300 text-sm mb-2 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>With Professional Role:</span>
                </h4>
                <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap">
                    {afterResponse}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-orange-700/30 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">Measurable Improvements:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-rose-400">"Thank you" →</div>
                  <div className="text-rose-400">"How can I assist?" →</div>
                  <div className="text-rose-400">Generic tone →</div>
                  <div className="text-rose-400">No authority →</div>
                </div>
                <div className="space-y-1">
                  <div className="text-emerald-300">"Sincere apology"</div>
                  <div className="text-emerald-300">"Specific solutions offered"</div>
                  <div className="text-emerald-300">Professional tone</div>
                  <div className="text-emerald-300">Established expertise</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
              <p className="text-emerald-300 text-sm">
                <strong>Quality Score: +2 points</strong> - Role specification transforms generic responses 
                into professional communications with established authority and credibility.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={!promptData.role}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center space-x-2 border border-slate-600"
          >
            <span>Continue to Context Definition</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
