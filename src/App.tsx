
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import PromptEngineeringLab from "./pages/PromptEngineeringLab";
import AITransformationDay1 from "./pages/AITransformationDay1";
import IntroduzioneCourse from "./pages/IntroduzioneCourse";
import LLMFundamentals from "./pages/LLMFundamentals";
import AITutorialInteractive from "./pages/AITutorialInteractive";
import PromptingCourse from "./pages/PromptingCourse";
import ContestoExercise from "./pages/ContestoExercise";
import FormatControl from "./pages/FormatControl";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/prompt-lab" element={<PromptEngineeringLab />} />
            <Route path="/ai-transformation-day1" element={<AITransformationDay1 />} />
            <Route path="/introduzione" element={<IntroduzioneCourse />} />
            <Route path="/llm-fundamentals" element={<LLMFundamentals />} />
            <Route path="/ai-tutorial-interactive" element={<AITutorialInteractive />} />
            <Route path="/prompting" element={<PromptingCourse />} />
            <Route path="/contesto" element={<ContestoExercise />} />
            <Route path="/ai-interactive/format-control" element={<FormatControl />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
