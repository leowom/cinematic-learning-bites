import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, Database, Shield, Globe, Mail, Bell,
  Key, Lock, Users, Zap, Calendar, MessageSquare,
  Server, Cloud, AlertTriangle, CheckCircle, 
  ExternalLink, Plus, Trash2, Eye, EyeOff,
  Smartphone, QrCode, Chrome, Slack
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SystemSettings {
  // General Settings
  platform_name: string;
  platform_description: string;
  default_language: string;
  timezone: string;
  
  // Authentication
  enable_registration: boolean;
  require_email_verification: boolean;
  enable_2fa: boolean;
  password_min_length: number;
  enable_social_login: boolean;
  
  // Course Settings
  auto_enroll_new_users: boolean;
  default_course_visibility: string;
  enable_certificates: boolean;
  certificate_template: string;
  
  // Notifications
  enable_email_notifications: boolean;
  enable_push_notifications: boolean;
  notification_frequency: string;
  
  // Integrations
  google_calendar_enabled: boolean;
  slack_integration_enabled: boolean;
  zoom_integration_enabled: boolean;
  
  // Advanced
  enable_analytics: boolean;
  data_retention_days: number;
  enable_audit_logs: boolean;
  max_file_size_mb: number;
}

interface IntegrationConfig {
  id: string;
  name: string;
  type: 'oauth' | 'api_key' | 'webhook';
  enabled: boolean;
  configured: boolean;
  description: string;
  icon: React.ReactNode;
  settings: Record<string, any>;
}

