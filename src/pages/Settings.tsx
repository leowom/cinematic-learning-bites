import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, User, Mail, Save } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
        });

      if (error) throw error;

      toast.success('Profilo aggiornato con successo!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Errore durante l\'aggiornamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="prompt-lab-container">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Impostazioni</h1>
                <p className="text-slate-300">Gestisci il tuo profilo e le preferenze</p>
              </div>
            </div>
            
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              Esci
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <main className="p-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Profile Settings */}
            <Card className="glassmorphism-base border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informazioni Profilo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-200">Nome</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Il tuo nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-200">Cognome</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Il tuo cognome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-slate-800/50 border-slate-600 text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-sm text-slate-400">L'email non può essere modificata</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salva Modifiche
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;