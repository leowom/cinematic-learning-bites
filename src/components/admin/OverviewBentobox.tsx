
import React from 'react';
import { BookOpen, Users, Brain, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import GlassmorphismCard from '@/components/GlassmorphismCard';

const OverviewBentobox = () => {
  const stats = [
    {
      title: 'Corsi Attivi',
      value: '24',
      change: '+3 questa settimana',
      icon: BookOpen,
      color: 'from-blue-500/20 to-blue-600/10'
    },
    {
      title: 'Utenti Attivi',
      value: '1,847',
      change: '+127 questo mese',
      icon: Users,
      color: 'from-green-500/20 to-green-600/10'
    },
    {
      title: 'AI Processing',
      value: '12',
      change: 'In coda',
      icon: Brain,
      color: 'from-amber-500/20 to-amber-600/10'
    }
  ];

  const recentActivities = [
    { action: 'Nuovo corso pubblicato', time: '2 ore fa', status: 'success' },
    { action: 'Claude processing completato', time: '4 ore fa', status: 'success' },
    { action: 'Review richiesta', time: '1 giorno fa', status: 'pending' },
    { action: 'Utente registrato', time: '2 giorni fa', status: 'info' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Panoramica Enterprise</h2>
        <p className="text-blue-200/80">Metriche administrative e performance insights</p>
      </div>

      {/* Stats Bentobox Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <GlassmorphismCard 
            key={index}
            className="admin-bentobox hover:scale-105 transition-all duration-300"
            size="large"
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-50`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-blue-200" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <p className="text-blue-200/80 font-medium">{stat.title}</p>
                <p className="text-green-400/80 text-sm">{stat.change}</p>
              </div>
            </div>
          </GlassmorphismCard>
        ))}
      </div>

      {/* Activity & Processing Bentobox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Attività Recenti</h3>
            <p className="text-blue-200/80 text-sm">Administrative actions e system events</p>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                  <span className="text-blue-100 text-sm">{activity.action}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-200/60" />
                  <span className="text-blue-200/60 text-xs">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassmorphismCard>

        {/* AI Processing Status */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Claude AI Status</h3>
            <p className="text-blue-200/80 text-sm">Processing workflow e system performance</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20">
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-amber-400" />
                <div>
                  <p className="text-white font-medium">Processing Queue</p>
                  <p className="text-amber-200/80 text-sm">12 corsi in elaborazione</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-amber-400 font-bold">~8 min</p>
                <p className="text-amber-200/60 text-xs">ETA completion</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-medium">Completati Oggi</p>
                  <p className="text-green-200/80 text-sm">47 corsi processati</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold">98.5%</p>
                <p className="text-green-200/60 text-xs">Success rate</p>
              </div>
            </div>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
};

export default OverviewBentobox;
