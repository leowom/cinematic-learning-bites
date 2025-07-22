import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, Activity, TrendingUp, Clock, Mail, 
  Calendar, MessageSquare, CheckCircle, XCircle,
  BarChart3, Download, UserCheck, UserX, Shield,
  Settings, Globe, Zap, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdvancedUserData {
  id: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
  updated_at: string;
  lessons_started: number;
  lessons_completed: number;
  courses_enrolled: number;
  last_activity: string;
  completion_rate: number;
  avg_session_duration: number;
  streak_days: number;
  total_points: number;
}

interface BulkAction {
  type: 'role' | 'course' | 'notification';
  value: string;
  users: string[];
}

const AdvancedUserManagement = () => {
  const [users, setUsers] = useState<AdvancedUserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
    averageEngagement: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAdvancedUserData();
    loadUserAnalytics();
  }, []);

  const loadAdvancedUserData = async () => {
    try {
      // Direct query approach instead of RPC
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `);

      const { data: progressData } = await supabase
        .from('user_progress')
        .select(`
          user_id,
          completed,
          last_accessed_at,
          lesson_id
        `);

      const { data: enrollmentData } = await supabase
        .from('user_enrollments')
        .select(`
          user_id,
          course_id,
          progress_percentage
        `);

      // Process data to create advanced analytics
      const processedUsers = profiles?.map(profile => {
        const userProgress = progressData?.filter(p => p.user_id === profile.id) || [];
        const userEnrollments = enrollmentData?.filter(e => e.user_id === profile.id) || [];
        
        const lessons_started = userProgress.length;
        const lessons_completed = userProgress.filter(p => p.completed).length;
        const completion_rate = lessons_started > 0 ? (lessons_completed / lessons_started) * 100 : 0;
        const last_activity = userProgress.reduce((latest, current) => {
          return new Date(current.last_accessed_at) > new Date(latest) ? current.last_accessed_at : latest;
        }, profile.created_at);

        return {
          ...profile,
          lessons_started,
          lessons_completed,
          courses_enrolled: userEnrollments.length,
          last_activity,
          completion_rate: Math.round(completion_rate),
          avg_session_duration: Math.floor(Math.random() * 45) + 15, // Mock data
          streak_days: Math.floor(Math.random() * 14), // Mock data
          total_points: lessons_completed * 100 + userEnrollments.length * 50 // Mock calculation
        };
      }) || [];

      setUsers(processedUsers);
    } catch (error) {
      console.error('Error loading advanced user data:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati avanzati degli utenti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserAnalytics = async () => {
    try {
      const totalUsers = users.length;
      const activeUsers = users.filter(user => {
        const lastActivity = new Date(user.last_activity);
        const daysAgo = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 7;
      }).length;

      const completionRate = users.reduce((acc, user) => acc + user.completion_rate, 0) / totalUsers || 0;
      const averageEngagement = users.reduce((acc, user) => acc + user.streak_days, 0) / totalUsers || 0;

      setAnalytics({
        totalUsers,
        activeUsers,
        completionRate: Math.round(completionRate),
        averageEngagement: Math.round(averageEngagement)
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleBulkSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    try {
      switch (bulkAction.type) {
        case 'role':
          const { error: roleError } = await supabase
            .from('profiles')
            .update({ role: bulkAction.value as any })
            .in('id', selectedUsers);
          
          if (roleError) throw roleError;
          break;

        case 'course':
          const enrollments = selectedUsers.map(userId => ({
            user_id: userId,
            course_id: bulkAction.value,
            status: 'active',
            progress_percentage: 0
          }));

          const { error: enrollError } = await supabase
            .from('user_enrollments')
            .insert(enrollments);
          
          if (enrollError) throw enrollError;
          break;

        case 'notification':
          // Mock notification system - in real implementation, 
          // this would trigger email/push notifications
          console.log(`Sending "${bulkAction.value}" to ${selectedUsers.length} users`);
          break;
      }

      await loadAdvancedUserData();
      setSelectedUsers([]);
      setBulkAction(null);
      setShowBulkDialog(false);
      
      toast({
        title: "Successo",
        description: `Azione applicata a ${selectedUsers.length} utenti`,
      });
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast({
        title: "Errore",
        description: "Impossibile eseguire l'azione in massa",
        variant: "destructive",
      });
    }
  };

  const exportUserData = () => {
    const csvData = users.map(user => ({
      'Nome': `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      'Email': user.id, // Using ID as email placeholder
      'Ruolo': user.role,
      'Lezioni Iniziate': user.lessons_started,
      'Lezioni Completate': user.lessons_completed,
      'Tasso Completamento (%)': user.completion_rate,
      'Corsi Iscritti': user.courses_enrolled,
      'Punti Totali': user.total_points,
      'Data Registrazione': new Date(user.created_at).toLocaleDateString('it-IT'),
      'Ultima Attività': new Date(user.last_activity).toLocaleDateString('it-IT')
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utenti-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getUserStatusColor = (user: AdvancedUserData) => {
    const daysSinceLastActivity = (Date.now() - new Date(user.last_activity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity <= 1) return 'text-green-500';
    if (daysSinceLastActivity <= 7) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Analytics */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestione Utenti Avanzata</h1>
        <p className="text-gray-600">Panoramica completa, analytics e gestione in massa degli utenti</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utenti Totali</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utenti Attivi</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</p>
                <p className="text-xs text-gray-500">Ultimi 7 giorni</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasso Completamento</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Medio</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageEngagement}</p>
                <p className="text-xs text-gray-500">giorni di streak</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedUsers.length > 0 && (
        <Alert>
          <Shield className="w-4 h-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{selectedUsers.length} utenti selezionati</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowBulkDialog(true)}
                >
                  Azioni in Massa
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUsers([])}
                >
                  Deseleziona Tutto
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Dettaglio Utenti
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportUserData}>
                <Download className="w-4 h-4 mr-2" />
                Esporta CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedUsers(
                  selectedUsers.length === users.length ? [] : users.map(u => u.id)
                )}
              >
                {selectedUsers.length === users.length ? 'Deseleziona Tutto' : 'Seleziona Tutto'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={() => setSelectedUsers(
                        selectedUsers.length === users.length ? [] : users.map(u => u.id)
                      )}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-4">Utente</th>
                  <th className="text-left p-4">Ruolo</th>
                  <th className="text-left p-4">Progresso</th>
                  <th className="text-left p-4">Engagement</th>
                  <th className="text-left p-4">Ultima Attività</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleBulkSelection(user.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {(user.first_name?.[0] || user.id[0]).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : 'Nome non disponibile'
                            }
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={
                        user.role === 'admin' ? 'border-red-300 text-red-700' :
                        user.role === 'instructor' ? 'border-blue-300 text-blue-700' :
                        'border-green-300 text-green-700'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{user.lessons_completed}/{user.lessons_started}</span>
                          <span className="text-gray-500">{user.completion_rate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${user.completion_rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{user.streak_days}</span> giorni streak
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.total_points} punti
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">
                        {new Date(user.last_activity).toLocaleDateString('it-IT')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 ${getUserStatusColor(user)}`}>
                        {(() => {
                          const days = (Date.now() - new Date(user.last_activity).getTime()) / (1000 * 60 * 60 * 24);
                          if (days <= 1) return <><CheckCircle className="w-4 h-4" /> Online</>;
                          if (days <= 7) return <><Clock className="w-4 h-4" /> Attivo</>;
                          return <><XCircle className="w-4 h-4" /> Inattivo</>;
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Azioni in Massa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo di Azione</Label>
              <Tabs defaultValue="role" onValueChange={(value) => setBulkAction(prev => ({ ...prev, type: value as any }))}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="role">Ruolo</TabsTrigger>
                  <TabsTrigger value="course">Corso</TabsTrigger>
                  <TabsTrigger value="notification">Notifica</TabsTrigger>
                </TabsList>
                <TabsContent value="role" className="space-y-2">
                  <Select onValueChange={(value) => setBulkAction(prev => ({ ...prev, value, type: 'role' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona nuovo ruolo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Studente</SelectItem>
                      <SelectItem value="instructor">Istruttore</SelectItem>
                      <SelectItem value="admin">Amministratore</SelectItem>
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="course" className="space-y-2">
                  <Select onValueChange={(value) => setBulkAction(prev => ({ ...prev, value, type: 'course' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona corso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prompting-course">Corso Prompting</SelectItem>
                      <SelectItem value="ai-fundamentals">AI Fundamentals</SelectItem>
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="notification" className="space-y-2">
                  <Select onValueChange={(value) => setBulkAction(prev => ({ ...prev, value, type: 'notification' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo notifica" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Messaggio di Benvenuto</SelectItem>
                      <SelectItem value="course-reminder">Promemoria Corso</SelectItem>
                      <SelectItem value="completion-congratulations">Congratulazioni Completamento</SelectItem>
                    </SelectContent>
                  </Select>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                Annulla
              </Button>
              <Button 
                onClick={executeBulkAction}
                disabled={!bulkAction?.value}
              >
                Applica a {selectedUsers.length} Utenti
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedUserManagement;