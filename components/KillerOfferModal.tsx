import React, { useState, useEffect } from 'react';
import { X, Zap, Target, DollarSign, MessageCircle, Copy, Check } from 'lucide-react';
import { Lead } from './AdminDashboard';

interface KillerOfferModalProps {
    lead: Lead;
    onClose: () => void;
    onOpenWhatsapp: (text: string) => void;
}

interface OfferStrategy {
    hook: string;
    pain_point: string;
    solution_name: string;
    price_anchor: string;
    script: string;
    bonus: string;
}

const KillerOfferModal: React.FC<KillerOfferModalProps> = ({ lead, onClose, onOpenWhatsapp }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [strategy, setStrategy] = useState<OfferStrategy | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generateKillerOffer();
    }, [lead]);

    const generateKillerOffer = async () => {
        setIsLoading(true);
        try {
            const prompt = `
            Atue como um estrategista de vendas agressivo e especialista em ofertas irresistíveis (Alex Hormozi style).
            Analise este lead e crie uma oferta única e matadora para vender um serviço digital.
            
            DADOS DO LEAD:
            Nome: ${lead.name}
            Tipo: ${lead.types ? lead.types[0] : 'Comércio Local'}
            Nota: ${lead.rating} (${lead.user_ratings_total} avaliações)
            Endereço: ${lead.address}
            Site: ${lead.website || 'Sem site'}
            Status Site: ${lead.status_site}
            
            O QUE VOCÊ DEVE FAZER:
            1. Identifique a maior dor oculta dele (ex: se tem nota baixa, é reputação; se não tem site, é invisibilidade; se tem site ruim, é perda de dinheiro).
            2. Crie um nome de "Micro-Serviço" específico para resolver isso (NÃO use termos genéricos como "Gestão de Tráfego"). Use nomes como "Sistema de Blindagem de Reputação", "Máquina de Agendamento Automático", "Reativação de Clientes Antigos".
            3. Defina um preço âncora (alto) e um preço de oferta (baixo/irresistível).
            4. Escreva um script de abordagem curto, direto e que toque na ferida.
            
            RETORNE APENAS JSON:
            {
                "hook": "Uma frase curta que chame atenção imediata (ex: 'Vi que você está perdendo clientes por causa de X')",
                "pain_point": "A dor principal identificada",
                "solution_name": "Nome sexy do serviço",
                "price_anchor": "De R$ XXX por R$ YYY",
                "script": "O texto da mensagem para enviar no WhatsApp",
                "bonus": "Um bônus rápido para fechar agora (ex: 'Configuração do Google Meu Negócio Grátis')"
            }
            `;

            const response = await fetch('/api/generate-strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();
            const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '');
            setStrategy(JSON.parse(cleanText));
        } catch (error) {
            console.error("Erro ao gerar oferta", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (strategy) {
            navigator.clipboard.writeText(strategy.script);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!lead) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-[#0c0c0c] border border-red-900/30 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header Explosivo */}
                <div className="p-6 bg-gradient-to-r from-red-900/20 to-black border-b border-red-900/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-600 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
                            <Target className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Oferta Matadora</h2>
                            <p className="text-red-500 text-xs font-mono uppercase tracking-widest">Sniper Mode Ativado</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                        <X />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-white/50 text-sm font-mono animate-pulse">Analisando pontos fracos do alvo...</p>
                        </div>
                    ) : strategy ? (
                        <>
                            {/* A Dor e a Solução */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#111] border border-white/5 p-4 rounded-2xl">
                                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Ponto Fraco (A Dor)</h3>
                                    <p className="text-white font-medium leading-relaxed">{strategy.pain_point}</p>
                                </div>
                                <div className="bg-[#111] border border-green-500/20 p-4 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 blur-2xl rounded-full"></div>
                                    <h3 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">A Solução (O Produto)</h3>
                                    <p className="text-xl font-black text-white uppercase italic tracking-tight">{strategy.solution_name}</p>
                                </div>
                            </div>

                            {/* O Gancho e Preço */}
                            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-white/5 p-5 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Gancho de Atenção</h3>
                                        <p className="text-white/80 italic">"{strategy.hook}"</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Oferta</h3>
                                        <p className="text-lg font-black text-yellow-500">{strategy.price_anchor}</p>
                                    </div>
                                </div>
                                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                    <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Bônus "Só Hoje"</h3>
                                    <p className="text-sm text-white/70">{strategy.bonus}</p>
                                </div>
                            </div>

                            {/* O Script */}
                            <div className="bg-[#111] border border-white/10 rounded-2xl p-1">
                                <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                                    <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest">Script de Venda</h3>
                                    <button 
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white transition-colors"
                                    >
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        {copied ? 'COPIADO' : 'COPIAR'}
                                    </button>
                                </div>
                                <div className="p-4">
                                    <textarea 
                                        className="w-full bg-transparent text-white text-sm leading-relaxed resize-none outline-none h-32 font-mono"
                                        value={strategy.script}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-white/50">Falha ao gerar estratégia. Tente novamente.</div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-[#111] flex gap-4">
                    <button 
                        onClick={() => generateKillerOffer()}
                        className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                        <Zap size={18} />
                        Gerar Outra
                    </button>
                    <button 
                        onClick={() => strategy && onOpenWhatsapp(strategy.script)}
                        disabled={!strategy}
                        className="flex-[2] py-4 rounded-xl bg-green-600 text-white font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MessageCircle size={18} />
                        Enviar Oferta Agora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KillerOfferModal;
