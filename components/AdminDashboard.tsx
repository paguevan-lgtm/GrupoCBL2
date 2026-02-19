
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
  formatted_phone_number?: string;
  international_phone_number?: string;
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
                             <div className="bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl col-span-1 md:col-span-3 lg:col-span-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#151515] p-4 rounded-xl border border-white/5">
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Google Strategy</h4>
                                        <p className="text-xs text-white/80 mb-2"><strong>Tipo:</strong> {strategy.google_ads.campaign_type}</p>
                                        <p className="text-xs text-white/60">"{strategy.google_ads.headline}"</p>
                                    </div>
                                    <div className="bg-[#151515] p-4 rounded-xl border border-white/5">
                                        <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">Meta Strategy</h4>
                                        <p className="text-xs text-white/80 mb-2"><strong>Hook:</strong> {strategy.meta_ads.copy_hook}</p>
                                        <p className="text-xs text-white/60">Idea: {strategy.meta_ads.creative_idea}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5">
                                     <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Projeções</h4>
                                     <div className="flex justify-between text-xs text-white">
                                         <span>Clicks: {strategy.projections.clicks}</span>
                                         <span>Leads: {strategy.projections.leads}</span>
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

// --- TEMPLATES PADRÃO (FALLBACK) ---
const DEFAULT_SCRIPTS = {
    crisis: `Oi, tudo bem? Tentei falar com o responsável pela {EMPRESA} mas não consegui.\n\nVi que vocês estão com nota {NOTA} no Google e isso deve estar atrapalhando muito a chegada de clientes novos aí na região de {BAIRRO}.\n\nTem alguém aí que cuida dessa parte de marketing ou avaliações que eu possa falar?`,
    ghost: `Olá, tudo bem? Pode me fazer uma gentileza? 🙏\n\nEstou procurando o site oficial da {EMPRESA} no Google e não acho de jeito nenhum. Vocês estão sem site no momento?\n\nSou especialista nisso e queria falar com o dono sobre como resolver isso rápido. Sabe me dizer quem é o responsável?`,
    basic: `Bom dia, tudo joia?\n\nVi que a {EMPRESA} ainda usa {PLATAFORMA} como site principal. Pra um negócio do nível de vocês, isso passa uma imagem um pouco amadora pra quem não conhece.\n\nConsegue me passar o contato de quem decide sobre o marketing aí? Tenho uma proposta visual pra mostrar.`,
    whale: `Olá, tudo bem? Estou fazendo um levantamento de empresas de alto padrão aqui em {BAIRRO} e selecionei a {EMPRESA}.\n\nTenho um projeto de posicionamento digital focado em público High Ticket que encaixa perfeitamente com vocês.\n\nCom quem eu poderia falar 5 minutinhos sobre isso?`,
    standard: `Opa, tudo bem? Sou da CBL.\n\nEncontrei a {EMPRESA} aqui no Google e vi uns pontos que dão pra melhorar bastante pra atrair mais gente.\n\nVocê consegue encaminhar essa mensagem pro responsável ou pro dono? Obrigado!`
};

