
import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './icons/Logo';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LocationIcon } from './icons/LocationIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TargetIcon } from './icons/TargetIcon';
import { ZapIcon } from './icons/ZapIcon';
import { XIcon } from './icons/XIcon';
import { ConsultingIcon } from './icons/ConsultingIcon'; 
import { BrainIcon } from './icons/BrainIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { MenuIcon } from './icons/MenuIcon';
import { LocalDB, Task, WarRoomData, MarketingData } from '../utils/localDb';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Lead {
  id: string;
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  website?: string;
  url?: string;
  phone?: string;
  international_phone?: string;
  lead_score: number;
  status_site: 'com_site' | 'sem_site' | 'site_basico';
  place_id: string;
  types: string[];
  price_level?: number;
  business_status?: string;
  opening_hours?: { open_now: boolean, weekday_text?: string[] };
  photos?: { photo_reference: string }[];
  contactedAt?: string;
  ai_analysis?: string;
  pipelineStatus?: 'contacted' | 'negotiating' | 'closed' | 'lost';
}

interface IAAnalysisResult {
    pitch: string;
    products_to_sell: string[];
    sales_strategy: string;
    suggested_pricing: string;
    conquest_tip: string;
    pain_points: string[];
}

interface MarketingPlan {
    summary: {
        total_days: number;
        projected_leads_min: number;
        projected_leads_max: number;
        recommended_split: string;
    };
    phases: {
        phase_name: string;
        days_range: string;
        budget_allocation: string;
        objective: string;
        actions: string[];
    }[];
    tactical_advice: {
        do: string[];
        dont: string[];
    };
}

type SearchMode = 'standard' | 'whale' | 'crisis' | 'ghost';

const DEFAULT_SCRIPTS = {
    cold_call: "Olá [Nome], aqui é [Seu Nome] da CBL. Vi que vocês são referência em [Nicho] na região, mas notei um ponto crítico na presença digital de vocês que pode estar custando clientes. Tem 30 segundos?",
    gatekeeper: "Olá, bom dia. Quem cuida da parte de marketing ou expansão da empresa? É sobre uma parceria comercial que pode interessar a diretoria.",
    whatsapp_intro: "Olá [Nome], tudo bem? Encontrei a [Empresa] no Google e vi um potencial enorme, mas notei que vocês não estão aproveitando [Oportunidade]. Posso te mandar um áudio rápido explicando?",
    follow_up: "Oi [Nome], conseguiu dar uma olhada na proposta? Estou fechando a agenda da semana e queria priorizar o projeto de vocês."
};

const ScriptManager = ({ scripts, onSave }: { scripts: any, onSave: (s: any) => void }) => {
    const [localScripts, setLocalScripts] = useState(scripts);
    const [activeScript, setActiveScript] = useState('cold_call');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updated = { ...localScripts, [activeScript]: e.target.value };
        setLocalScripts(updated);
        onSave(updated);
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-600/20 rounded-lg text-purple-500"><BrainIcon className="w-6 h-6"/></div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Script Vault</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                <div className="space-y-2">
                    {Object.keys(localScripts).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveScript(key)}
                            className={`w-full text-left p-4 rounded-xl border transition-all uppercase text-xs font-bold tracking-widest ${activeScript === key ? 'bg-white/10 border-purple-500 text-white' : 'bg-[#111] border-white/5 text-white/50 hover:bg-[#151515]'}`}
                        >
                            {key.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                
                <div className="md:col-span-2 bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] text-purple-500 font-black uppercase tracking-widest">Editor de Texto</span>
                        <button onClick={() => navigator.clipboard.writeText(localScripts[activeScript])} className="text-white/40 hover:text-white text-[10px] uppercase font-bold transition-colors">Copiar</button>
                    </div>
                    <textarea 
                        value={localScripts[activeScript]}
                        onChange={handleChange}
                        className="flex-1 bg-transparent text-white/80 font-mono text-sm resize-none outline-none custom-scrollbar leading-relaxed"
                    />
                </div>
            </div>
        </div>
    );
};

