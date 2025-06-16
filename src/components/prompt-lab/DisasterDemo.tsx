
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const DisasterDemo: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
    updatePromptData('disasterUnderstood', true);
  };

  const clientEmail = `Subject: DEFECTIVE PRODUCT - IMMEDIATE REFUND REQUIRED

Dear Customer Service,

I received your t-shirt yesterday but it arrived with a significant tear. This is unacceptable quality and I demand an immediate refund or I will escalate this matter through legal channels.

Marco Rossi
Order #12345`;

  const badPrompt = `"Respond to this customer email"`;

  const badResponse = `Hello Marco,

Thank you for your email. I apologize for any inconvenience. What can I do to help you?

Best regards`;

  return (
    <div className="bg-slate-900/90 border border-slate-700/50 rounded-xl p-6 shadow-xl shadow-black/10 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-800/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Zap className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Analyzing Ineffective Prompt Patterns
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <p className="text-slate-400 leading-relaxed">
          Let's examine how generic prompts fail in real-world customer service scenarios and identify improvement opportunities.
        </p>

        {/* Customer Email */}
        <div>
          <h3 className="text-slate-200 font-medium mb-3 flex items-center space-x-2">
            <span>Customer Communication:</span>
          </h3>
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
            <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans">
              {clientEmail}
            </pre>
          </div>
        </div>

        {/* Generic Prompt */}
        <div>
          <h3 className="text-slate-200 font-medium mb-3 flex items-center space-x-2">
            <span>Generic Prompt Used:</span>
          </h3>
          <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-4">
            <code className="text-rose-300 text-sm">{badPrompt}</code>
          </div>
        </div>

        {/* Poor AI Response */}
        <div>
          <h3 className="text-slate-200 font-medium mb-3 flex items-center space-x-2">
            <span>Resulting AI Response:</span>
          </h3>
          <div className="bg-slate-800/30 border border-rose-700/30 rounded-lg p-4">
            <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans">
              {badResponse}
            </pre>
          </div>
        </div>

        {!showAnalysis && (
          <div className="text-center">
            <Button
              onClick={handleShowAnalysis}
              className="bg-orange-800 hover:bg-orange-700 text-orange-100 px-6 py-3 rounded-lg font-medium border border-orange-700"
            >
              Analyze Response Quality
            </Button>
          </div>
        )}

        {showAnalysis && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-4">
              <h4 className="text-rose-300 font-medium mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Issues Identified:</span>
              </h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start">
                  <span className="text-rose-400 mr-2">•</span>
                  Lacks acknowledgment of company responsibility
                </li>
                <li className="flex items-start">
                  <span className="text-rose-400 mr-2">•</span>
                  No concrete resolution offered (refund/replacement)
                </li>
                <li className="flex items-start">
                  <span className="text-rose-400 mr-2">•</span>
                  Inappropriate tone for escalated customer concern
                </li>
                <li className="flex items-start">
                  <span className="text-rose-400 mr-2">•</span>
                  Ignores specific refund request
                </li>
                <li className="flex items-start">
                  <span className="text-rose-400 mr-2">•</span>
                  Places burden on customer to direct resolution
                </li>
              </ul>
            </div>

            <div className="bg-orange-900/15 border border-orange-700/30 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">Business Impact:</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                This response likely escalates customer frustration and could result in negative reviews, 
                social media complaints, or lost customer relationships. The lack of professional 
                authority undermines brand credibility.
              </p>
            </div>

            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium mb-2 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Solution Preview:</span>
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Through structured prompt engineering, we can transform this interaction into a 
                professional resolution that addresses customer concerns, maintains brand integrity, 
                and follows established service protocols.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={onComplete}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 border border-slate-600"
              >
                <span>Begin Structured Approach</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterDemo;
