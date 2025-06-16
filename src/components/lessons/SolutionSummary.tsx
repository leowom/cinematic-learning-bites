
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Play, BarChart3 } from 'lucide-react';

const SolutionSummary: React.FC = () => {
  const benefits = [
    { title: 'Riduzione 70% tempo di risposta', description: 'Da 48h a 14h media' },
    { title: 'Consistenza nelle risposte', description: 'Tono professionale garantito' },
    { title: 'Scalabilità automatica', description: 'Gestisce picchi di traffico' },
    { title: 'Team focalizzato su casi complessi', description: 'Maggior soddisfazione lavorativa' }
  ];

  const implementation = [
    'Integra il prompt nel tuo sistema email',
    'Configura automazione per email standard',
    'Imposta escalation per casi complessi',
    'Monitora e ottimizza performance'
  ];

  return (
    <div className="space-y-6">
      {/* Success Metrics */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <CardTitle className="text-green-800">Risultati Attesi</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/80 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{benefit.title}</h4>
                    <p className="text-gray-600 text-xs mt-1">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Implementazione Pratica</CardTitle>
          <p className="text-gray-600">Prossimi passi per applicare quello che hai imparato</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {implementation.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Scarica Template Prompt
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Prova Demo Live
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-800">Punti Chiave da Ricordare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-blue-600">1</Badge>
              <p className="text-blue-700 text-sm">
                <strong>Contesto è tutto:</strong> Fornisci sempre informazioni aziendali specifiche
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-blue-600">2</Badge>
              <p className="text-blue-700 text-sm">
                <strong>Struttura le istruzioni:</strong> Step chiari e actionable per l'AI
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-blue-600">3</Badge>
              <p className="text-blue-700 text-sm">
                <strong>Testa e itera:</strong> Continua a migliorare basandoti sui risultati
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-blue-600">4</Badge>
              <p className="text-blue-700 text-sm">
                <strong>Monitora sempre:</strong> L'AI migliora con feedback costante
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Badge */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Lezione Completata! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Hai masterizzato i fondamenti del Prompt Engineering per email automation
            </p>
            <Badge className="bg-green-600 text-white px-4 py-2">
              Certificato: AI Email Automation
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionSummary;
