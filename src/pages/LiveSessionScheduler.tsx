import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Users, Video, Plus, Edit3, 
  Trash2, ArrowLeft, Play, Square, Settings,
  Bell, Link as LinkIcon, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  instructor: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  meetingLink?: string;
  course?: string;
  lesson?: string;
}

const LiveSessionScheduler = () => {
  const navigate = useNavigate();
  const { canManageContent, loading, userProfile } = useUserRole();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<LiveSession | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    maxParticipants: 50,
    course: '',
    lesson: ''
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    // Mock data - in real app this would come from Supabase
    const mockSessions: LiveSession[] = [
      {
        id: '1',
        title: 'Advanced Prompt Engineering Workshop',
        description: 'Sessione avanzata sulle tecniche di prompt engineering con esempi pratici e Q&A dal vivo.',
        date: '2024-01-25',
        time: '14:30',
        duration: 90,
        instructor: 'Prof. Marco Rossi',
        maxParticipants: 30,
        currentParticipants: 18,
        status: 'scheduled',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        course: 'Prompt Engineering Lab',
        lesson: 'Advanced Techniques'
      },
      {
        id: '2',
        title: 'AI Ethics Discussion',
        description: 'Tavola rotonda sull\'etica nell\'intelligenza artificiale e le implicazioni future.',
        date: '2024-01-28',
        time: '16:00',
        duration: 60,
        instructor: 'Dr.ssa Laura Bianchi',
        maxParticipants: 25,
        currentParticipants: 12,
        status: 'scheduled',
        meetingLink: 'https://zoom.us/j/123456789',
        course: 'AI Fundamentals',
        lesson: 'Ethics Module'
      },
      {
        id: '3',
        title: 'Live Coding: Building AI Chatbots',
        description: 'Sessione di live coding per costruire chatbot intelligenti usando OpenAI API.',
        date: '2024-01-22',
        time: '10:00',
        duration: 120,
        instructor: 'Dev. Giuseppe Verde',
        maxParticipants: 40,
        currentParticipants: 35,
        status: 'completed',
        course: 'AI Development',
        lesson: 'Practical Implementation'
      }
    ];
    setSessions(mockSessions);
  };

  const createSession = async () => {
    try {
      const session: LiveSession = {
        id: Date.now().toString(),
        title: newSession.title,
        description: newSession.description,
        date: newSession.date,
        time: newSession.time,
        duration: newSession.duration,
        instructor: userProfile?.first_name + ' ' + userProfile?.last_name || 'Instructor',
        maxParticipants: newSession.maxParticipants,
        currentParticipants: 0,
        status: 'scheduled',
        meetingLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 12)}`,
        course: newSession.course,
        lesson: newSession.lesson
      };

      setSessions(prev => [...prev, session]);
      setNewSession({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        maxParticipants: 50,
        course: '',
        lesson: ''
      });
      setIsCreateOpen(false);
      
      toast({
        title: "✅ Sessione creata",
        description: "La sessione live è stata programmata con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile creare la sessione",
        variant: "destructive",
      });
    }
  };

  const copyMeetingLink = (link: string, sessionId: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(sessionId);
    setTimeout(() => setCopiedLink(null), 2000);
    
    toast({
      title: "Link copiato",
      description: "Il link della sessione è stato copiato negli appunti",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">Programmata</Badge>;
      case 'live':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/50">🔴 Live</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Completata</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-slate-400 border-slate-600">Annullata</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading Live Sessions...</div>
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
            <div className="text-slate-200 font-medium text-xl flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-pink-400" />
              Live Session Scheduler
            </div>
            <div className="text-slate-400 text-sm">
              Gestisci webinar e sessioni dal vivo
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-pink-300 border-pink-500/50">
              Instructor-Led Training
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Sessioni Programmate</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {sessions.filter(s => s.status === 'scheduled').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Live Ora</p>
                  <p className="text-2xl font-bold text-red-400">
                    {sessions.filter(s => s.status === 'live').length}
                  </p>
                </div>
                <Video className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Partecipanti Totali</p>
                  <p className="text-2xl font-bold text-green-400">
                    {sessions.reduce((sum, s) => sum + s.currentParticipants, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Ore Totali</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Sessioni Live</CardTitle>
                  {canManageContent() && (
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-pink-600 hover:bg-pink-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Nuova Sessione
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Programma Nuova Sessione Live</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Titolo Sessione</Label>
                              <Input 
                                value={newSession.title}
                                onChange={(e) => setNewSession(prev => ({...prev, title: e.target.value}))}
                                placeholder="Nome della sessione live"
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                            <div>
                              <Label>Corso Associato</Label>
                              <Input 
                                value={newSession.course}
                                onChange={(e) => setNewSession(prev => ({...prev, course: e.target.value}))}
                                placeholder="Nome del corso"
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Descrizione</Label>
                            <Textarea 
                              value={newSession.description}
                              onChange={(e) => setNewSession(prev => ({...prev, description: e.target.value}))}
                              placeholder="Descrizione della sessione..."
                              rows={3}
                              className="bg-slate-700 border-slate-600"
                            />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Data</Label>
                              <Input 
                                type="date"
                                value={newSession.date}
                                onChange={(e) => setNewSession(prev => ({...prev, date: e.target.value}))}
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                            <div>
                              <Label>Ora</Label>
                              <Input 
                                type="time"
                                value={newSession.time}
                                onChange={(e) => setNewSession(prev => ({...prev, time: e.target.value}))}
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                            <div>
                              <Label>Durata (minuti)</Label>
                              <Input 
                                type="number"
                                value={newSession.duration}
                                onChange={(e) => setNewSession(prev => ({...prev, duration: parseInt(e.target.value)}))}
                                className="bg-slate-700 border-slate-600"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Numero Massimo Partecipanti</Label>
                            <Input 
                              type="number"
                              value={newSession.maxParticipants}
                              onChange={(e) => setNewSession(prev => ({...prev, maxParticipants: parseInt(e.target.value)}))}
                              className="bg-slate-700 border-slate-600"
                            />
                          </div>
                          
                          <Button onClick={createSession} className="w-full bg-pink-600 hover:bg-pink-700">
                            <Calendar className="w-4 h-4 mr-2" />
                            Programma Sessione
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-slate-200 text-lg">{session.title}</h3>
                            {getStatusBadge(session.status)}
                          </div>
                          <p className="text-sm text-slate-300 mb-2">{session.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(session.date)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {session.time} ({session.duration} min)
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {session.currentParticipants}/{session.maxParticipants} partecipanti
                            </div>
                            <div className="flex items-center">
                              <Video className="w-4 h-4 mr-2" />
                              {session.instructor}
                            </div>
                          </div>
                          
                          {session.course && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {session.course}
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {session.meetingLink && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => copyMeetingLink(session.meetingLink!, session.id)}
                              className="text-slate-300"
                            >
                              {copiedLink === session.id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          
                          {session.status === 'scheduled' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Play className="w-4 h-4 mr-1" />
                              Avvia
                            </Button>
                          )}
                          
                          {session.status === 'live' && (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Square className="w-4 h-4 mr-1" />
                              Termina
                            </Button>
                          )}
                          
                          {canManageContent() && (
                            <>
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-200">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {session.meetingLink && (
                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <LinkIcon className="w-3 h-3" />
                            <span>Meeting Link: {session.meetingLink}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Azioni Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Bell className="w-4 h-4 mr-3 text-yellow-400" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Notifiche</div>
                      <div className="text-xs text-slate-400">Gestisci reminder</div>
                    </div>
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Settings className="w-4 h-4 mr-3 text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Impostazioni</div>
                      <div className="text-xs text-slate-400">Configura piattaforma</div>
                    </div>
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Users className="w-4 h-4 mr-3 text-green-400" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Partecipanti</div>
                      <div className="text-xs text-slate-400">Gestisci iscrizioni</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Platform Integration */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Piattaforme Video</CardTitle>
                <CardDescription className="text-slate-400">
                  Integra con le tue piattaforme preferite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span>Google Meet</span>
                    </div>
                    <span className="text-green-400">Connesso</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span>Zoom</span>
                    </div>
                    <span className="text-blue-400">Connesso</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                      <span>Microsoft Teams</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Connetti
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Prossime Sessioni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions
                    .filter(s => s.status === 'scheduled')
                    .slice(0, 3)
                    .map((session) => (
                    <div key={session.id} className="p-2 bg-slate-700/30 rounded text-sm">
                      <div className="font-medium text-slate-200 truncate">{session.title}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {session.date} • {session.time}
                      </div>
                      <div className="text-xs text-slate-400">
                        {session.currentParticipants}/{session.maxParticipants} iscritti
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionScheduler;