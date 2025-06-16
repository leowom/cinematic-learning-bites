
import React from 'react';
import GlassmorphismCard from './GlassmorphismCard';
import { Skeleton } from './ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Ambient Background Layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 space-y-24 py-16">
        {/* Current Course Section Skeleton */}
        <section className="px-6">
          <GlassmorphismCard size="large" className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-3/4 bg-white/20" />
                  <Skeleton className="h-4 w-1/2 bg-white/20" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full bg-white/20" />
                ))}
              </div>
            </div>
          </GlassmorphismCard>
        </section>

        {/* Bento Grid Skeleton */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 space-y-2">
              <Skeleton className="h-10 w-64 bg-white/20" />
              <Skeleton className="h-6 w-96 bg-white/20" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <GlassmorphismCard key={i} size="medium">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-8 rounded-lg bg-white/20" />
                      <Skeleton className="h-6 w-16 bg-white/20" />
                    </div>
                    <Skeleton className="h-6 w-3/4 bg-white/20" />
                    <Skeleton className="h-4 w-full bg-white/20" />
                    <Skeleton className="h-4 w-2/3 bg-white/20" />
                  </div>
                </GlassmorphismCard>
              ))}
            </div>
          </div>
        </section>

        {/* Floating Actions Skeleton */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto flex justify-center">
            <GlassmorphismCard size="medium" className="w-auto">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
                <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
                <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
              </div>
            </GlassmorphismCard>
          </div>
        </section>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <GlassmorphismCard size="small" className="w-auto">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white/80"></div>
            <span className="text-white/90 text-sm font-medium">Caricamento...</span>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
