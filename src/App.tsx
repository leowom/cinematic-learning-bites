
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import LoadingScreen from "./components/LoadingScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthGuard } from "./components/AuthGuard";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardLMS from "./pages/AdminDashboardLMS";
import CourseBuilder from "./pages/CourseBuilder";
import CourseBuilderAI from "./pages/CourseBuilderAI";
import QuizBuilder from "./pages/QuizBuilder";
import UserManagement from "./pages/UserManagement";
import LearningPaths from "./pages/LearningPaths";
import ContentLibrary from "./components/ContentLibrary";
import AITutor from "./pages/AITutor";
import LiveSessionScheduler from "./pages/LiveSessionScheduler";
import LearningAutomations from "./pages/LearningAutomations";
import Auth from "./pages/Auth";
import PromptEngineeringLab from "./pages/PromptEngineeringLab";
import AITransformationDay1 from "./pages/AITransformationDay1";
import IntroduzioneCourse from "./pages/IntroduzioneCourse";
import LLMFundamentals from "./pages/LLMFundamentals";
import AITutorialInteractive from "./pages/AITutorialInteractive";
import PromptingCourse from "./pages/PromptingCourse";
import ContestoExercise from "./pages/ContestoExercise";
import FormatControl from "./pages/FormatControl";
import RoleInstruction from "./pages/RoleInstruction";
import EditOutput from "./pages/EditOutput";
import Module3PDFPrompt from "./pages/Module3PDFPrompt";
import Module3ImageGenerator from "./pages/Module3ImageGenerator";
import Module3CodeByPrompt from "./pages/Module3CodeByPrompt";
import AIWorkHelper from "./pages/AIWorkHelper";
import PromptIteration from "./pages/PromptIteration";
import Settings from "./pages/Settings";
import CourseIndex from "./pages/CourseIndex";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
            <Routes>
              <Route path="/" element={<AuthGuard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin-lms" element={<ProtectedRoute><AdminDashboardLMS /></ProtectedRoute>} />
              <Route path="/admin/course-builder" element={<ProtectedRoute><CourseBuilder /></ProtectedRoute>} />
              <Route path="/admin/course-builder-ai" element={<ProtectedRoute><CourseBuilderAI /></ProtectedRoute>} />
              <Route path="/admin/quiz-builder" element={<ProtectedRoute><QuizBuilder /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/learning-paths" element={<ProtectedRoute><LearningPaths /></ProtectedRoute>} />
              <Route path="/content-library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
              <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
              <Route path="/live-sessions" element={<ProtectedRoute><LiveSessionScheduler /></ProtectedRoute>} />
              <Route path="/learning-automations" element={<ProtectedRoute><LearningAutomations /></ProtectedRoute>} />
              <Route path="/course-index" element={<ProtectedRoute><CourseIndex /></ProtectedRoute>} />
              <Route path="/prompt-lab" element={<ProtectedRoute><PromptEngineeringLab /></ProtectedRoute>} />
              <Route path="/ai-transformation-day1" element={<ProtectedRoute><AITransformationDay1 /></ProtectedRoute>} />
              <Route path="/introduzione" element={<ProtectedRoute><IntroduzioneCourse /></ProtectedRoute>} />
              <Route path="/llm-fundamentals" element={<ProtectedRoute><LLMFundamentals /></ProtectedRoute>} />
              <Route path="/ai-tutorial-interactive" element={<ProtectedRoute><AITutorialInteractive /></ProtectedRoute>} />
              <Route path="/prompting" element={<ProtectedRoute><PromptingCourse /></ProtectedRoute>} />
              <Route path="/contesto" element={<ProtectedRoute><ContestoExercise /></ProtectedRoute>} />
              <Route path="/ai-interactive/format-control" element={<ProtectedRoute><FormatControl /></ProtectedRoute>} />
              <Route path="/ai-interactive/role-instruction" element={<ProtectedRoute><RoleInstruction /></ProtectedRoute>} />
              <Route path="/ai-interactive/edit-output" element={<ProtectedRoute><EditOutput /></ProtectedRoute>} />
              <Route path="/module3-pdf-prompt" element={<ProtectedRoute><Module3PDFPrompt /></ProtectedRoute>} />
              <Route path="/module3-image-generator" element={<ProtectedRoute><Module3ImageGenerator /></ProtectedRoute>} />
              <Route path="/module3-code-by-prompt" element={<ProtectedRoute><Module3CodeByPrompt /></ProtectedRoute>} />
              <Route path="/ai-work-helper" element={<ProtectedRoute><AIWorkHelper /></ProtectedRoute>} />
              <Route path="/prompt-iteration" element={<ProtectedRoute><PromptIteration /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
