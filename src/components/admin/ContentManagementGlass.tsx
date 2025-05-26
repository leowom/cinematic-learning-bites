
import React, { useState } from 'react';
import { Upload, Edit, Copy, Trash2, Eye, Filter, Plus } from 'lucide-react';
import GlassmorphismCard from '@/components/GlassmorphismCard';

const ContentManagementGlass = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Introduzione al Machine Learning',
      status: 'published',
      category: 'AI Fundamentals',
      created: '2024-01-15',
      students: 234
    },
    {
      id: 2,
      title: 'Deep Learning Avanzato',
      status: 'draft',
      category: 'Advanced AI',
      created: '2024-01-14',
      students: 0
    },
    {
      id: 3,
      title: 'Computer Vision Pratico',
      status: 'review',
      category: 'Specialized AI',
      created: '2024-01-13',
      students: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'review': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Content Management</h2>
        <p className="text-blue-200/80">Gestione enterprise dei corsi e contenuti AI</p>
      </div>

      {/* Upload & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* AI Upload Glassmorphism */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Upload Content</h3>
            <p className="text-blue-200/80 mb-6">Drag & drop files per Claude processing</p>
            
            <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer">
              <p className="text-blue-200/80">Drop files here o click per selezionare</p>
              <p className="text-blue-200/60 text-sm mt-2">PDF, DOCX, TXT supportati</p>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Processing Workflow */}
        <GlassmorphismCard className="admin-bentobox" size="large">
          <h3 className="text-xl font-bold text-white mb-4">AI Processing Workflow</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-blue-100">1. Upload & Analysis</span>
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-blue-100">2. Claude Processing</span>
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-blue-100">3. Review & Approval</span>
              <div className="w-3 h-3 rounded-full bg-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-blue-100">4. Publish & Deploy</span>
              <div className="w-3 h-3 rounded-full bg-gray-400" />
            </div>
          </div>
        </GlassmorphismCard>
      </div>

      {/* Course Library */}
      <GlassmorphismCard className="admin-bentobox" size="large">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Course Library</h3>
          
          <div className="flex items-center space-x-4">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-200" />
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-blue-100 text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="all">Tutti</option>
                <option value="published">Pubblicati</option>
                <option value="draft">Bozze</option>
                <option value="review">In Review</option>
              </select>
            </div>
            
            <button className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg px-4 py-2 text-blue-100 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Nuovo Corso</span>
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="text-white font-medium">{course.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-blue-200/60">
                  <span>{course.category}</span>
                  <span>•</span>
                  <span>{course.created}</span>
                  <span>•</span>
                  <span>{course.students} studenti</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default ContentManagementGlass;
