
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  openaiAvailable: boolean;
  aiGeneratorFunction: boolean;
  saveCourseFunction: boolean;
  testing: boolean;
}

const AIStatusChecker: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    openaiAvailable: false,
    aiGeneratorFunction: false,
    saveCourseFunction: false,
    testing: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    setLoading(true);
    setStatus(prev => ({ ...prev, testing: true }));

    try {
      // Test AI content generator function
      const aiTest = await supabase.functions.invoke('ai-content-generator', {
        body: {
          action: 'parse_pdf',
          pdfContent: 'Test content for system check'
        }
      });

      // Test save course function connectivity (without actually saving)
      const saveTest = await fetch(`https://dnircioicebnrdwifmkl.supabase.co/functions/v1/save-course`, {
        method: 'OPTIONS'
      });

      setStatus({
        openaiAvailable: !aiTest.error,
        aiGeneratorFunction: !aiTest.error,
        saveCourseFunction: saveTest.ok,
        testing: false
      });

    } catch (error) {
      console.error('Status check failed:', error);
      setStatus({
        openaiAvailable: false,
        aiGeneratorFunction: false,
        saveCourseFunction: false,
        testing: false
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusItem = ({ label, status, loading }: { label: string; status: boolean; loading: boolean }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-300">{label}</span>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      ) : (
        <div className="flex items-center space-x-2">
          {status ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">OK</Badge>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-red-400" />
              <Badge variant="outline" className="text-red-300 border-red-500/50">Error</Badge>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Sistema AI Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <StatusItem label="OpenAI API" status={status.openaiAvailable} loading={loading} />
        <StatusItem label="AI Generator Function" status={status.aiGeneratorFunction} loading={loading} />
        <StatusItem label="Save Course Function" status={status.saveCourseFunction} loading={loading} />
      </CardContent>
    </Card>
  );
};

export default AIStatusChecker;
