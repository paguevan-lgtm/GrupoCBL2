
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
        <div className="h-full flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar p-6">
             <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-8">
                    <MegaphoneIcon className="w-8 h-8 text-red-600" />
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Marketing Command</h2>
                </div>

                {!strategy ? (
                    <form onSubmit={generateStrategy} className="space-y-6 bg-[#0c0c0c] p-8 rounded-3xl border border-white/10">
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

                            {/* Google Strategy */}
                            <div className="bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl col-span-1 md:col-span-3 lg:col-span-2">
                                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Google Search</h3>
                                <div className="space-y-4">
                                    <div className="bg-[#151515] p-4 rounded-xl border border-white/5">
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Headline</span>
                                        <p className="text-white font-bold text-lg">"{strategy.google_ads.headline}"</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-2">Keywords</span>
                                        <div className="flex flex-wrap gap-2">
                                            {strategy.google_ads.keywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-900/20 text-blue-400 text-xs rounded-lg border border-blue-900/30">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Meta Strategy */}
                            <div className="bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl col-span-1 md:col-span-3">
                                <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Social Ads</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#151515] p-4 rounded-xl border border-white/5">
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Ideia Criativa</span>
                                        <p className="text-white/80 text-sm">{strategy.meta_ads.creative_idea}</p>
                                    </div>
                                    <div className="bg-[#151515] p-4 rounded-xl border border-white/5">
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Gancho (Hook)</span>
                                        <p className="text-white font-bold text-sm italic">"{strategy.meta_ads.copy_hook}"</p>
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
        <div className="h-full flex flex-col bg-[#050505] p-6">
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
                <div className="absolute bottom-4 right-4 text-[9px] text-white/10 font-black uppercase tracking-widest pointer-events-none group-focus-within:text-white/30">CBL Encrypted Storage</div>
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
    customScripts
}: { 
    lead: Lead, 
    onClose: () => void, 
    onOpenWhatsapp: (text: string) => void,
    customScripts: typeof DEFAULT_SCRIPTS
}) => {
    
    const [strategy, setStrategy] = useState<LeadStrategyData | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'sales' | 'script'>('sales');

    // Gera Estratégia Completa ao abrir
    useEffect(() => {
        const generateAiStrategy = async () => {
            setIsAiLoading(true);
            
            // Dados brutos
            const companyName = lead.name;
            const rating = lead.rating;
            const address = lead.address;
            const hasSite = lead.status_site !== 'sem_site';
            
            const prompt = `
                ATUE COMO: Consultor de Negócios Sênior do Grupo CBL (Especialista em Vendas B2B High Ticket).
                
                DADOS DO PROSPECT (LEAD):
                Nome: ${companyName}
                Nota Google: ${rating} estrelas
                Endereço/Região: ${address}
                Tem Site Próprio: ${hasSite ? "Sim (" + lead.website + ")" : "Não (Usa linktree/ifood/instagram ou nada)"}
                Nicho/Tipo: ${lead.types.join(', ')}

                TAREFA: Gere um Raio-X comercial detalhado para que eu possa vender serviços digitais para este cliente.

                RETORNE UM JSON ESTRITO COM ESTA ESTRUTURA:
                {
                    "executive_summary": "Uma análise curta e grossa sobre a situação digital dele. Ex: 'Empresa consolidada fisicamente mas invisível digitalmente. Deixa dinheiro na mesa por não ter site próprio.'",
                    "suggested_products": [
                        "Produto 1 (Ex: Site Institucional de Alta Performance)",
                        "Produto 2 (Ex: Tráfego Pago Google Ads)",
                        "Produto 3 (Ex: Gestão de Reputação/Reviews)"
                    ],
                    "pricing_strategy": {
                        "level": "High Ticket" ou "Mid Market" ou "Low Entry",
                        "rationale": "Por que cobrar esse preço? (Baseado na aparência do local e nicho)",
                        "estimated_value": "Ex: R$ 3.000 a R$ 5.000"
                    },
                    "sales_arguments": {
                        "pain_points": ["Dor 1", "Dor 2", "Dor 3"],
                        "hooks": ["Gancho de venda 1", "Gancho de venda 2"]
                    },
                    "owner_profile_guess": "Chute educado sobre quem é o dono (Ex: 'Provavelmente um empresário tradicional que não entende de tech, foca em qualidade do produto.')",
                    "cold_message": "Um script de abordagem direta para WhatsApp, curto e focado na dor identificada."
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
                // Fallback simples se der erro
                setStrategy({
                    executive_summary: "Erro ao gerar análise detalhada. Use o script padrão.",
                    suggested_products: ["Site Institucional", "Tráfego Local"],
                    pricing_strategy: { level: 'Mid Market', rationale: 'Sem dados suficientes.', estimated_value: 'R$ 1.500+' },
                    sales_arguments: { pain_points: ["Falta de visibilidade"], hooks: ["Aumentar vendas"] },
                    owner_profile_guess: "Empresário local",
                    cold_message: customScripts.standard.replace('{EMPRESA}', companyName)
                });
            } finally {
                setIsAiLoading(false);
            }
        };

        generateAiStrategy();
    }, [lead, customScripts]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado!");
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full md:max-w-6xl h-[95vh] md:h-[90vh] bg-[#0c0c0c] border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#111] flex justify-between items-start shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${lead.lead_score > 70 ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                            <span className="font-black text-xl">{lead.lead_score}</span>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter truncate max-w-[250px] md:max-w-none">{lead.name}</h2>
                            <p className="text-white/50 text-xs flex items-center gap-2 uppercase tracking-widest">
                                Raio-X de Inteligência • {lead.business_status === 'OPERATIONAL' ? 'Ativo' : 'Inativo'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0c0c0c] flex flex-col md:flex-row">
                    
                    {/* Sidebar de Navegação Interna */}
                    <div className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-visible">
                        <button onClick={() => setActiveTab('sales')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'sales' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            <TargetIcon className="w-4 h-4" /> Estratégia
                        </button>
                        <button onClick={() => setActiveTab('script')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'script' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            <ConsultingIcon className="w-4 h-4" /> Abordagem
                        </button>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="flex-1 p-6 md:p-8">
                        {isAiLoading ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <SpinnerIcon />
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 animate-pulse">Compilando Dados de Mercado...</span>
                            </div>
                        ) : strategy ? (
                            <>
                                {activeTab === 'sales' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4">
                                        {/* Sumário Executivo */}
                                        <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Diagnóstico Executivo</h3>
                                            <p className="text-white text-lg leading-relaxed font-light italic">"{strategy.executive_summary}"</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Oportunidades de Venda */}
                                            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                                                <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> O que vender?
                                                </h3>
                                                <ul className="space-y-3">
                                                    {strategy.suggested_products.map((prod, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                                                            <span className="text-green-500 font-bold">✓</span> {prod}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Estratégia de Preço */}
                                            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                                                <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Precificação Sugerida
                                                </h3>
                                                <div className="mb-3">
                                                    <span className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-black uppercase tracking-widest rounded mb-2">
                                                        {strategy.pricing_strategy.level}
                                                    </span>
                                                    <div className="text-2xl font-black text-white">{strategy.pricing_strategy.estimated_value}</div>
                                                </div>
                                                <p className="text-xs text-white/50 leading-relaxed">{strategy.pricing_strategy.rationale}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Dores (Pain Points) */}
                                            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                                                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Pontos de Dor
                                                </h3>
                                                <ul className="space-y-2">
                                                    {strategy.sales_arguments.pain_points.map((pain, i) => (
                                                        <li key={i} className="text-xs text-white/70 border-l border-red-500/30 pl-3 py-1">{pain}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            {/* Perfil do Dono */}
                                            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                                                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Perfil do Decisor
                                                </h3>
                                                <p className="text-sm text-white/80 italic leading-relaxed">"{strategy.owner_profile_guess}"</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'script' && (
                                    <div className="space-y-6 h-full flex flex-col animate-in slide-in-from-bottom-4">
                                        <div className="flex-1 bg-[#151515] border border-white/10 rounded-2xl p-6 relative">
                                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Script de Alta Conversão</h3>
                                            <textarea 
                                                className="w-full h-full bg-transparent border-none outline-none text-white text-base leading-relaxed resize-none font-sans"
                                                value={strategy.cold_message}
                                                readOnly
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 shrink-0">
                                            <button 
                                                onClick={() => handleCopy(strategy.cold_message)}
                                                className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] border border-white/10 transition-colors"
                                            >
                                                Copiar Texto
                                            </button>
                                            <button 
                                                onClick={() => onOpenWhatsapp(strategy.cold_message)}
                                                className="bg-[#25D366] hover:bg-[#20b858] text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-600/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
                                            >
                                                <PhoneIcon className="w-4 h-4 text-black fill-current" />
                                                Enviar Agora
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-white/50">Erro ao carregar dados.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE: GERENCIADOR DE SCRIPTS ---
const ScriptManager = ({ scripts, onSave }: { scripts: typeof DEFAULT_SCRIPTS, onSave: (s: typeof DEFAULT_SCRIPTS) => void }) => {
    const [localScripts, setLocalScripts] = useState(scripts);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (key: keyof typeof DEFAULT_SCRIPTS, val: string) => {
        setLocalScripts(prev => ({ ...prev, [key]: val }));
        setHasChanges(true);
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <ConsultingIcon className="w-8 h-8 text-white" />
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Scripts Base</h2>
                </div>
                <button 
                    onClick={() => { onSave(localScripts); setHasChanges(false); }}
                    disabled={!hasChanges}
                    className="bg-white text-black px-6 py-2 rounded-xl font-black uppercase text-xs tracking-[0.2em] disabled:opacity-50 transition-all hover:bg-gray-200"
                >
                    Salvar Alterações
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-20">
                {Object.entries(localScripts).map(([key, value]) => (
                    <div key={key} className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6">
                        <label className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-3">Template: {key}</label>
                        <textarea 
                            value={value}
                            onChange={(e) => handleChange(key as keyof typeof DEFAULT_SCRIPTS, e.target.value)}
                            className="w-full h-32 bg-[#151515] border border-white/5 rounded-xl p-4 text-white/80 text-sm focus:border-white/20 outline-none resize-none"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'contacted' | 'viewed' | 'scripts' | 'brainstorm' | 'marketing'>('search');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Script State
  const [customScripts, setCustomScripts] = useState<typeof DEFAULT_SCRIPTS>(DEFAULT_SCRIPTS);

  useEffect(() => {
      const saved = localStorage.getItem('cbl_custom_scripts');
      if (saved) {
          try { setCustomScripts(JSON.parse(saved)); } catch(e) {}
      }
  }, []);

  const handleSaveScripts = (newScripts: typeof DEFAULT_SCRIPTS) => {
      setCustomScripts(newScripts);
      localStorage.setItem('cbl_custom_scripts', JSON.stringify(newScripts));
      alert("Scripts atualizados com sucesso!");
  };
  
  // Search Configuration
  const [searchMode, setSearchMode] = useState<SearchMode>('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  
  // CRM States
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  const [viewedLeads, setViewedLeads] = useState<Lead[]>([]); // Nova lista para visualizados (ignorados)
  const [chamadosSearch, setChamadosSearch] = useState('');

  // Results States
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  // Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cbl_contacted_leads');
    if (saved) {
        try { setContactedLeads(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    const savedViewed = localStorage.getItem('cbl_viewed_leads');
    if (savedViewed) {
        try { setViewedLeads(JSON.parse(savedViewed)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cbl_contacted_leads', JSON.stringify(contactedLeads));
  }, [contactedLeads]);

  useEffect(() => {
    localStorage.setItem('cbl_viewed_leads', JSON.stringify(viewedLeads));
  }, [viewedLeads]);

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

  const executeSearch = async (token?: string) => {
    if (!searchTerm || !location) return;

    setIsLoading(true);
    if (!token) {
        setLeads([]); // Limpa se for nova busca
    }
    setActiveTab('search');
    
    let queryPrefix = "";
    if (searchMode === 'whale') queryPrefix = "Luxury High End ";
    
    const fullQuery = `${queryPrefix}${searchTerm} in ${location}`;

    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query: fullQuery,
            pagetoken: token // Envia o token se existir
        }),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || errorData.error || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawResults = data.results || [];
      
      setNextPageToken(data.next_page_token || null);

      let processedLeads: Lead[] = rawResults.map((place: any) => {
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
              photos: place.photos
          };
      });

      // --- CRITÉRIOS DE FILTRAGEM AVANÇADA ---
      // 1. Remove Contactados (Arquivados)
      // 2. Remove Visualizados (Que não viraram contactados, ou seja, ignorados/lidos)
      processedLeads = processedLeads.filter((lead: Lead) => {
          const isContacted = contactedLeads.some(cl => cl.id === lead.id);
          const isViewed = viewedLeads.some(vl => vl.id === lead.id);
          
          if (isContacted) return false;
          if (isViewed) return false; // Remove visualizados da nova busca
          
          if (searchMode === 'ghost' && lead.status_site === 'com_site') return false;
          return true;
      });

      // --- CRITÉRIO DE ORDENAÇÃO ---
      // Ordena pelo SCORE (Do maior para o menor)
      processedLeads.sort((a, b) => b.lead_score - a.lead_score);

      setLeads(prev => token ? [...prev, ...processedLeads] : processedLeads);

    } catch (error: any) {
      console.error(error);
      alert("Erro na busca: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      executeSearch();
  };

  const loadMore = () => {
      if (nextPageToken) {
          executeSearch(nextPageToken);
      }
  };

  const markAsContacted = (lead: Lead) => {
      const leadWithDate = { ...lead, contactedAt: new Date().toISOString() };
      setContactedLeads(prev => [leadWithDate, ...prev]);
      
      // Remove da lista atual e da lista de visualizados (se estiver lá)
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      setViewedLeads(prev => prev.filter(l => l.id !== lead.id));
      
      if (selectedLead?.id === lead.id) setSelectedLead(null);
  };

  const handleOpenLead = (lead: Lead) => {
      setSelectedLead(lead);
      
      // Se não estiver contactado, adiciona aos visualizados
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
      const rawPhone = lead.international_phone || lead.phone;
      if (!rawPhone) { alert("Telefone não disponível."); return; }
      let cleanPhone = rawPhone.replace(/\D/g, '');
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11) cleanPhone = '55' + cleanPhone;
      
      const message = customMessage || `Olá ${lead.name}, gostaria de falar sobre o marketing de vocês.`;
      const text = encodeURIComponent(message);
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const openInstagram = (lead: Lead) => {
      if (lead.website && lead.website.toLowerCase().includes('instagram.com')) {
          window.open(lead.website, '_blank');
          return;
      }
      const query = `site:instagram.com "${lead.name}" ${location}`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

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

  const LeadCard: React.FC<{ lead: Lead; isArchived?: boolean; isViewed?: boolean }> = ({ lead, isArchived = false, isViewed = false }) => (
      <div className={`bg-[#0c0c0c] border ${isArchived ? 'border-blue-900/30' : (isViewed ? 'border-white/5 opacity-70 hover:opacity-100' : 'border-white/10')} rounded-3xl flex flex-col justify-between h-full group transition-all duration-300 relative overflow-hidden shadow-2xl mb-4 md:mb-0`}>
             <div className="h-40 w-full bg-gray-900 relative overflow-hidden shrink-0">
                 {lead.photos && lead.photos.length > 0 ? (
                     <img src={`/api/photo?ref=${lead.photos[0].photo_reference}`} className={`w-full h-full object-cover transition-all duration-700 ${isArchived ? 'grayscale' : 'opacity-80 group-hover:opacity-100'}`} alt={lead.name} />
                 ) : (
                     <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center opacity-50"><Logo className="scale-75 opacity-20" /></div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-transparent"></div>
                 <div className="absolute top-3 left-3 flex gap-2">
                     {isArchived && <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-wide shadow-lg">Processado</span>}
                     {isViewed && !isArchived && <span className="bg-white/10 text-white/60 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wide border border-white/10">Visualizado</span>}
                     {lead.opening_hours?.open_now ? <span className="bg-green-500/90 text-black text-[8px] font-black px-2 py-1 rounded uppercase">Aberto</span> : <span className="bg-red-600/90 text-white text-[8px] font-black px-2 py-1 rounded uppercase">Fechado</span>}
                 </div>
                 <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                     <span className="text-yellow-500 text-[10px]">★</span><span className="text-white text-[10px] font-bold">{lead.rating}</span>
                 </div>
             </div>
             
             <div className="p-5 relative -mt-6 flex-1 flex flex-col">
                 <h3 className="text-xl font-black text-white uppercase leading-tight line-clamp-2 mb-2">{lead.name}</h3>
                 <div className="flex items-start gap-2 mb-3 min-h-[30px]"><LocationIcon className="w-3 h-3 text-white/30 mt-0.5 shrink-0" /><span className="text-white/60 text-[10px] line-clamp-2 font-medium">{lead.address}</span></div>
                 
                 <div className="flex justify-between items-center border-t border-white/10 pt-3 mb-4 mt-auto">
                     <button onClick={() => handleOpenLead(lead)} className="bg-white/5 hover:bg-white/10 text-red-500 text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-lg border border-red-900/30 hover:border-red-600 transition-all flex items-center gap-2">Ver Raio-X <span className="text-[10px]">→</span></button>
                     <div className="flex flex-col items-center">
                        <span className={`text-xl font-black ${lead.lead_score > 70 ? 'text-green-500' : 'text-red-600'}`}>{lead.lead_score}</span>
                        <span className="text-[7px] text-white/20 uppercase tracking-widest">Score</span>
                     </div>
                 </div>
             </div>

             <div className="grid grid-cols-4 gap-px bg-[#1a1a1a] mt-auto border-t border-white/5">
                 <button onClick={() => openWhatsApp(lead)} className="col-span-1 bg-[#0c0c0c] hover:bg-[#25D366] text-[#25D366] hover:text-black py-4 flex flex-col items-center justify-center transition-all gap-1 h-16 active:scale-95"><PhoneIcon className="w-5 h-5 text-current" /></button>
                 <button onClick={() => openInstagram(lead)} className="col-span-1 bg-[#0c0c0c] hover:bg-pink-600 text-pink-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1 h-16 active:scale-95"><InstagramIcon className="w-5 h-5" /></button>
                 <button onClick={() => copyPitch(lead, undefined)} className={`col-span-1 py-4 flex flex-col items-center justify-center transition-all gap-1 h-16 active:scale-95 ${copiedId === lead.id ? 'bg-green-600 text-white' : 'bg-[#0c0c0c] hover:bg-white text-white hover:text-black'}`}><span className="text-[10px] font-black uppercase">Copy</span></button>
                 {isArchived ? (
                     <button onClick={() => setContactedLeads(prev => prev.filter(l => l.id !== lead.id))} className="col-span-1 bg-[#0c0c0c] hover:bg-red-600 text-red-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1 h-16 active:scale-95"><span className="text-lg font-black">↩</span></button>
                 ) : (
                     <button onClick={() => markAsContacted(lead)} className="col-span-1 bg-[#0c0c0c] hover:bg-blue-600 text-blue-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1 h-16 active:scale-95"><span className="text-lg font-black">✓</span></button>
                 )}
             </div>
      </div>
  );

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-red-600 selection:text-white">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="md:hidden h-16 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-50 fixed top-0 w-full">
          <Logo className="scale-75 origin-left" />
          <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2 rounded-lg bg-white/5 active:scale-95"><MenuIcon className="w-6 h-6" /></button>
      </div>

      {/* Sidebar Overlay (Mobile Only) */}
      <div className={`fixed inset-0 bg-black/80 z-50 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar (Responsive: Drawer on Mobile, Fixed on Desktop) */}
      <aside className={`fixed md:relative z-50 top-0 left-0 h-full w-72 md:w-20 lg:w-72 bg-[#080808] border-r border-white/10 flex flex-col py-6 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:pt-6`}>
          <div className="px-6 md:px-0 lg:px-6 mb-8 flex justify-between items-center md:justify-center lg:justify-start">
              <Logo className="scale-90 origin-left md:scale-75 lg:scale-90" />
              <button onClick={() => setIsSidebarOpen(false)} className="text-white/50 md:hidden"><XIcon /></button>
          </div>
          
          <div className="flex flex-col gap-2 px-4 md:px-2 lg:px-4">
             <div className="md:hidden lg:block text-[9px] text-white/30 uppercase tracking-[0.2em] mb-2 pl-2">Ferramentas</div>
             <NavButton tab="search" icon={<TargetIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">Prospecção</span>} />
             <NavButton tab="contacted" icon={<PhoneIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">Histórico</span>} />
             {/* NOVA ABA: Visualizados */}
             <NavButton tab="viewed" icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} label={<span className="md:hidden lg:inline">Visualizados</span>} />
             
             <NavButton tab="brainstorm" icon={<BrainIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">War Room</span>} />
             <NavButton tab="marketing" icon={<MegaphoneIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">Marketing</span>} />
             <NavButton tab="scripts" icon={<ConsultingIcon className="w-5 h-5" />} label={<span className="md:hidden lg:inline">Scripts</span>} />
          </div>

          <div className="mt-auto px-4 md:px-2 lg:px-4">
              <button onClick={onLogout} className="w-full text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-red-500 transition-colors flex items-center justify-center gap-2 py-4 rounded-lg bg-white/5 md:bg-transparent lg:bg-white/5 md:hover:bg-white/5"><XIcon className="w-4 h-4" /> <span className="md:hidden lg:inline">Sair</span></button>
          </div>
      </aside>

      <main className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden pt-16 md:pt-0">
            {/* Desktop Header (Visible on MD+) */}
            <header className="hidden md:flex h-16 border-b border-white/10 items-center justify-between px-6 bg-[#0A0A0A]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4"><div className="h-4 w-px bg-white/10"></div><span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Intelligence Hub v4.5</span></div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span><span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Deep Search: ON</span></div>
                </div>
            </header>

            {activeTab === 'search' && (
                <>
                <div className="p-4 md:p-6 border-b border-white/5 bg-[#050505]/95 backdrop-blur z-10 shrink-0">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Busca <span className="text-red-600">Deep Dive</span></h1>
                            <ModeSelector />
                        </div>
                        
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end bg-[#0A0A0A] p-4 md:p-5 rounded-3xl border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho</label>
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm md:text-base font-bold transition-all placeholder-white/20" placeholder="Ex: Estética" />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm md:text-base font-bold transition-all placeholder-white/20" placeholder="Ex: Pinheiros, SP" />
                            </div>
                            <div className="md:col-span-3">
                                <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 md:py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[48px] md:h-[58px] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                    {isLoading ? <SpinnerIcon /> : 'BUSCAR ALVOS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-[#050505]">
                    <div className="max-w-8xl mx-auto pb-20">
                        {!isLoading && leads.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                                <TargetIcon className="w-16 h-16 text-white mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest">Nenhum alvo detectado</p>
                            </div>
                        )}
                        
                        {leads.length > 0 && (
                            <>
                                <div className="flex justify-between items-end mb-6 px-1 border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-white italic">{leads.length}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2 leading-tight">Leads Encontrados</span>
                                    </div>
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
                </>
            )}

            {activeTab === 'contacted' && (
                <div className="flex-1 flex flex-col bg-[#050505] p-4 md:p-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                            <div><h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Histórico</h1><p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Leads Processados</p></div>
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
                <div className="flex-1 flex flex-col bg-[#050505] p-4 md:p-6 overflow-hidden">
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
            
            {/* Outras Abas (Funcionais) */}
            {(activeTab === 'brainstorm' || activeTab === 'marketing' || activeTab === 'scripts') && (
                <div className="flex-1 overflow-hidden h-full">
                    {activeTab === 'brainstorm' && <StrategicWarRoom />}
                    {activeTab === 'marketing' && <MarketingCommand />}
                    {activeTab === 'scripts' && <ScriptManager scripts={customScripts} onSave={handleSaveScripts} />}
                </div>
            )}
      </main>

      {selectedLead && <LeadStrategyModal lead={selectedLead} onClose={() => setSelectedLead(null)} onOpenWhatsapp={(text) => openWhatsApp(selectedLead, text)} customScripts={customScripts} />}
    </div>
  );
};

export default AdminDashboard;
