
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
      {/* Business Scenario Card */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <CardTitle className="text-red-800">Scenario Aziendale Reale</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white/80 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              TechCorp Inc. - Team Customer Service
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Il team di customer service riceve <strong>500+ email al giorno</strong> con richieste 
              di supporto, informazioni sui prodotti e reclami. I 5 operatori sono sopraffatti e 
              i tempi di risposta sono passati da 2 ore a 24-48 ore.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white/60 p-3 rounded-lg text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">500+</div>
              <div className="text-xs text-gray-600">Email/giorno</div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">5</div>
              <div className="text-xs text-gray-600">Operatori</div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg text-center">
              <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">48h</div>
              <div className="text-xs text-gray-600">Tempo risposta</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Risultato:</strong> Clienti insoddisfatti, stress del team, perdita di business
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Poll */}
      <Card>
        <CardHeader>
          <CardTitle>Sondaggio Interattivo</CardTitle>
          <p className="text-gray-600">Qual è la tua sfida principale con le email?</p>
        </CardHeader>
        <CardContent>
          {!showResults ? (
            <div className="space-y-4">
              <RadioGroup value={selectedChallenge} onValueChange={setSelectedChallenge}>
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={challenge.id} id={challenge.id} />
                    <label htmlFor={challenge.id} className="text-gray-700 cursor-pointer">
                      {challenge.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                onClick={handleSubmitPoll}
                disabled={!selectedChallenge}
                className="w-full mt-4"
              >
                Vota e Vedi Risultati
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Risultati in tempo reale:</h4>
              {challenges.map((challenge) => (
                <div key={challenge.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={challenge.id === selectedChallenge ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                      {challenge.label}
                    </span>
                    <span className="text-gray-800">{challenge.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        challenge.id === selectedChallenge ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${challenge.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>Insight:</strong> La maggior parte delle aziende lotta con il volume eccessivo. 
                  L'AI può automatizzare fino al 70% delle risposte standard.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Problem Setup */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Come l'AI può risolvere questo problema?
              </h4>
              <p className="text-blue-700 text-sm">
                Nelle prossime sezioni imparerai come costruire prompt efficaci per automatizzare 
                le risposte email mantenendo un tono professionale e personalizzato.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemScenario;
