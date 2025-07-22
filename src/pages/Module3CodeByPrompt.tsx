import React, { useState, useEffect, useRef } from 'react';
import { Home, Copy, Check, Download, Code, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import CourseSidebar from '@/components/CourseSidebar';

const Module3CodeByPrompt: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prompt, setPrompt] = useState("Scrivimi il codice HTML, CSS e JavaScript per una calcolatrice semplice con le 4 operazioni base. Voglio che funzioni direttamente in un browser.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const { toast } = useToast();
  const calculatorRef = useRef<HTMLDivElement>(null);

  const calculatorCode = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: sans-serif; 
            text-align: center; 
            margin-top: 50px; 
            background: #1a2332;
            color: white;
        }
        .calculator {
            display: inline-block;
            background: #2a3441;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        #result {
            width: 220px; 
            height: 40px; 
            font-size: 20px; 
            margin-bottom: 10px;
            background: #1a2332;
            color: white;
            border: 1px solid #4a5568;
            text-align: right;
            padding: 0 10px;
            border-radius: 5px;
        }
        input[type="button"] {
            width: 50px; 
            height: 50px; 
            font-size: 18px; 
            margin: 2px;
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.2s;
        }
        input[type="button"]:hover {
            background: #3182ce;
        }
        .operator {
            background: #9f7aea !important;
        }
        .operator:hover {
            background: #805ad5 !important;
        }
        .equals {
            background: #48bb78 !important;
        }
        .equals:hover {
            background: #38a169 !important;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <input type="text" id="result" disabled><br>
        <input type="button" value="C" onclick="clearResult()">
        <input type="button" value="±" onclick="toggleSign()">
        <input type="button" value="%" onclick="press('%')">
        <input type="button" value="/" onclick="press('/')" class="operator"><br>
        <input type="button" value="7" onclick="press('7')">
        <input type="button" value="8" onclick="press('8')">
        <input type="button" value="9" onclick="press('9')">
        <input type="button" value="*" onclick="press('*')" class="operator"><br>
        <input type="button" value="4" onclick="press('4')">
        <input type="button" value="5" onclick="press('5')">
        <input type="button" value="6" onclick="press('6')">
        <input type="button" value="-" onclick="press('-')" class="operator"><br>
        <input type="button" value="1" onclick="press('1')">
        <input type="button" value="2" onclick="press('2')">
        <input type="button" value="3" onclick="press('3')">
        <input type="button" value="+" onclick="press('+')" class="operator"><br>
        <input type="button" value="0" onclick="press('0')" style="width: 102px;">
        <input type="button" value="." onclick="press('.')">
        <input type="button" value="=" onclick="calculate()" class="equals">
    </div>
    <script>
        let expression = "";
        let shouldReset = false;
        
        function press(val) {
            if (shouldReset) {
                expression = "";
                shouldReset = false;
            }
            expression += val;
            document.getElementById("result").value = expression;
        }
        
        function calculate() {
            try {
                let result = eval(expression);
                document.getElementById("result").value = result;
                expression = result.toString();
                shouldReset = true;
            } catch (e) {
                document.getElementById("result").value = "Errore";
                expression = "";
            }
        }
        
        function clearResult() {
            expression = "";
            document.getElementById("result").value = "";
        }
        
        function toggleSign() {
            if (expression) {
                if (expression.charAt(0) === '-') {
                    expression = expression.slice(1);
                } else {
                    expression = '-' + expression;
                }
                document.getElementById("result").value = expression;
            }
        }
    </script>
</body>
</html>`;


  const typewriterEffect = (text: string, speed: number = 30): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      setTypewriterText('');
      const timer = setInterval(() => {
        if (i < text.length) {
          setTypewriterText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  };

  const generateCode = async () => {
    setIsGenerating(true);
    setShowPreview(false);
    setShowCode(false);
    setGeneratedCode('');
    
    // Simulazione loading ridotta
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Effetto typewriter più veloce
    await typewriterEffect(calculatorCode, 8);
    
    setGeneratedCode(calculatorCode);
    setIsGenerating(false);
    setShowCode(true);
    
    // Mostra preview subito
    setTimeout(() => {
      setShowPreview(true);
      toast({
        title: "Codice generato!",
        description: "La tua calcolatrice è pronta e funzionante"
      });
    }, 500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copiato!",
      description: "Codice copiato negli appunti"
    });
  };

  const exportCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calcolatrice.html';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Esportato!",
      description: "File calcolatrice.html scaricato"
    });
  };


  // Calculator component for preview
  const CalculatorPreview = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [shouldReset, setShouldReset] = useState(false);

    const press = (val: string) => {
      if (shouldReset) {
        setExpression('');
        setShouldReset(false);
      }
      const newExpression = expression + val;
      setExpression(newExpression);
      setDisplay(newExpression);
    };

    const calculate = () => {
      try {
        const result = eval(expression);
        setDisplay(result.toString());
        setExpression(result.toString());
        setShouldReset(true);
      } catch (e) {
        setDisplay('Errore');
        setExpression('');
      }
    };

    const clearResult = () => {
      setExpression('');
      setDisplay('0');
    };

    const toggleSign = () => {
      if (expression) {
        const newExpression = expression.charAt(0) === '-' 
          ? expression.slice(1) 
          : '-' + expression;
        setExpression(newExpression);
        setDisplay(newExpression);
      }
    };

    return (
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 max-w-sm mx-auto">
        <input 
          type="text" 
          value={display}
          disabled
          className="w-full h-12 text-xl text-right bg-slate-900 text-white border border-slate-600 rounded px-3 mb-4"
        />
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={clearResult} className="bg-slate-600 hover:bg-slate-500 text-white h-12">C</Button>
          <Button onClick={toggleSign} className="bg-slate-600 hover:bg-slate-500 text-white h-12">±</Button>
          <Button onClick={() => press('%')} className="bg-slate-600 hover:bg-slate-500 text-white h-12">%</Button>
          <Button onClick={() => press('/')} className="bg-purple-600 hover:bg-purple-700 text-white h-12">÷</Button>
          
          <Button onClick={() => press('7')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">7</Button>
          <Button onClick={() => press('8')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">8</Button>
          <Button onClick={() => press('9')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">9</Button>
          <Button onClick={() => press('*')} className="bg-purple-600 hover:bg-purple-700 text-white h-12">×</Button>
          
          <Button onClick={() => press('4')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">4</Button>
          <Button onClick={() => press('5')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">5</Button>
          <Button onClick={() => press('6')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">6</Button>
          <Button onClick={() => press('-')} className="bg-purple-600 hover:bg-purple-700 text-white h-12">-</Button>
          
          <Button onClick={() => press('1')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">1</Button>
          <Button onClick={() => press('2')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">2</Button>
          <Button onClick={() => press('3')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">3</Button>
          <Button onClick={() => press('+')} className="bg-purple-600 hover:bg-purple-700 text-white h-12">+</Button>
          
          <Button onClick={() => press('0')} className="bg-blue-600 hover:bg-blue-700 text-white h-12 col-span-2">0</Button>
          <Button onClick={() => press('.')} className="bg-blue-600 hover:bg-blue-700 text-white h-12">.</Button>
          <Button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white h-12">=</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f1419 50%, #1a2434 100%)'
    }}>
      <div className="prompt-lab-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium">
              Modulo 3.3 - Code by Prompt
            </div>
            <div className="text-slate-400 text-sm">
              Crea app funzionanti con l'AI
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: 75%
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Sidebar */}
          <CourseSidebar 
            currentModuleId="modulo-3"
            currentLessonId="2"
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  🧠 LearningBites AI
                </h1>
                <p className="text-slate-300 text-lg">
                  MODULO 3.3 – Code by Prompt: crea un'app funzionante con l'AI
                </p>
              </div>

              {/* Introduzione */}
              <GlassmorphismCard className="mb-6">
                <div className="text-center mb-6">
                  <h3 className="text-white text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                    <Code className="w-6 h-6 text-blue-400" />
                    🎯 Obiettivo: Genera codice funzionante
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Scopri come l'AI può scrivere codice completo e funzionante. 
                    Questo esempio genera una calcolatrice HTML/CSS/JS che puoi usare subito!
                  </p>
                </div>
              </GlassmorphismCard>

              {/* Prompt Input */}
              <GlassmorphismCard className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  ✍️ Scrivi il tuo prompt
                </h3>
                
                <Textarea 
                  value={prompt} 
                  onChange={e => setPrompt(e.target.value)} 
                  placeholder="Descrivi l'app che vuoi creare..."
                  className="min-h-[120px] mb-4 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400" 
                />

                {showGuide && (
                  <div className="mb-4 p-4 bg-blue-900/20 rounded-lg border border-blue-600/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-blue-300 font-medium flex items-center gap-2">
                        🎯 Guida Interattiva
                      </h4>
                      <Button 
                        onClick={() => setShowGuide(false)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        ✕
                      </Button>
                    </div>
                    <p className="text-blue-200 text-sm mb-3">
                      👋 Benvenuto! Segui questa demo guidata per creare la tua prima app con l'AI.
                    </p>
                    <Button 
                      onClick={() => {
                        setPrompt("Scrivimi il codice HTML, CSS e JavaScript per una calcolatrice semplice con le 4 operazioni base. Voglio che funzioni direttamente in un browser.");
                        setShowGuide(false);
                        toast({
                          title: "Prompt precompilato!",
                          description: "Ora clicca 'Genera codice' per vedere la magia dell'AI"
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      🚀 Inizia la demo - Genera Calcolatrice
                    </Button>
                  </div>
                )}

                <Button 
                  onClick={generateCode} 
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      🛠️ L'AI sta scrivendo il codice...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      🚀 Genera codice
                    </>
                  )}
                </Button>
              </GlassmorphismCard>

              {/* Code Generation */}
              {(isGenerating || showCode) && (
                <GlassmorphismCard className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">
                      🖥️ Codice generato dall'AI
                    </h3>
                    {showCode && (
                      <div className="flex gap-2">
                        <Button onClick={copyCode} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copiato!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              📄 Copia codice
                            </>
                          )}
                        </Button>
                        <Button onClick={exportCode} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          ⬇️ Esporta .html
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono">
                      {isGenerating ? typewriterText : generatedCode}
                      {isGenerating && <span className="animate-pulse">|</span>}
                    </pre>
                  </div>
                </GlassmorphismCard>
              )}

              {/* Preview */}
              {showPreview && (
                <GlassmorphismCard className="mb-6">
                  <h3 className="text-white text-lg font-semibold mb-4 text-center">
                    📱 Anteprima: la tua app funziona!
                  </h3>
                  <div className="text-center">
                    <CalculatorPreview />
                    <p className="text-slate-400 text-sm mt-4">
                      ✅ La calcolatrice è completamente funzionante! Provala cliccando i pulsanti.
                    </p>
                  </div>
                </GlassmorphismCard>
              )}

              {/* Call to Action */}
              <GlassmorphismCard size="small">
                <h4 className="text-white font-semibold mb-3 text-center">🧠 Ora tocca a te!</h4>
                <div className="text-slate-300 text-sm space-y-3">
                  <p>
                    <strong>1. Vai sul tuo LLM preferito:</strong> ChatGPT, Claude, Gemini, ecc.
                  </p>
                  <p>
                    <strong>2. Prova a generare:</strong>
                  </p>
                  <ul className="ml-4 space-y-1 text-slate-400">
                    <li>• Una To-Do List interattiva</li>
                    <li>• Una pagina portfolio personale</li>
                    <li>• Un sistema di login finto (solo frontend)</li>
                    <li>• Un timer/cronometro</li>
                  </ul>
                  <p>
                    <strong>3. Usa il codice:</strong> Copia il codice generato, salvalo come file .html e aprilo nel browser.
                  </p>
                  <div className="text-center mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
                    <p className="text-blue-300 font-medium">
                      🎉 Con l'AI puoi costruire davvero qualsiasi interfaccia!
                    </p>
                  </div>
                </div>
              </GlassmorphismCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module3CodeByPrompt;