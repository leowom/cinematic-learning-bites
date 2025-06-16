
import React from 'react';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, Target, Zap, FileText, Settings } from 'lucide-react';

interface Props {
  onClose: () => void;
  finalScore: number;
}

const CompletionModal: React.FC<Props> = ({ onClose, finalScore }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-xl p-8 max-w-md mx-4 shadow-2xl shadow-black/40">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-800/10 to-transparent pointer-events-none" />
        
        <div className="text-center relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-12 h-12 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-4">
            Training Module Completed
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            You have successfully completed the prompt engineering curriculum. Your prompt is now optimized for professional-grade results.
          </p>
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <div className="text-sm text-slate-400 mb-2">Quality Improvement:</div>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-rose-400 text-xs mb-1">INITIAL</div>
                <div className="text-rose-400 font-bold text-xl">2.0/10</div>
                <div className="text-rose-400/60 text-xs">Generic prompt</div>
              </div>
              <div className="text-slate-400 text-2xl">→</div>
              <div className="text-center">
                <div className="text-emerald-300 text-xs mb-1">OPTIMIZED</div>
                <div className="text-emerald-300 font-bold text-xl">9.2/10</div>
                <div className="text-emerald-300/60 text-xs">Professional prompt</div>
              </div>
            </div>
          </div>
          
          {/* Achievement metrics */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-2">
              <div className="flex items-center space-x-1 text-slate-300 font-medium">
                <Target className="w-3 h-3" />
                <span>Accuracy</span>
              </div>
              <div className="text-slate-400">+40% precision</div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-2">
              <div className="flex items-center space-x-1 text-slate-300 font-medium">
                <Zap className="w-3 h-3" />
                <span>Efficiency</span>
              </div>
              <div className="text-slate-400">-60% iteration time</div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-2">
              <div className="flex items-center space-x-1 text-slate-300 font-medium">
                <Settings className="w-3 h-3" />
                <span>Consistency</span>
              </div>
              <div className="text-slate-400">Standardized output</div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-2">
              <div className="flex items-center space-x-1 text-slate-300 font-medium">
                <FileText className="w-3 h-3" />
                <span>Structure</span>
              </div>
              <div className="text-slate-400">Optimal format</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 rounded-lg font-medium transition-all duration-300 border border-slate-600"
              onClick={() => {
                // Save template logic here
                onClose();
              }}
            >
              Save Prompt Template
            </Button>
            <Button
              className="w-full bg-slate-800 text-slate-300 py-3 rounded-lg font-medium hover:bg-slate-700 transition-all duration-300 border border-slate-700"
              onClick={onClose}
            >
              Continue to Next Module
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
