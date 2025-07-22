import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, MessageSquare, Send, BookOpen, ArrowLeft,
  Lightbulb, Brain, Zap, Star, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  format?: 'text' | 'list' | 'example';
}

const AITutor = () => {
  const navigate = useNavigate();
  const { userProfile, loading } = useUserRole();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [responseFormat, setResponseFormat] = useState<'text' | 'list' | 'example'>('text');

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: `Ciao ${userProfile?.first_name || 'studente'}! 👋 Sono il tuo Personal AI Tutor. Sono qui per aiutarti con qualsiasi domanda sui corsi di AI e Prompt Engineering. \n\nPuoi chiedermi:\n• Spiegazioni sui concetti\n• Esempi pratici\n• Suggerimenti di studio\n• Chiarimenti sulle lezioni\n\nCome posso aiutarti oggi?`,
      timestamp: new Date(),
      format: 'text'
    };
    setMessages([welcomeMessage]);
  }, [userProfile]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        format: responseFormat
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('prompt engineering') || lowerQuestion.includes('prompt')) {
      return `Eccellente domanda sul Prompt Engineering! 🎯\n\nIl Prompt Engineering è l'arte di comunicare efficacemente con i modelli AI. Ecco i principi fondamentali:\n\n• **Chiarezza**: Sii specifico e dettagliato\n• **Contesto**: Fornisci informazioni rilevanti\n• **Esempi**: Usa esempi per guidare l'output\n• **Ruolo**: Definisci il ruolo dell'AI\n\nVuoi che approfondisca una tecnica specifica?`;
    }
    
    if (lowerQuestion.includes('chain of thought') || lowerQuestion.includes('cot')) {
      return `La Chain of Thought è una tecnica potente! 🧠\n\n**Come funziona:**\n1. Chiedi all'AI di "pensare passo dopo passo"\n2. L'AI mostra il suo ragionamento\n3. Ottieni risposte più accurate e verificabili\n\n**Esempio:**\n"Risolvi questo problema passo dopo passo: Se ho 15 mele e ne do 3 a Marco e 5 a Lisa, quante me ne rimangono?"\n\nVuoi provare un esercizio pratico?`;
    }
    
    if (lowerQuestion.includes('aiuto') || lowerQuestion.includes('help') || lowerQuestion.includes('non capisco')) {
      return `Non preoccuparti, sono qui per aiutarti! 💪\n\nEcco come posso supportarti:\n\n🔍 **Spiegazioni semplici** - Posso semplificare concetti complessi\n📚 **Esempi pratici** - Ti mostro come applicare le tecniche\n🎯 **Esercizi guidati** - Pratichiamo insieme\n💡 **Suggerimenti personalizzati** - Consigli basati sui tuoi progressi\n\nDimmi su cosa vuoi concentrarti e ti aiuto passo dopo passo!`;
    }
    
    return `Interessante domanda! 🤔\n\nBasandomi sui contenuti del corso, posso aiutarti con:\n\n• Concetti fondamentali di AI\n• Tecniche di prompting avanzate\n• Best practices e ottimizzazioni\n• Esempi pratici e casi d'uso\n\nPuoi essere più specifico su cosa vuoi approfondire? Così posso fornirti una risposta più mirata e utile! 🎯`;
  };

  const formatMessage = (message: Message) => {
    if (message.format === 'list') {
      return message.content.split('\n').map((line, index) => (
        <div key={index} className={line.startsWith('•') ? 'ml-4' : ''}>{line}</div>
      ));
    }
    
    return message.content.split('\n').map((line, index) => (
      <div key={index} className="mb-1">{line}</div>
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading AI Tutor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium text-xl flex items-center">
              <Bot className="w-6 h-6 mr-2 text-indigo-400" />
              Personal AI Tutor
            </div>
            <div className="text-slate-400 text-sm">
              Il tuo assistente personale per l'apprendimento AI
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-indigo-300 border-indigo-500/50">
              AI Powered
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200 h-[calc(100vh-200px)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Conversazione con AI Tutor
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="text-slate-300">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-700/50 text-slate-200'
                        }`}>
                          <div className="text-sm">
                            {formatMessage(message)}
                          </div>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString('it-IT', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-700/50 text-slate-200 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="border-t border-slate-600 pt-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Fai una domanda al tuo AI Tutor..."
                      className="flex-1 bg-slate-700 border-slate-600 text-slate-200"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Azioni Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Lightbulb className="w-4 h-4 mr-3 text-yellow-400" />
                    Suggerisci argomenti
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <BookOpen className="w-4 h-4 mr-3 text-blue-400" />
                    Materiali correlati
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Brain className="w-4 h-4 mr-3 text-purple-400" />
                    Quiz di verifica
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" variant="ghost">
                    <Star className="w-4 h-4 mr-3 text-green-400" />
                    Prossimi obiettivi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response Format */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Formato Risposta</CardTitle>
                <CardDescription className="text-slate-400">
                  Personalizza come vuoi ricevere le risposte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    variant={responseFormat === 'text' ? 'default' : 'outline'}
                    onClick={() => setResponseFormat('text')}
                    className="w-full justify-start"
                  >
                    Testo semplice
                  </Button>
                  <Button 
                    size="sm" 
                    variant={responseFormat === 'list' ? 'default' : 'outline'}
                    onClick={() => setResponseFormat('list')}
                    className="w-full justify-start"
                  >
                    Elenco puntato
                  </Button>
                  <Button 
                    size="sm" 
                    variant={responseFormat === 'example' ? 'default' : 'outline'}
                    onClick={() => setResponseFormat('example')}
                    className="w-full justify-start"
                  >
                    Esempio pratico
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="bg-slate-800/50 border-slate-700/50 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white text-lg">Statistiche Sessione</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Domande fatte:</span>
                    <span className="text-slate-200">{messages.filter(m => m.type === 'user').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risposte ricevute:</span>
                    <span className="text-slate-200">{messages.filter(m => m.type === 'ai').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Argomenti trattati:</span>
                    <span className="text-slate-200">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;