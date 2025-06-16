
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const FoundationStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleUserPromptSubmit = () => {
    setShowDemo(true);
    updatePromptData('foundationComplete', true);
  };

  const getAIResponse = (prompt: string) => {
    if (!prompt.trim()) return "Please provide clear instructions for optimal assistance.";
    
    if (prompt.toLowerCase().includes('aiutami') || prompt.toLowerCase().includes('help')) {
      return "I can provide general assistance with productivity tips, email management, workflow optimization, and various other topics. Please specify your needs for more targeted support.";
    }
    
    if (prompt.toLowerCase().includes('email') && prompt.toLowerCase().includes('cliente')) {
      return "I need additional context to provide effective assistance. What type of email communication? What business context? What specific outcome are you seeking?";
    }
    
    return "I can assist with your request. However, providing more specific context and objectives would enable me to deliver more precise and actionable guidance.";
  };

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Brain className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Understanding Prompt Fundamentals
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            A prompt serves as an instruction set for AI systems. The specificity and structure of your prompt directly correlates with the quality and relevance of the AI response.
          </p>
          
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="bg-slate-800/50 rounded-lg p-3 element-spacing">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 sub-element-spacing">Human Communication:</div>
                  <div className="text-slate-300">"Help with emails" →</div>
                  <div className="text-slate-400 text-xs">Response: "What specifically do you need?"</div>
                </div>
                <div>
                  <div className="text-slate-400 sub-element-spacing">AI Communication:</div>
                  <div className="text-slate-300">"Help with emails" →</div>
                  <div className="text-slate-400 text-xs">Response: "Here are 50 general email tips..."</div>
                </div>
              </div>
            </div>

            <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3 element-spacing">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <AlertTriangle className="w-4 h-4 text-rose-300" />
                <span className="text-rose-300 text-sm font-medium">Common Issue:</span>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                Without role definition, AI responses lack context and authority. Generic prompts produce generic responses with limited practical value.
              </div>
            </div>
            
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-medium">Professional Approach:</span>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                "You are a customer service manager with 8 years of experience. Draft a professional response for an upset customer requesting a refund."
              </div>
              <div className="text-emerald-400/70 text-xs mt-2">
                This approach establishes clear role authority and specific context for targeted results.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 section-spacing">
          <h3 className="text-slate-200 font-medium element-spacing flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Practice Exercise:</span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 text-sm block sub-element-spacing">
                Enter your instruction for the AI system:
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Example: Help me with email management..."
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 text-slate-200 placeholder-slate-500 resize-none focus:border-slate-600 focus:outline-none"
                rows={2}
              />
            </div>
            <Button
              onClick={handleUserPromptSubmit}
              disabled={!userPrompt.trim()}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
            >
              Submit Prompt
            </Button>
          </div>
        </div>

        {showDemo && (
          <div className="bg-slate-800/30 border border-orange-700/30 rounded-lg p-4 animate-fade-in section-spacing">
            <h4 className="text-orange-300 font-medium sub-element-spacing flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI Response:</span>
            </h4>
            <div className="bg-slate-900/40 rounded-lg p-3 element-spacing">
              <p className="text-slate-300 text-sm leading-relaxed">
                {getAIResponse(userPrompt)}
              </p>
            </div>
            
            <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3">
              <h5 className="text-rose-300 font-medium sub-element-spacing flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Key Observation:</span>
              </h5>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• AI systems respond literally to input provided</li>
                <li>• Vague instructions yield generic responses</li>
                <li>• Specific context produces targeted results</li>
                <li>• <strong>Precision is essential for effectiveness</strong></li>
              </ul>
            </div>
          </div>
        )}

        {showDemo && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 border border-slate-600"
            >
              <span>Proceed to Next Module</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundationStep;
