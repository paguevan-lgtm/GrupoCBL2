
import React, { useState, useEffect } from 'react';
import { Logo } from './icons/Logo';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LocationIcon } from './icons/LocationIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TargetIcon } from './icons/TargetIcon';
import { ZapIcon } from './icons/ZapIcon';
import { XIcon } from './icons/XIcon';
import { BrainIcon } from './icons/BrainIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { MenuIcon } from './icons/MenuIcon';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';

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
  viewedAt?: string;
  ai_analysis?: string;
  geometry?: { location: { lat: number; lng: number } };
  source?: 'google_maps' | 'web_hunter';
  ai_snippet?: string;
  vibe?: string;
}

// Interface para Dados de Estratégia Avançada (Raio-X)
interface LeadStrategyData {
    executive_summary: string;
    suggested_products: string[];
    pricing_strategy: {
        level: 'High Ticket' | 'Mid Market' | 'Low Entry';
        rationale: string;
        estimated_value: string;
    };
    sales_arguments: {
        pain_points: string[];
        hooks: string[];
    };
    cold_message: string;
    owner_profile_guess: string;
}

// Interface para Marketing Command
interface AdsStrategy {
    niche: string;
    total_budget: string;
    allocation: {
        google_percent: number;
        meta_percent: number;
        google_value: string;
        meta_value: string;
    };
    projections: {
        clicks: string;
        leads: string;
        cpm: string;
    };
    google_ads: {
        campaign_type: string;
        keywords: string[];
        headline: string;
        description: string;
    };
    meta_ads: {
        creative_idea: string;
        copy_hook: string;
    };
    tactical_plan: {
        phase1: string;
        phase2: string;
    };
}

type SearchMode = 'standard' | 'whale' | 'crisis' | 'ghost';

// --- FUNÇÕES UTILITÁRIAS ---
const generateScript = async (lead: Lead) => {
    // --- CÁLCULO DA SAUDAÇÃO TEMPORAL ---
    const currentHour = new Date().getHours();
    let timeGreeting = "Olá";
    if (currentHour >= 5 && currentHour < 12) timeGreeting = "Bom dia";
    else if (currentHour >= 12 && currentHour < 18) timeGreeting = "Boa tarde";
    else timeGreeting = "Boa noite";

    try {
        const prompt = `
            ATUE COMO: Especialista em Vendas e Posicionamento Digital (Humano, Casual, Brasileiro).
            OBJETIVO: Enviar uma mensagem de WhatsApp para o dono da "${lead.name}" para conseguir uma reunião.
            
            DADOS DO LEAD:
            - Nicho: ${lead.types?.[0] || 'Comércio'} (Isso define o TOM de voz)
            - Nota: ${lead.rating}
            - Site: ${lead.website || 'Sem site'}
            - Nome da Empresa: ${lead.name}
            
            REGRA 1: ADAPTAÇÃO TOTAL AO NICHO (TOM DE VOZ):
            - Se for FEMININO/ESTÉTICA (Salão, Spa, Moda, Clínica, Loja de Roupas): Use um tom elegante, leve, empático. Use emojis sutis (✨, 🌷). Fale sobre "Imagem", "Experiência", "Valorização".
            - Se for MASCULINO/TÉCNICO (Oficina, Obras, Carros, Indústria): Use um tom direto, prático, "de homem pra homem". Fale sobre "Grana na mesa", "Demanda", "Oportunidade".
            - Se for SAÚDE/FORMAL (Advogado, Médico, Dentista): Use um tom profissional, respeitoso, mas firme. Fale sobre "Autoridade", "Captação qualificada".
            - Se for ALIMENTAÇÃO/GERAL (Restaurante, Mercado): Tom casual e vizinho.

            REGRA 2: ESTRUTURA OBRIGATÓRIA DA MENSAGEM:
            Parte A: SAUDAÇÃO OBRIGATÓRIA. Comece a frase com "${timeGreeting}".
            Parte B: GANCHO (Quebra de Padrão). Comente algo específico (falta de site, nota google, ou elogio sincero sobre a estrutura/avaliações).
            Parte C (FINALIZAÇÃO MANDATÓRIA): Você DEVE dizer que é especialista no assunto e perguntar quem é a pessoa do marketing para conversar se tem um tempo.
            
            EXEMPLOS DE FINALIZAÇÃO (Adapte o tom, mas mantenha a essência):
            - "Sou especialista em posicionamento pra estética. Quem cuida do marketing de vocês? Tem um tempinho pra conversar?"
            - "Trabalho só com alavancagem de oficinas. Quem toca o marketing aí? Consegue falar rapidinho?"
            - "Sou especialista nessa área. Quem cuida dessa parte do marketing aí? Tem um tempo pra gente falar?"
            
            REGRAS GERAIS:
            - Texto CURTO (max 3 frases).
            - Zero "Prezados" ou formalidades de e-mail.
            - IMPORTANTE: Use apenas emojis padrão Unicode (ex: 🚀, 💰, 🤝). NÃO use códigos de escape ou emojis proprietários.
            
            Gere APENAS o texto da mensagem.
        `;

        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: { parts: [{ text: prompt }] },
                model: 'gemini-3-flash-preview',
                config: { responseMimeType: 'text/plain' }
            })
        });

        const data = await response.json();
        if (data.text) return data.text.trim();
        
        throw new Error("No text generated");
    } catch (error) {
        console.error("Erro script IA:", error);
        return `${timeGreeting}, tudo bem? Vi a ${lead.name} aqui no Google e vi uma oportunidade de melhorar o posicionamento. Sou especialista nessa área. Quem cuida do marketing de vocês? Tem um tempinho pra conversar?`;
    }
};

const getScoreDetails = (lead: Lead, mode: SearchMode) => {
    const reasons = [];
    reasons.push({ label: "Base Score", points: 50, color: "text-white" });
    
    if (lead.status_site === 'sem_site') reasons.push({ label: "Sem Site", points: +30, color: "text-green-500" });
    else if (lead.status_site === 'site_basico') reasons.push({ label: "Site Básico/Linktree", points: +20, color: "text-yellow-500" });
    else reasons.push({ label: "Possui Site", points: -10, color: "text-red-500" });

    if (mode === 'whale') {
        if ((lead.price_level || 0) >= 3) reasons.push({ label: "Alto Padrão ($$$)", points: +40, color: "text-green-500" });
        else if ((lead.price_level || 0) === 2) reasons.push({ label: "Médio Padrão ($$)", points: +10, color: "text-green-500" });
    }
    
    if (mode === 'crisis') {
        if (lead.rating < 3.8) reasons.push({ label: "Reputação Baixa", points: +40, color: "text-green-500" });
        else if (lead.rating < 4.3) reasons.push({ label: "Reputação Mediana", points: +20, color: "text-yellow-500" });
    }

    return reasons;
};