const LeadStrategyModal = ({ lead, onClose, onCopyPitch, onOpenWhatsapp, customScripts }: any) => {
    const [analysis, setAnalysis] = useState<IAAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!lead) return;
        
        // Auto-analyze on open
        const analyzeLead = async () => {
            setIsLoading(true);
            const prompt = `
                ATUE COMO: Estrategista de Vendas B2B Sênior.
                ANALISE ESTE LEAD:
                Nome: ${lead.name}
                Nicho Provável: Baseado no nome e tipos (${lead.types?.join(', ')})
                Score: ${lead.lead_score}
                Status Site: ${lead.status_site}
                Rating: ${lead.rating} (${lead.user_ratings_total} reviews)
                
                TAREFA: Gere uma estratégia de abordagem fria (Cold Call/Message).
                
                RETORNE JSON:
                {
                    "pitch": "Script de abordagem de 1 parágrafo focado na dor dele (ex: falta de site, nota baixa)",
                    "products_to_sell": ["Produto 1", "Produto 2"],
                    "sales_strategy": "Dica tática de como abordar (ex: Elogie x, depois critique y)",
                    "suggested_pricing": "Ticket sugerido (Baixo/Médio/Alto)",
                    "conquest_tip": "Uma frase de efeito para fechar",
                    "pain_points": ["Dor 1", "Dor 2"]
                }
            `;

            try {
                const response = await fetch('/api/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: prompt,
                        model: 'gemini-3-flash-preview',
                        config: { responseMimeType: 'application/json' }
                    })
                });
                const data = await response.json();
                const parsed = JSON.parse(data.text);
                setAnalysis(parsed);
            } catch (error) {
                console.error("Erro na análise:", error);
            } finally {
                setIsLoading(false);
            }
        };

        analyzeLead();
    }, [lead]);

    if (!lead) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="w-full max-w-4xl bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#111]">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className={`w-3 h-3 rounded-full ${lead.lead_score > 70 ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_currentColor]`}></div>
                             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ID: {lead.place_id?.substr(-8)}</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{lead.name}</h2>
                        <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
                            <LocationIcon className="w-4 h-4 text-red-500"/> {lead.address}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"><XIcon/></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Coluna 1: Dados do Lead */}
                        <div className="space-y-6">
                            <div className="bg-[#151515] p-5 rounded-2xl border border-white/5 space-y-4">
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Raio-X</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs text-white/60">Reputação</span>
                                        <span className={`text-xs font-bold ${lead.rating >= 4.5 ? 'text-green-500' : 'text-yellow-500'}`}>{lead.rating} ★ ({lead.user_ratings_total})</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs text-white/60">Website</span>
                                        <span className={`text-xs font-bold ${lead.status_site === 'com_site' ? 'text-green-500' : 'text-red-500'}`}>{lead.status_site === 'com_site' ? 'Online' : 'Ausente'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs text-white/60">Lead Score</span>
                                        <span className="text-xs font-bold text-white">{lead.lead_score}/100</span>
                                    </div>
                                </div>
                            </div>

                             <div className="bg-[#151515] p-5 rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Ações Rápidas</h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => onOpenWhatsapp(customScripts.whatsapp_intro.replace('[Nome]', 'Gestor').replace('[Empresa]', lead.name).replace('[Oportunidade]', 'o potencial digital'))}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
                                    >
                                        <PhoneIcon className="w-4 h-4"/> Chamar no Zap
                                    </button>
                                    <button 
                                        onClick={() => onCopyPitch(customScripts.cold_call.replace('[Nome]', 'Gestor').replace('[Nicho]', 'seu nicho'))}
                                        className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all border border-white/10"
                                    >
                                        Copiar Script Cold Call
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Coluna 2 e 3: Inteligência Artificial */}
                        <div className="md:col-span-2 space-y-6">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 bg-[#151515] rounded-2xl border border-white/5 min-h-[300px]">
                                    <SpinnerIcon />
                                    <p className="text-red-500 font-black text-xs uppercase tracking-widest animate-pulse">Consultando Satélite Estratégico...</p>
                                </div>
                            ) : analysis ? (
                                <>
                                    <div className="bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 p-6 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10"><BrainIcon className="w-12 h-12 text-red-500"/></div>
                                        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Pitch Gerado por IA</h3>
                                        <p className="text-white text-lg font-medium leading-relaxed italic">"{analysis.pitch}"</p>
                                        <div className="mt-4 flex gap-2">
                                            <button onClick={() => onCopyPitch(analysis.pitch)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors">Copiar</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#151515] border border-white/5 p-5 rounded-2xl">
                                            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Estratégia de Venda</h3>
                                            <p className="text-white/70 text-xs leading-relaxed">{analysis.sales_strategy}</p>
                                            <div className="mt-4 space-y-2">
                                                {analysis.pain_points.map((pain: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                                                        <span className="text-red-500">⚠</span> {pain}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-[#151515] border border-white/5 p-5 rounded-2xl">
                                            <h3 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-3">Produtos Sugeridos</h3>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {analysis.products_to_sell.map((prod: string, i: number) => (
                                                    <span key={i} className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase">{prod}</span>
                                                ))}
                                            </div>
                                            <div className="border-t border-white/5 pt-3">
                                                 <span className="text-[9px] text-white/30 uppercase tracking-widest block">Ticket Sugerido</span>
                                                 <span className="text-white font-bold">{analysis.suggested_pricing}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#151515] border border-white/5 p-4 rounded-xl flex items-center gap-4">
                                        <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500"><ZapIcon className="w-5 h-5"/></div>
                                        <div>
                                            <span className="text-[9px] text-white/30 uppercase tracking-widest block">Dica de Fechamento</span>
                                            <span className="text-white text-xs font-bold italic">"{analysis.conquest_tip}"</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center text-white/20">Erro na análise.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- FEATURE 1: OBJECTION CRUSHER (Agora com IA Real) ---
const ObjectionCrusher = () => {
    const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
    const [customObjection, setCustomObjection] = useState('');
    const [isAiProcessing, setIsAiProcessing] = useState(false);

    const objections = [
        { id: 'expensive', label: '“Está muito caro”', script: 'Entendo totalmente a preocupação com o investimento. Mas se olharmos para o retorno, hoje você perde clientes por não estar posicionado? Meu foco é fazer esse valor voltar multiplicado para o seu caixa.' },
        { id: 'nephew', label: '“Tenho um sobrinho que faz”', script: 'Que bacana que você dá oportunidade para a família! O que eu proponho não é competir com ele, mas trazer uma estratégia comercial profissional. Talvez possamos somar: ele na operação diária e eu na estratégia de vendas.' },
        { id: 'think', label: '“Vou pensar”', script: 'Perfeito, decisões importantes precisam ser pensadas. Mas qual é a sua maior dúvida hoje? Talvez eu consiga esclarecer agora para você decidir com mais tranquilidade.' },
        { id: 'broke', label: '“Estamos sem verba”', script: 'Entendo, o momento exige cautela. Mas é justamente para trazer mais caixa que meu trabalho serve. Vamos começar com algo menor para você ver o dinheiro entrando primeiro?' },
        { id: 'marketing', label: '“Já faço tráfego”', script: 'Excelente! Isso mostra que você tem visão. E como está o custo por cliente hoje? Às vezes, um ajuste fino na estratégia pode dobrar seus resultados com o mesmo investimento.' }
    ];

    const handleCustomCrush = async () => {
        if (!customObjection.trim()) return;
        setIsAiProcessing(true);
        setSelectedObjection(null); // Limpa anterior

        const prompt = `
            ATUE COMO: Especialista em Vendas e Negociação (Closer) do Grupo CBL.
            CONTEXTO: Estou tentando vender serviços de tecnologia/marketing.
            OBJEÇÃO DO CLIENTE: "${customObjection}"
            
            TAREFA: Gere uma quebra de objeção curta, perspicaz e profissional.
            Use técnica de empatia tática + reframe (reenquadramento).
            MÁXIMO 2 PARÁGRAFOS CURTOS.
            Responda diretamente com o script de fala.
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: prompt,
                    model: 'gemini-3-flash-preview',
                    config: { temperature: 0.7 }
                })
            });
            const data = await response.json();
            setSelectedObjection(data.text);
        } catch (error) {
            console.error("Erro na IA:", error);
            alert("Erro ao processar objeção.");
        } finally {
            setIsAiProcessing(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-600/20 rounded-lg text-red-500"><ZapIcon className="w-6 h-6"/></div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Objection Crusher</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto custom-scrollbar pb-20">
                <div className="space-y-6">
                    {/* Área de Custom Input com IA */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-3">
                        <label className="text-[10px] text-red-500 font-black uppercase tracking-widest">Objeção Personalizada (IA)</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={customObjection}
                                onChange={(e) => setCustomObjection(e.target.value)}
                                placeholder="Digite o que o cliente disse..."
                                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors"
                                onKeyDown={(e) => e.key === 'Enter' && handleCustomCrush()}
                            />
                            <button 
                                onClick={handleCustomCrush}
                                disabled={isAiProcessing || !customObjection}
                                className="bg-red-600 hover:bg-red-500 text-white px-4 rounded-xl disabled:opacity-50 transition-colors"
                            >
                                {isAiProcessing ? <SpinnerIcon /> : <ZapIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Objeções Comuns</p>
                        {objections.map(obj => (
                            <button 
                                key={obj.id} 
                                onClick={() => setSelectedObjection(obj.script)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedObjection === obj.script ? 'bg-white/10 border-red-500 text-white shadow-lg' : 'bg-[#111] border-white/5 text-white/70 hover:bg-[#1a1a1a] hover:border-white/10'}`}
                            >
                                <span className="font-bold text-sm">{obj.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 relative min-h-[300px] flex flex-col">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Script Sugerido</p>
                    {isAiProcessing ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <SpinnerIcon />
                            <p className="text-red-500 text-[10px] uppercase tracking-widest animate-pulse">Consultando Base Estratégica...</p>
                        </div>
                    ) : selectedObjection ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 flex-1 relative">
                            <p className="text-white text-lg font-medium leading-relaxed whitespace-pre-wrap">"{selectedObjection}"</p>
                            <button onClick={() => navigator.clipboard.writeText(selectedObjection)} className="absolute bottom-0 right-0 bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 shadow-lg">Copiar</button>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-white/20 text-sm italic">Selecione ou digite uma objeção.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- FEATURE 3: HUNTER RANK (GAMIFICATION) ---
const HunterRank = ({ count }: { count: number }) => {
    let rank = "Novato";
    let color = "text-gray-400";
    let progress = (count / 10) * 100;

    if (count >= 10) { rank = "Caçador"; color = "text-blue-400"; progress = ((count-10)/40)*100; }
    if (count >= 50) { rank = "Predador"; color = "text-purple-400"; progress = ((count-50)/50)*100; }
    if (count >= 100) { rank = "Lenda"; color = "text-red-500"; progress = 100; }

    return (
        <div className="mb-6 px-4">
            <div className="bg-[#111] border border-white/5 rounded-xl p-4 relative overflow-hidden group">
                <div className="flex justify-between items-end mb-2 relative z-10">
                    <div>
                        <span className="text-[9px] text-white/40 uppercase tracking-widest block">Hunter Rank</span>
                        <span className={`text-xl font-black uppercase italic ${color}`}>{rank}</span>
                    </div>
                    <span className="text-2xl font-black text-white">{count}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                    <div className={`h-full transition-all duration-1000 ${color.replace('text', 'bg')}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <div className={`absolute inset-0 opacity-10 ${color.replace('text', 'bg')} blur-xl group-hover:opacity-20 transition-opacity`}></div>
            </div>
        </div>
    );
};

// --- COMPONENTE: MARKETING COMMAND ---
const MarketingCommand = () => {
    const [inputs, setInputs] = useState({ budget: 1000, days: 30, niche: '', objective: 'Leads no WhatsApp' });
    const [plan, setPlan] = useState<MarketingPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedData = LocalDB.getMarketingData();
        if (savedData.currentPlan) {
             setPlan(savedData.currentPlan);
             setInputs(savedData.lastInputs || inputs);
        }
    }, []);

    const generatePlan = async () => {
        if (!inputs.niche) return;
        setIsLoading(true);

        const prompt = `
            ATUE COMO: Diretor de Tráfego Pago Sênior (Ex-Facebook/Google).
            Crie um PLANO CIRÚRGICO de investimento para o cliente.
            
            DADOS:
            - Nicho: ${inputs.niche}
            - Verba Total: R$ ${inputs.budget}
            - Duração: ${inputs.days}
            - Objetivo: ${inputs.objective}

            REGRAS ESTRATÉGICAS:
            1. Divida em fases claras (ex: Validação, Otimização, Escala).
            2. Dê valores EXATOS de quanto gastar por dia em cada fase.
            3. Seja específico nas ações (ex: "Criar Público Lookalike 1%", "Excluir Visitantes 7D").
            4. Inclua estimativas realistas (conservadoras) de leads.

            RETORNE APENAS UM JSON VÁLIDO COM ESTA ESTRUTURA:
            {
                "summary": {
                    "total_days": ${inputs.days},
                    "projected_leads_min": (int),
                    "projected_leads_max": (int),
                    "recommended_split": "Ex: 60% Meta Ads (Instagram/FB) / 40% Google Search"
                },
                "phases": [
                    {
                        "phase_name": "Fase 1: [Nome da Fase]",
                        "days_range": "Dia 1 ao 7",
                        "budget_allocation": "R$ X/dia",
                        "objective": "Objetivo curto",
                        "actions": ["Ação prática 1", "Ação prática 2", "Ação prática 3"]
                    }
                ],
                "tactical_advice": {
                    "do": ["Conselho tático 1", "Conselho tático 2"],
                    "dont": ["Erro fatal a evitar 1", "Erro fatal a evitar 2"]
                }
            }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: prompt,
                    model: 'gemini-3-flash-preview',
                    config: { responseMimeType: 'application/json' }
                })
            });

            const data = await response.json();
            
            let cleanText = data.text.trim();
            // Remove code blocks
            cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');
            
            try {
                const generatedPlan = JSON.parse(cleanText);
                setPlan(generatedPlan);
                LocalDB.saveMarketingData({ currentPlan: generatedPlan, lastInputs: inputs });
            } catch (e) {
                console.error("Erro ao fazer parse do JSON:", e, cleanText);
                alert("Erro ao interpretar resposta da IA. Tente novamente.");
            }

        } catch (error) {
            console.error("Erro ao gerar plano:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] p-4 md:p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 shrink-0">
                <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500"><MegaphoneIcon className="w-6 h-6"/></div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Marketing Command</h2>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Gerador de Estratégia de Tráfego Cirúrgico</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                <div className="lg:col-span-4 bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 flex flex-col overflow-y-auto custom-scrollbar h-auto max-h-full">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Briefing Tático</h3>
                    
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Nicho do Cliente</label>
                            <input 
                                type="text" 
                                value={inputs.niche}
                                onChange={e => setInputs({...inputs, niche: e.target.value})}
                                placeholder="Ex: Clínica Odontológica"
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Verba (R$)</label>
                                <input 
                                    type="number" 
                                    value={inputs.budget}
                                    onChange={e => setInputs({...inputs, budget: Number(e.target.value)})}
                                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Duração (Dias)</label>
                                <input 
                                    type="number" 
                                    value={inputs.days}
                                    onChange={e => setInputs({...inputs, days: Number(e.target.value)})}
                                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Objetivo Principal</label>
                            <select 
                                value={inputs.objective}
                                onChange={e => setInputs({...inputs, objective: e.target.value})}
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors appearance-none"
                            >
                                <option>Leads no WhatsApp</option>
                                <option>Venda Direta (E-commerce)</option>
                                <option>Seguidores / Branding</option>
                                <option>Agendamentos</option>
                            </select>
                        </div>

                        <button 
                            onClick={generatePlan}
                            disabled={isLoading || !inputs.niche}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <SpinnerIcon /> : 'GERAR PLANO TÁTICO'}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2 font-mono">Dica do Especialista:</p>
                        <p className="text-xs text-white/60 font-light italic">"Nunca comece com a verba total. Use 20% para validar o criativo antes de escalar."</p>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-[#0c0c0c] border border-white/10 rounded-3xl p-1 overflow-hidden flex flex-col h-full relative">
                    {!plan && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-white/20 p-10 text-center">
                            <TargetIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p className="uppercase tracking-widest text-xs font-bold">Aguardando Parâmetros</p>
                            <p className="text-[10px] mt-2 max-w-md">Insira os dados ao lado para gerar um cronograma de investimento otimizado por IA.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <SpinnerIcon />
                            <p className="text-blue-500 font-black text-xs uppercase tracking-widest animate-pulse">Calculando Rotas de Investimento...</p>
                        </div>
                    )}

                    {plan && !isLoading && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
                                    <span className="block text-[9px] text-blue-400 uppercase tracking-widest font-bold">Investimento Sugerido</span>
                                    <span className="block text-xl font-black text-white mt-1">{plan.summary.recommended_split}</span>
                                </div>
                                <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                                    <span className="block text-[9px] text-green-400 uppercase tracking-widest font-bold">Projeção de Leads</span>
                                    <span className="block text-xl font-black text-white mt-1">{plan.summary.projected_leads_min} - {plan.summary.projected_leads_max}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                    <span className="block text-[9px] text-white/40 uppercase tracking-widest font-bold">Ciclo Total</span>
                                    <span className="block text-xl font-black text-white mt-1">{plan.summary.total_days} Dias</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Cronograma de Execução
                                </h3>
                                <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                                    {plan.phases.map((phase, idx) => (
                                        <div key={idx} className="relative pl-10">
                                            <div className="absolute left-[13px] top-6 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                                            <div className="bg-[#151515] border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">{phase.days_range}</span>
                                                        <h4 className="text-lg font-bold text-white mt-2">{phase.phase_name}</h4>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-[9px] text-white/40 uppercase tracking-widest">Budget Diário</span>
                                                        <span className="block text-sm font-black text-white">{phase.budget_allocation}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-white/60 mb-4 italic">Meta: {phase.objective}</p>
                                                <div className="space-y-2 border-t border-white/5 pt-3">
                                                    {phase.actions.map((action, i) => (
                                                        <div key={i} className="flex gap-3 text-xs text-white/80">
                                                            <span className="text-blue-500 font-bold">→</span>
                                                            {action}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                <div>
                                    <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="text-lg">✓</span> Essencial (Faça)
                                    </h4>
                                    <ul className="space-y-2">
                                        {plan.tactical_advice.do.map((item, i) => (
                                            <li key={i} className="text-xs text-white/70 bg-green-500/5 p-2 rounded border border-green-500/10">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="text-lg">✕</span> Crítico (Evite)
                                    </h4>
                                    <ul className="space-y-2">
                                        {plan.tactical_advice.dont.map((item, i) => (
                                            <li key={i} className="text-xs text-white/70 bg-red-500/5 p-2 rounded border border-red-500/10">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ESTRUTURA KANBAN & CARDS ---
const TaskCard: React.FC<{ task: Task, moveTask: (id: string, status: Task['status']) => void, deleteTask: (id: string) => void }> = ({ task, moveTask, deleteTask }) => {
    const priorityColors = {
        high: 'bg-red-500/20 text-red-400 border-red-500/20',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
        low: 'bg-blue-500/20 text-blue-400 border-blue-500/20'
    };

    return (
        <div className="group relative bg-[#181818]/60 backdrop-blur-md border border-white/5 p-4 rounded-xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/50 shrink-0">
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-white/20 hover:text-red-500 transition-colors">
                    <XIcon />
                </button>
            </div>
            <p className="text-white/90 text-sm font-medium leading-relaxed mb-4">{task.content}</p>
            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                <span className="text-[9px] text-white/20 font-mono">ID: {task.id.substr(-4)}</span>
                <div className="flex gap-1 bg-black/40 rounded-lg p-1">
                    <button 
                        disabled={task.status === 'backlog'}
                        onClick={() => moveTask(task.id, task.status === 'doing' ? 'backlog' : 'doing')} 
                        className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white disabled:opacity-20 transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                            disabled={task.status === 'done'}
                            onClick={() => moveTask(task.id, task.status === 'backlog' ? 'doing' : 'done')}
                            className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white disabled:opacity-20 transition-colors"
                    >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

interface KanbanColumnProps {
    title: string;
    status: Task['status'];
    color: string;
    icon: React.ReactNode;
    tasks: Task[];
    moveTask: (id: string, status: Task['status']) => void;
    deleteTask: (id: string) => void;
    onAddTask?: () => void;
    newTaskText?: string;
    setNewTaskText?: (val: string) => void;
    newTaskPriority?: Task['priority'];
    setNewTaskPriority?: (val: Task['priority']) => void;
}

const KanbanColumn = ({ title, status, color, icon, tasks, moveTask, deleteTask, onAddTask, newTaskText, setNewTaskText, newTaskPriority, setNewTaskPriority }: KanbanColumnProps) => (
    <div className="min-w-[85vw] md:min-w-0 md:flex-1 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-col h-full relative overflow-hidden shrink-0 snap-center mx-2 md:mx-0">
        <div className={`p-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm flex justify-between items-center z-10 sticky top-0`}>
            <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg bg-opacity-10 ${color.replace('text', 'bg')} ${color}`}>
                    {icon}
                </div>
                <h3 className={`text-xs font-black uppercase tracking-[0.2em] text-white`}>{title}</h3>
            </div>
            <span className="bg-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                {tasks.length}
            </span>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} moveTask={moveTask} deleteTask={deleteTask} />
            ))}
            {tasks.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center text-white/10 border-2 border-dashed border-white/5 rounded-xl m-2">
                    <span className="text-2xl mb-2 opacity-50">+</span>
                    <span className="text-[9px] uppercase tracking-widest">Sem tarefas</span>
                </div>
            )}
        </div>
        {status === 'backlog' && setNewTaskText && setNewTaskPriority && onAddTask && (
            <div className="p-3 border-t border-white/5 bg-[#111]">
                <div className="flex gap-2 mb-2">
                        {(['low', 'medium', 'high'] as const).map(p => (
                            <button 
                            key={p}
                            onClick={() => setNewTaskPriority(p)}
                            className={`flex-1 text-[8px] uppercase font-bold py-1 rounded border transition-all ${newTaskPriority === p ? 'bg-white text-black border-white' : 'bg-transparent text-white/30 border-white/10'}`}
                            >
                            {p}
                            </button>
                        ))}
                </div>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newTaskText}
                        onChange={e => setNewTaskText(e.target.value)}
                        placeholder="Nova missão..."
                        className="flex-1 bg-black border border-white/10 text-white text-xs px-3 py-2.5 rounded-lg outline-none focus:border-white/30 transition-colors"
                        onKeyDown={e => e.key === 'Enter' && onAddTask()}
                    />
                    <button 
                        onClick={onAddTask}
                        className="bg-white/10 hover:bg-white text-white hover:text-black p-2 rounded-lg transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
            </div>
        )}
    </div>
);

// --- COMPONENTE: STRATEGIC WAR ROOM ---
const StrategicWarRoom = () => {
    const [data, setData] = useState<WarRoomData>({ notes: '', tasks: [] });
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');

    useEffect(() => {
        setData(LocalDB.getWarRoomData());
    }, []);

    const updateDB = (newData: WarRoomData) => {
        setData(newData);
        LocalDB.saveWarRoomData(newData);
    };

    const addTask = () => {
        if (!newTaskText) return;
        const newTask: Task = {
            id: Date.now().toString(),
            content: newTaskText,
            status: 'backlog',
            priority: newTaskPriority
        };
        updateDB({ ...data, tasks: [...data.tasks, newTask] });
        setNewTaskText('');
    };

    const moveTask = (id: string, newStatus: Task['status']) => {
        const updatedTasks = data.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
        updateDB({ ...data, tasks: updatedTasks });
    };

    const deleteTask = (id: string) => {
        updateDB({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] p-4 md:p-6 overflow-hidden">
             <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-purple-600/30 to-purple-900/30 border border-purple-500/30 rounded-xl text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
                        <BrainIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">War Room</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-[9px] text-white/40 uppercase tracking-[0.3em]">Online • Sync Ativo</p>
                        </div>
                    </div>
                </div>
             </div>

             <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                <div className="lg:col-span-8 h-full flex flex-col min-h-0">
                    <div className="flex-1 flex overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-4 pb-4 lg:pb-0 custom-scrollbar md:grid md:grid-cols-3">
                        <KanbanColumn 
                            title="Backlog" 
                            status="backlog" 
                            color="text-gray-400" 
                            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                            tasks={data.tasks.filter(t => t.status === 'backlog')}
                            moveTask={moveTask}
                            deleteTask={deleteTask}
                            onAddTask={addTask}
                            newTaskText={newTaskText}
                            setNewTaskText={setNewTaskText}
                            newTaskPriority={newTaskPriority}
                            setNewTaskPriority={setNewTaskPriority}
                        />
                        <KanbanColumn 
                            title="Em Execução" 
                            status="doing" 
                            color="text-yellow-400" 
                            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            tasks={data.tasks.filter(t => t.status === 'doing')}
                            moveTask={moveTask}
                            deleteTask={deleteTask}
                        />
                        <KanbanColumn 
                            title="Concluído" 
                            status="done" 
                            color="text-green-500" 
                            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            tasks={data.tasks.filter(t => t.status === 'done')}
                            moveTask={moveTask}
                            deleteTask={deleteTask}
                        />
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col h-[400px] lg:h-full bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-[#111] p-3 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Strategic_Log.txt</h3>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                    </div>
                    <div className="flex-1 relative group">
                        <textarea 
                            value={data.notes} 
                            onChange={e => updateDB({...data, notes: e.target.value})} 
                            className="absolute inset-0 w-full h-full bg-transparent p-5 text-white/80 font-mono text-xs md:text-sm resize-none outline-none custom-scrollbar leading-relaxed z-10 selection:bg-purple-500/30" 
                            placeholder="// Digite suas estratégias confidenciais aqui..." 
                        />
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ 
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', 
                            backgroundSize: '100% 24px' 
                        }}></div>
                    </div>
                    <div className="p-2 bg-[#111] border-t border-white/5 text-[9px] text-white/20 font-mono text-right">
                        {data.notes.length} chars
                    </div>
                </div>
             </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'contacted' | 'ignored' | 'scripts' | 'brainstorm' | 'marketing' | 'objections'>('search');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customScripts, setCustomScripts] = useState(DEFAULT_SCRIPTS);
  
  // Search State
  const [searchMode, setSearchMode] = useState<SearchMode>('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [minScore, setMinScore] = useState(50);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [chamadosSearch, setChamadosSearch] = useState('');
  
  // CRM Data
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  
  const downloadCSV = () => {
      const headers = "Nome,Telefone,Endereço,Rating,Score\n";
      const rows = leads.map(l => `"${l.name}","${l.phone || ''}","${l.address}","${l.rating}","${l.lead_score}"`).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_cbl_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
  };

  useEffect(() => {
      setContactedLeads(LocalDB.getContactedLeads());
  }, []);

  const saveLeadsToDB = (updatedLeads: Lead[]) => {
      setContactedLeads(updatedLeads);
      LocalDB.saveContactedLeads(updatedLeads);
  };

  const executeSearch = async (token?: string) => {
      if (!searchTerm || !location) return;
      setIsLoading(true);
      setSearchError('');
      setLeads([]);
      
      try {
          const response = await fetch('/api/places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `${searchTerm} in ${location}`, pagetoken: token }),
          });
          const data = await response.json();
          
          if (!response.ok && !data.is_mock) { // Só lança erro se não for mock
             throw new Error(data.details || data.error || 'Erro desconhecido na API');
          }

          if (data.is_mock) {
              setSearchError("Modo Demo Ativado: API Key inválida ou quota excedida.");
          }

          let newLeads = (data.results || []).map((p: any) => ({
              ...p,
              id: p.place_id,
              lead_score: Math.floor(Math.random() * 40) + 40 + (p.rating || 0) * 5, 
              status_site: p.website ? 'com_site' : 'sem_site',
              phone: p.formatted_phone_number
          }));

          if (searchMode === 'whale') {
             newLeads = newLeads.filter((l: any) => l.rating >= 4.0 && l.status_site === 'com_site');
          } else if (searchMode === 'crisis') {
             newLeads = newLeads.filter((l: any) => l.rating < 4.0);
          } else if (searchMode === 'ghost') {
             newLeads = newLeads.filter((l: any) => l.status_site === 'sem_site');
          }

          setLeads(newLeads);
      } catch (e: any) {
          console.error(e);
          setSearchError(e.message || "Falha na comunicação com a API");
      } finally {
          setIsLoading(false);
      }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); executeSearch(); };

  const updateStatus = (id: string, status: Lead['pipelineStatus']) => {
      const updated = contactedLeads.map(l => l.id === id ? { ...l, pipelineStatus: status } : l);
      saveLeadsToDB(updated);
  };
  
  const markAsContacted = (lead: Lead) => {
      if (contactedLeads.some(l => l.id === lead.id)) return;
      
      // Garante que o status inicial seja 'contacted' se não estiver definido
      const newLead = { 
          ...lead, 
          contactedAt: new Date().toISOString(), 
          pipelineStatus: 'contacted' as const 
      };
      
      const updated = [newLead, ...contactedLeads];
      saveLeadsToDB(updated);
  };

  const NavButton = ({ tab, icon, label }: any) => (
      <button 
        onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group ${activeTab === tab ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10' : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'}`}
      >
          <div className={`p-2 rounded-lg transition-colors ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>{icon}</div>
          <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </button>
  );

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-50 fixed top-0 w-full">
          <Logo className="scale-75 origin-left" />
          <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2 rounded-lg bg-white/5 active:scale-95"><MenuIcon className="w-6 h-6" /></button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 top-0 left-0 h-full w-72 md:w-64 bg-[#080808] border-r border-white/10 flex flex-col py-6 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:pt-6`}>
          <div className="px-6 mb-8 flex justify-between items-center"><Logo className="scale-90 origin-left" /><button onClick={() => setIsSidebarOpen(false)} className="text-white/50 md:hidden"><XIcon /></button></div>
          
          <HunterRank count={contactedLeads.length} />

          <div className="flex flex-col gap-2 px-4 flex-1 overflow-y-auto custom-scrollbar">
             <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-2 pl-2">Arsenal</div>
             <NavButton tab="search" icon={<TargetIcon className="w-5 h-5" />} label="Prospecção" />
             <NavButton tab="contacted" icon={<PhoneIcon className="w-5 h-5" />} label="Pipeline" />
             <NavButton tab="objections" icon={<ZapIcon className="w-5 h-5" />} label="Obj. Crusher" />
             <NavButton tab="scripts" icon={<BrainIcon className="w-5 h-5" />} label="Scripts" />
             <NavButton tab="marketing" icon={<MegaphoneIcon className="w-5 h-5" />} label="Marketing" />
             <NavButton tab="brainstorm" icon={<BrainIcon className="w-5 h-5" />} label="War Room" />
          </div>
          <div className="mt-auto px-4"><button onClick={onLogout} className="w-full text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-red-500 transition-colors flex items-center justify-center gap-2 py-4 rounded-lg bg-white/5">Sair</button></div>
      </aside>

      <main className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden pt-16 md:pt-0">
            {activeTab === 'search' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-[#050505]">
                    <div className="max-w-8xl mx-auto pb-20">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Deep <span className="text-red-600">Dive</span></h1>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Localize alvos de alto valor</p>
                            </div>
                            {leads.length > 0 && (
                                <button onClick={downloadCSV} className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-2">
                                    <span className="text-lg">↓</span> Exportar CSV
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                            {[
                                { id: 'standard', label: 'Padrão', icon: '🎯' },
                                { id: 'whale', label: 'Whale (High Ticket)', icon: '🐋' },
                                { id: 'crisis', label: 'Crise (<3.5★)', icon: '📉' },
                                { id: 'ghost', label: 'Ghost (Sem Site)', icon: '👻' },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setSearchMode(mode.id as SearchMode)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-all ${
                                        searchMode === mode.id 
                                        ? 'bg-red-600 border-red-600 text-white shadow-lg' 
                                        : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'
                                    }`}
                                >
                                    <span>{mode.icon}</span> {mode.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end bg-[#0A0A0A] p-4 md:p-5 rounded-3xl border border-white/10 relative overflow-hidden group mb-8">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho</label>
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm font-bold transition-all placeholder-white/20" placeholder="Ex: Estética" />
                                {searchTerm.length > 3 && <p className="text-[8px] text-green-500 uppercase tracking-wider pl-1 animate-pulse">💡 Dica: Foque em reputação para este nicho.</p>}
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm font-bold transition-all placeholder-white/20" placeholder="Ex: Pinheiros, SP" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[9px] font-black text-white/50 uppercase tracking-widest ml-1">Score Mín: {minScore}</label>
                                <input type="range" min="0" max="90" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-full accent-red-600 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 md:py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[48px] md:h-[58px]">
                                    {isLoading ? <SpinnerIcon /> : 'BUSCAR'}
                                </button>
                            </div>
                        </form>
                        
                        {searchError && (
                            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl mb-6 text-center animate-in fade-in slide-in-from-top-2">
                                <p className="text-yellow-500 font-bold text-xs uppercase tracking-widest mb-1">Aviso do Sistema</p>
                                <p className="text-white/70 text-xs font-mono">{searchError}</p>
                            </div>
                        )}

                        {leads.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8">
                                {leads.map((lead) => {
                                    const isInPipeline = contactedLeads.some(l => l.id === lead.id);
                                    return (
                                        <div key={lead.id} className="bg-[#0c0c0c] border border-white/10 rounded-3xl flex flex-col overflow-hidden group hover:border-white/20 transition-all">
                                            <div className="h-40 bg-gray-900 relative">
                                                <div className="absolute bottom-2 left-2 bg-black/80 text-green-400 text-[8px] font-black uppercase px-2 py-1 rounded backdrop-blur">
                                                    LTV: R$ {(lead.lead_score * 50).toLocaleString()}
                                                </div>
                                                {lead.photos?.[0] ? (
                                                    <img src={`/api/photo?ref=${lead.photos[0].photo_reference}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all"/>
                                                ) : (
                                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center opacity-30"><Logo className="scale-50"/></div>
                                                )}
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-lg font-black text-white uppercase leading-tight mb-2 line-clamp-1">{lead.name}</h3>
                                                <p className="text-[10px] text-white/50 mb-4 line-clamp-2">{lead.address}</p>
                                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                                                    <div className="flex flex-col">
                                                        <span className={`text-2xl font-black ${lead.lead_score > 70 ? 'text-green-500' : 'text-red-500'}`}>{lead.lead_score}</span>
                                                        <span className="text-[7px] text-white/30 uppercase tracking-widest">Score</span>
                                                    </div>
                                                    <button onClick={() => setSelectedLead(lead)} className="bg-white text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-200">Raio-X</button>
                                                </div>
                                            </div>
                                            <button 
                                                disabled={isInPipeline}
                                                onClick={() => {
                                                    markAsContacted(lead);
                                                    const msg = `Olá ${lead.name}, sou especialista em marketing digital e vi potencial no seu negócio. Podemos falar?`;
                                                    window.open(`https://wa.me/55${lead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                                }} 
                                                className={`py-3 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border-t border-white/5 ${isInPipeline ? 'bg-green-600/20 text-green-500 cursor-default' : 'bg-[#1a1a1a] hover:bg-green-600 text-white/30 hover:text-white'}`}
                                            >
                                                {isInPipeline ? (
                                                    <>✓ Em Pipeline</>
                                                ) : (
                                                    <><PhoneIcon className="w-3 h-3"/> Fast Zap</>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            !isLoading && !searchError && <div className="h-64 flex items-center justify-center text-white/20 text-sm uppercase tracking-widest">Nenhum alvo detectado</div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'objections' && <ObjectionCrusher />}

            {activeTab === 'contacted' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#050505]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pipeline de Vendas</h2>
                        <input type="text" value={chamadosSearch} onChange={(e) => setChamadosSearch(e.target.value)} placeholder="Filtrar..." className="bg-[#151515] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none" />
                    </div>
                    <div className="space-y-4 pb-20">
                        {contactedLeads.filter(l => l.name.toLowerCase().includes(chamadosSearch.toLowerCase())).length === 0 ? (
                            <div className="text-center text-white/20 py-10 uppercase tracking-widest text-xs">Pipeline Vazio</div>
                        ) : (
                            contactedLeads.filter(l => l.name.toLowerCase().includes(chamadosSearch.toLowerCase())).map(lead => (
                                <div key={lead.id} className="bg-[#0c0c0c] border border-white/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 group hover:border-white/20 transition-all">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">{lead.name}</h3>
                                        <p className="text-xs text-white/40">{lead.phone} • {new Date(lead.contactedAt || '').toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <select 
                                            value={lead.pipelineStatus || 'contacted'} 
                                            onChange={(e) => updateStatus(lead.id, e.target.value as any)}
                                            className={`bg-[#151515] border border-white/10 text-xs p-2 rounded-lg outline-none font-bold uppercase tracking-wide flex-1 md:flex-none ${
                                                lead.pipelineStatus === 'closed' ? 'text-green-500' : (lead.pipelineStatus === 'negotiating' ? 'text-yellow-500' : 'text-white')
                                            }`}
                                        >
                                            <option value="contacted">📩 Contactado</option>
                                            <option value="negotiating">🤝 Negociando</option>
                                            <option value="closed">💰 Fechado</option>
                                            <option value="lost">❌ Perdido</option>
                                        </select>
                                        <button onClick={() => setSelectedLead(lead)} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-white/50 hover:text-white"><BrainIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {(activeTab === 'brainstorm' || activeTab === 'marketing' || activeTab === 'scripts') && (
                <div className="flex-1 overflow-hidden h-full">
                    {activeTab === 'brainstorm' && <StrategicWarRoom />}
                    {activeTab === 'marketing' && <MarketingCommand />}
                    {activeTab === 'scripts' && <ScriptManager scripts={customScripts} onSave={(s:any) => setCustomScripts(s)} />}
                </div>
            )}
      </main>

      {selectedLead && (
        <LeadStrategyModal 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)} 
            onCopyPitch={(text: string) => navigator.clipboard.writeText(text)} 
            onOpenWhatsapp={(text: string) => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')} 
            customScripts={customScripts} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
