import React, { useState } from 'react';
import { Home, Users, BookOpen, BarChart3, Settings, Plus, FileText, Trophy, Clock, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import CourseSidebar from '@/components/CourseSidebar';

const AdminDashboardLMS = () => {
  const navigate = useNavigate();
  const { userProfile, canManageContent, loading } = useUserRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect if not authorized
  if (!loading && !canManageContent()) {
    navigate('/dashboard');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  // Mock data - will be replaced with real data later
  const stats = {
    totalStudents: 156,
    activeCourses: 8,
    completionRate: 74,
    avgQuizScore: 86
  };

  const recentActivities = [
    { id: 1, type: 'course_completed', user: 'Maria Rossi', course: 'Prompt Engineering Lab', time: '2 ore fa' },
    { id: 2, type: 'quiz_failed', user: 'Giuseppe Verdi', course: 'AI Basics', score: 45, time: '4 ore fa' },
    { id: 3, type: 'new_enrollment', user: 'Laura Bianchi', course: 'Advanced AI', time: '6 ore fa' },
    { id: 4, type: 'course_created', user: 'Admin', course: 'Machine Learning Fundamentals', time: '1 giorno fa' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_completed': return <Trophy className="w-4 h-4 text-emerald-500" />;
      case 'quiz_failed': return <FileText className="w-4 h-4 text-red-500" />;
      case 'new_enrollment': return <Users className="w-4 h-4 text-blue-500" />;
      case 'course_created': return <BookOpen className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="prompt-lab-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard Studenti
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium">
              Dashboard Amministrazione LMS
            </div>
            <div className="text-slate-400 text-sm">
              Benvenuto, {userProfile?.first_name || 'Admin'}
            </div>
          </div>

          <div className="text-right">
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">
              {canManageContent() ? 'Amministratore' : 'Utente'}
            </Badge>
          </div>
        </div>

        <div className="flex gap-6 relative">
          <CourseSidebar 
            currentModuleId="admin"
            currentLessonId={0}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-12 gap-6">
              
              {/* Quick Stats */}
              <div className="col-span-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Studenti Totali</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-400">{stats.totalStudents}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Corsi Attivi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-400">{stats.activeCourses}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Tasso Completamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-400">{stats.completionRate}%</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Punteggio Medio Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-400">{stats.avgQuizScore}%</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-span-12 lg:col-span-8">
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white">Azioni Rapide</CardTitle>
                    <CardDescription className="text-slate-400">
                      Gestisci contenuti e utenti della piattaforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => navigate('/admin/course-builder')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-20 flex-col"
                      >
                        <BookOpen className="w-6 h-6 mb-2" />
                        Crea Nuovo Corso
                      </Button>

                      <Button 
                        onClick={() => navigate('/admin/quiz-builder')}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex-col"
                      >
                        <FileText className="w-6 h-6 mb-2" />
                        Crea Quiz
                      </Button>

                      <Button 
                        onClick={() => navigate('/admin/users')}
                        className="bg-purple-600 hover:bg-purple-700 text-white h-20 flex-col"
                      >
                        <Users className="w-6 h-6 mb-2" />
                        Gestisci Utenti
                      </Button>

                      <Button 
                        onClick={() => navigate('/admin/learning-paths')}
                        className="bg-orange-600 hover:bg-orange-700 text-white h-20 flex-col"
                      >
                        <Target className="w-6 h-6 mb-2" />
                        Learning Paths
                      </Button>

                      <Button 
                        onClick={() => navigate('/admin/analytics')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white h-20 flex-col"
                      >
                        <BarChart3 className="w-6 h-6 mb-2" />
                        Analytics
                      </Button>

                      <Button 
                        onClick={() => navigate('/admin/scheduler')}
                        className="bg-pink-600 hover:bg-pink-700 text-white h-20 flex-col"
                      >
                        <Calendar className="w-6 h-6 mb-2" />
                        Live Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <div className="col-span-12 lg:col-span-4">
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white">Attività Recenti</CardTitle>
                    <CardDescription className="text-slate-400">
                      Ultimi eventi sulla piattaforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-200">
                              <span className="font-medium">{activity.user}</span>
                              {activity.type === 'course_completed' && ' ha completato '}
                              {activity.type === 'quiz_failed' && ' ha fallito il quiz '}
                              {activity.type === 'new_enrollment' && ' si è iscritto a '}
                              {activity.type === 'course_created' && ' ha creato '}
                              <span className="font-medium">{activity.course}</span>
                              {activity.score && (
                                <span className="text-red-400"> (Punteggio: {activity.score}%)</span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Coming Soon Features */}
              <div className="col-span-12">
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white">Funzionalità in Sviluppo</CardTitle>
                    <CardDescription className="text-slate-400">
                      Roadmap delle prossime implementazioni
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-emerald-500">
                        <h4 className="font-medium text-emerald-300 mb-2">Fase 1 - Fondamenta LMS</h4>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>✅ Sistema ruoli utente</li>
                          <li>🔄 Course Builder visuale</li>
                          <li>🔄 Quiz e Assessments</li>
                          <li>⏳ Learning Paths personalizzati</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-300 mb-2">Fase 2 - AI e Automazione</h4>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>⏳ Personal AI Tutor</li>
                          <li>⏳ Content Creation AI-Assisted</li>
                          <li>⏳ Automazioni apprendimento</li>
                          <li>⏳ Knowledge Base intelligente</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-medium text-purple-300 mb-2">Fase 3 - Analytics Avanzati</h4>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>⏳ Dashboard manager avanzate</li>
                          <li>⏳ Feedback Loop AI</li>
                          <li>⏳ A/B Testing</li>
                          <li>⏳ Continuous Improvement</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLMS;