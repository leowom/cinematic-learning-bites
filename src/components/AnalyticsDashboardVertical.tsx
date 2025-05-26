
import React, { useEffect } from 'react';
import AnalyticsHeader from './analytics/AnalyticsHeader';
import ExecutiveSummary from './analytics/ExecutiveSummary';
import CoreAnalyticsBentobox from './analytics/CoreAnalyticsBentobox';
import DetailedAnalyticsSection from './analytics/DetailedAnalyticsSection';
import ExportActions from './analytics/ExportActions';

const AnalyticsDashboardVertical = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('analytics-reveal');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.analytics-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-x-hidden">
      {/* Minimal ambient background for enterprise look */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-600/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-emerald-500/3 rounded-full blur-2xl" />
      </div>

      {/* Analytics Dashboard Content */}
      <div className="relative z-10">
        {/* Analytics Header */}
        <section className="analytics-section sticky top-0 z-40 mb-8">
          <AnalyticsHeader />
        </section>

        {/* Executive Summary */}
        <section className="analytics-section px-6 mb-12">
          <ExecutiveSummary />
        </section>

        {/* Core Analytics Bentobox */}
        <section className="analytics-section px-6 mb-12">
          <CoreAnalyticsBentobox />
        </section>

        {/* Detailed Analytics */}
        <section className="analytics-section px-6 mb-12">
          <DetailedAnalyticsSection />
        </section>

        {/* Export Actions */}
        <section className="analytics-section px-6 pb-20">
          <ExportActions />
        </section>
      </div>
    </div>
  );
};

export default AnalyticsDashboardVertical;
