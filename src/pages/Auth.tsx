import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/course-index');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/course-index');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/course-index`,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Utente già registrato. Prova ad accedere invece.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Registrazione completata! Controlla la tua email per confermare l\'account.');
      }
    } catch (error) {
      toast.error('Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Credenziali non valide. Controlla email e password.');
        } else {
          toast.error(error.message);
        }
      }
    } catch (error) {
      toast.error('Errore durante l\'accesso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/85e8a1d7-8421-46a8-88ef-d4a3206a8fe7.png" 
              alt="Course Icon" 
              className="w-8 h-8"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI & LLM Fundamentals</h1>
          <p className="text-slate-300">Accedi al tuo percorso di apprendimento</p>
        </div>

        <Card className="glassmorphism-base border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-center text-white">Benvenuto</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Accedi</TabsTrigger>
                <TabsTrigger value="signup">Registrati</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-slate-200">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="La tua email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-slate-200">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="La tua password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Accesso in corso...
                      </>
                    ) : (
                      'Accedi'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname" className="text-slate-200">Nome</Label>
                      <Input
                        id="firstname"
                        type="text"
                        placeholder="Nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname" className="text-slate-200">Cognome</Label>
                      <Input
                        id="lastname"
                        type="text"
                        placeholder="Cognome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-200">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="La tua email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-200">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Crea una password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrazione in corso...
                      </>
                    ) : (
                      'Registrati'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;