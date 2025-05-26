
import React from 'react';
import { Users, UserPlus, Award, TrendingUp, Clock, Star } from 'lucide-react';
import GlassmorphismCard from '@/components/GlassmorphismCard';

const UserManagementGlass = () => {
  const userMetrics = [
    { label: 'Utenti Totali', value: '1,847', change: '+127', icon: Users },
    { label: 'Attivi Oggi', value: '342', change: '+23', icon: TrendingUp },
    { label: 'Completamenti', value: '89', change: '+12', icon: Award },
    { label: 'Tempo Medio', value: '24m', change: '-3m', icon: Clock }
  ];

  const topUsers = [
    { name: 'Marco Rossi', role: 'Data Scientist', courses: 8, progress: 95, achievements: 12 },
    { name: 'Sara Bianchi', role: 'ML Engineer', courses: 6, progress: 87, achievements: 9 },
    { name: 'Luigi Verdi', role: 'AI Researcher', courses: 7, progress: 92, achievements: 11 },
    { name: 'Anna Neri', role: 'Product Manager', courses: 5, progress: 78, achievements: 7 }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
        <p className="text-blue-200/80">Analytics utenti e performance tracking enterprise</p>
      </div>

      {/* User Metrics Bentobox */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {userMetrics.map((metric, index) => (
          <GlassmorphismCard 
            key={index}
            className="admin-bentobox hover:scale-105 transition-all duration-300"
            size="medium"
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="w-6 h-6 text-blue-400" />
              <span className="text-green-400 text-sm font-medium">{metric.change}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-blue-200/80 text-sm">{metric.label}</p>
            </div>
          </GlassmorphismCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Top Performers</h3>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm">Excellence Recognition</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                    <span className="text-white font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{user.name}</h4>
                    <p className="text-blue-200/60 text-sm">{user.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-blue-100 font-medium">{user.courses}</p>
                    <p className="text-blue-200/60">Corsi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 font-medium">{user.progress}%</p>
                    <p className="text-blue-200/60">Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-400 font-medium">{user.achievements}</p>
                    <p className="text-blue-200/60">Awards</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassmorphismCard>

        {/* Administrative Controls */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <h3 className="text-xl font-bold text-white mb-6">Administrative Controls</h3>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <UserPlus className="w-5 h-5" />
                <span>Invita Nuovi Utenti</span>
              </div>
              <span className="text-blue-200/60">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5" />
                <span>Gestisci Achievements</span>
              </div>
              <span className="text-green-200/60">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-100 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5" />
                <span>Export Analytics</span>
              </div>
              <span className="text-amber-200/60">→</span>
            </button>
          </div>

          {/* Subdued Gamification */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-white font-medium mb-4">Achievement System</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200/80">Completamento Corsi</span>
                <span className="text-blue-100">847 awarded</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200/80">Learning Streaks</span>
                <span className="text-blue-100">234 active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200/80">Knowledge Mastery</span>
                <span className="text-blue-100">156 certified</span>
              </div>
            </div>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
};

export default UserManagementGlass;
