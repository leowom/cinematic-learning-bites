
import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import DashboardVertical from '@/components/DashboardVertical';
import { useUserRole } from '@/hooks/useUserRole';

const Dashboard = () => {
  const navigate = useNavigate();
  const { canManageContent, userProfile, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Admin Panel Access Button */}
      {canManageContent() && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => navigate('/admin-lms')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            size="sm"
          >
            <Shield className="w-4 h-4 mr-2" />
            Dashboard LMS Admin
          </Button>
        </div>
      )}
      
      <DashboardVertical />
    </div>
  );
};

export default Dashboard;
