
import React, { useState, useEffect } from 'react';
import AdminHeader from './admin/AdminHeader';
import OverviewBentobox from './admin/OverviewBentobox';
import ContentManagementGlass from './admin/ContentManagementGlass';
import UserManagementGlass from './admin/UserManagementGlass';
import SystemSettingsGlass from './admin/SystemSettingsGlass';

const AdminDashboardVertical = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('admin-reveal');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.admin-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-x-hidden">
      {/* Enterprise Background Ambient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/5 left-1/5 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/6 rounded-full blur-2xl animate-float" />
        <div className="absolute top-3/5 left-1/2 w-64 h-64 bg-green-500/4 rounded-full blur-xl animate-glow" />
      </div>

      {/* Admin Dashboard Content */}
      <div className="relative z-10">
        {/* Admin Header */}
        <section className="admin-section sticky top-0 z-40 mb-8">
          <AdminHeader />
        </section>

        {/* Overview Bentobox */}
        <section className="admin-section px-6 mb-12">
          <OverviewBentobox />
        </section>

        {/* Content Management */}
        <section className="admin-section px-6 mb-12">
          <ContentManagementGlass />
        </section>

        {/* User Management */}
        <section className="admin-section px-6 mb-12">
          <UserManagementGlass />
        </section>

        {/* System Settings */}
        <section className="admin-section px-6 pb-20">
          <SystemSettingsGlass />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardVertical;
