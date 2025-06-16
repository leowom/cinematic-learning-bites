
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mail, Users, Clock, TrendingUp } from 'lucide-react';

const ProblemScenario: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [showResults, setShowResults] = useState(false);

  const challenges = [
    { id: 'volume', label: 'Volume eccessivo di email', percentage: 45 },
    { id: 'time', label: 'Tempo di risposta troppo lungo', percentage: 30 },
    { id: 'quality', label: 'Qualità delle risposte inconsistente', percentage: 25 }
  ];

  const handleSubmitPoll = () => {
    setShowResults(true);
  };

  return (
    <div className="space-y-8">
      {/* Business Scenario */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Scenario Aziendale Reale
          </CardTitle>
          <p className="text-slate-300">TechCorp Inc. affronta una crisi nel customer service</p>
        </CardHeader>
        <CardContent>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-red-200 mb-3 text-lg">
              🚨 Situazione Critica
            </h4>
            <p className="text-red-100 leading-relaxed mb-4">
              Il team di customer service riceve <strong className="text-white">500+ email al giorno</strong> con richieste 
              di supporto, informazioni sui prodotti e reclami. I 5 operatori sono sopraffatti e 
              i tempi di risposta sono passati da 2 ore a <strong className="text-red-200">24-48 ore</strong>.
            </p>
            
            <Badge variant="destructive" className="bg-red-500/20 text-red-200 border-red-400/30">
              Perdita clienti: -15% ultimo trimestre
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/60 border border-blue-400/30 rounded-lg p-4 text-center">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-blue-200">Email/giorno</div>
              <div className="text-xs text-slate-400 mt-1">+200% vs anno scorso</div>
            </div>
            <div className="bg-slate-900/60 border border-green-400/30 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">5</div>
              <div className="text-sm text-green-200">Operatori</div>
              <div className="text-xs text-slate-400 mt-1">Stesso team da 2 anni</div>
            </div>
            <div className="bg-slate-900/60 border border-red-400/30 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">48h</div>
              <div className="text-sm text-red-200">Tempo risposta</div>
              <div className="text-xs text-slate-400 mt-1">Era 2h un anno fa</div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-200 text-sm">
                  <strong className="text-yellow-100">Conseguenze:</strong> Clienti insoddisfatti, stress del team, 
                  perdita di business e recensioni negative online. Il CEO ha dato 30 giorni per trovare una soluzione.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Poll */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">🗳️ Sondaggio Interattivo</CardTitle>
          <p className="text-slate-300">Condividi la tua esperienza: qual è la tua sfida principale con le email?</p>
        </CardHeader>
        <CardContent>
          {!showResults ? (
            <div className="space-y-6">
              <RadioGroup value={selectedChallenge} onValueChange={setSelectedChallenge}>
                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/40 border border-slate-600/30 hover:border-blue-400/50 transition-colors">
                      <RadioGroupItem value={challenge.id} id={challenge.id} className="border-blue-400 text-blue-400" />
                      <label htmlFor={challenge.id} className="text-slate-200 cursor-pointer flex-1">
                        {challenge.label}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              <Button 
                onClick={handleSubmitPoll}
                disabled={!selectedChallenge}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              >
                Vota e Vedi Risultati
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">📊 Risultati in tempo reale:</h4>
              {challenges.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={`${challenge.id === selectedChallenge ? 'font-semibold text-blue-300' : 'text-slate-300'}`}>
                      {challenge.label}
                    </span>
                    <span className="text-white font-medium">{challenge.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-700 ${
                        challenge.id === selectedChallenge 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-r from-slate-500 to-slate-600'
                      }`}
                      style={{ width: `${challenge.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    💡
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-200 mb-1">Insight dai Dati</h5>
                    <p className="text-blue-100 text-sm">
                      Il <strong>45% delle aziende</strong> lotta con il volume eccessivo di email. 
                      L'AI può automatizzare fino al <strong className="text-white">70% delle risposte standard</strong>, 
                      riducendo il carico di lavoro e migliorando i tempi di risposta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Solution Preview */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              AI
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-3 text-lg">
                🚀 Come l'AI può trasformare il customer service
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                  <div className="text-green-200 font-medium text-sm">BEFORE (Manuale)</div>
                  <div className="text-green-100 text-xs">48h risposta • 5 operatori • Stress elevato</div>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                  <div className="text-blue-200 font-medium text-sm">AFTER (AI-Powered)</div>
                  <div className="text-blue-100 text-xs">2h risposta • 70% automatizzato • Team rilassato</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Nelle prossime sezioni costruirai <strong className="text-white">step-by-step un prompt efficace</strong> per 
                automatizzare le risposte email mantenendo qualità e personalizzazione umana.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemScenario;
