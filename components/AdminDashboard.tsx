import React, { useState, useRef, useEffect } from 'react';
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
            
            try {
                // PROMPT DE ALTA CONVERSÃO - CAMALEÃO DE NICHO + CTA OBRIGATÓRIO
                const prompt = `
                    ATUE COMO: Especialista em Vendas e Posicionamento Digital (Humano, Casual, Brasileiro).
                    OBJETIVO: Enviar uma mensagem de WhatsApp para o dono da "${lead.name}" para conseguir uma reunião.
                    
                    DADOS DO LEAD:
                    - Nicho: ${lead.types?.[0] || 'Comércio'} (Isso define o TOM de voz)
                    - Nota: ${lead.rating}
                    - Site: ${lead.website || 'Sem site'}
                    
                    REGRA 1: ADAPTAÇÃO TOTAL AO NICHO (TOM DE VOZ):
                    - Se for FEMININO/ESTÉTICA (Salão, Spa, Moda, Clínica, Loja de Roupas): Use um tom elegante, leve, empático. Use emojis sutis (✨, 🌷). Fale sobre "Imagem", "Experiência", "Valorização".
                    - Se for MASCULINO/TÉCNICO (Oficina, Obras, Carros, Indústria): Use um tom direto, prático, "de homem pra homem". Fale sobre "Grana na mesa", "Demanda", "Oportunidade".
                    - Se for SAÚDE/FORMAL (Advogado, Médico, Dentista): Use um tom profissional, respeitoso, mas firme. Fale sobre "Autoridade", "Captação qualificada".
                    - Se for GERAL (Restaurante, Mercado): Tom casual e vizinho.

                    REGRA 2: ESTRUTURA OBRIGATÓRIA DA MENSAGEM:
                    Parte A: GANCHO (Quebra de Padrão). Comente algo específico (falta de site, nota google, ou elogio sincero).
                    Parte B (FINALIZAÇÃO MANDATÓRIA): Você DEVE dizer que é especialista no assunto e perguntar quem é a pessoa do marketing para conversar.
                    
                    EXEMPLOS DE FINALIZAÇÃO (Adapte o tom, mas mantenha a essência):
                    - "Sou especialista em posicionamento pra estética. Quem cuida do marketing de vocês? Tem um tempinho pra conversar?"
                    - "Trabalho só com alavancagem de oficinas. Quem toca o marketing aí? Consegue falar rapidinho?"
                    
                    Gere APENAS o texto da mensagem. Curto (max 3 frases). Sem "Prezados".
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
                
                if (isMounted) {
                    if (data.text) {
                        setGeneratedScript(data.text.trim());
                    } else {
                        // Fallback genérico com a estrutura obrigatória
                        setGeneratedScript(`Opa, tudo bem? Vi a ${lead.name} aqui no Google e vi uma oportunidade de melhorar o posicionamento. Sou especialista nessa área. Quem cuida do marketing de vocês? Tem um tempinho pra conversar?`);
                    }
                }
            } catch (error) {
                console.error("Erro script IA:", error);
                if (isMounted) setGeneratedScript(`Opa, tudo bem? Vi a ${lead.name} aqui. Sou especialista em digital. Quem cuida do marketing de vocês? Tem um tempinho pra conversar?`);
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'search' | 'marketing' | 'warroom'>('search');
    const [query, setQuery] = useState('');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [searchMode, setSearchMode] = useState<SearchMode>('standard');

    const handleSearch = async (token?: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, pagetoken: token })
            });
            const data = await response.json();
            
            // Map Google Places result to Lead interface
            const newLeads = (data.results || []).map((place: any) => ({
                id: place.place_id,
                name: place.name,
                address: place.formatted_address,
                rating: place.rating || 0,
                user_ratings_total: place.user_ratings_total || 0,
                website: place.website,
                url: place.url,
                phone: place.formatted_phone_number,
                international_phone: place.international_phone_number,
                lead_score: Math.floor(Math.random() * 40) + 60, // Mock score for demo
                status_site: place.website ? 'com_site' : 'sem_site',
                place_id: place.place_id,
                types: place.types || [],
                price_level: place.price_level,
                business_status: place.business_status,
                opening_hours: place.opening_hours,
                photos: place.photos
            }));

            if (token) {
                setLeads(prev => [...prev, ...newLeads]);
            } else {
                setLeads(newLeads);
            }
            setNextPageToken(data.next_page_token || null);
        } catch (error) {
            console.error(error);
            alert("Erro ao buscar leads.");
        } finally {
            setLoading(false);
        }
    };

    const openWhatsapp = (text: string) => {
        if (!selectedLead?.phone) {
             alert("Lead sem telefone.");
             return;
        }
        // Remove non-digits
        const phone = selectedLead.phone.replace(/\D/g, '');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-16 md:w-64 bg-[#0A0A0A] border-r border-white/10 flex flex-col justify-between shrink-0 z-50">
                <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-4">
                    <Logo className="scale-75 md:scale-100 origin-left" />
                </div>

                <nav className="flex-1 px-2 md:px-4 py-8 space-y-2">
                    <button 
                        onClick={() => setActiveTab('search')}
                        className={`w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all ${activeTab === 'search' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        title="Prospectar"
                    >
                        <TargetIcon className="w-5 h-5" />
                        <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Prospectar</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('marketing')}
                        className={`w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all ${activeTab === 'marketing' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        title="Marketing Command"
                    >
                        <MegaphoneIcon className="w-5 h-5" />
                        <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Marketing</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('warroom')}
                        className={`w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all ${activeTab === 'warroom' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        title="War Room"
                    >
                        <BrainIcon className="w-5 h-5" />
                        <span className="hidden md:block text-xs font-bold uppercase tracking-widest">War Room</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="w-full flex items-center justify-center md:justify-start gap-4 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Sair">
                        <XIcon className="w-5 h-5" />
                        <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden">
                
                {activeTab === 'search' && (
                    <div className="flex flex-col h-full">
                        {/* Search Header */}
                        <div className="p-4 md:p-6 border-b border-white/10 bg-[#0c0c0c] flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative w-full md:w-96">
                                    <input 
                                        type="text" 
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Busca Inteligente (Ex: Cafeterias Jardins)"
                                        className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-red-600 outline-none transition-all placeholder-white/20 text-sm font-medium"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                                        <TargetIcon className="w-4 h-4" />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleSearch()}
                                    className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                                >
                                    Buscar
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mr-2 hidden md:block">Filtros de Caça:</span>
                                {(['standard', 'whale', 'crisis', 'ghost'] as SearchMode[]).map(mode => (
                                    <button 
                                        key={mode}
                                        onClick={() => setSearchMode(mode)}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${searchMode === mode ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'}`}
                                    >
                                        {mode.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[#050505]">
                            {loading && leads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                                    <div className="relative">
                                        <SpinnerIcon />
                                        <div className="absolute inset-0 bg-red-600/20 blur-xl animate-pulse"></div>
                                    </div>
                                    <p className="text-xs font-mono uppercase tracking-widest animate-pulse">Varrendo Google Maps via Satélite...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {leads.map(lead => (
                                        <div 
                                            key={lead.id} 
                                            onClick={() => setSelectedLead(lead)}
                                            className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden group hover:border-red-600/30 transition-all flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-black"
                                        >
                                            <div className="h-32 bg-white/5 relative overflow-hidden">
                                                {lead.photos && lead.photos.length > 0 ? (
                                                     <img 
                                                        src={`/api/photo?ref=${lead.photos[0].photo_reference}`} 
                                                        alt={lead.name}
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110"
                                                        loading="lazy"
                                                     />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/10 bg-[#151515]">
                                                        <LocationIcon className="w-8 h-8 opacity-20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-black text-white border border-white/10 flex items-center gap-1">
                                                    {lead.rating} ★
                                                </div>
                                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider backdrop-blur-md ${lead.website ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'}`}>
                                                        {lead.website ? 'Website ON' : 'SEM SITE'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-1 group-hover:text-red-500 transition-colors">{lead.name}</h3>
                                                <p className="text-white/40 text-[10px] mb-3 line-clamp-1">{lead.address}</p>
                                                
                                                <div className="mt-auto pt-3 border-t border-white/5 flex gap-2">
                                                    <button 
                                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors"
                                                    >
                                                        Raio-X
                                                    </button>
                                                    <button 
                                                        className="flex-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 group/btn"
                                                    >
                                                        <ZapIcon className="w-3 h-3 group-hover/btn:fill-current" /> Ataque
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {leads.length > 0 && nextPageToken && (
                                        <div className="col-span-full flex justify-center pt-8 pb-12">
                                            <button 
                                                onClick={() => handleSearch(nextPageToken)}
                                                disabled={loading}
                                                className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                                            >
                                                {loading ? 'Carregando Satélite...' : 'Carregar Mais Alvos'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {!loading && leads.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-white/10 select-none">
                                    <TargetIcon className="w-24 h-24 mb-6 opacity-20" />
                                    <p className="text-sm font-black uppercase tracking-[0.4em] text-white/20">Aguardando coordenadas do alvo</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'marketing' && <MarketingCommand />}
                {activeTab === 'warroom' && <StrategicWarRoom />}

            </main>

            {/* Strategy Modal */}
            {selectedLead && (
                <LeadStrategyModal 
                    lead={selectedLead} 
                    onClose={() => setSelectedLead(null)} 
                    onOpenWhatsapp={openWhatsapp}
                    searchMode={searchMode}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