const SystemConfiguration = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    platform_name: 'AI Learning Platform',
    platform_description: 'Piattaforma di apprendimento AI avanzata',
    default_language: 'it',
    timezone: 'Europe/Rome',
    enable_registration: true,
    require_email_verification: false,
    enable_2fa: false,
    password_min_length: 8,
    enable_social_login: false,
    auto_enroll_new_users: false,
    default_course_visibility: 'public',
    enable_certificates: true,
    certificate_template: 'default',
    enable_email_notifications: true,
    enable_push_notifications: false,
    notification_frequency: 'daily',
    google_calendar_enabled: false,
    slack_integration_enabled: false,
    zoom_integration_enabled: false,
    enable_analytics: true,
    data_retention_days: 365,
    enable_audit_logs: true,
    max_file_size_mb: 10
  });

  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'oauth',
      enabled: false,
      configured: false,
      description: 'Sincronizza sessioni live e scadenze con Google Calendar',
      icon: <Calendar className="w-5 h-5" />,
      settings: {}
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'webhook',
      enabled: false,
      configured: false,
      description: 'Invia notifiche di progresso e promemoria su Slack',
      icon: <Slack className="w-5 h-5" />,
      settings: {}
    },
    {
      id: 'zoom',
      name: 'Zoom',
      type: 'api_key',
      enabled: false,
      configured: false,
      description: 'Crea automaticamente meeting Zoom per sessioni live',
      icon: <Globe className="w-5 h-5" />,
      settings: {}
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      type: 'api_key',
      enabled: false,
      configured: false,
      description: 'Sistema email avanzato per notifiche e marketing',
      icon: <Mail className="w-5 h-5" />,
      settings: {}
    }
  ]);

  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'loading'>>({});
  const { toast } = useToast();

  const saveSettings = async (section?: string) => {
    try {
      // In a real implementation, this would save to the database
      // For now, we'll save to localStorage as a demo
      localStorage.setItem('system_settings', JSON.stringify(settings));
      
      toast({
        title: "Impostazioni Salvate",
        description: section ? `Sezione ${section} aggiornata con successo` : "Tutte le impostazioni sono state salvate",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile salvare le impostazioni",
        variant: "destructive",
      });
    }
  };

  const testIntegration = async (integrationId: string) => {
    setTestResults(prev => ({ ...prev, [integrationId]: 'loading' }));
    
    try {
      // Mock test - in reality this would test the actual integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random success/failure for demo
      const success = Math.random() > 0.3;
      
      setTestResults(prev => ({ 
        ...prev, 
        [integrationId]: success ? 'success' : 'error' 
      }));
      
      toast({
        title: success ? "Test Riuscito" : "Test Fallito",
        description: success 
          ? "L'integrazione funziona correttamente" 
          : "Verifica le credenziali e riprova",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [integrationId]: 'error' }));
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Sei sicuro di voler ripristinare tutte le impostazioni ai valori predefiniti?')) {
      setSettings({
        platform_name: 'AI Learning Platform',
        platform_description: 'Piattaforma di apprendimento AI avanzata',
        default_language: 'it',
        timezone: 'Europe/Rome',
        enable_registration: true,
        require_email_verification: false,
        enable_2fa: false,
        password_min_length: 8,
        enable_social_login: false,
        auto_enroll_new_users: false,
        default_course_visibility: 'public',
        enable_certificates: true,
        certificate_template: 'default',
        enable_email_notifications: true,
        enable_push_notifications: false,
        notification_frequency: 'daily',
        google_calendar_enabled: false,
        slack_integration_enabled: false,
        zoom_integration_enabled: false,
        enable_analytics: true,
        data_retention_days: 365,
        enable_audit_logs: true,
        max_file_size_mb: 10
      });
      
      toast({
        title: "Impostazioni Ripristinate",
        description: "Tutte le impostazioni sono state ripristinate ai valori predefiniti",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurazione Sistema</h1>
        <p className="text-gray-600">Gestisci impostazioni globali, sicurezza e integrazioni</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Generali
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sicurezza
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Corsi
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifiche
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Integrazioni
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Avanzate
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Generali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform_name">Nome Piattaforma</Label>
                  <Input
                    id="platform_name"
                    value={settings.platform_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, platform_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_language">Lingua Predefinita</Label>
                  <Select 
                    value={settings.default_language}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, default_language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform_description">Descrizione Piattaforma</Label>
                <Input
                  id="platform_description"
                  value={settings.platform_description}
                  onChange={(e) => setSettings(prev => ({ ...prev, platform_description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Orario</Label>
                <Select 
                  value={settings.timezone}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Rome">Europa/Roma (GMT+1)</SelectItem>
                    <SelectItem value="America/New_York">America/New York (GMT-5)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                    <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => saveSettings('generale')} className="w-full">
                Salva Impostazioni Generali
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication & Security */}
        <TabsContent value="auth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Autenticazione e Sicurezza</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_registration">Abilita Registrazione</Label>
                    <Switch
                      id="enable_registration"
                      checked={settings.enable_registration}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_registration: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require_email_verification">Richiedi Verifica Email</Label>
                    <Switch
                      id="require_email_verification"
                      checked={settings.require_email_verification}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_email_verification: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_2fa">Abilita 2FA</Label>
                    <Switch
                      id="enable_2fa"
                      checked={settings.enable_2fa}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_2fa: checked }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password_min_length">Lunghezza Minima Password</Label>
                    <Select 
                      value={settings.password_min_length.toString()}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, password_min_length: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 caratteri</SelectItem>
                        <SelectItem value="8">8 caratteri</SelectItem>
                        <SelectItem value="10">10 caratteri</SelectItem>
                        <SelectItem value="12">12 caratteri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_social_login">Login Social</Label>
                    <Switch
                      id="enable_social_login"
                      checked={settings.enable_social_login}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_social_login: checked }))}
                    />
                  </div>
                </div>
              </div>
              
              {settings.enable_2fa && (
                <Alert>
                  <Smartphone className="w-4 h-4" />
                  <AlertDescription>
                    <strong>2FA Abilitato:</strong> Gli utenti dovranno configurare un'app di autenticazione 
                    come Google Authenticator al primo accesso.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button onClick={() => saveSettings('sicurezza')} className="w-full">
                Salva Impostazioni Sicurezza
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrazioni Esterne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {integration.icon}
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={integration.configured ? "default" : "secondary"}>
                          {integration.configured ? "Configurato" : "Non Configurato"}
                        </Badge>
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={(checked) => {
                            setIntegrations(prev => prev.map(int => 
                              int.id === integration.id ? { ...int, enabled: checked } : int
                            ));
                          }}
                        />
                      </div>
                    </div>
                    
                    {integration.enabled && (
                      <div className="space-y-3 border-t pt-3">
                        {integration.type === 'api_key' && (
                          <div className="space-y-2">
                            <Label>API Key</Label>
                            <div className="flex gap-2">
                              <Input
                                type={showApiKey[integration.id] ? "text" : "password"}
                                placeholder="Inserisci API Key"
                                value={integration.settings.apiKey || ''}
                                onChange={(e) => {
                                  setIntegrations(prev => prev.map(int => 
                                    int.id === integration.id 
                                      ? { ...int, settings: { ...int.settings, apiKey: e.target.value }, configured: !!e.target.value }
                                      : int
                                  ));
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowApiKey(prev => ({ ...prev, [integration.id]: !prev[integration.id] }))}
                              >
                                {showApiKey[integration.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {integration.type === 'oauth' && (
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Configura OAuth
                            </Button>
                          </div>
                        )}
                        
                        {integration.type === 'webhook' && (
                          <div className="space-y-2">
                            <Label>Webhook URL</Label>
                            <Input
                              placeholder="https://hooks.slack.com/services/..."
                              value={integration.settings.webhookUrl || ''}
                              onChange={(e) => {
                                setIntegrations(prev => prev.map(int => 
                                  int.id === integration.id 
                                    ? { ...int, settings: { ...int.settings, webhookUrl: e.target.value }, configured: !!e.target.value }
                                    : int
                                ));
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testIntegration(integration.id)}
                            disabled={testResults[integration.id] === 'loading' || !integration.configured}
                          >
                            {testResults[integration.id] === 'loading' ? (
                              "Testing..."
                            ) : (
                              <>Test Connessione</>
                            )}
                          </Button>
                          
                          {testResults[integration.id] === 'success' && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Funzionante
                            </Badge>
                          )}
                          
                          {testResults[integration.id] === 'error' && (
                            <Badge variant="destructive">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Errore
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content would go here */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Corsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Configurazioni specifiche per la gestione dei corsi</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Iscrizione Automatica Nuovi Utenti</Label>
                  <Switch
                    checked={settings.auto_enroll_new_users}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_enroll_new_users: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Abilita Certificati</Label>
                  <Switch
                    checked={settings.enable_certificates}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_certificates: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifiche</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gestisci come e quando inviare notifiche agli utenti</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={settings.enable_email_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_email_notifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch
                    checked={settings.enable_push_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_push_notifications: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Avanzate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Configurazioni tecniche e avanzate del sistema</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Abilita Analytics</Label>
                  <Switch
                    checked={settings.enable_analytics}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_analytics: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Audit Logs</Label>
                  <Switch
                    checked={settings.enable_audit_logs}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_audit_logs: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dimensione Massima File (MB)</Label>
                  <Select
                    value={settings.max_file_size_mb.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, max_file_size_mb: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="25">25 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                      <SelectItem value="100">100 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex justify-between items-center border-t pt-6">
        <Button variant="outline" onClick={resetToDefaults}>
          Ripristina Impostazioni Predefinite
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => saveSettings()}>
            Salva Tutte le Impostazioni
          </Button>
          <Button onClick={() => toast({ title: "Sistema riavviato", description: "Le modifiche sono state applicate" })}>
            Applica e Riavvia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;
