
import { lazy } from 'react';

// Lazy load heavy components to improve initial bundle size
export const LazyAdminDashboard = lazy(() => import('../pages/AdminDashboard'));
export const LazyAnalytics = lazy(() => import('../pages/Analytics'));
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));

// Lazy load onboarding steps for better code splitting
export const LazyPersonalizationStep = lazy(() => import('./onboarding/PersonalizationStep'));
export const LazyAssessmentStep = lazy(() => import('./onboarding/AssessmentStep'));
