
import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { ZapIcon } from './icons/ZapIcon';

interface Message {
    sender: 'user' | 'ai';
    text: string;
    emotion?: number; // 0 a 100 (Nível de interesse do cliente)
}

const NeuroSalesModal: React.FC<{ isOpen: boolean; onClose: () => void; onShowToast?: (msg: string, type: 'success'|'error') => void }> = ({ isOpen, onClose, onShowToast }) => {
    const [step, setStep] = useState<'setup' | 'simulation' | 'report'>('setup');
    const [product, setProduct] = useState('');
    const [persona, setPersona] = useState<{name: string, role: string, objection: string} | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentInterest, setCurrentInterest] = useState(30); // Começa cético
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startSimulation = async () => {
        if (!product) return;
        setIsLoading(true);
        
        // 1. Gerar Persona com IA
        const personaPrompt = `
            Você é um Gerador de Personas para Treinamento de Vendas Corporativas High-Ticket.
            O usuário vende: "${product}".
            Crie uma persona de cliente DIFÍCIL, CÉTICO e EXIGENTE para esse produto.
            Retorne APENAS um JSON:
            {
                "name": "Nome",
                "role": "Cargo/Perfil (ex: Diretor Financeiro Conservador)",
                "objection": "A principal objeção oculta dele (ex: Acha caro demais, Já tem fornecedor)"
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
            const initialMsg = `Olá, sou ${pData.name}. Tenho pouco tempo. O que você tem de tão especial sobre esse tal de ${product}?`;
            setMessages([{ sender: 'ai', text: initialMsg, emotion: 30 }]);
            
        } catch (error) {
            console.error(error);
            onShowToast?.("Erro ao iniciar simulador.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !persona) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        // 2. Simular Resposta da IA e Analisar Emoção
        const chatPrompt = `
            ATUE COMO: ${persona.name}, ${persona.role}.
            CONTEXTO: O usuário está tentando te vender "${product}".
            SUA PERSONALIDADE: Cético, difícil, curto e grosso. Sua objeção oculta é: "${persona.objection}".
            
            HISTÓRICO:
            ${messages.map(m => `${m.sender === 'user' ? 'Vendedor' : 'Você'}: ${m.text}`).join('\n')}
            Vendedor: ${userMsg}

            TAREFA:
            1. Responda ao vendedor. Se ele falou algo genérico, seja duro. Se ele tocou na sua dor, mostre leve interesse.
            2. Dê uma nota de 0 a 100 do seu nível de interesse ATUAL (Começou em ${currentInterest}).
               - 0 = "Vou desligar"
               - 100 = "Onde eu assino?"
            
            RETORNE JSON:
            {
                "response": "Sua resposta curta e direta.",
                "interest_score": (número 0-100),
                "game_over": (boolean - true se você se irritou demais e encerrou, ou se comprou)
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
            
            setCurrentInterest(aiData.interest_score);
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                text: aiData.response, 
                emotion: aiData.interest_score 
            }]);

            if (aiData.game_over) {
                setTimeout(() => setStep('report'), 2000);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-0 md:p-4">
            <div className="w-full h-full md:w-[90vw] md:h-[90vh] bg-[#050505] border border-white/10 md:rounded-3xl flex flex-col relative overflow-hidden shadow-2xl">
                
                {/* Background Grid FX */}
                <div className="absolute inset-0 pointer-events-none opacity-20" 
                     style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Header */}
                <div className="bg-black/80 border-b border-white/10 p-4 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#0f0]"></div>
                        <span className="font-mono text-green-500 text-xs md:text-sm uppercase tracking-widest">CBL_SALES_PROTOCOL_v2.0</span>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white p-2"><XIcon /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
                    
                    {step === 'setup' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
                            <div className="space-y-4 max-w-2xl">
                                <h2 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                                    Teste de <span className="text-green-500">Mercado Real</span>
                                </h2>
                                <p className="text-white/60 font-mono text-xs md:text-sm uppercase tracking-widest leading-relaxed">
                                    Simule uma negociação hostil contra o Protocolo CBL. <br/>
                                    Se você não convencer nosso sistema, você não está pronto para o mercado.
                                </p>
                            </div>
                            
                            <div className="w-full max-w-md space-y-4">
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-black text-green-500 uppercase tracking-widest">O que você vende?</label>
                                    <input 
                                        type="text" 
                                        value={product}
                                        onChange={(e) => setProduct(e.target.value)}
                                        placeholder="Ex: Consultoria, Imóveis de Luxo, Software..."
                                        className="w-full bg-black border border-green-500/30 rounded-xl px-4 py-4 text-white focus:border-green-500 focus:shadow-[0_0_20px_rgba(0,255,0,0.2)] outline-none font-mono text-sm transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={startSimulation}
                                    disabled={!product || isLoading}
                                    className="w-full bg-green-600 hover:bg-green-500 text-black py-4 rounded-xl font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'ANALISANDO PERFIL...' : 'INICIAR PROTOCOLO'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'simulation' && persona && (
                        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                            {/* HUD Lateral (Emotion Monitor) */}
                            <div className="w-full md:w-80 bg-black/50 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col gap-6 shrink-0">
                                <div>
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-2">Cliente Alvo</span>
                                    <div className="border border-white/20 p-4 rounded-xl bg-white/5">
                                        <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                                        <p className="text-xs text-white/60 font-mono mt-1">{persona.role}</p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-2 text-center">Probabilidade de Fechamento</span>
                                    <div className="relative w-full h-64 bg-black border border-white/10 rounded-2xl overflow-hidden">
                                        {/* Barra de Progresso Vertical */}
                                        <div 
                                            className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out ${currentInterest < 30 ? 'bg-red-600' : (currentInterest < 70 ? 'bg-yellow-500' : 'bg-green-500')}`}
                                            style={{ height: `${currentInterest}%`, opacity: 0.5 }}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-white animate-pulse"></div>
                                        </div>
                                        
                                        {/* Valor Numérico */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={`text-6xl font-black ${currentInterest < 30 ? 'text-red-500' : (currentInterest < 70 ? 'text-yellow-500' : 'text-green-500')}`}>
                                                {currentInterest}%
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-center text-[10px] text-white/40 mt-2 font-mono uppercase">
                                        {currentInterest < 30 ? 'STATUS: PERDENDO O CLIENTE' : (currentInterest > 80 ? 'STATUS: CONTRATO PRÓXIMO' : 'STATUS: EM NEGOCIAÇÃO')}
                                    </p>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 flex flex-col bg-black/20 relative">
                                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed border ${
                                                msg.sender === 'user' 
                                                ? 'bg-white/10 border-white/10 text-white rounded-br-none' 
                                                : 'bg-green-900/10 border-green-500/30 text-green-100 rounded-bl-none font-mono shadow-[0_0_15px_rgba(0,255,0,0.05)]'
                                            }`}>
                                                <span className="block text-[9px] opacity-50 mb-1 uppercase tracking-wider font-bold">
                                                    {msg.sender === 'user' ? 'Você' : persona.name}
                                                </span>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-2xl rounded-bl-none">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black">
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Digite seu argumento de venda..."
                                            autoFocus
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none text-sm font-mono"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={isLoading || !input.trim()}
                                            className="bg-white/10 hover:bg-green-600 hover:text-black text-white px-6 rounded-xl font-bold uppercase text-xs tracking-widest transition-all disabled:opacity-50"
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {step === 'report' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/80 backdrop-blur-xl">
                            <div className="max-w-2xl w-full border border-white/10 bg-[#0A0A0A] p-8 rounded-3xl relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-2 ${currentInterest > 70 ? 'bg-green-500' : 'bg-red-600'}`}></div>
                                
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
                                    {currentInterest > 70 ? 'VENDA REALIZADA' : 'VENDA PERDIDA'}
                                </h3>
                                <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-8">
                                    Score de Negociação CBL: <span className="text-white font-bold">{currentInterest}/100</span>
                                </p>

                                <div className="bg-white/5 rounded-xl p-6 text-left mb-8">
                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Parecer Técnico Grupo CBL</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        {currentInterest > 70 
                                            ? "Você tem talento natural. Com nossas estratégias de tráfego pago, você poderia escalar esse resultado para milhares de leads por dia." 
                                            : "Sua oferta tem falhas na quebra de objeções. Se você rodar anúncios agora, vai queimar dinheiro. Precisamos reestruturar sua copy antes de escalar."}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                    <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-red-600/30">
                                        Agendar Consultoria de Ads
                                    </button>
                                    <button onClick={() => { setStep('setup'); setMessages([]); setCurrentInterest(30); }} className="flex-1 border border-white/10 hover:bg-white/5 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all">
                                        Tentar Novamente
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
