import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ArrowLeft, Search, UserPlus, Shield, 
  BookOpen, Award, Calendar, MoreHorizontal, 
  Edit3, Trash2, Eye, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserEnrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  progress_percentage: number;
  status: string;
  course_title?: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { canManageContent, loading } = useUserRole();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  // Redirect if not authorized
  if (!loading && !canManageContent()) {
    navigate('/admin-lms');
    return null;
  }

  useEffect(() => {
    loadUsers();
    loadCourses();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli utenti",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadUserEnrollments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_enrollments')
        .select(`
          *,
          courses (
            title
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      const enrichedEnrollments = data.map((enrollment: any) => ({
        ...enrollment,
        course_title: enrollment.courses?.title || 'Corso non trovato'
      }));
      
      setEnrollments(enrichedEnrollments);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole as any })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Successo",
        description: "Ruolo utente aggiornato",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il ruolo",
        variant: "destructive",
      });
    }
  };

  const enrollUserInCourse = async () => {
    if (!selectedUser || !selectedCourse) return;

    try {
      const { error } = await supabase
        .from('user_enrollments')
        .insert([{
          user_id: selectedUser.id,
          course_id: selectedCourse,
          status: 'active',
          progress_percentage: 0
        }]);

      if (error) throw error;

      await loadUserEnrollments(selectedUser.id);
      setIsEnrollModalOpen(false);
      setSelectedCourse('');
      
      toast({
        title: "Successo",
        description: "Utente iscritto al corso",
      });
    } catch (error) {
      console.error('Error enrolling user:', error);
      toast({
        title: "Errore",
        description: "Impossibile iscrivere l'utente",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'instructor': return <BookOpen className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'instructor': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default: return 'bg-green-500/20 text-green-300 border-green-500/50';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading User Management...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/admin-lms')} 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard Admin
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium text-xl">
              Gestione Utenti
            </div>
            <div className="text-slate-400 text-sm">
              Amministra utenti, ruoli e iscrizioni ai corsi
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-purple-300 border-purple-500/50">
              {users.length} Utenti
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Users List */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Lista Utenti
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Gestisci utenti registrati e i loro ruoli
                    </CardDescription>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cerca utenti..."
                      className="pl-10 bg-slate-700 border-slate-600 text-slate-200"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">Tutti i Ruoli</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="instructor">Istruttore</SelectItem>
                      <SelectItem value="student">Studente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        loadUserEnrollments(user.id);
                      }}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'bg-purple-600/20 border-purple-500/50' 
                          : 'bg-slate-700/30 border-slate-600/40 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {(user.first_name?.[0] || user.id[0]).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : 'Nome non disponibile'
                              }
                            </div>
                            <div className="text-xs text-slate-400">{user.id}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </Badge>
                          
                          <Select 
                            value={user.role} 
                            onValueChange={(value) => updateUserRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32 bg-slate-600 border-slate-500 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="student">Studente</SelectItem>
                              <SelectItem value="instructor">Istruttore</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-slate-500">
                        Registrato il {new Date(user.created_at).toLocaleDateString('it-IT')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Details */}
          <div className="col-span-12 lg:col-span-4">
            {selectedUser ? (
              <div className="space-y-4">
                {/* User Info */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Dettagli Utente</span>
                      <Dialog open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
                          <DialogHeader>
                            <DialogTitle>Iscrivi a Corso</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Seleziona Corso</Label>
                              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger className="bg-slate-700 border-slate-600">
                                  <SelectValue placeholder="Scegli un corso" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  {courses.map(course => (
                                    <SelectItem key={course.id} value={course.id}>
                                      {course.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={enrollUserInCourse} 
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={!selectedCourse}
                            >
                              Iscrivi Utente
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-slate-400">Nome Completo</div>
                        <div className="font-medium">
                          {selectedUser.first_name && selectedUser.last_name 
                            ? `${selectedUser.first_name} ${selectedUser.last_name}`
                            : 'Non disponibile'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">ID Utente</div>
                        <div className="font-mono text-xs bg-slate-700/50 p-2 rounded">
                          {selectedUser.id}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Ruolo</div>
                        <Badge variant="outline" className={getRoleBadgeColor(selectedUser.role)}>
                          {getRoleIcon(selectedUser.role)}
                          <span className="ml-1 capitalize">{selectedUser.role}</span>
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Data Registrazione</div>
                        <div className="text-sm">
                          {new Date(selectedUser.created_at).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Enrollments */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Corsi Iscritti</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {enrollments.length === 0 ? (
                      <div className="text-center py-4 text-slate-400 text-sm">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Nessuna iscrizione</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {enrollments.map((enrollment) => (
                          <div
                            key={enrollment.id}
                            className="p-3 bg-slate-700/30 rounded border border-slate-600/40"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-sm text-slate-200">
                                {enrollment.course_title}
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  enrollment.status === 'completed' 
                                    ? 'text-green-300 border-green-500/50' 
                                    : enrollment.status === 'active'
                                    ? 'text-blue-300 border-blue-500/50'
                                    : 'text-red-300 border-red-500/50'
                                }`}
                              >
                                {enrollment.status === 'completed' ? 'Completato' :
                                 enrollment.status === 'active' ? 'Attivo' : 'Abbandonato'}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-400">
                              Progresso: {enrollment.progress_percentage}%
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
                              <div 
                                className="bg-purple-500 h-1 rounded-full transition-all"
                                style={{ width: `${enrollment.progress_percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-slate-300 text-lg font-medium mb-2">Seleziona un Utente</h3>
                  <p className="text-slate-500">Clicca su un utente per vedere i dettagli e gestire le iscrizioni</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;