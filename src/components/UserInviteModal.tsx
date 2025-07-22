import React, { useState } from 'react';
import { Mail, UserPlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserInvited: () => void;
}

export const UserInviteModal: React.FC<UserInviteModalProps> = ({
  isOpen,
  onClose,
  onUserInvited
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Errore",
        description: "Inserisci un'email valida",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);

    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: {
          email,
          role,
          invitedBy: currentUser.user?.id
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Errore durante l\'invito');
      }

      toast({
        title: "Utente Invitato",
        description: `${email} è stato invitato con ruolo ${role}. Riceverà un'email per impostare la password.`,
      });

      setEmail('');
      setRole('student');
      onClose();
      onUserInvited();

    } catch (error: any) {
      console.error('Invite error:', error);
      toast({
        title: "Errore Invito",
        description: error.message || "Impossibile invitare l'utente",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Mail className="w-5 h-5 mr-2 text-blue-400" />
            Invita Nuovo Utente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-slate-300">
              Email Utente
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="utente@esempio.com"
              className="bg-slate-700 border-slate-600 text-slate-200 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-slate-300">
              Ruolo
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-slate-700 border-slate-600 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="student">Studente</SelectItem>
                <SelectItem value="instructor">Istruttore</SelectItem>
                <SelectItem value="admin">Amministratore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={isInviting}
            >
              Annulla
            </Button>
            <Button
              onClick={handleInvite}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isInviting || !email}
            >
              {isInviting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Invitando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invia Invito
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};