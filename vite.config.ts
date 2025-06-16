
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance optimizations
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-toast', 'lucide-react'],
          'query-vendor': ['@tanstack/react-query'],
          'chart-vendor': ['recharts'],
          // Feature chunks
          'onboarding': [
            './src/components/onboarding/WelcomeStep',
            './src/components/onboarding/ProfileBuilderStep',
            './src/components/onboarding/AssessmentStep',
            './src/components/onboarding/PersonalizationStep'
          ],
          'admin': ['./src/pages/AdminDashboard', './src/components/AdminDashboardVertical'],
          'analytics': ['./src/pages/Analytics', './src/components/AnalyticsDashboardVertical']
        }
      }
    },
    // Enable compression and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps only in development
    sourcemap: mode === 'development'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    exclude: ['@radix-ui/react-accordion'] // Large unused components
  }
}));
