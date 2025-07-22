import React, { useState, useRef } from 'react';
import { Upload, Download, Users, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ParsedUser {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = "email,first_name,last_name,role\n" +
                      "mario.rossi@esempio.com,Mario,Rossi,student\n" +
                      "giulia.bianchi@esempio.com,Giulia,Bianchi,instructor\n" +
                      "admin@esempio.com,Admin,Sistema,admin";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_utenti.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const parseCSV = (content: string): ParsedUser[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const users: ParsedUser[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length >= 3) {
        const user: any = {};
        headers.forEach((header, index) => {
          user[header] = values[index] || '';
        });
        
        if (user.email && user.email.includes('@')) {
          users.push({
            email: user.email,
            first_name: user.first_name || user.nome || '',
            last_name: user.last_name || user.cognome || '',
            role: user.role || user.ruolo || 'student'
          });
        }
      }
    }
    
    return users;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Formato File Non Valido",
        description: "Carica solo file CSV",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const users = parseCSV(content);
        setParsedUsers(users);
        
        if (users.length === 0) {
          toast({
            title: "File Vuoto",
            description: "Il file CSV non contiene utenti validi",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Errore Parsing",
          description: "Impossibile leggere il file CSV",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (parsedUsers.length === 0) return;

    setIsProcessing(true);
    setImportProgress(0);

    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      // Create import session
      const { data: session, error: sessionError } = await supabase
        .from('bulk_import_sessions')
        .insert([{
          initiated_by: currentUser.user?.id,
          filename: file?.name || 'unknown.csv',
          total_records: parsedUsers.length,
          status: 'processing'
        }])
        .select()
        .single();

      if (sessionError || !session) {
        throw new Error('Impossibile creare sessione di import');
      }

      // Start import via edge function
      const { data, error } = await supabase.functions.invoke('bulk-import-users', {
        body: {
          users: parsedUsers,
          sessionId: session.id,
          initiatedBy: currentUser.user?.id
        }
      });

      if (error) {
        throw error;
      }

      setImportResults(data.results);
      setImportProgress(100);

      toast({
        title: "Import Completato",
        description: `${data.results.successful} utenti importati con successo, ${data.results.failed} errori`,
      });

      onImportComplete();

    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Errore Import",
        description: error.message || "Impossibile completare l'import",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setParsedUsers([]);
    setImportProgress(0);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Upload className="w-5 h-5 mr-2 text-green-400" />
            Import Utenti in Massa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-200">Template CSV</h3>
                <p className="text-sm text-slate-400">
                  Scarica il template per formattare correttamente i dati
                </p>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Scarica Template
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label className="text-slate-300 mb-2 block">
              Carica File CSV
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              disabled={isProcessing}
            />
          </div>

          {/* Preview */}
          {parsedUsers.length > 0 && !importResults && (
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-200 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Anteprima Import
                </h3>
                <Badge variant="outline" className="border-green-500/50 text-green-300">
                  {parsedUsers.length} utenti trovati
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {parsedUsers.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded">
                    <span>{user.first_name} {user.last_name}</span>
                    <span className="text-slate-400">{user.email}</span>
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
                {parsedUsers.length > 5 && (
                  <div className="text-center text-slate-400 text-sm">
                    ... e altri {parsedUsers.length - 5} utenti
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Import Progress */}
          {isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Import in corso...
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          {/* Results */}
          {importResults && (
            <div className="space-y-4">
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Import completato: {importResults.successful} utenti creati con successo
                </AlertDescription>
              </Alert>

              {importResults.failed > 0 && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-300">
                    {importResults.failed} errori riscontrati durante l'import
                  </AlertDescription>
                </Alert>
              )}

              {importResults.errors && importResults.errors.length > 0 && (
                <div className="bg-slate-700/30 p-3 rounded-lg max-h-32 overflow-y-auto">
                  <div className="text-sm text-slate-400 mb-2">Dettagli errori:</div>
                  {importResults.errors.map((error: string, index: number) => (
                    <div key={index} className="text-xs text-red-300 mb-1">
                      • {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={isProcessing}
            >
              {importResults ? 'Chiudi' : 'Annulla'}
            </Button>
            
            {!importResults && (
              <Button
                onClick={handleImport}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isProcessing || parsedUsers.length === 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Avvia Import ({parsedUsers.length} utenti)
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};