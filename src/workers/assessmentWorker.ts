
// Web Worker for heavy AI calculations to prevent main thread blocking
interface AnalysisRequest {
  answers: Record<number, string>;
}

interface AnalysisResult {
  workflow: string;
  scores: Record<string, number>;
  profile: {
    dominantStyle: string;
    adaptability: string;
  };
}

self.onmessage = function(e: MessageEvent<AnalysisRequest>) {
  const { answers } = e.data;
  
  // AI Logic for Workflow Assignment (moved from main thread)
  const scores = {
    'learn-by-doing': 0,
    'microlearning': 0,
    'problem-solution': 0
  };

  // Analyze each answer and assign scores
  Object.entries(answers).forEach(([questionIndex, answerId]) => {
    const qIndex = parseInt(questionIndex);
    
    switch (qIndex) {
      case 0: // Approach to new learning
        if (answerId === 'practical') scores['learn-by-doing'] += 3;
        if (answerId === 'documentation') scores['microlearning'] += 3;
        if (answerId === 'experiment') scores['problem-solution'] += 3;
        break;
      case 1: // Memory concepts
        if (answerId === 'hands-on') scores['learn-by-doing'] += 2;
        if (answerId === 'visual' || answerId === 'notes') scores['microlearning'] += 2;
        if (answerId === 'audio') scores['problem-solution'] += 1;
        break;
      case 2: // Learning strategy
        if (answerId === 'step-by-step') scores['microlearning'] += 3;
        if (answerId === 'overview') scores['problem-solution'] += 3;
        if (answerId === 'mixed') {
          scores['learn-by-doing'] += 1;
          scores['microlearning'] += 1;
          scores['problem-solution'] += 1;
        }
        break;
      case 3: // Feedback management
        if (answerId === 'reflect') scores['microlearning'] += 2;
        if (answerId === 'immediate') scores['learn-by-doing'] += 2;
        break;
      case 4: // Environment
        if (answerId === 'quiet') scores['microlearning'] += 2;
        if (answerId === 'collaborative') scores['problem-solution'] += 2;
        if (answerId === 'background') scores['learn-by-doing'] += 1;
        break;
      case 5: // Pace
        if (answerId === 'regular') scores['microlearning'] += 2;
        if (answerId === 'intensive') scores['problem-solution'] += 2;
        if (answerId === 'flexible') scores['learn-by-doing'] += 2;
        break;
      case 6: // Motivation
        if (answerId === 'competition') scores['problem-solution'] += 2;
        if (answerId === 'curiosity') scores['learn-by-doing'] += 2;
        if (answerId === 'career' || answerId === 'business') scores['microlearning'] += 1;
        break;
      case 7: // Time available
        if (answerId === 'micro') scores['microlearning'] += 3;
        if (answerId === 'standard') scores['learn-by-doing'] += 2;
        if (answerId === 'deep') scores['problem-solution'] += 2;
        break;
    }
  });

  // Determine winning workflow
  const maxScore = Math.max(...Object.values(scores));
  const winningWorkflow = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore);
  
  const result: AnalysisResult = {
    workflow: winningWorkflow || 'learn-by-doing',
    scores,
    profile: {
      dominantStyle: winningWorkflow || 'learn-by-doing',
      adaptability: scores['learn-by-doing'] > 0 && scores['microlearning'] > 0 && scores['problem-solution'] > 0 ? 'high' : 'moderate'
    }
  };

  // Send result back to main thread
  self.postMessage(result);
};

export {};
