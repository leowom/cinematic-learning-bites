
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Mail, Users, Clock } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Business Scenario */}
      <Card className="bg-red-900/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Scenario Aziendale Reale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800/40 border border-white/20 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-white mb-2">
              TechCorp Inc. - Team Customer Service
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Il team di customer service riceve <strong className="text-white">500+ email al giorno</strong> con richieste 
              di supporto, informazioni sui prodotti e reclami. I 5 operatori sono sopraffatti e 
              i tempi di risposta sono passati da 2 ore a 24-48 ore.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-800/40 border border-white/20 rounded-lg p-4 text-center">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-slate-300">Email/giorno</div>
            </div>
            <div className="bg-slate-800/40 border border-white/20 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-xs text-slate-300">Operatori</div>
            </div>
            <div className="bg-slate-800/40 border border-white/20 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">48h</div>
              <div className="text-xs text-slate-300">Tempo risposta</div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-100">Risultato:</strong> Clienti insoddisfatti, stress del team, perdita di business
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Poll */}
      <Card className="bg-slate-800/40 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">🗳️ Sondaggio Interattivo</CardTitle>
          <p className="text-slate-300">Qual è la tua sfida principale con le email?</p>
        </CardHeader>
        <CardContent>
          {!showResults ? (
            <div className="space-y-4">
              <RadioGroup value={selectedChallenge} onValueChange={setSelectedChallenge}>
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={challenge.id} id={challenge.id} />
                    <label htmlFor={challenge.id} className="text-slate-200 cursor-pointer">
                      {challenge.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                onClick={handleSubmitPoll}
                disabled={!selectedChallenge}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Vota e Vedi Risultati
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Risultati in tempo reale:</h4>
              {challenges.map((challenge) => (
                <div key={challenge.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={challenge.id === selectedChallenge ? 'font-semibold text-blue-300' : 'text-slate-300'}>
                      {challenge.label}
                    </span>
                    <span className="text-white">{challenge.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        challenge.id === selectedChallenge ? 'bg-blue-500' : 'bg-slate-500'
                      }`}
                      style={{ width: `${challenge.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong className="text-blue-100">Insight:</strong> La maggior parte delle aziende lotta con il volume eccessivo. 
                  L'AI può automatizzare fino al 70% delle risposte standard.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Solution Preview */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div>
              <h4 className="font-semibold text-blue-200 mb-2">
                Come l'AI può risolvere questo problema?
              </h4>
              <p className="text-blue-100 text-sm">
                Nelle prossime sezioni costruirai step-by-step un prompt efficace per automatizzare 
                le risposte email mantenendo qualità e personalizzazione.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemScenario;
