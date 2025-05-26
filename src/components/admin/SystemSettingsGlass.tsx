
import React, { useState } from 'react';
import { Server, Database, Shield, Zap, Monitor, AlertTriangle } from 'lucide-react';
import GlassmorphismCard from '@/components/GlassmorphismCard';

const SystemSettingsGlass = () => {
  const [aiProcessingEnabled, setAiProcessingEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const systemHealth = [
    { name: 'API Server', status: 'healthy', uptime: '99.9%', icon: Server },
    { name: 'Database', status: 'healthy', uptime: '99.8%', icon: Database },
    { name: 'Claude AI', status: 'healthy', uptime: '98.5%', icon: Zap },
    { name: 'Security', status: 'healthy', uptime: '100%', icon: Shield }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">System Settings</h2>
        <p className="text-blue-200/80">Enterprise configuration e system monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health Monitor */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <div className="flex items-center space-x-3 mb-6">
            <Monitor className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">System Health</h3>
          </div>
          
          <div className="space-y-4">
            {systemHealth.map((system, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <system.icon className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100 font-medium">{system.name}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-blue-200/60 text-sm">{system.uptime}</span>
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(system.status)}`}>
                    {system.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-blue-100 font-medium">Overall System Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-green-400 font-medium">Operational</span>
              </div>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Configuration Settings */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <h3 className="text-xl font-bold text-white mb-6">Enterprise Configuration</h3>
          
          <div className="space-y-6">
            {/* AI Processing Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <h4 className="text-blue-100 font-medium">Claude AI Processing</h4>
                <p className="text-blue-200/60 text-sm">Enable automatic content processing</p>
              </div>
              <button
                onClick={() => setAiProcessingEnabled(!aiProcessingEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  aiProcessingEnabled ? 'bg-blue-600' : 'bg-gray-600'
                } relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  aiProcessingEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <h4 className="text-blue-100 font-medium">Maintenance Mode</h4>
                <p className="text-blue-200/60 text-sm">Restrict access during updates</p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  maintenanceMode ? 'bg-amber-600' : 'bg-gray-600'
                } relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Security Settings */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <h4 className="text-blue-100 font-medium">Security Settings</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200/80">Two-Factor Auth</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200/80">SSL Certificate</span>
                  <span className="text-green-400">Valid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200/80">Data Encryption</span>
                  <span className="text-green-400">AES-256</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="text-amber-100 font-medium">System Alerts</h4>
              </div>
              <p className="text-amber-200/80 text-sm">
                Scheduled maintenance: domenica 2:00-4:00 AM
              </p>
            </div>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
};

export default SystemSettingsGlass;
