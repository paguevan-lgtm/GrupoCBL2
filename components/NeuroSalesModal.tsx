
import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { ZapIcon } from './icons/ZapIcon';

interface Message {
    sender: 'user' | 'ai';
    text: string;
    emotion?: number; // 0 a 100 (Nível de interesse do cliente)
}

interface ReportAnalysis {
    copy_score: number;
    main_strength: string;
    critical_error: string;
    tactical_advice: string;
}

const NeuroSalesModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onOpenDiagnostic: () => void;
    onShowToast?: (msg: string, type: 'success'|'error') => void 
}> = ({ isOpen, onClose, onOpenDiagnostic, onShowToast }) => {
    const [step, setStep] = useState<'setup' | 'simulation' | 'analyzing' | 'report'>('setup');
    const [product, setProduct] = useState('');
    const [persona, setPersona] = useState<{name: string, role: string, objection: string, style: string} | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentInterest, setCurrentInterest] = useState(30); // Começa cético
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [simulationEnded, setSimulationEnded] = useState(false);
    const [reportData, setReportData] = useState<ReportAnalysis | null>(null);
    
    // Estados para animação de loading do report
    const [analysisLog, setAnalysisLog] = useState<string>("");
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, simulationEnded]);

    // Efeito de logs durante a análise
    useEffect(() => {
        if (step === 'analyzing') {
            const logs = [
                "Extraindo transcrição criptografada...",
                "Processando semântica via Engine CBL v4...",
                "Comparando com base de dados de alta conversão...",
                "Calculando score de persuasão...",
                "Gerando plano tático final..."
            ];
            let i = 0;
            const interval = setInterval(() => {
                if (i < logs.length) {
                    setAnalysisLog(logs[i]);
                    i++;
                }
            }, 800);
            return () => clearInterval(interval);
        }
    }, [step]);

    const startSimulation = async () => {
        if (!product) return;
        setIsLoading(true);
        setSimulationEnded(false);
        setReportData(null);
        setCurrentInterest(30);
        
        // 1. Gerar Persona com IA (Contextualizada ao Produto)
        const personaPrompt = `
            ATUE COMO: Gerador de Cenários de Vendas Reais.
            OFERTA DO USUÁRIO: "${product}".
            
            TAREFA: Crie uma persona de comprador EXTREMAMENTE REALISTA para este nicho.
            
            DIRETRIZES IMPORTANTES:
            1. A persona tem uma DOR ESPECÍFICA (ex: precisa de durabilidade, ou preço, ou status).
            2. A objeção deve ser COERENTE. Se o produto é "Motos", a objeção não pode ser técnica demais LOGO DE CARA (ex: "suspensão invertida") a menos que o vendedor ofereça uma moto esportiva.
            3. O estilo deve ser de alguém ocupado, que quer resolver um problema.
            
            Retorne JSON estrito:
            {
                "name": "Nome Brasileiro",
                "role": "Quem é ele? (ex: Entregador Autônomo, Diretor de Logística, Estudante)",
                "objection": "A preocupação central dele (ex: Custo de manutenção alto, Revenda ruim, Durabilidade duvidosa)",
                "style": "Estilo de fala (ex: Prático e direto, Desconfiado, Analítico)"
            }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: personaPrompt,
                    model: 'gemini-3-flash-preview',
                    config: { responseMimeType: 'application/json' }
                })
            });

            const data = await response.json();
            const pData = JSON.parse(data.text);
            setPersona(pData);
            setStep('simulation');
            
            // Primeira mensagem da IA
            const initialMsg = `Aqui é ${pData.name}. Vi seu anúncio sobre ${product}. O que você tem pra mim?`;
            setMessages([{ sender: 'ai', text: initialMsg, emotion: 30 }]);
            
        } catch (error) {
            console.error(error);
            onShowToast?.("Erro ao iniciar sistema.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !persona || simulationEnded) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);
        setIsTyping(true); // Efeito visual

        // 2. Simular Resposta da IA e Analisar Emoção (Com foco no PRODUTO)
        const chatPrompt = `
            PERSONAGEM: ${persona.name} (${persona.role}).
            ESTILO: ${persona.style}.
            DOR/OBJEÇÃO: ${persona.objection}.
            NICHIO: "${product}".
            
            HISTÓRICO DA CONVERSA:
            ${messages.map(m => `${m.sender === 'user' ? 'Vendedor' : 'Você'}: ${m.text}`).join('\n')}
            Vendedor (Agora): "${userMsg}"

            REGRAS DE INTELIGÊNCIA DE VENDAS (CRÍTICO):
            1. NÃO ALUCINE SPECS TÉCNICAS: Se o vendedor ainda não disse qual modelo/produto específico é, NÃO comece a falar de "suspensão invertida", "arrefecimento líquido" ou peças específicas. VOCÊ NÃO SABE O QUE ELE ESTÁ VENDENDO AINDA.
            2. FLUXO LÓGICO:
               - Se o vendedor foi genérico (ex: "tenho várias opções"), sua resposta deve ser EXPOR SUA NECESSIDADE para ver se ele tem o produto certo. (Ex: "Ok, mas eu rodo 200km por dia em estrada de terra. Você tem algo que aguenta isso ou suas motos são de plástico?").
               - SÓ CRITIQUE TÉCNICA SE ELE APRESENTOU O PRODUTO. Se ele falou "Tenho a Moto X", aí sim você ataca os defeitos da Moto X.
            3. SEJA UM COMPRADOR REAL: Compradores reais não fazem quiz técnico do nada. Eles querem saber se resolve o problema deles.
            4. Se o vendedor for "sabonete" (não responde, enrola), seja rude e diminua o interesse.
            5. Se o interesse passar de 90, feche o negócio.

            INTERESSE ATUAL: ${currentInterest} (0-100)

            RETORNE JSON:
            {
                "response": "Sua resposta na primeira pessoa. Curta, grossa ou interessada, dependendo do contexto.",
                "interest_score": (Novo score baseado na lógica acima),
                "game_over": (boolean - true APENAS se vendeu ou se mandou o vendedor passear)
            }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: chatPrompt,
                    model: 'gemini-3-flash-preview',
                    config: { responseMimeType: 'application/json' }
                })
            });

            const data = await response.json();
            const aiData = JSON.parse(data.text);
            
            // Delay artificial para leitura
            setTimeout(() => {
                setIsTyping(false);
                setCurrentInterest(aiData.interest_score);
                setMessages(prev => [...prev, { 
                    sender: 'ai', 
                    text: aiData.response, 
                    emotion: aiData.interest_score 
                }]);

                if (aiData.game_over) {
                    setSimulationEnded(true);
                }
                setIsLoading(false);
            }, 1500);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const generateDetailedReport = async () => {
        setStep('analyzing');
        
        const historyText = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
        
        const reportPrompt = `
            ATUE COMO: Especialista em Vendas e Copywriting.
            PRODUTO VENDIDO: "${product}".
            ANALISE ESTA TRANSCRIÇÃO DE VENDAS:
            
            ${historyText}
            
            RESULTADO FINAL: Interesse ${currentInterest}/100.
            
            TAREFA: Gere um feedback TÉCNICO sobre a argumentação do vendedor.
            
            RETORNE JSON:
            {
                "copy_score": (Nota 0-10),
                "main_strength": "O melhor argumento usado (cite a frase se houver).",
                "critical_error": "Onde ele errou na condução (ex: foi genérico, não fez perguntas de qualificação).",
                "tactical_advice": "O que ele deveria ter dito para controlar a venda melhor."
            }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: reportPrompt,
                    model: 'gemini-3-flash-preview',
                    config: { responseMimeType: 'application/json' }
                })
            });

            const data = await response.json();
            const report = JSON.parse(data.text);
            
            setTimeout(() => {
                setReportData(report);
                setStep('report');
            }, 3000);

        } catch (error) {
            console.error(error);
            onShowToast?.("Erro ao processar análise do sistema.", "error");
            setStep('simulation');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-300">
            <div className="w-full h-full md:w-[95vw] md:h-[95vh] bg-[#050505] border border-white/10 md:rounded-3xl flex flex-col relative overflow-hidden shadow-2xl">
                
                {/* Background Grid FX */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                     style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Header (Desktop & Mobile Unified with different styles) */}
                <div className="bg-[#0A0A0A] border-b border-white/10 p-3 md:p-4 px-4 md:px-6 flex justify-between items-center relative z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <div>
                             <span className="font-black text-white text-xs md:text-sm uppercase tracking-tighter block">Sales Lab</span>
                             <span className="font-mono text-green-500 text-[8px] md:text-[9px] uppercase tracking-widest block opacity-70">Engine v3.0</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"><XIcon /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
                    
                    {step === 'setup' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-10 animate-in zoom-in-95 duration-500">
                            <div className="space-y-4 max-w-2xl relative">
                                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                                <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter relative z-10">
                                    Valide sua <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700">Oferta</span>
                                </h2>
                                <p className="text-white/60 font-mono text-xs md:text-sm uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
                                    Simulador de negociação via Algoritmo Comportamental CBL. <br/>
                                    Descubra se sua copy converte antes de ir para o mercado.
                                </p>
                            </div>
                            
                            <div className="w-full max-w-md space-y-6 relative z-10">
                                <div className="space-y-2 text-left bg-white/5 p-1 rounded-2xl border border-white/10 focus-within:border-green-500/50 transition-colors">
                                    <input 
                                        type="text" 
                                        value={product}
                                        onChange={(e) => setProduct(e.target.value)}
                                        placeholder="O que você vende? (Ex: Consultoria Tech)"
                                        className="w-full bg-transparent border-none rounded-xl px-6 py-5 text-white placeholder-white/20 focus:ring-0 outline-none font-bold text-lg text-center"
                                        onKeyDown={(e) => e.key === 'Enter' && startSimulation()}
                                    />
                                </div>
                                <button 
                                    onClick={startSimulation}
                                    disabled={!product || isLoading}
                                    className="w-full bg-green-600 hover:bg-green-500 text-black py-5 rounded-xl font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:shadow-[0_0_50px_rgba(22,163,74,0.5)]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <ZapIcon className="w-4 h-4 animate-spin" /> INICIALIZANDO SISTEMA...
                                        </span>
                                    ) : 'INICIAR SIMULAÇÃO'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'simulation' && persona && (
                        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                            {/* Top Bar for Mobile / Sidebar for Desktop */}
                            <div className="w-full md:w-80 bg-[#080808] border-b md:border-b-0 md:border-r border-white/5 p-3 md:p-6 flex flex-row md:flex-col gap-3 md:gap-8 shrink-0 items-center md:items-stretch justify-between md:justify-start min-h-[60px] md:h-auto">
                                
                                {/* Info do Cliente - Compacto no Mobile */}
                                <div className="flex items-center gap-3 md:block">
                                    <div className="hidden md:block text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">Cliente Detectado</div>
                                    <div className="flex items-center gap-3 md:border md:border-white/10 md:p-4 md:rounded-xl md:bg-white/[0.02]">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] md:text-xs font-bold border border-white/20 shrink-0">
                                            {persona.name.charAt(0)}
                                        </div>
                                        <div>
                                             <h3 className="text-xs md:text-sm font-bold text-white leading-none line-clamp-1">{persona.name}</h3>
                                             <p className="text-[10px] text-white/50 font-mono mt-0.5 md:mt-1 leading-none line-clamp-1">{persona.role}</p>
                                        </div>
                                    </div>
                                    {/* Style Tag - Hidden on tiny screens, block on md */}
                                    <div className="hidden md:flex gap-2 mt-3">
                                        <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[8px] text-white/60 uppercase">{persona.style}</span>
                                    </div>
                                </div>

                                {/* Termômetro Mobile (Barra Horizontal Fina) / Desktop (Barra Vertical) */}
                                <div className="flex-1 md:flex-none flex md:flex-col justify-end md:justify-center max-w-[120px] md:max-w-none">
                                    <span className="hidden md:block text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3 text-left">Termômetro</span>
                                    
                                    {/* Desktop Vertical */}
                                    <div className="hidden md:block relative w-full h-48 bg-black border border-white/10 rounded-2xl overflow-hidden">
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out"
                                            style={{ 
                                                height: `${currentInterest}%`, 
                                                backgroundColor: currentInterest < 30 ? '#ef4444' : (currentInterest < 70 ? '#eab308' : '#22c55e'),
                                                opacity: 0.8
                                            }}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/50 shadow-[0_0_10px_white]"></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center z-10 flex-col">
                                            <span className="text-4xl font-black text-white drop-shadow-lg">{currentInterest}</span>
                                            <span className="text-[8px] uppercase tracking-widest text-white/60">Score</span>
                                        </div>
                                    </div>

                                    {/* Mobile Horizontal - Compacto */}
                                    <div className="block md:hidden w-full">
                                         <div className="flex justify-between text-[8px] font-mono text-white/50 mb-1 tracking-wider uppercase">
                                            <span>Interesse</span>
                                            <span className={currentInterest > 70 ? 'text-green-500' : (currentInterest < 40 ? 'text-red-500' : 'text-yellow-500')}>{currentInterest}%</span>
                                         </div>
                                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full transition-all duration-1000 ease-out rounded-full"
                                                style={{ 
                                                    width: `${currentInterest}%`, 
                                                    backgroundColor: currentInterest < 30 ? '#ef4444' : (currentInterest < 70 ? '#eab308' : '#22c55e')
                                                }}
                                            />
                                         </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 flex flex-col bg-[#050505] relative w-full min-w-0">
                                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-6 custom-scrollbar scroll-smooth">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                            <div className={`max-w-[90%] md:max-w-[70%] p-3.5 md:p-5 rounded-2xl md:rounded-3xl text-sm md:text-base leading-relaxed relative group shadow-sm ${
                                                msg.sender === 'user' 
                                                ? 'bg-white text-black rounded-tr-none' 
                                                : 'bg-[#111] border border-white/10 text-gray-200 rounded-tl-none font-light'
                                            }`}>
                                                {msg.sender === 'ai' && (
                                                    <span className="block mb-1 text-[8px] font-black text-white/30 uppercase tracking-widest">
                                                        {persona.name}
                                                    </span>
                                                )}
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {isTyping && (
                                        <div className="flex justify-start animate-in fade-in duration-300">
                                            <div className="bg-[#111] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-75"></div>
                                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150"></div>
                                            </div>
                                        </div>
                                    )}

                                    {simulationEnded && !isLoading && (
                                        <div className="my-8 border-t border-b border-white/10 py-6 bg-white/[0.02] flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 text-xl ${currentInterest > 75 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                {currentInterest > 75 ? '✓' : '✕'}
                                            </div>
                                            <h4 className="text-white font-black uppercase text-lg tracking-widest mb-1">
                                                {currentInterest > 75 ? 'Sucesso' : 'Falha'}
                                            </h4>
                                            <p className="text-white/40 text-xs font-mono max-w-md mb-6 px-4">
                                                Simulação finalizada. Gere o relatório para ver onde acertou e errou.
                                            </p>
                                            <button 
                                                onClick={generateDetailedReport}
                                                className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
                                            >
                                                <ZapIcon className="w-4 h-4" /> Análise de Copy
                                            </button>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="p-3 md:p-6 border-t border-white/10 bg-[#0A0A0A] relative z-20">
                                    <div className="flex gap-2 md:gap-4 relative">
                                        <input 
                                            type="text" 
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={simulationEnded ? "Sessão encerrada." : "Digite sua resposta..."}
                                            autoFocus
                                            disabled={simulationEnded || isLoading || isTyping}
                                            className="flex-1 bg-[#151515] border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-white focus:border-white/30 outline-none text-sm transition-all disabled:opacity-50 placeholder-white/20"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={simulationEnded || isLoading || isTyping || !input.trim()}
                                            className="bg-green-600 hover:bg-green-500 text-black px-4 md:px-8 rounded-xl md:rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(22,163,74,0.2)] hover:shadow-[0_0_30px_rgba(22,163,74,0.4)] flex items-center justify-center"
                                        >
                                            <span className="hidden md:inline">Enviar</span>
                                            <span className="md:hidden text-lg">→</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {step === 'analyzing' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#050505] relative overflow-hidden">
                             {/* Fundo Matrix sutil */}
                             <div className="absolute inset-0 opacity-10" style={{ 
                                 backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .3) 25%, rgba(34, 197, 94, .3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .3) 75%, rgba(34, 197, 94, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .3) 25%, rgba(34, 197, 94, .3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .3) 75%, rgba(34, 197, 94, .3) 76%, transparent 77%, transparent)',
                                 backgroundSize: '50px 50px'
                             }}></div>

                             <div className="relative z-10 flex flex-col items-center gap-8">
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
                                    <div className="absolute inset-0 rounded-full border-t-2 border-green-500 animate-spin"></div>
                                    <div className="absolute inset-2 rounded-full border-t-2 border-green-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ZapIcon className="w-8 h-8 text-green-500 animate-pulse" />
                                    </div>
                                </div>
                                
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Processando Dados</h3>
                                    <p className="text-green-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">{analysisLog}</p>
                                </div>
                             </div>
                        </div>
                    )}

                    {step === 'report' && reportData && (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#050505] overflow-y-auto custom-scrollbar">
                            <div className="w-full max-w-4xl animate-in slide-in-from-bottom-10 duration-500">
                                
                                {/* Header do Report */}
                                <div className="text-center mb-10">
                                    <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 mb-4">
                                        Auditoria do Sistema CBL
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-2">
                                        Feedback <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Tático</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    
                                    {/* Score Card */}
                                    <div className="md:col-span-4 bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className={`text-7xl font-black mb-2 tracking-tighter ${reportData.copy_score >= 7 ? 'text-green-500' : (reportData.copy_score >= 5 ? 'text-yellow-500' : 'text-red-500')}`}>
                                            {reportData.copy_score}<span className="text-2xl text-white/20">/10</span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Nota de Persuasão</span>
                                    </div>

                                    {/* Pontos Fortes e Fracos */}
                                    <div className="md:col-span-8 space-y-6">
                                        {/* Strength */}
                                        <div className="bg-[#0f1d13] border border-green-500/20 p-6 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                            <h4 className="flex items-center gap-2 text-green-500 font-black uppercase text-xs tracking-widest mb-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                Ponto Alto da Conversa
                                            </h4>
                                            <p className="text-green-100/80 text-sm leading-relaxed font-light">"{reportData.main_strength}"</p>
                                        </div>

                                        {/* Weakness */}
                                        <div className="bg-[#1f0f0f] border border-red-500/20 p-6 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                            <h4 className="flex items-center gap-2 text-red-500 font-black uppercase text-xs tracking-widest mb-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                Falha Crítica
                                            </h4>
                                            <p className="text-red-100/80 text-sm leading-relaxed font-light">"{reportData.critical_error}"</p>
                                        </div>
                                    </div>

                                    {/* Tactical Advice - Full Width */}
                                    <div className="md:col-span-12 mt-4">
                                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative">
                                            <div className="absolute -top-3 left-8 bg-[#050505] px-4 text-white font-mono text-[10px] uppercase tracking-widest border border-white/10 py-1 rounded-full">
                                                Conselho do Sistema
                                            </div>
                                            <p className="text-white text-lg font-light leading-relaxed italic">
                                                "{reportData.tactical_advice}"
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
                                    <button 
                                        onClick={onOpenDiagnostic} 
                                        className="bg-white text-black px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                    >
                                        Profissionalizar Minha Copy
                                    </button>
                                    <button 
                                        onClick={() => { setStep('setup'); setMessages([]); setCurrentInterest(30); }} 
                                        className="border border-white/20 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-colors"
                                    >
                                        Reiniciar Lab
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default NeuroSalesModal;
