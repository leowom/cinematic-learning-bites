
import React from 'react';
import { Bell, Settings, User, ChevronRight } from 'lucide-react';
import GlassmorphismCard from '@/components/GlassmorphismCard';

const AdminHeader = () => {
  return (
    <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Admin Identity */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-200/80 text-sm">Learning Bites Management</p>
            </div>
          </div>

          {/* Professional Breadcrumbs */}
          <div className="hidden md:flex items-center space-x-2 text-blue-200/60 text-sm">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Overview</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <GlassmorphismCard size="small" className="p-2 hover:scale-105 transition-transform cursor-pointer">
              <Bell className="w-5 h-5 text-blue-200" />
            </GlassmorphismCard>
            
            <GlassmorphismCard size="small" className="p-2 hover:scale-105 transition-transform cursor-pointer">
              <Settings className="w-5 h-5 text-blue-200" />
            </GlassmorphismCard>

            <GlassmorphismCard size="small" className="flex items-center space-x-2 px-3 py-2">
              <User className="w-4 h-4 text-blue-200" />
              <span className="text-blue-100 text-sm font-medium">Admin</span>
            </GlassmorphismCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
