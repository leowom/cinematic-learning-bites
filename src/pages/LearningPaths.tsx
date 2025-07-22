import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Map, Plus, ArrowRight, BookOpen, ArrowLeft, 
  Target, Users, Clock, Award, Settings, GripVertical,
  Edit3, Trash2, Eye, Badge as BadgeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  target_role: string;
  tags: string[];
  prerequisites: string[];
  total_duration: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  course_sequence: string[];
  target_role: string;
  estimated_duration: string;
  created_at: string;
}

const LearningPaths = () => {
  const navigate = useNavigate();
  const { canManageContent, loading } = useUserRole();
  const { toast } = useToast();
  
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [isCreatePathOpen, setIsCreatePathOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [newPath, setNewPath] = useState({
    title: '',
    description: '',
    target_role: 'all',
    estimated_duration: '',
    selected_courses: [] as string[]
  });

  // Redirect if not authorized
  if (!loading && !canManageContent()) {
    navigate('/admin-lms');
    return null;
  }

  useEffect(() => {
    loadLearningPaths();
    loadCourses();
  }, []);

  const loadLearningPaths = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLearningPaths(data || []);
    } catch (error) {
      console.error('Error loading learning paths:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i percorsi di apprendimento",
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
        .select('*')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const createLearningPath = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .insert([{
          id: `path-${Date.now()}`,
          title: newPath.title,
          description: newPath.description,
          course_sequence: newPath.selected_courses,
          target_role: newPath.target_role,
          estimated_duration: newPath.estimated_duration
        }])
        .select()
        .single();

      if (error) throw error;

      setLearningPaths(prev => [data, ...prev]);
      setNewPath({ 
        title: '', 
        description: '', 
        target_role: 'all', 
        estimated_duration: '', 
        selected_courses: [] 
      });
      setIsCreatePathOpen(false);
      
      toast({
        title: "Successo",
        description: "Percorso di apprendimento creato",
      });
    } catch (error) {
      console.error('Error creating learning path:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare il percorso",
        variant: "destructive",
      });
    }
  };

  const deleteLearningPath = async (pathId: string) => {
    try {
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', pathId);

      if (error) throw error;

      setLearningPaths(prev => prev.filter(p => p.id !== pathId));
      if (selectedPath?.id === pathId) {
        setSelectedPath(null);
      }
      
      toast({
        title: "Successo",
        description: "Percorso eliminato",
      });
    } catch (error) {
      console.error('Error deleting learning path:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il percorso",
        variant: "destructive",
      });
    }
  };

  const toggleCourseSelection = (courseId: string) => {
    setNewPath(prev => ({
      ...prev,
      selected_courses: prev.selected_courses.includes(courseId)
        ? prev.selected_courses.filter(id => id !== courseId)
        : [...prev.selected_courses, courseId]
    }));
  };

  const moveCourse = (from: number, to: number) => {
    setNewPath(prev => {
      const newSequence = [...prev.selected_courses];
      const [moved] = newSequence.splice(from, 1);
      newSequence.splice(to, 0, moved);
      return { ...prev, selected_courses: newSequence };
    });
  };

  const getCourseById = (courseId: string) => 
    courses.find(c => c.id === courseId);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'instructor': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'marketing': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'developer': return 'bg-green-500/20 text-green-300 border-green-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading Learning Paths...</div>
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
              Learning Paths
            </div>
            <div className="text-slate-400 text-sm">
              Crea percorsi di apprendimento personalizzati con prerequisiti
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-300 border-green-500/50">
              {learningPaths.length} Percorsi
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Learning Paths List */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Map className="w-5 h-5 mr-2" />
                    Percorsi di Apprendimento
                  </CardTitle>
                  <Dialog open={isCreatePathOpen} onOpenChange={setIsCreatePathOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Crea Nuovo Percorso</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Titolo Percorso</Label>
                          <Input 
                            value={newPath.title}
                            onChange={(e) => setNewPath(prev => ({...prev, title: e.target.value}))}
                            placeholder="Nome del percorso di apprendimento"
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label>Descrizione</Label>
                          <Textarea 
                            value={newPath.description}
                            onChange={(e) => setNewPath(prev => ({...prev, description: e.target.value}))}
                            placeholder="Descrivi gli obiettivi e i benefici del percorso"
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Ruolo Target</Label>
                            <Select 
                              value={newPath.target_role} 
                              onValueChange={(value) => setNewPath(prev => ({...prev, target_role: value}))}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                <SelectItem value="all">Tutti</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="developer">Sviluppatori</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="student">Studenti</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Durata Stimata</Label>
                            <Input 
                              value={newPath.estimated_duration}
                              onChange={(e) => setNewPath(prev => ({...prev, estimated_duration: e.target.value}))}
                              placeholder="es. 4-6 settimane"
                              className="bg-slate-700 border-slate-600"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="mb-3 block">Seleziona Corsi (nell'ordine di completamento)</Label>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {courses.map((course) => (
                              <div
                                key={course.id}
                                className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded border border-slate-600/40"
                              >
                                <Checkbox
                                  id={course.id}
                                  checked={newPath.selected_courses.includes(course.id)}
                                  onCheckedChange={() => toggleCourseSelection(course.id)}
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-slate-200">{course.title}</div>
                                  <div className="text-xs text-slate-400">
                                    {course.level} • {course.total_duration}
                                  </div>
                                  {course.tags && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {course.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {newPath.selected_courses.includes(course.id) && (
                                  <Badge variant="secondary" className="text-xs">
                                    #{newPath.selected_courses.indexOf(course.id) + 1}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {newPath.selected_courses.length > 0 && (
                          <div>
                            <Label>Ordine dei Corsi (trascina per riordinare)</Label>
                            <div className="space-y-2 mt-2">
                              {newPath.selected_courses.map((courseId, index) => {
                                const course = getCourseById(courseId);
                                return (
                                  <div
                                    key={courseId}
                                    className="flex items-center space-x-3 p-2 bg-slate-600/20 rounded border"
                                  >
                                    <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-slate-200">
                                        {course?.title}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <Button 
                          onClick={createLearningPath} 
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={!newPath.title || newPath.selected_courses.length === 0}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Crea Percorso
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {learningPaths.map((path) => (
                    <div
                      key={path.id}
                      onClick={() => setSelectedPath(path)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedPath?.id === path.id 
                          ? 'bg-green-600/20 border-green-500/50' 
                          : 'bg-slate-700/30 border-slate-600/40 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-slate-200 truncate">
                          {path.title}
                        </div>
                        <Badge variant="outline" className={getRoleBadgeColor(path.target_role)}>
                          {path.target_role === 'all' ? 'Tutti' : path.target_role}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        {path.course_sequence.length} corsi • {path.estimated_duration}
                      </div>
                      <div className="text-xs text-slate-500">
                        {path.description?.substring(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Path Details */}
          <div className="col-span-12 lg:col-span-8">
            {selectedPath ? (
              <div className="space-y-6">
                {/* Path Overview */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{selectedPath.title}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {selectedPath.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-400 border-slate-600"
                          onClick={() => deleteLearningPath(selectedPath.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center mb-6">
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {selectedPath.course_sequence.length}
                        </div>
                        <div className="text-xs text-slate-400">Corsi</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          {selectedPath.estimated_duration}
                        </div>
                        <div className="text-xs text-slate-400">Durata Stimata</div>
                      </div>
                      <div>
                        <Badge variant="outline" className={getRoleBadgeColor(selectedPath.target_role)}>
                          {selectedPath.target_role === 'all' ? 'Tutti i ruoli' : selectedPath.target_role}
                        </Badge>
                        <div className="text-xs text-slate-400 mt-1">Target</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Sequence */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white">Sequenza Corsi</CardTitle>
                    <CardDescription className="text-slate-400">
                      Ordine di completamento del percorso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPath.course_sequence.map((courseId, index) => {
                        const course = getCourseById(courseId);
                        if (!course) return null;
                        
                        return (
                          <div key={courseId} className="relative">
                            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/40">
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-slate-200">{course.title}</div>
                                <div className="text-sm text-slate-400 mt-1">
                                  {course.description?.substring(0, 80)}...
                                </div>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {course.total_duration}
                                  </span>
                                  <span className="flex items-center">
                                    <BadgeIcon className="w-3 h-3 mr-1" />
                                    {course.level}
                                  </span>
                                  {course.prerequisites && course.prerequisites.length > 0 && (
                                    <span className="flex items-center text-orange-400">
                                      <Settings className="w-3 h-3 mr-1" />
                                      {course.prerequisites.length} prerequisiti
                                    </span>
                                  )}
                                </div>
                                {course.tags && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {course.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {index < selectedPath.course_sequence.length - 1 && (
                              <div className="flex items-center justify-center my-2">
                                <ArrowRight className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Enrollment Stats */}
                <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Statistiche Iscrizioni</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-400">0</div>
                        <div className="text-xs text-slate-400">Utenti Iscritti</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">0</div>
                        <div className="text-xs text-slate-400">Completamenti</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-400">0%</div>
                        <div className="text-xs text-slate-400">Tasso Successo</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-slate-300 text-lg font-medium mb-2">Seleziona un Percorso</h3>
                  <p className="text-slate-500">Clicca su un percorso per vedere i dettagli e gestire la sequenza</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPaths;