import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Mail, Calendar, Users, Settings, Bell, 
  ArrowLeft, Play, Pause, Edit3, Trash2, Plus,
  Clock, Target, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  type: 'enrollment' | 'notification' | 'recommendation';
  trigger: string;
  action: string;
  conditions: any;
  isActive: boolean;
  executions: number;
  lastExecuted?: string;
}

const LearningAutomations = () => {
  const navigate = useNavigate();
  const { canManageContent, loading } = useUserRole();
  const { toast } = useToast();
  
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    type: 'enrollment',
    trigger: '',
    action: '',
    conditions: {}
  });

  // Redirect if not authorized
  if (!loading && !canManageContent()) {
    navigate('/admin-lms');
    return null;
  }

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = () => {
    // Mock data - in real app this would come from Supabase
    const mockAutomations: AutomationRule[] = [
      {
        id: '1',
        name: 'Iscrizione Automatica Corso Base',
        type: 'enrollment',
        trigger: 'user_signup',
        action: 'enroll_in_course',
        conditions: { course_id: 'intro-ai', role: 'student' },
        isActive: true,
        executions: 45,
        lastExecuted: '2024-01-20T10:30:00Z'
      },
      {
        id: '2',
        name: 'Reminder Inattività 7 Giorni',
        type: 'notification',
        trigger: 'user_inactive',
        action: 'send_email',
        conditions: { days: 7, template: 'comeback_reminder' },
        isActive: true,
        executions: 23,
        lastExecuted: '2024-01-19T15:45:00Z'
      },
      {
        id: '3',
        name: 'Raccomandazione Corso Avanzato',
        type: 'recommendation',
        trigger: 'course_completed',
        action: 'suggest_next_course',
        conditions: { completed_course: 'prompt-basics', suggest_course: 'prompt-advanced' },
        isActive: false,
        executions: 12,
        lastExecuted: '2024-01-18T09:15:00Z'
      }
    ];
    setAutomations(mockAutomations);
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, isActive: !automation.isActive }
        : automation
    ));
    
    toast({
      title: "Automazione aggiornata",
      description: "Lo stato dell'automazione è stato modificato",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      case 'recommendation': return <Target className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'text-emerald-400 bg-emerald-400/10';
      case 'notification': return 'text-blue-400 bg-blue-400/10';
      case 'recommendation': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'enrollment': return 'Iscrizione';
      case 'notification': return 'Notifica';
      case 'recommendation': return 'Raccomandazione';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading Automations...</div>
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
              Learning Automations
            </div>
            <div className="text-slate-400 text-sm">
              Automatizza iscrizioni, notifiche e raccomandazioni
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-yellow-300 border-yellow-500/50">
              Smart Learning
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Automazioni Attive</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {automations.filter(a => a.isActive).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Esecuzioni Totali</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {automations.reduce((sum, a) => sum + a.executions, 0)}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Email Inviate</p>
                  <p className="text-2xl font-bold text-purple-400">127</p>
                </div>
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Auto-Iscrizioni</p>
                  <p className="text-2xl font-bold text-orange-400">45</p>
                </div>
                <Users className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Automation Rules List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Regole di Automazione</CardTitle>
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuova Regola
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
                      <DialogHeader>
                        <DialogTitle>Crea Nuova Automazione</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Nome Regola</Label>
                          <Input 
                            value={newAutomation.name}
                            onChange={(e) => setNewAutomation(prev => ({...prev, name: e.target.value}))}
                            placeholder="Nome descrittivo della regola"
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label>Tipo Automazione</Label>
                          <Select value={newAutomation.type} onValueChange={(val: any) => setNewAutomation(prev => ({...prev, type: val}))}>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="enrollment">Iscrizione Automatica</SelectItem>
                              <SelectItem value="notification">Notifica Email</SelectItem>
                              <SelectItem value="recommendation">Raccomandazione Corso</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Crea Automazione
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automations.map((automation) => (
                    <div key={automation.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded ${getTypeColor(automation.type)}`}>
                            {getTypeIcon(automation.type)}
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-200">{automation.name}</h3>
                            <p className="text-sm text-slate-400">
                              {getTypeName(automation.type)} • {automation.executions} esecuzioni
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={automation.isActive}
                            onCheckedChange={() => toggleAutomation(automation.id)}
                          />
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-200">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-300 mb-2">
                        <strong>Trigger:</strong> {automation.trigger.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-slate-300 mb-2">
                        <strong>Azione:</strong> {automation.action.replace(/_/g, ' ')}
                      </div>
                      
                      {automation.lastExecuted && (
                        <div className="text-xs text-slate-400 mt-2">
                          Ultima esecuzione: {new Date(automation.lastExecuted).toLocaleString('it-IT')}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant={automation.isActive ? "default" : "secondary"} className="text-xs">
                          {automation.isActive ? 'Attiva' : 'Disattiva'}
                        </Badge>
                        <div className="text-xs text-slate-400">
                          ID: {automation.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Templates & Settings */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Template Rapidi</CardTitle>
                <CardDescription className="text-slate-400">
                  Crea automazioni comuni con un click
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Users className="w-4 h-4 mr-3 text-emerald-400" />
                    <div className="text-left">
                      <div className="font-medium">Welcome Sequence</div>
                      <div className="text-xs text-slate-400">Iscrivi nuovi utenti al corso base</div>
                    </div>
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Bell className="w-4 h-4 mr-3 text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium">Inactivity Reminder</div>
                      <div className="text-xs text-slate-400">Reminder dopo 7 giorni di inattività</div>
                    </div>
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Target className="w-4 h-4 mr-3 text-purple-400" />
                    <div className="text-left">
                      <div className="font-medium">Course Progression</div>
                      <div className="text-xs text-slate-400">Suggerisci prossimo corso dopo completamento</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Impostazioni Sistema</CardTitle>
                <CardDescription className="text-slate-400">
                  Configura il comportamento delle automazioni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Email Notifications</div>
                      <div className="text-xs text-slate-400">Abilita invio email automatiche</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Auto-Enrollment</div>
                      <div className="text-xs text-slate-400">Iscrizioni automatiche ai corsi</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Smart Recommendations</div>
                      <div className="text-xs text-slate-400">Raccomandazioni AI-powered</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Execution Frequency</Label>
                    <Select defaultValue="hourly">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Ogni ora</SelectItem>
                        <SelectItem value="daily">Giornaliera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningAutomations;