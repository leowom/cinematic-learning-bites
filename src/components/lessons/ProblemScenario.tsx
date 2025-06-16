
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import GlassmorphismCard from '@/components/GlassmorphismCard';
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
      <GlassmorphismCard className="border-red-300/30 bg-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-300" />
          <h3 className="text-xl font-semibold text-white">Scenario Aziendale Reale</h3>
        </div>
        
        <GlassmorphismCard size="small" className="bg-white/10 mb-4">
          <h4 className="font-semibold text-white mb-2">
            TechCorp Inc. - Team Customer Service
          </h4>
          <p className="text-blue-100 leading-relaxed">
            Il team di customer service riceve <strong className="text-white">500+ email al giorno</strong> con richieste 
            di supporto, informazioni sui prodotti e reclami. I 5 operatori sono sopraffatti e 
            i tempi di risposta sono passati da 2 ore a 24-48 ore.
          </p>
        </GlassmorphismCard>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <GlassmorphismCard size="small" className="bg-white/10 text-center">
            <Mail className="w-8 h-8 text-blue-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-xs text-blue-200">Email/giorno</div>
          </GlassmorphismCard>
          <GlassmorphismCard size="small" className="bg-white/10 text-center">
            <Users className="w-8 h-8 text-green-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-xs text-blue-200">Operatori</div>
          </GlassmorphismCard>
          <GlassmorphismCard size="small" className="bg-white/10 text-center">
            <Clock className="w-8 h-8 text-red-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">48h</div>
            <div className="text-xs text-blue-200">Tempo risposta</div>
          </GlassmorphismCard>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-300/30 p-3 rounded-lg">
          <p className="text-yellow-100 text-sm">
            <strong className="text-yellow-200">Risultato:</strong> Clienti insoddisfatti, stress del team, perdita di business
          </p>
        </div>
      </GlassmorphismCard>

      {/* Interactive Poll */}
      <GlassmorphismCard>
        <h3 className="text-xl font-semibold text-white mb-2">Sondaggio Interattivo</h3>
        <p className="text-blue-200 mb-4">Qual è la tua sfida principale con le email?</p>
        
        {!showResults ? (
          <div className="space-y-4">
            <RadioGroup value={selectedChallenge} onValueChange={setSelectedChallenge}>
              {challenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={challenge.id} id={challenge.id} />
                  <label htmlFor={challenge.id} className="text-blue-100 cursor-pointer">
                    {challenge.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
            
            <Button 
              onClick={handleSubmitPoll}
              disabled={!selectedChallenge}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
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
                  <span className={challenge.id === selectedChallenge ? 'font-semibold text-blue-300' : 'text-blue-200'}>
                    {challenge.label}
                  </span>
                  <span className="text-white">{challenge.percentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      challenge.id === selectedChallenge ? 'bg-blue-400' : 'bg-white/40'
                    }`}
                    style={{ width: `${challenge.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            
            <GlassmorphismCard size="small" className="bg-blue-500/20 border-blue-300/30 mt-4">
              <p className="text-blue-100 text-sm">
                <strong className="text-blue-200">Insight:</strong> La maggior parte delle aziende lotta con il volume eccessivo. 
                L'AI può automatizzare fino al 70% delle risposte standard.
              </p>
            </GlassmorphismCard>
          </div>
        )}
      </GlassmorphismCard>

      {/* Problem Setup */}
      <GlassmorphismCard className="border-blue-300/30 bg-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 mb-2">
              Come l'AI può risolvere questo problema?
            </h4>
            <p className="text-blue-100 text-sm">
              Nelle prossime sezioni imparerai come costruire prompt efficaci per automatizzare 
              le risposte email mantenendo un tono professionale e personalizzato.
            </p>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default ProblemScenario;