// --- MODAL DE ESTRATÉGIA AVANÇADA (RAIO-X 2.0) ---
const LeadStrategyModal = ({ 
    lead, 
    onClose, 
    onOpenWhatsapp,
    customScripts,
    searchMode
}: { 
    lead: Lead, 
    onClose: () => void, 
    onOpenWhatsapp: (text: string) => void,
    customScripts: typeof DEFAULT_SCRIPTS,
    searchMode: SearchMode
}) => {
    
    // Inicia na aba 'approach' (Abordagem/Dados) por padrão
    const [activeTab, setActiveTab] = useState<'approach' | 'ai_strategy'>('approach');
    const [strategy, setStrategy] = useState<LeadStrategyData | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // Novo Estado para Script Único
    const [aiScript, setAiScript] = useState<string>('');
    const [isScriptLoading, setIsScriptLoading] = useState(false);

    // Dados para o Score Breakdown
    const scoreReasons = getScoreDetails(lead, searchMode);

    // Gera o script único assim que o componente monta
    useEffect(() => {
        const generateUniqueScript = async () => {
            setIsScriptLoading(true);
            setAiScript('');

            const prompt = `
                ATUE COMO: SDR (Sales Development Representative) Sênior do Grupo CBL.
                
                TAREFA: Escreva uma ÚNICA mensagem fria para WhatsApp (Cold Outreach) para este prospect específico.
                
                DADOS DO PROSPECT:
                Nome: ${lead.name}
                Nicho: ${lead.types.join(', ')}
                Nota Google: ${lead.rating} (${lead.user_ratings_total} avaliações)
                Situação Site: ${lead.status_site === 'sem_site' ? "NÃO TEM SITE" : (lead.status_site === 'site_basico' ? "Site Amador/Linktree" : "Tem site: " + lead.website)}
                Região: ${lead.address}

                DIRETRIZES ESTRATÉGICAS (TONE OF VOICE: Profissional, Direto, High-Ticket):
                1. Comece saudando, mas vá direto ao ponto. Sem "espero que esteja bem".
                2. Use um GANCHO REAL baseado nos dados acima.
                   - Se a nota for < 4.5: Mencione que isso afasta clientes.
                   - Se não tiver site: Mencione a perda de autoridade ou clientes invisíveis.
                   - Se tiver site mas for ruim: Mencione que o design não condiz com a qualidade deles.
                   - Se for "Whale" (Alto Padrão): Elogie a estrutura e fale sobre posicionamento digital premium.
                3. Termine com uma pergunta de fechamento leve (CTA).
                4. Máximo de 3 a 4 linhas curtas.
                
                Retorne APENAS o texto da mensagem, pronto para copiar e colar.
            `;

            try {
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
                setAiScript(data.text.trim());
            } catch (error) {
                console.error("Erro script IA", error);
                // Fallback para template se a IA falhar
                setAiScript(getQuickScript());
            } finally {
                setIsScriptLoading(false);
            }
        };

        generateUniqueScript();
    }, [lead]);

    // Função Manual para Gerar IA (Estratégia Completa)
    const generateAiStrategy = async () => {
        setIsAiLoading(true);
        
        const companyName = lead.name;
        const rating = lead.rating;
        const hasSite = lead.status_site !== 'sem_site';
        
        const prompt = `
            ATUE COMO: Consultor de Negócios Sênior do Grupo CBL.
            DADOS DO PROSPECT:
            Nome: ${companyName}
            Nota: ${rating} estrelas
            Site: ${hasSite ? lead.website : "Não possui"}
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
    
    // Script básico (Template replacement) - Usado apenas como fallback ou referência interna
    const getQuickScript = () => {
        let template = customScripts.standard;
        if (lead.lead_score > 80) template = customScripts.whale;
        else if (lead.status_site === 'sem_site') template = customScripts.ghost;
        else if (lead.rating < 4.0) template = customScripts.crisis;
        
        return template
            .replace(/{EMPRESA}/g, lead.name)
            .replace(/{NOTA}/g, lead.rating.toString())
            .replace(/{BAIRRO}/g, lead.address.split(',')[1] || 'sua região')
            .replace(/{PLATAFORMA}/g, lead.website || 'Linktree');
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
                        Dados & Abordagem
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
                                        <div onClick={() => onOpenWhatsapp(aiScript || getQuickScript())} className="flex items-center gap-3 text-white cursor-pointer hover:text-green-500 transition-colors">
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

                            {/* Coluna Direita: Script AI Único */}
                            <div className="flex flex-col h-full">
                                <div className="flex-1 bg-[#151515] border border-white/10 rounded-2xl p-5 relative flex flex-col group">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Script IA Personalizado</h3>
                                            {!isScriptLoading && <span className="bg-green-500/10 text-green-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Gerado</span>}
                                        </div>
                                        {!isScriptLoading && (
                                            <button onClick={() => handleCopy(aiScript)} className="text-[10px] text-white/50 hover:text-white uppercase font-bold flex items-center gap-1">
                                                <span>Copiar</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 relative bg-black/20 rounded-xl p-4 overflow-hidden border border-white/5">
                                        {isScriptLoading ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-100"></div>
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-200"></div>
                                                </div>
                                                <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] animate-pulse">Engenharia de Copy Ativa...</span>
                                            </div>
                                        ) : (
                                            <textarea 
                                                className="w-full h-full bg-transparent border-none outline-none text-white text-sm md:text-base leading-relaxed resize-none font-sans custom-scrollbar"
                                                value={aiScript}
                                                readOnly
                                            />
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => onOpenWhatsapp(aiScript)}
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

// --- COMPONENTE: GERENCIADOR DE SCRIPTS ---
const ScriptManager = ({ scripts, onSave }: { scripts: typeof DEFAULT_SCRIPTS, onSave: (s: typeof DEFAULT_SCRIPTS) => void }) => {
    const [localScripts, setLocalScripts] = useState(scripts);
    const [activeKey, setActiveKey] = useState<keyof typeof DEFAULT_SCRIPTS>('standard');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalScripts({ ...localScripts, [activeKey]: e.target.value });
    };

    const handleSave = () => {
        onSave(localScripts);
        alert("Scripts salvos com sucesso.");
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] p-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-6">
                <MenuIcon className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Script Manager</h2>
            </div>
            
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {(Object.keys(localScripts) as Array<keyof typeof DEFAULT_SCRIPTS>).map(key => (
                     <button 
                        key={key}
                        onClick={() => setActiveKey(key)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeKey === key ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                    >
                        {key.replace('_', ' ')}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 bg-[#0c0c0c] border border-white/10 rounded-3xl p-1 relative group focus-within:border-white/30 transition-colors">
                 <textarea 
                    className="w-full h-full bg-[#0c0c0c] rounded-[20px] p-6 text-white/80 font-mono text-sm resize-none custom-scrollbar outline-none leading-relaxed"
                    value={localScripts[activeKey]}
                    onChange={handleChange}
                    spellCheck={false}
                />
            </div>
            
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={handleSave} 
                    className="bg-green-600 hover:bg-green-500 text-black px-8 py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                >
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL: ADMIN DASHBOARD ---
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState<'leads' | 'marketing' | 'war_room' | 'scripts'>('leads');
    const [query, setQuery] = useState('');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [customScripts, setCustomScripts] = useState(DEFAULT_SCRIPTS);
    const [searchMode, setSearchMode] = useState<SearchMode>('standard');

    const handleSearch = async (token?: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: token ? undefined : query, pagetoken: token })
            });
            const data = await res.json();
            
            const processedLeads = data.results.map((place: any) => {
                // Lógica de Score Básico
                let score = 50;
                let status: Lead['status_site'] = 'sem_site';

                if (place.website) {
                    if (place.website.includes('instagram') || place.website.includes('facebook') || place.website.includes('linktr.ee')) {
                        status = 'site_basico';
                        score += 20;
                    } else {
                        status = 'com_site';
                        score -= 10;
                    }
                } else {
                    score += 30;
                }

                if (place.rating < 4.0) score += 20;
                if ((place.price_level || 0) >= 3) score += 20;

                return {
                    ...place,
                    status_site: status,
                    lead_score: Math.min(score, 100)
                };
            });

            if (token) {
                setLeads(prev => [...prev, ...processedLeads]);
            } else {
                setLeads(processedLeads);
            }
            setNextPageToken(data.next_page_token);
        } catch (err) {
            console.error(err);
            alert("Erro ao buscar leads. Verifique a API Key.");
        } finally {
            setLoading(false);
        }
    };

    const openWhatsapp = (text: string) => {
         if (selectedLead?.phone || selectedLead?.formatted_phone_number) {
             const phone = selectedLead.international_phone_number || selectedLead.formatted_phone_number || selectedLead.phone;
             const cleanPhone = phone?.replace(/\D/g, '');
             window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
         } else {
             alert("Telefone não disponível para este lead.");
         }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
            {/* Navigation Bar */}
            <header className="border-b border-white/10 bg-[#050505] p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Logo className="scale-75 origin-left" />
                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                    <nav className="hidden md:flex gap-1">
                        {[
                            { id: 'leads', label: 'Lead Finder', icon: <TargetIcon className="w-4 h-4" /> },
                            { id: 'marketing', label: 'Marketing Command', icon: <MegaphoneIcon className="w-4 h-4" /> },
                            { id: 'war_room', label: 'War Room', icon: <BrainIcon className="w-4 h-4" /> },
                            { id: 'scripts', label: 'Scripts', icon: <MenuIcon className="w-4 h-4" /> },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id as any)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-white text-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                     <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-500 transition-colors">Logout</button>
                </div>
            </header>
            
            {/* Mobile Nav */}
            <div className="md:hidden p-2 bg-[#050505] border-b border-white/10 flex gap-2 overflow-x-auto">
                 {[
                    { id: 'leads', label: 'Leads' },
                    { id: 'marketing', label: 'Marketing' },
                    { id: 'war_room', label: 'War Room' },
                    { id: 'scripts', label: 'Scripts' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as any)}
                        className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${activeView === item.id ? 'bg-white text-black' : 'text-white/50 bg-white/5'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <main className="flex-1 overflow-hidden relative">
                {activeView === 'leads' && (
                    <div className="h-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 flex gap-2">
                                <input 
                                    type="text" 
                                    value={query} 
                                    onChange={(e) => setQuery(e.target.value)} 
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Ex: Restaurantes em Moema, SP" 
                                    className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none placeholder-white/20 text-sm"
                                />
                                <button onClick={() => handleSearch()} className="bg-red-600 hover:bg-red-500 text-white px-6 rounded-xl font-bold flex items-center justify-center min-w-[60px]">
                                    {loading ? <SpinnerIcon /> : <ZapIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            <select 
                                value={searchMode} 
                                onChange={(e) => setSearchMode(e.target.value as SearchMode)}
                                className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
                            >
                                <option value="standard">Modo Padrão</option>
                                <option value="whale">Caça-Baleia ($$$)</option>
                                <option value="crisis">Modo Crise (Nota Baixa)</option>
                                <option value="ghost">Caça-Fantasmas (Sem Site)</option>
                            </select>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 content-start">
                            {leads.map((lead, idx) => (
                                <div key={idx} onClick={() => setSelectedLead(lead)} className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-5 hover:border-red-600/50 transition-all cursor-pointer group relative overflow-hidden h-[180px] flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${lead.rating < 4.0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                            {lead.rating} ★
                                        </div>
                                        {lead.status_site === 'sem_site' && <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-1 rounded uppercase tracking-widest">Sem Site</span>}
                                    </div>
                                    <h3 className="text-lg font-black text-white italic tracking-tighter mb-1 line-clamp-1 group-hover:text-red-500 transition-colors">{lead.name}</h3>
                                    <p className="text-white/50 text-xs mb-4 line-clamp-2">{lead.address}</p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                        <span className="text-[10px] uppercase font-bold text-white/30">{lead.types?.[0]?.replace(/_/g, ' ')}</span>
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-white group-hover:text-black transition-all">
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {leads.length === 0 && !loading && (
                                <div className="col-span-full flex flex-col items-center justify-center h-64 text-white/20">
                                    <TargetIcon className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-xs uppercase tracking-[0.2em] font-bold">Nenhum lead encontrado</p>
                                </div>
                            )}
                            {loading && (
                                <div className="col-span-full flex justify-center py-10"><SpinnerIcon /></div>
                            )}
                            {nextPageToken && !loading && (
                                <div className="col-span-full flex justify-center py-6">
                                    <button onClick={() => handleSearch(nextPageToken!)} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5">
                                        Carregar Mais
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeView === 'marketing' && <MarketingCommand />}
                {activeView === 'war_room' && <StrategicWarRoom />}
                {activeView === 'scripts' && <ScriptManager scripts={customScripts} onSave={setCustomScripts} />}
            </main>

            {selectedLead && (
                <LeadStrategyModal 
                    lead={selectedLead} 
                    onClose={() => setSelectedLead(null)} 
                    onOpenWhatsapp={openWhatsapp}
                    customScripts={customScripts}
                    searchMode={searchMode}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