// --- COMPONENTE: MARKETING COMMAND ---
const MarketingCommand = () => {
    const [formData, setFormData] = useState({ niche: '', city: '', budget: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [strategy, setStrategy] = useState<AdsStrategy | null>(null);

    const generateStrategy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.niche || !formData.budget) return;

        setIsLoading(true);
        setStrategy(null);

        const prompt = `
            Atue como um Gestor de Tráfego Sênior.
            Crie uma estratégia de ADS resumida e tática:
            Nicho: ${formData.niche}
            Cidade: ${formData.city || 'Brasil'}
            Verba Mensal: R$ ${formData.budget}

            SAÍDA JSON ESTRITA:
            {
                "niche": "${formData.niche}",
                "total_budget": "R$ ${formData.budget}",
                "allocation": {
                    "google_percent": 40,
                    "meta_percent": 60,
                    "google_value": "Calculado",
                    "meta_value": "Calculado"
                },
                "projections": {
                    "clicks": "Estimativa",
                    "leads": "Estimativa",
                    "cpm": "Estimativa"
                },
                "google_ads": {
                    "campaign_type": "Ex: Rede de Pesquisa",
                    "keywords": ["kw1", "kw2", "kw3"],
                    "headline": "Título chamativo",
                    "description": "Descrição curta"
                },
                "meta_ads": {
                    "creative_idea": "Ideia visual do anúncio",
                    "copy_hook": "Gancho da copy"
                },
                "tactical_plan": {
                    "phase1": "Ação semana 1",
                    "phase2": "Ação semana 2"
                }
            }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: { parts: [{ text: prompt }] },
                    model: 'gemini-3-flash-preview',
                    config: { responseMimeType: 'application/json' }
                })
            });
            const data = await response.json();
            const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '');
            setStrategy(JSON.parse(cleanText));
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar estratégia.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar p-4 md:p-6 pb-24 md:pb-6">
             <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-8">
                    <MegaphoneIcon className="w-8 h-8 text-red-600" />
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Marketing Command</h2>
                </div>

                {!strategy ? (
                    <form onSubmit={generateStrategy} className="space-y-6 bg-[#0c0c0c] p-6 md:p-8 rounded-3xl border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nicho do Cliente</label>
                                <input type="text" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none" placeholder="Ex: Clínica Odontológica" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Verba Mensal (R$)</label>
                                <input type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none" placeholder="Ex: 1500" />
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                            {isLoading ? <SpinnerIcon /> : 'Gerar Plano Tático'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-bottom-10">
                        <button onClick={() => setStrategy(null)} className="text-white/40 hover:text-white text-xs uppercase tracking-widest mb-4">← Nova Estratégia</button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Budget Card */}
                            <div className="bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl col-span-1 md:col-span-3 lg:col-span-1">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Distribuição de Verba</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs text-white mb-1 font-bold"><span>Google Ads</span><span>{strategy.allocation.google_percent}%</span></div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div style={{width: `${strategy.allocation.google_percent}%`}} className="h-full bg-blue-500"></div></div>
                                        <div className="text-[10px] text-white/30 mt-1">{strategy.allocation.google_value}</div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-white mb-1 font-bold"><span>Meta Ads</span><span>{strategy.allocation.meta_percent}%</span></div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div style={{width: `${strategy.allocation.meta_percent}%`}} className="h-full bg-purple-500"></div></div>
                                        <div className="text-[10px] text-white/30 mt-1">{strategy.allocation.meta_value}</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Projections */}
                            <div className="bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl col-span-1 md:col-span-3 lg:col-span-2 flex flex-col justify-between">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Projeções Mensais</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                                        <div className="text-2xl font-black text-white">{strategy.projections.clicks}</div>
                                        <div className="text-[9px] uppercase text-white/40">Cliques Est.</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-green-500/20">
                                        <div className="text-2xl font-black text-green-500">{strategy.projections.leads}</div>
                                        <div className="text-[9px] uppercase text-green-500/60">Leads Est.</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                                        <div className="text-2xl font-black text-white">{strategy.projections.cpm}</div>
                                        <div className="text-[9px] uppercase text-white/40">CPM Médio</div>
                                    </div>
                                </div>
                            </div>

                            {/* Tactics */}
                            <div className="md:col-span-3 bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Plano Tático</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-blue-500 text-xs font-black uppercase mb-2">Google (Pesquisa)</h4>
                                        <p className="text-white/80 text-sm mb-2">"{strategy.google_ads.headline}"</p>
                                        <div className="flex flex-wrap gap-2">
                                            {strategy.google_ads.keywords.map((kw, i) => (
                                                <span key={i} className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-purple-500 text-xs font-black uppercase mb-2">Meta (Social)</h4>
                                        <p className="text-white/80 text-sm mb-1 italic">Idea: {strategy.meta_ads.creative_idea}</p>
                                        <p className="text-white/50 text-xs">Hook: "{strategy.meta_ads.copy_hook}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

// --- COMPONENTE: STRATEGIC WAR ROOM ---
const StrategicWarRoom = () => {
    const [notes, setNotes] = useState('');
    
    useEffect(() => {
        const saved = localStorage.getItem('cbl_war_room_notes');
        if (saved) setNotes(saved);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        localStorage.setItem('cbl_war_room_notes', e.target.value);
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] p-6 pb-24 md:pb-6">
             <div className="flex items-center gap-3 mb-6">
                 <BrainIcon className="w-8 h-8 text-white" />
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">War Room</h2>
                    <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Bloco de Notas Tático (Salvo Localmente)</p>
                 </div>
             </div>
             <div className="flex-1 bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 relative group focus-within:border-white/30 transition-colors">
                <textarea 
                    value={notes}
                    onChange={handleChange}
                    className="w-full h-full bg-transparent border-none outline-none text-white/80 font-mono text-sm resize-none custom-scrollbar leading-relaxed"
                    placeholder="// Digite suas estratégias de guerra aqui..."
                />
             </div>
        </div>
    );
};

// --- MODAL DE ESTRATÉGIA AVANÇADA (RAIO-X 2.0) ---
const LeadStrategyModal = ({ 
    lead, 
    onClose, 
    onOpenWhatsapp,
    searchMode
}: { 
    lead: Lead, 
    onClose: () => void, 
    onOpenWhatsapp: (text: string) => void,
    searchMode: SearchMode
}) => {
    
    // Inicia na aba 'approach' (Abordagem/Dados) por padrão
    const [activeTab, setActiveTab] = useState<'approach' | 'ai_strategy'>('approach');
    const [strategy, setStrategy] = useState<LeadStrategyData | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Estado para Script Personalizado IA
    const [generatedScript, setGeneratedScript] = useState('');
    const [isScriptLoading, setIsScriptLoading] = useState(false);

    // Dados para o Score Breakdown
    const scoreReasons = getScoreDetails(lead, searchMode);

    // Efeito para Gerar Script Automaticamente ao abrir o modal
    useEffect(() => {
        let isMounted = true;
        const generatePersonalizedScript = async () => {
            setIsScriptLoading(true);
            setGeneratedScript(''); // Limpa script anterior
            
            // --- CÁLCULO DA SAUDAÇÃO TEMPORAL ---
            const currentHour = new Date().getHours();
            let timeGreeting = "Olá";
            if (currentHour >= 5 && currentHour < 12) timeGreeting = "Bom dia";
            else if (currentHour >= 12 && currentHour < 18) timeGreeting = "Boa tarde";
            else timeGreeting = "Boa noite";
            // ------------------------------------

            try {
                const script = await generateScript(lead);
                if (isMounted) setGeneratedScript(script);
            } catch (error) {
                console.error("Erro script IA:", error);
                if (isMounted) setGeneratedScript(`${timeGreeting}, tudo bem? Vi a ${lead.name} aqui. Sou especialista em digital. Quem cuida do marketing de vocês? Tem um tempinho pra conversar?`);
            } finally {
                if (isMounted) setIsScriptLoading(false);
            }
        };

        generatePersonalizedScript();

        return () => { isMounted = false; };
    }, [lead]); // Recarrega se o lead mudar

    // Função Manual para Gerar Estratégia Completa (Aba 2)
    const generateAiStrategy = async () => {
        setIsAiLoading(true);
        const prompt = `
            ATUE COMO: Consultor de Negócios Sênior do Grupo CBL.
            DADOS DO PROSPECT:
            Nome: ${lead.name}
            Nota: ${lead.rating} estrelas
            Site: ${lead.status_site !== 'sem_site' ? lead.website : "Não possui"}
            Nicho: ${lead.types.join(', ')}

            TAREFA: Raio-X comercial para venda de site/tráfego.
            RETORNE JSON:
            {
                "executive_summary": "Análise curta.",
                "suggested_products": ["Prod 1", "Prod 2"],
                "pricing_strategy": { "level": "Mid Market", "rationale": "Motivo", "estimated_value": "R$ Valor" },
                "sales_arguments": { "pain_points": ["Dor 1", "Dor 2"], "hooks": ["Gancho 1"] },
                "owner_profile_guess": "Perfil provável do dono",
                "cold_message": "Script curto de WhatsApp"
            }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: { parts: [{ text: prompt }] },
                    model: 'gemini-3-flash-preview',
                    config: { responseMimeType: 'application/json' }
                })
            });
            const data = await response.json();
            const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '');
            setStrategy(JSON.parse(cleanText));
        } catch (error) {
            console.error("Erro na IA", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado!");
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full h-full md:max-w-6xl md:h-[90vh] bg-[#0c0c0c] border border-white/10 md:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header Compacto Mobile */}
                <div className="p-4 md:p-6 border-b border-white/10 bg-[#111] flex justify-between items-start shrink-0">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border shrink-0 ${lead.lead_score > 70 ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                            <span className="font-black text-lg md:text-xl">{lead.lead_score}</span>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tighter truncate">{lead.name}</h2>
                            <p className="text-white/50 text-[10px] md:text-xs flex items-center gap-2 uppercase tracking-widest truncate">
                                {lead.business_status || 'Status Desconhecido'} • {lead.rating} ★
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                {/* Tabs de Navegação */}
                <div className="flex border-b border-white/5 bg-[#0a0a0a]">
                    <button 
                        onClick={() => setActiveTab('approach')} 
                        className={`flex-1 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'approach' ? 'border-red-600 text-white bg-white/5' : 'border-transparent text-white/30'}`}
                    >
                        Dados & Conversa
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai_strategy')} 
                        className={`flex-1 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'ai_strategy' ? 'border-blue-600 text-white bg-white/5' : 'border-transparent text-white/30'}`}
                    >
                        Estratégia IA
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0c0c0c] p-4 md:p-8">
                    
                    {/* ABA 1: ABORDAGEM (DADOS BÁSICOS) */}
                    {activeTab === 'approach' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in slide-in-from-left-4">
                            
                            {/* Coluna Esquerda: Dados e Score */}
                            <div className="space-y-6">
                                {/* Score Breakdown */}
                                <div className="bg-[#151515] border border-white/5 rounded-2xl p-5">
                                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Análise do Score</h3>
                                    <div className="space-y-2">
                                        {scoreReasons.map((reason, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                <span className="text-white/70">{reason.label}</span>
                                                <span className={`font-bold ${reason.color}`}>{reason.points > 0 ? '+' : ''}{reason.points}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Dados de Contato Rápidos */}
                                <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 space-y-4">
                                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Dados de Contato</h3>
                                    
                                    {lead.phone && (
                                        <div onClick={() => onOpenWhatsapp(generatedScript)} className="flex items-center gap-3 text-white cursor-pointer hover:text-green-500 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><PhoneIcon /></div>
                                            <span className="text-sm font-bold">{lead.phone}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><LocationIcon /></div>
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.address)}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-xs md:text-sm font-medium hover:text-blue-400 transition-colors line-clamp-2"
                                        >
                                            {lead.address}
                                        </a>
                                    </div>

                                    {lead.website && (
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><ArrowUpRightIcon className="w-4 h-4" /></div>
                                            <a href={lead.website} target="_blank" className="text-xs md:text-sm font-medium hover:text-blue-400 truncate max-w-[200px]">{lead.website}</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Coluna Direita: Script Rápido (Agora com IA) */}
                            <div className="flex flex-col h-full">
                                <div className="flex-1 bg-[#151515] border border-white/10 rounded-2xl p-5 relative flex flex-col group">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Início de Conversa (IA)</h3>
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                                        </div>
                                        <button onClick={() => handleCopy(generatedScript)} className="text-[10px] text-white/50 hover:text-white uppercase font-bold">Copiar</button>
                                    </div>
                                    
                                    <div className="relative flex-1 min-h-[200px]">
                                        {isScriptLoading && (
                                            <div className="absolute inset-0 bg-[#151515] z-10 flex flex-col items-center justify-center rounded-xl border border-white/5">
                                                <SpinnerIcon />
                                                <span className="text-[10px] uppercase tracking-widest text-white/40 mt-2 animate-pulse">Criando Abordagem Natural...</span>
                                            </div>
                                        )}
                                        <textarea 
                                            className="w-full h-full bg-transparent border-none outline-none text-white text-sm md:text-base leading-relaxed resize-none font-sans"
                                            value={generatedScript}
                                            onChange={(e) => setGeneratedScript(e.target.value)}
                                            placeholder="Aguarde, gerando texto..."
                                        />
                                    </div>

                                    <button 
                                        onClick={() => onOpenWhatsapp(generatedScript)}
                                        disabled={isScriptLoading}
                                        className="mt-4 w-full bg-[#25D366] hover:bg-[#20b858] text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-600/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PhoneIcon className="w-4 h-4 text-black fill-current" />
                                        Enviar WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABA 2: ESTRATÉGIA IA */}
                    {activeTab === 'ai_strategy' && (
                        <div className="h-full flex flex-col animate-in slide-in-from-right-4">
                            {!strategy && !isAiLoading && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                        <BrainIcon className="w-10 h-10 text-white/50" />
                                    </div>
                                    <div className="text-center max-w-sm px-4">
                                        <h3 className="text-xl font-black text-white uppercase italic">Análise Profunda</h3>
                                        <p className="text-white/40 text-sm mt-2">Use a IA para gerar um perfil comportamental do dono, produtos sugeridos e quebra de objeções.</p>
                                    </div>
                                    <button 
                                        onClick={generateAiStrategy}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                                    >
                                        Gerar Estratégia IA
                                    </button>
                                </div>
                            )}

                            {isAiLoading && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                                    <SpinnerIcon />
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 animate-pulse">Analisando Mercado...</span>
                                </div>
                            )}

                            {strategy && (
                                <div className="space-y-6">
                                    {/* Sumário Executivo */}
                                    <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Diagnóstico IA</h3>
                                        <p className="text-white text-sm md:text-lg leading-relaxed font-light italic">"{strategy.executive_summary}"</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-[#111] border border-white/5 p-5 rounded-2xl">
                                            <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">O que vender?</h3>
                                            <ul className="space-y-2">
                                                {strategy.suggested_products.map((prod, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-white/80">
                                                        <span className="text-green-500 font-bold">✓</span> {prod}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-[#111] border border-white/5 p-5 rounded-2xl">
                                            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Perfil do Dono</h3>
                                            <p className="text-xs md:text-sm text-white/80 italic">"{strategy.owner_profile_guess}"</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#111] border border-white/5 p-5 rounded-2xl">
                                        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4">Pontos de Dor</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {strategy.sales_arguments.pain_points.map((pain, i) => (
                                                <li key={i} className="text-xs text-white/70 border-l border-red-500/30 pl-3 py-1">{pain}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <button onClick={() => setStrategy(null)} className="w-full py-4 text-center text-white/30 hover:text-white text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-all">
                                        Limpar e Gerar Nova Análise
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const NICHES = [
    "Dentista", "Advogado", "Pizzaria", "Estética", "Oficina Mecânica", 
    "Imobiliária", "Academia", "Pet Shop", "Salão de Beleza", "Restaurante",
    "Contabilidade", "Arquitetura", "Engenharia", "Marketing Digital", "Consultoria",
    "Psicólogo", "Nutricionista", "Fisioterapia", "Personal Trainer", "Barbearia",
    "Loja de Roupas", "Farmácia", "Supermercado", "Padaria", "Confeitaria",
    "Hotel", "Pousada", "Agência de Viagens", "Escola", "Curso de Idiomas",
    "Clínica Veterinária", "Lavanderia", "Floricultura", "Papelaria", "Livraria",
    "Loja de Móveis", "Loja de Eletrônicos", "Loja de Informática", "Assistência Técnica",
    "Gráfica", "Despachante", "Seguradora", "Plano de Saúde", "Consórcio",
    "Empréstimo", "Investimentos", "Câmbio", "Cartório", "Auto Escola"
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'contacted' | 'viewed' | 'excluded' | 'brainstorm' | 'marketing'>('search');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Search Configuration
  const [searchMode, setSearchMode] = useState<SearchMode>('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [minScore, setMinScore] = useState(0); 
  const [useWebHunter, setUseWebHunter] = useState(false);
  
  // Automation State
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isProcessingAuto, setIsProcessingAuto] = useState(false);

  // Detecta se é a mesma busca para usar paginação
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [lastLocation, setLastLocation] = useState('');

  // CRM States
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  const [viewedLeads, setViewedLeads] = useState<Lead[]>([]);
  const [excludedLeads, setExcludedLeads] = useState<Lead[]>([]);
  const [chamadosSearch, setChamadosSearch] = useState('');

  // Stats States
  const [contactedCount24h, setContactedCount24h] = useState(0);
  const [firstContactTime, setFirstContactTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [exhaustedSearches, setExhaustedSearches] = useState<Set<string>>(new Set());

  // Results States
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  // Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Countdown & Instagram Logic
  const [autoCountdown, setAutoCountdown] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [loadingInstagramId, setLoadingInstagramId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cbl_contacted_leads');
    if (saved) {
        try { 
            const parsed = JSON.parse(saved);
            setContactedLeads(parsed);
            
            // Calculate 24h stats on load
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const recentContacts = parsed.filter((l: Lead) => l.contactedAt && new Date(l.contactedAt) > oneDayAgo);
            setContactedCount24h(recentContacts.length);
            
            if (recentContacts.length > 0) {
                // Find the earliest contact in the last 24h window
                const sorted = recentContacts.sort((a: Lead, b: Lead) => new Date(a.contactedAt!).getTime() - new Date(b.contactedAt!).getTime());
                setFirstContactTime(new Date(sorted[0].contactedAt!));
            }
        } catch (e) { console.error(e); }
    }
    const savedViewed = localStorage.getItem('cbl_viewed_leads');
    if (savedViewed) {
        try { setViewedLeads(JSON.parse(savedViewed)); } catch (e) { console.error(e); }
    }
    const savedExcluded = localStorage.getItem('cbl_excluded_leads');
    if (savedExcluded) {
        try { setExcludedLeads(JSON.parse(savedExcluded)); } catch (e) { console.error(e); }
    }
    const savedExhausted = localStorage.getItem('cbl_exhausted_searches');
    if (savedExhausted) {
        try { setExhaustedSearches(new Set(JSON.parse(savedExhausted))); } catch (e) { console.error(e); }
    }
  }, []);

  // Timer Effect
  useEffect(() => {
      if (!firstContactTime) return;
      
      const interval = setInterval(() => {
          const now = new Date();
          const diff = now.getTime() - firstContactTime.getTime();
          
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
      
      return () => clearInterval(interval);
  }, [firstContactTime]);

  const generateRandomNiche = () => {
      const availableNiches = NICHES.filter(n => !exhaustedSearches.has(`${n.toLowerCase()}-${location.toLowerCase()}`));
      if (availableNiches.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * availableNiches.length);
      return availableNiches[randomIndex];
  };

  const handleGenerateNiche = () => {
      const niche = generateRandomNiche();
      if (niche) {
          setSearchTerm(niche);
      } else {
          alert("Todos os nichos disponíveis já foram explorados para esta localização!");
      }
  };

  useEffect(() => {
    localStorage.setItem('cbl_contacted_leads', JSON.stringify(contactedLeads));
  }, [contactedLeads]);

  useEffect(() => {
    localStorage.setItem('cbl_viewed_leads', JSON.stringify(viewedLeads));
  }, [viewedLeads]);

  useEffect(() => {
    localStorage.setItem('cbl_excluded_leads', JSON.stringify(excludedLeads));
  }, [excludedLeads]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdownTimer > 0) {
      interval = setInterval(() => {
        setCountdownTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdownTimer]);



  const classifySite = (url?: string): 'com_site' | 'sem_site' | 'site_basico' => {
      if (!url) return 'sem_site';
      const lowerUrl = url.toLowerCase();
      const weakDomains = ['anota.ai', 'ifood', 'facebook', 'instagram', 'linktr.ee', 'wa.me', 'whatsapp', 'wix', 'google.com/view', 'bit.ly'];
      if (weakDomains.some(domain => lowerUrl.includes(domain))) return 'site_basico';
      return 'com_site';
  };

  const calculateLeadScore = (place: any, siteStatus: string, mode: SearchMode) => {
    let score = 50; 
    if (siteStatus === 'sem_site') score += 30;
    else if (siteStatus === 'site_basico') score += 20;
    else score -= 10;

    switch (mode) {
        case 'whale': 
            if (place.price_level >= 3) score += 40; 
            else if (place.price_level === 2) score += 10;
            break;
        case 'crisis': 
            if (place.rating < 3.8) score += 40; 
            else if (place.rating < 4.3) score += 20;
            break;
        case 'ghost': 
            if (siteStatus === 'com_site') score = 0; 
            if (siteStatus === 'sem_site') score += 20;
            break;
    }
    return Math.min(Math.max(score, 0), 99);
  };

  const executeSearch = async (token?: string, overrideTerm?: string) => {
    const termToUse = overrideTerm || searchTerm;
    if (!termToUse || !location) return;

    setIsLoading(true);
    if (!token) {
        setLeads([]);
    }
    setActiveTab('search');
    
    // Salva termos atuais para comparar na proxima
    setLastSearchTerm(termToUse);
    setLastLocation(location);

    try {
      let processedLeads: Lead[] = [];
      let nextToken = null;

      if (useWebHunter && !token) {
          // --- WEB HUNTER MODE (AI SEARCH) ---
          const response = await fetch('/api/web-hunter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: termToUse, location: location })
          });
          
          if (!response.ok) throw new Error("Erro no Web Hunter");
          const data = await response.json();
          
          processedLeads = data.results.map((item: any) => {
              const siteStatus = classifySite(item.website);
              // Web leads start with a base score, adjusted by vibe if possible
              let score = 60; 
              if (siteStatus === 'sem_site') score += 20;
              return {
                  id: item.place_id,
                  place_id: item.place_id,
                  name: item.name,
                  address: item.formatted_address,
                  rating: 0,
                  user_ratings_total: 0,
                  website: item.website,
                  phone: item.formatted_phone_number,
                  lead_score: score,
                  status_site: siteStatus,
                  types: item.types,
                  business_status: 'OPERATIONAL',
                  source: 'web_hunter',
                  ai_snippet: item.ai_snippet,
                  vibe: item.vibe
              };
          });

      } else {
          // --- STANDARD GOOGLE MAPS MODE ---
          let queryPrefix = "";
          if (searchMode === 'whale') queryPrefix = "Luxury High End ";
          const fullQuery = `${queryPrefix}${termToUse} in ${location}`;

          const response = await fetch('/api/places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                query: fullQuery,
                pagetoken: token
            }),
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.details || errorData.error || `Erro HTTP ${response.status}`);
          }

          const data = await response.json();
          const rawResults = data.results || [];
          nextToken = data.next_page_token || null;

          processedLeads = rawResults.map((place: any) => {
              const siteStatus = classifySite(place.website);
              const score = calculateLeadScore(place, siteStatus, searchMode);
              return {
                  id: place.place_id,
                  place_id: place.place_id,
                  name: place.name,
                  address: place.formatted_address,
                  rating: place.rating || 0,
                  user_ratings_total: place.user_ratings_total || 0,
                  website: place.website,
                  url: place.url,
                  phone: place.formatted_phone_number,
                  international_phone: place.international_phone_number,
                  lead_score: score,
                  status_site: siteStatus,
                  types: place.types || [],
                  price_level: place.price_level,
                  business_status: place.business_status,
                  opening_hours: place.opening_hours,
                  photos: place.photos,
                  geometry: place.geometry,
                  source: 'google_maps'
              };
          });
      }

      setNextPageToken(nextToken);

      // --- CRITÉRIOS DE FILTRAGEM AVANÇADA ---
      processedLeads = processedLeads.filter((lead: Lead) => {
          // 1. Remove Contactados
          const isContacted = contactedLeads.some(cl => cl.id === lead.id);
          if (isContacted) return false;
          
          // 2. Remove Visualizados
          const isViewed = viewedLeads.some(vl => vl.id === lead.id);
          if (isViewed) return false; 

          // 3. Remove Excluídos
          const isExcluded = excludedLeads.some(el => el.id === lead.id);
          if (isExcluded) return false;
          
          // 4. Filtro de Score Mínimo (Slider)
          if (lead.lead_score < minScore) return false;

          if (searchMode === 'ghost' && lead.status_site === 'com_site') return false;
          return true;
      });

      // --- CRITÉRIO DE ORDENAÇÃO ---
      // Ordena pelo SCORE (Do maior para o menor)
      processedLeads.sort((a, b) => b.lead_score - a.lead_score);

      // Check if we found leads. If not, and it's the first page, mark as exhausted
      if (processedLeads.length === 0 && !token) {
           const key = `${termToUse.toLowerCase()}-${location.toLowerCase()}`;
           setExhaustedSearches(prev => {
               const newSet = new Set(prev).add(key);
               localStorage.setItem('cbl_exhausted_searches', JSON.stringify(Array.from(newSet)));
               return newSet;
           });
      }

      setLeads(prev => token ? [...prev, ...processedLeads] : processedLeads);

    } catch (error: any) {
      console.error(error);
      alert("Erro na busca: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchButton = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Mover leads ATUAIS da tela para Visualizados (Arquivar em massa)
      const currentVisibleLeads = leads;
      if (currentVisibleLeads.length > 0) {
          const newViewed = [...viewedLeads, ...currentVisibleLeads];
          // Remove duplicatas por ID apenas por segurança
          const uniqueViewed = Array.from(new Map(newViewed.map(item => [item.id, item])).values());
          
          setViewedLeads(uniqueViewed);
          localStorage.setItem('cbl_viewed_leads', JSON.stringify(uniqueViewed));
      }

      // Limpa a tela atual para trazer novos
      setLeads([]);

      // Lógica de Paginação Automática
      if (searchTerm === lastSearchTerm && location === lastLocation && nextPageToken) {
          executeSearch(nextPageToken);
      } else {
          executeSearch();
      }
  };

  const loadMore = () => {
      if (nextPageToken) {
          executeSearch(nextPageToken);
      }
  };

  const markAsContacted = (lead: Lead) => {
      const leadWithDate = { ...lead, contactedAt: new Date().toISOString() };
      setContactedLeads(prev => [leadWithDate, ...prev]);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      setViewedLeads(prev => prev.filter(l => l.id !== lead.id));
      if (selectedLead?.id === lead.id) setSelectedLead(null);
      
      // Update Stats
      setContactedCount24h(prev => prev + 1);
      if (!firstContactTime) {
          setFirstContactTime(new Date());
      }
  };

  const markAsExcluded = (lead: Lead) => {
      setExcludedLeads(prev => [lead, ...prev]);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      setViewedLeads(prev => prev.filter(l => l.id !== lead.id));
      setContactedLeads(prev => prev.filter(l => l.id !== lead.id));
      if (selectedLead?.id === lead.id) setSelectedLead(null);
  };

  const handleOpenLead = (lead: Lead) => {
      setSelectedLead(lead);
      
      const isContacted = contactedLeads.some(cl => cl.id === lead.id);
      if (!isContacted) {
          const isAlreadyViewed = viewedLeads.some(vl => vl.id === lead.id);
          if (!isAlreadyViewed) {
              const viewedLead = { ...lead, viewedAt: new Date().toISOString() };
              setViewedLeads(prev => [viewedLead, ...prev]);
          }
      }
  };

  const openWhatsApp = (lead: Lead, customMessage?: string) => {
      if (countdownTimer > 0) {
          alert(`Aguarde ${countdownTimer}s para evitar bloqueios do WhatsApp.`);
          return;
      }

      const rawPhone = lead.international_phone || lead.phone;
      if (!rawPhone) { alert("Telefone não disponível."); return; }
      let cleanPhone = rawPhone.replace(/\D/g, '');
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11) cleanPhone = '55' + cleanPhone;
      
      const message = customMessage || `Olá ${lead.name}, gostaria de falar sobre o marketing de vocês.`;
      const text = encodeURIComponent(message);
      // Use api.whatsapp.com for better compatibility with emojis
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`, '_blank');

      if (autoCountdown) {
          // Random countdown between 60 and 120 seconds for safer automation
          const randomCountdown = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
          setCountdownTimer(randomCountdown); 
      }
  };

  const openInstagram = async (lead: Lead) => {
      if (lead.website && lead.website.toLowerCase().includes('instagram.com')) {
          window.open(lead.website, '_blank');
          return;
      }
      
      setLoadingInstagramId(lead.id);
      try {
          // Tenta buscar via API robusta (Gemini + Google Search)
          const response = await fetch('/api/find-instagram', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  name: lead.name, 
                  address: lead.address, 
                  website: lead.website 
              })
          });
          
          const data = await response.json();
          if (data.url) {
              window.open(data.url, '_blank');
          } else {
              // Fallback to Google Search if not found
              const query = `site:instagram.com "${lead.name}" ${location}`;
              window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
          }
      } catch (error) {
          console.error("Erro ao buscar Instagram:", error);
          const query = `site:instagram.com "${lead.name}" ${location}`;
          window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      } finally {
          setLoadingInstagramId(null);
      }
  };

  // --- AUTOMATION LOOP (MOVED HERE TO ACCESS FUNCTIONS) ---
  useEffect(() => {
      if (!isAutoMode || countdownTimer > 0 || isProcessingAuto) return;

      // Logic to handle empty leads list: Try to load more or stop
      if (leads.length === 0) {
          if (nextPageToken) {
              console.log("[Auto Mode] Loading more leads...");
              executeSearch(nextPageToken);
          } else {
              // Try to switch niche
              const nextNiche = generateRandomNiche();
              if (nextNiche) {
                  console.log(`[Auto Mode] Niche exhausted. Switching to: ${nextNiche}`);
                  setSearchTerm(nextNiche);
                  // Mark current as exhausted
                  const key = `${searchTerm.toLowerCase()}-${location.toLowerCase()}`;
                  setExhaustedSearches(prev => {
                      const newSet = new Set(prev).add(key);
                      localStorage.setItem('cbl_exhausted_searches', JSON.stringify(Array.from(newSet)));
                      return newSet;
                  });
                  
                  // Trigger search with new niche (overrideTerm is important because state update might be slow)
                  executeSearch(undefined, nextNiche);
              } else {
                  console.log("[Auto Mode] No more leads and no more niches. Stopping.");
                  setIsAutoMode(false);
                  alert("Automação finalizada: Não há mais leads e todos os nichos foram explorados.");
              }
          }
          return;
      }

      const processNextLead = async () => {
          setIsProcessingAuto(true);
          const currentLead = leads[0]; // Always process the first one as they get removed

          try {
              // Check phone validity first to avoid alerts in openWhatsApp
              const rawPhone = currentLead.international_phone || currentLead.phone;
              
              if (rawPhone) {
                  // 1. Generate Script
                  const script = await generateScript(currentLead);

                  // 2. Open WhatsApp (this might set countdown if enabled)
                  openWhatsApp(currentLead, script);
              } else {
                  console.log(`[Auto Mode] Skipping ${currentLead.name} - No Phone`);
              }

              // 3. Mark as Contacted (removes from list)
              // Small delay to ensure UI updates and browser handles the popup
              setTimeout(() => {
                  markAsContacted(currentLead);
                  setIsProcessingAuto(false);
                  
                  // If autoCountdown is NOT on, force a small safety delay anyway
                  if (!autoCountdown) {
                      // Random countdown between 5 and 15 seconds
                      const randomShortCountdown = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
                      setCountdownTimer(randomShortCountdown);
                  }
              }, 2000);

          } catch (error) {
              console.error("Auto Process Error:", error);
              setIsProcessingAuto(false);
          }
      };

      processNextLead();
  }, [isAutoMode, leads, countdownTimer, isProcessingAuto, autoCountdown, nextPageToken]);

  const copyPitch = (lead: Lead, pitchText?: string) => {
      let textToCopy = pitchText || "Olá";
      textToCopy = textToCopy.trim().replace(/\n\s+\n/g, '\n\n'); 
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
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

  const ModeSelector = () => (
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
          {[{id: 'standard', label: 'Padrão', color: 'red'}, {id: 'whale', label: 'Whale', color: 'blue'}, {id: 'crisis', label: 'Crise', color: 'orange'}, {id: 'ghost', label: 'Ghost', color: 'purple'}].map((m: any) => (
             <button 
                key={m.id}
                type="button"
                onClick={() => setSearchMode(m.id as SearchMode)}
                className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all whitespace-nowrap min-w-[80px] ${searchMode === m.id ? `bg-${m.color}-600 border-${m.color}-500 text-white shadow-lg` : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
             >
                 <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
             </button>
          ))}
      </div>
  );

  const LeadCard: React.FC<{ lead: Lead; isArchived?: boolean; isViewed?: boolean; isExcluded?: boolean }> = ({ lead, isArchived = false, isViewed = false, isExcluded = false }) => {
      if (!lead) return null;

      // Cálculo de Tags Dinâmicas
      const isHighScore = lead.lead_score > 70;
      const isLowScore = lead.lead_score < 40;
      const isBlocked = countdownTimer > 0 && !isArchived && !isExcluded;
      
      return (
        <div className={`
            bg-[#0f0f0f] border rounded-3xl flex flex-col justify-between h-full group transition-all duration-300 relative overflow-hidden shadow-2xl mb-4 md:mb-0
            ${isHighScore ? 'border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]' : (isLowScore ? 'border-red-500/10' : 'border-white/10')}
            ${isArchived ? 'opacity-50 grayscale' : ''}
            ${isViewed && !isArchived && !isExcluded ? 'opacity-80 border-white/5' : ''}
            ${isExcluded ? 'opacity-40 grayscale border-red-900/20' : ''}
            ${isBlocked ? 'pointer-events-none' : ''}
        `}>
             {/* Countdown Overlay - Outside Grayscale Context */}
             {isBlocked && (
                 <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                     <div className="text-center animate-pulse">
                         <span className="block text-6xl font-black text-[#ff0000] tracking-tighter drop-shadow-[0_0_25px_rgba(255,0,0,0.8)]">{countdownTimer}</span>
                         <span className="text-[10px] uppercase tracking-widest text-white font-bold mt-2 block">Aguarde...</span>
                     </div>
                 </div>
             )}

             {/* Content Wrapper - Applies Grayscale Only Here */}
             <div className={`flex flex-col justify-between h-full w-full transition-all duration-300 ${isBlocked ? 'grayscale opacity-20' : ''}`}>
                 {/* Header de Imagem e Score */}
                 <div className="h-32 w-full bg-gray-900 relative overflow-hidden shrink-0 group-hover:scale-[1.01] transition-transform duration-700">
                     {/* Scanline Effect */}
                     <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                     <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
                     
                     {lead.photos && lead.photos.length > 0 ? (
                         <img src={`/api/photo?ref=${lead.photos[0].photo_reference}`} className="w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-80" alt={lead.name} />
                     ) : (
                         <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center opacity-50"><Logo className="scale-75 opacity-20" /></div>
                     )}

                     {/* Badges de Topo */}
                     <div className="absolute top-2 left-2 flex flex-col gap-1 z-20 items-start">
                         {lead.source === 'web_hunter' ? (
                             <span className="bg-blue-600/90 text-white text-[10px] font-mono font-black px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                 🌐 WEB HUNTER
                             </span>
                         ) : (
                             <span className="bg-green-600/90 text-white text-[10px] font-mono font-black px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                 📍 GOOGLE MAPS
                             </span>
                         )}

                         {lead.opening_hours?.open_now 
                            ? <span className="bg-emerald-500/90 text-black text-[10px] font-mono font-black px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider shadow-lg">ABERTO</span> 
                            : <span className="bg-red-600/90 text-white text-[10px] font-mono font-black px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider shadow-lg">FECHADO</span>
                         }
                         
                         {/* SALES TRIGGER BADGES (Gatilhos Mentais) */}
                         {lead.status_site === 'sem_site' && lead.rating > 4.0 && (
                             <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg animate-pulse">👑 Ouro</span>
                         )}
                         {lead.rating < 4.0 && lead.user_ratings_total > 50 && (
                             <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg">🚑 Socorro</span>
                         )}
                         {(lead.price_level || 0) >= 3 && (
                             <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg">💎 High Ticket</span>
                         )}
                         {lead.user_ratings_total > 100 && lead.rating >= 4.5 && (
                             <span className="bg-purple-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg">⭐ Autoridade</span>
                         )}
                         {lead.user_ratings_total < 10 && (
                             <span className="bg-gray-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg">🆕 Novo</span>
                         )}
                     </div>

                     {/* Score Ring Visual */}
                     <div className="absolute top-2 right-2 z-20">
                         <div className="relative w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
                            <svg className="w-full h-full transform -rotate-90 absolute">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/10" />
                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="transparent" 
                                    className={`${isHighScore ? 'text-green-500' : 'text-red-500'}`}
                                    strokeDasharray={113}
                                    strokeDashoffset={113 - (113 * lead.lead_score) / 100}
                                />
                            </svg>
                            <span className={`text-xs font-black ${isHighScore ? 'text-green-500' : 'text-white'}`}>{lead.lead_score}</span>
                         </div>
                     </div>
                 </div>
                 
                 {/* Corpo do Card */}
                 <div className="p-4 flex-1 flex flex-col relative z-20 -mt-4">
                     <h3 className="text-base font-black text-white uppercase leading-tight line-clamp-2 mb-2 group-hover:text-red-500 transition-colors drop-shadow-md">
                        {lead.name}
                     </h3>
                     
                     {/* Smart Tags (Nova Feature) */}
                     <div className="flex flex-wrap gap-1.5 mb-3">
                        {lead.status_site === 'sem_site' && <span className="text-[7px] font-mono uppercase bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded tracking-widest">[SEM SITE]</span>}
                        {lead.status_site === 'site_basico' && <span className="text-[7px] font-mono uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded tracking-widest">[LINKTREE]</span>}
                        {(lead.price_level || 0) >= 3 && <span className="text-[7px] font-mono uppercase bg-green-500/10 text-green-500 border border-green-500/20 px-1.5 py-0.5 rounded tracking-widest">[HIGH TICKET]</span>}
                        {lead.rating < 4.0 && <span className="text-[7px] font-mono uppercase bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded tracking-widest">[BAIXA REP]</span>}
                        {lead.user_ratings_total > 100 && <span className="text-[7px] font-mono uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded tracking-widest">[POPULAR]</span>}
                     </div>

                     <div className="flex items-start gap-2 mt-auto">
                        <LocationIcon className="w-3 h-3 text-white/30 mt-0.5 shrink-0" />
                        <span className="text-white/50 text-[9px] font-medium leading-relaxed line-clamp-2">{lead.address}</span>
                     </div>
                 </div>

                 {/* Footer de Ações (Control Panel Style) */}
                 <div className="grid grid-cols-5 gap-px bg-[#222] border-t border-white/5">
                     <button onClick={() => openWhatsApp(lead)} className="col-span-1 bg-[#0f0f0f] hover:bg-[#25D366] text-white/30 hover:text-black py-4 flex flex-col items-center justify-center transition-all h-14 active:scale-95 group/btn">
                        <PhoneIcon className="w-5 h-5 text-current" />
                     </button>
                     <button onClick={() => openInstagram(lead)} disabled={loadingInstagramId === lead.id} className="col-span-1 bg-[#0f0f0f] hover:bg-pink-600 text-white/30 hover:text-white py-4 flex flex-col items-center justify-center transition-all h-14 active:scale-95 group/btn disabled:opacity-50 disabled:cursor-not-allowed">
                        {loadingInstagramId === lead.id ? <SpinnerIcon className="w-5 h-5 animate-spin text-pink-500" /> : <InstagramIcon className="w-5 h-5 text-current" />}
                     </button>
                     <button onClick={() => handleOpenLead(lead)} className="col-span-1 bg-[#0f0f0f] hover:bg-white text-white/30 hover:text-black py-4 flex flex-col items-center justify-center transition-all h-14 active:scale-95 group/btn">
                        <ZapIcon className="w-5 h-5 text-current" />
                     </button>
                     
                     {/* Lógica de Botão de Check/Restaurar */}
                     {isArchived ? (
                         <button onClick={() => setContactedLeads(prev => prev.filter(l => l.id !== lead.id))} className="col-span-1 bg-[#0f0f0f] hover:bg-blue-600 text-blue-600 hover:text-white py-4 flex flex-col items-center justify-center transition-all h-14 active:scale-95">
                            <span className="text-xl font-black">↩</span>
                         </button>
                     ) : (
                         <button onClick={() => markAsContacted(lead)} className="col-span-1 bg-[#0f0f0f] hover:bg-green-600 text-green-600 hover:text-white py-4 flex flex-col items-center justify-center transition-all h-14 active:scale-95">
                            <span className="text-xl font-black">✓</span>
                         </button>
                     )}

                     {/* Botão de Excluir */}
                     <button onClick={() => markAsExcluded(lead)} className="col-span-1 bg-[#0f0f0f] hover:bg-red-900 text-red-900 hover:text-white py-4 flex flex-col items-center justify-center transition-all h-14 active:scale-95 group/btn border-l border-white/5">
                        <XIcon className="w-5 h-5 text-current" />
                     </button>
                 </div>
             </div>
      </div>
      );
  };

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-red-600 selection:text-white">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="md:hidden h-16 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-50 fixed top-0 w-full">
          <Logo className="scale-75 origin-left" />
          <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2 rounded-lg bg-white/5 active:scale-95"><MenuIcon className="w-6 h-6" /></button>
      </div>

      {/* Sidebar Overlay (Mobile Only) */}
      <div className={`fixed inset-0 bg-black/80 z-50 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 top-0 left-0 h-full w-72 md:w-20 lg:w-72 bg-[#080808] border-r border-white/10 flex flex-col py-6 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:pt-6`}>
          <div className="px-6 md:px-0 lg:px-6 mb-8 flex justify-between items-center md:justify-center lg:justify-start">
              <Logo className="scale-90 origin-left md:scale-75 lg:scale-90" />
              <button onClick={() => setIsSidebarOpen(false)} className="text-white/50 md:hidden"><XIcon /></button>
          </div>
          
          <div className="flex flex-col gap-2 px-4 md:px-2 lg:px-4">
             <div className="md:hidden lg:block text-[9px] text-white/30 uppercase tracking-[0.2em] mb-2 pl-2">Ferramentas</div>
             <NavButton tab="search" icon={<TargetIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">Prospecção</span>} />
             <NavButton tab="contacted" icon={<PhoneIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">Histórico</span>} />
             <NavButton tab="viewed" icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} label={<span className="md:hidden lg:inline">Visualizados</span>} />
             <NavButton tab="excluded" icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>} label={<span className="md:hidden lg:inline">Lixeira</span>} />
             
             <NavButton tab="brainstorm" icon={<BrainIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">War Room</span>} />
             <NavButton tab="marketing" icon={<MegaphoneIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">Marketing</span>} />
          </div>

          <div className="mt-auto px-4 md:px-2 lg:px-4">
              <button onClick={onLogout} className="w-full text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-red-500 transition-colors flex items-center justify-center gap-2 py-4 rounded-lg bg-white/5 md:bg-transparent lg:bg-white/5 md:hover:bg-white/5"><XIcon className="w-4 h-4" /> <span className="md:hidden lg:inline">Sair</span></button>
          </div>
      </aside>

      <main className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden pt-16 md:pt-0">
            {/* Desktop Header */}
            <header className="hidden md:flex h-16 border-b border-white/10 items-center justify-between px-6 bg-[#0A0A0A]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-px bg-white/10"></div>
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Intelligence Hub v4.5</span>
                    
                    {/* Stats Bar */}
                    <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase text-white/30 tracking-widest">Tempo Ativo</span>
                            <span className="text-xs font-mono font-bold text-white">{elapsedTime}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase text-white/30 tracking-widest">Contatados (24h)</span>
                            <span className="text-xs font-mono font-bold text-green-500">{contactedCount24h}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span><span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Deep Search: ON</span></div>
                </div>
            </header>

            {activeTab === 'search' && (
                <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-6 border-b border-white/5 bg-[#050505] z-10 shrink-0">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="mb-4 flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Busca <span className="text-red-600">Deep Dive</span></h1>
                                        
                                        <div className="flex flex-wrap gap-3">
                                            {/* Auto Mode Toggle */}
                                            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 w-fit">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Modo Automático</span>
                                                <button 
                                                    onClick={() => setIsAutoMode(!isAutoMode)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isAutoMode ? 'bg-purple-500' : 'bg-white/10'}`}
                                                >
                                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 ${isAutoMode ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                                {isAutoMode && <span className="text-[10px] font-mono font-bold text-purple-500 animate-pulse">ON</span>}
                                            </div>

                                            {/* Toggle Switch */}
                                            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 w-fit">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Auto Countdown</span>
                                                <button 
                                                    onClick={() => setAutoCountdown(!autoCountdown)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${autoCountdown ? 'bg-green-500' : 'bg-white/10'}`}
                                                >
                                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 ${autoCountdown ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                                {countdownTimer > 0 && <span className="text-[10px] font-mono font-bold text-red-500 animate-pulse">{countdownTimer}s</span>}
                                            </div>

                                            {/* Web Hunter Toggle */}
                                            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 w-fit">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Web Hunter (IA)</span>
                                                <button 
                                                    onClick={() => setUseWebHunter(!useWebHunter)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${useWebHunter ? 'bg-blue-500' : 'bg-white/10'}`}
                                                >
                                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 ${useWebHunter ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <ModeSelector />
                                </div>
                            </div>
                            
                            <form onSubmit={handleSearchButton} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end bg-[#0A0A0A] p-4 md:p-5 rounded-3xl border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm md:text-base font-bold transition-all placeholder-white/20" placeholder="Ex: Estética" />
                                        <button type="button" onClick={handleGenerateNiche} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-3 flex items-center justify-center text-white/50 hover:text-white transition-colors" title="Gerar Nicho Aleatório">
                                            <BrainIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região</label>
                                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm md:text-base font-bold transition-all placeholder-white/20" placeholder="Ex: Pinheiros, SP" />
                                </div>
                                <div className="md:col-span-3 space-y-2 flex flex-col justify-end h-full">
                                    <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1 flex justify-between">
                                        <span>Score Min: {minScore}</span>
                                        <span>+70 = Alta Qualidade</span>
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:py-4 flex items-center">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="99" 
                                            value={minScore} 
                                            onChange={(e) => setMinScore(Number(e.target.value))} 
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-600"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 md:py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[48px] md:h-[58px] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                        {isLoading ? <SpinnerIcon /> : 'BUSCAR ALVOS'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-[#050505] pb-24 md:pb-24">
                        <div className="max-w-8xl mx-auto">
                            {!isLoading && leads.length === 0 && (
                                <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                                    <TargetIcon className="w-16 h-16 text-white mb-4" />
                                    <p className="text-sm font-black uppercase tracking-widest">Nenhum alvo detectado</p>
                                    <p className="text-xs mt-2 text-white/50 max-w-xs">Se já buscou antes, os resultados anteriores foram movidos para a aba "Visualizados" para não repetir.</p>
                                </div>
                            )}
                            
                            {leads.length > 0 && (
                                <>
                                    <div className="flex justify-between items-end mb-6 px-1 border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl font-black text-white italic">{leads.length}</span>
                                            <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2 leading-tight">Leads Encontrados</span>
                                        </div>
                                        {minScore > 0 && <span className="text-[9px] text-red-500 border border-red-500/30 px-2 py-1 rounded uppercase tracking-widest">Filtro Score: &gt; {minScore}</span>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8">
                                        {leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
                                    </div>
                                    {nextPageToken && (
                                        <div className="mt-10 flex justify-center">
                                            <button 
                                                onClick={loadMore} 
                                                disabled={isLoading}
                                                className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all hover:scale-105"
                                            >
                                                {isLoading ? <SpinnerIcon /> : '+ CARREGAR MAIS ALVOS'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Outras Abas (CRM e Ferramentas) */}
            {activeTab === 'contacted' && (
                <div className="flex-1 flex flex-col bg-[#050505] p-4 md:p-6 pb-24 md:pb-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                            <div><h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Histórico</h1><p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Mapa de Leads Contactados</p></div>
                            <input type="text" value={chamadosSearch} onChange={(e) => setChamadosSearch(e.target.value)} placeholder="Filtrar..." className="w-full md:w-96 bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-600 outline-none text-sm font-medium" />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 pb-20">
                                {contactedLeads.filter(l => l.name.toLowerCase().includes(chamadosSearch.toLowerCase())).map((lead) => <LeadCard key={lead.id} lead={lead} isArchived={true} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'viewed' && (
                <div className="flex-1 flex flex-col bg-[#050505] p-4 md:p-6 pb-24 md:pb-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                            <div><h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Visualizados</h1><p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Leads que você já olhou mas não contactou</p></div>
                            <input type="text" value={chamadosSearch} onChange={(e) => setChamadosSearch(e.target.value)} placeholder="Filtrar..." className="w-full md:w-96 bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-600 outline-none text-sm font-medium" />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 pb-20">
                                {viewedLeads.filter(l => l.name.toLowerCase().includes(chamadosSearch.toLowerCase())).map((lead) => <LeadCard key={lead.id} lead={lead} isViewed={true} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'excluded' && (
                <div className="flex-1 flex flex-col bg-[#050505] p-4 md:p-6 pb-24 md:pb-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                            <div><h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Lixeira</h1><p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Leads Descartados / Excluídos</p></div>
                            <input type="text" value={chamadosSearch} onChange={(e) => setChamadosSearch(e.target.value)} placeholder="Filtrar..." className="w-full md:w-96 bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-600 outline-none text-sm font-medium" />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 pb-20">
                                {excludedLeads.filter(l => l.name.toLowerCase().includes(chamadosSearch.toLowerCase())).map((lead) => <LeadCard key={lead.id} lead={lead} isExcluded={true} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {(activeTab === 'brainstorm' || activeTab === 'marketing') && (
                <div className="flex-1 overflow-hidden h-full">
                    {activeTab === 'brainstorm' && <StrategicWarRoom />}
                    {activeTab === 'marketing' && <MarketingCommand />}
                </div>
            )}
      </main>

      {selectedLead && <LeadStrategyModal lead={selectedLead} onClose={() => setSelectedLead(null)} onOpenWhatsapp={(text) => openWhatsApp(selectedLead, text)} searchMode={searchMode} />}
    </div>
  );
};

export default AdminDashboard;
