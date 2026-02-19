
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
import { LayersIcon } from './icons/LayersIcon'; // Assuming this exists or reused
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon'; // Assuming this exists or reused

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
}

// Interfaces para o War Room
interface StrategyTask {
    id: string;
    title: string;
    desc: string;
    status: 'backlog' | 'doing' | 'done';
    priority: 'high' | 'medium' | 'low';
    value?: string;
}

// Interface Complexa de Marketing
interface AdsStrategy {
    lead_analysis: {
        strengths: string;
        weaknesses: string;
        opportunity: string;
    };
    budget_plan: {
        daily_total: string;
        google_daily: string;
        meta_daily: string;
        runway_days: string;
    };
    google_setup: {
        campaign_goal: string;
        bid_strategy: string;
        keywords_exact: string[];
        keywords_broad: string[];
        negative_keywords: string[];
        ad_copy: {
            h1: string;
            h2: string;
            desc1: string;
            desc2: string;
        };
    };
    meta_setup: {
        campaign_objective: string;
        conversion_event: string;
        audience_interests: string[];
        audience_exclusions: string[];
        creative_1: {
            format: string;
            visual_hook: string;
            copy_text: string;
        };
        creative_2: {
            format: string;
            visual_hook: string;
            copy_text: string;
        };
    };
    action_plan: {
        day_1: string;
        day_2: string;
        day_3: string;
        day_4_7: string;
    };
    optimization_rules: {
        ctr_benchmark: string;
        cpl_target: string;
        when_to_kill: string;
        when_to_scale: string;
    };
}

// Interface detalhada da IA
interface IAAnalysisResult {
    pitch: string;
    products_to_sell: string[];
    sales_strategy: string;
    suggested_pricing: string;
    conquest_tip: string;
    pain_points: string[];
}

type SearchMode = 'standard' | 'whale' | 'crisis' | 'ghost';

// --- COMPONENTE: MARKETING COMMAND ---
const MarketingCommand = () => {
    const [formData, setFormData] = useState({ niche: '', city: '', budget: '', companyName: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [strategy, setStrategy] = useState<AdsStrategy | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'creatives' | 'optimize'>('overview');

    const generateStrategy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.niche || !formData.budget) return;

        setIsLoading(true);
        setStrategy(null);
        setActiveTab('overview');

        const prompt = `
            ATUE COMO: Gestor de Tráfego de Elite (Especialista em Google Ads e Meta Ads).
            CONTEXTO: Você precisa criar um MANUAL DE IMPLEMENTAÇÃO passo-a-passo para um cliente.
            
            DADOS DO CLIENTE:
            - Empresa: ${formData.companyName || 'Empresa Local'}
            - Nicho: ${formData.niche}
            - Cidade: ${formData.city || 'Brasil'}
            - Verba Mensal: R$ ${formData.budget}

            MISSÃO:
            Não dê dicas genéricas. Diga exatamente quais botões apertar, quanto gastar por dia e como analisar.
            Seja crítico. Se a verba for baixa, avise que não dá para fazer milagre.

            SAÍDA JSON ESTRITA (OBRIGATÓRIO SEGUIR ESTA ESTRUTURA):
            {
                "lead_analysis": {
                    "strengths": "Ponto forte do nicho/região",
                    "weaknesses": "Possível gargalo (ex: site ruim, verba baixa)",
                    "opportunity": "A brecha para ganhar dinheiro rápido"
                },
                "budget_plan": {
                    "daily_total": "Valor total/dia (Ex: R$ 50,00)",
                    "google_daily": "Quanto por no Google/dia",
                    "meta_daily": "Quanto por no Meta/dia",
                    "runway_days": "Quantos dias a verba dura"
                },
                "google_setup": {
                    "campaign_goal": "Objetivo (Ex: Leads ou Vendas - NÃO tráfego)",
                    "bid_strategy": "Estratégia de Lance (Ex: Maximizar Cliques com teto ou Max Conversões)",
                    "keywords_exact": ["palavra1", "palavra2"],
                    "keywords_broad": ["termo amplo 1", "termo amplo 2"],
                    "negative_keywords": ["grátis", "barato", "curso", "vaga"],
                    "ad_copy": {
                        "h1": "Título Impactante 1",
                        "h2": "Título Oferta/CTA",
                        "desc1": "Descrição focada em dor/benefício",
                        "desc2": "Descrição com CTA e Escassez"
                    }
                },
                "meta_setup": {
                    "campaign_objective": "Objetivo (Ex: Cadastro ou Mensagem)",
                    "conversion_event": "Evento (Ex: Enviar Mensagem WhatsApp)",
                    "audience_interests": ["Interesse 1", "Interesse 2 (Comportamento)"],
                    "audience_exclusions": ["Afiliados", "Marketing Digital"],
                    "creative_1": {
                        "format": "Imagem Única ou Carrossel?",
                        "visual_hook": "Descrição visual da imagem (O que deve ter na foto)",
                        "copy_text": "Legenda curta focada em AIDA"
                    },
                    "creative_2": {
                        "format": "Reels/Video",
                        "visual_hook": "Roteiro visual de 15s",
                        "copy_text": "Legenda alternativa"
                    }
                },
                "action_plan": {
                    "day_1": "Configuração Técnica (Pixel, Tag, GMN)",
                    "day_2": "Subida de Campanhas (O que fazer exatamente)",
                    "day_3": "Análise de Aprovação e Impressões",
                    "day_4_7": "Primeira Otimização (O que olhar)"
                },
                "optimization_rules": {
                    "ctr_benchmark": "CTR Mínimo aceitável (Ex: 1.5%)",
                    "cpl_target": "Custo por Lead Ideal (Ex: R$ 15,00)",
                    "when_to_kill": "Regra para pausar criativo (Ex: Gastou R$ 30 e zero leads)",
                    "when_to_scale": "Regra para aumentar verba (Ex: 3 leads no CPL meta)"
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
            
            if (data.error) throw new Error(data.details || data.error);
            if (!data || !data.text) throw new Error("A IA não retornou uma resposta válida.");

            let cleanText = data.text.trim();
            if (cleanText.includes("```json")) {
                cleanText = cleanText.split("```json")[1].split("```")[0].trim();
            } else if (cleanText.includes("```")) {
                cleanText = cleanText.split("```")[1].split("```")[0].trim();
            }

            setStrategy(JSON.parse(cleanText));
        } catch (error: any) {
            console.error(error);
            alert(`Erro ao gerar estratégia: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === id 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
            }`}
        >
            {icon}
            <span className="hidden md:inline">{label}</span>
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar p-4 md:p-6">
             <div className="max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-8">
                    <MegaphoneIcon className="w-8 h-8 text-red-600" />
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Marketing Command</h2>
                        <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.3em]">Gestão de Tráfego Autônoma v4.0</p>
                    </div>
                </div>

                {!strategy ? (
                    <form onSubmit={generateStrategy} className="space-y-6 bg-[#0c0c0c] p-6 md:p-8 rounded-3xl border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nome da Empresa (Para Contexto)</label>
                                <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none placeholder-white/20" placeholder="Ex: Pizzaria do João" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nicho do Cliente</label>
                                <input type="text" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none placeholder-white/20" placeholder="Ex: Odontologia / Delivery" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Verba Mensal (R$)</label>
                                <input type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none placeholder-white/20" placeholder="Ex: 1500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cidade (Opcional)</label>
                                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none placeholder-white/20" placeholder="Ex: São Paulo" />
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                            {isLoading ? <SpinnerIcon /> : 'Gerar Plano Tático Completo'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-bottom-5">
                        <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4">
                            <TabButton id="overview" label="Visão Geral" icon={<BrainIcon className="w-4 h-4"/>} />
                            <TabButton id="setup" label="Setup Técnico" icon={<ZapIcon className="w-4 h-4"/>} />
                            <TabButton id="creatives" label="Criativos & Copy" icon={<InstagramIcon className="w-4 h-4"/>} />
                            <TabButton id="optimize" label="Otimização" icon={<TargetIcon className="w-4 h-4"/>} />
                            <button onClick={() => setStrategy(null)} className="ml-auto text-white/30 hover:text-white text-[10px] uppercase font-bold tracking-widest px-4">Nova Busca</button>
                        </div>
                        
                        {/* TAB: VISÃO GERAL */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#111] border border-white/10 p-6 rounded-3xl space-y-4">
                                    <h3 className="text-red-600 font-black text-xs uppercase tracking-widest">Análise Crítica do Lead</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-green-900/10 border border-green-900/30 rounded-xl">
                                            <span className="text-[9px] text-green-500 uppercase font-black block mb-1">Ponto Forte</span>
                                            <p className="text-white/80 text-sm leading-tight">{strategy.lead_analysis.strengths}</p>
                                        </div>
                                        <div className="p-3 bg-red-900/10 border border-red-900/30 rounded-xl">
                                            <span className="text-[9px] text-red-500 uppercase font-black block mb-1">Ponto Fraco</span>
                                            <p className="text-white/80 text-sm leading-tight">{strategy.lead_analysis.weaknesses}</p>
                                        </div>
                                        <div className="p-3 bg-yellow-900/10 border border-yellow-900/30 rounded-xl">
                                            <span className="text-[9px] text-yellow-500 uppercase font-black block mb-1">Oportunidade Oculta</span>
                                            <p className="text-white/80 text-sm leading-tight">{strategy.lead_analysis.opportunity}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#111] border border-white/10 p-6 rounded-3xl space-y-4">
                                    <h3 className="text-white font-black text-xs uppercase tracking-widest flex justify-between">
                                        Planejamento Financeiro <span>Total Dia: {strategy.budget_plan.daily_total}</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 text-center">
                                            <span className="text-blue-400 text-[10px] uppercase font-black">Google Ads</span>
                                            <p className="text-2xl font-black text-white mt-1">{strategy.budget_plan.google_daily}</p>
                                            <span className="text-[8px] text-white/30 uppercase">Intenção de Compra</span>
                                        </div>
                                        <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 text-center">
                                            <span className="text-purple-400 text-[10px] uppercase font-black">Meta Ads</span>
                                            <p className="text-2xl font-black text-white mt-1">{strategy.budget_plan.meta_daily}</p>
                                            <span className="text-[8px] text-white/30 uppercase">Atração & Branding</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl text-center">
                                        <span className="text-[9px] text-white/40 uppercase tracking-widest">Runway (Duração da Verba): </span>
                                        <span className="text-white font-bold">{strategy.budget_plan.runway_days}</span>
                                    </div>
                                </div>

                                <div className="md:col-span-2 bg-[#111] border border-white/10 p-6 rounded-3xl">
                                    <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">Cronograma de Implementação</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {[1, 2, 3, '4-7'].map((day, i) => (
                                            <div key={day} className="p-4 bg-[#151515] rounded-xl border border-white/5 relative overflow-hidden group hover:border-red-600/30 transition-colors">
                                                <span className="absolute top-0 right-0 p-2 text-[40px] font-black text-white/5 leading-none -mt-2 -mr-2">{day}</span>
                                                <span className="text-red-600 text-[9px] font-black uppercase tracking-widest block mb-2">Dia {day}</span>
                                                <p className="text-white/80 text-xs leading-snug relative z-10">
                                                    {i === 0 ? strategy.action_plan.day_1 : 
                                                     i === 1 ? strategy.action_plan.day_2 : 
                                                     i === 2 ? strategy.action_plan.day_3 : 
                                                     strategy.action_plan.day_4_7}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SETUP TÉCNICO */}
                        {activeTab === 'setup' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Google Setup */}
                                <div className="bg-[#111] border border-blue-900/30 p-6 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-full blur-2xl"></div>
                                    <h3 className="text-blue-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Configuração Google
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#151515] p-3 rounded-xl">
                                                <span className="text-[8px] text-white/40 uppercase block">Objetivo</span>
                                                <span className="text-white text-xs font-bold">{strategy.google_setup.campaign_goal}</span>
                                            </div>
                                            <div className="bg-[#151515] p-3 rounded-xl">
                                                <span className="text-[8px] text-white/40 uppercase block">Estratégia Lance</span>
                                                <span className="text-white text-xs font-bold">{strategy.google_setup.bid_strategy}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Palavras-Chave (Exata)</span>
                                            <div className="flex flex-wrap gap-2">
                                                {strategy.google_setup.keywords_exact.map(k => (
                                                    <span key={k} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20">[{k}]</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Palavras-Chave Negativas (Importante)</span>
                                            <div className="flex flex-wrap gap-2">
                                                {strategy.google_setup.negative_keywords.map(k => (
                                                    <span key={k} className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded border border-red-500/20">-{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Meta Setup */}
                                <div className="bg-[#111] border border-purple-900/30 p-6 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/10 rounded-full blur-2xl"></div>
                                    <h3 className="text-purple-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div> Configuração Meta
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#151515] p-3 rounded-xl">
                                                <span className="text-[8px] text-white/40 uppercase block">Objetivo</span>
                                                <span className="text-white text-xs font-bold">{strategy.meta_setup.campaign_objective}</span>
                                            </div>
                                            <div className="bg-[#151515] p-3 rounded-xl">
                                                <span className="text-[8px] text-white/40 uppercase block">Conversão</span>
                                                <span className="text-white text-xs font-bold">{strategy.meta_setup.conversion_event}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Interesses (Público Frio)</span>
                                            <div className="flex flex-wrap gap-2">
                                                {strategy.meta_setup.audience_interests.map(k => (
                                                    <span key={k} className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/20">{k}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Exclusões (Não anunciar para)</span>
                                            <div className="flex flex-wrap gap-2">
                                                {strategy.meta_setup.audience_exclusions.map(k => (
                                                    <span key={k} className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded border border-red-500/20">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: CRIATIVOS */}
                        {activeTab === 'creatives' && (
                            <div className="space-y-6">
                                {/* Google Ads Copy */}
                                <div className="bg-[#111] border border-white/10 p-6 rounded-3xl">
                                    <h3 className="text-blue-500 font-black text-xs uppercase tracking-widest mb-4">Anúncio de Texto (Google)</h3>
                                    <div className="bg-[#151515] p-5 rounded-xl border border-white/5 space-y-3">
                                        <div>
                                            <span className="text-blue-400 text-lg font-bold block hover:underline cursor-pointer">{strategy.google_setup.ad_copy.h1} | {strategy.google_setup.ad_copy.h2}</span>
                                            <span className="text-green-500 text-xs block mb-1">Anúncio • {formData.website || 'www.seusite.com.br'}</span>
                                            <p className="text-white/70 text-sm">{strategy.google_setup.ad_copy.desc1} {strategy.google_setup.ad_copy.desc2}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Creative 1 */}
                                    <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col h-full">
                                        <div className="mb-4">
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase rounded mb-2 inline-block">Criativo 01 - {strategy.meta_setup.creative_1.format}</span>
                                            <h4 className="text-white font-bold text-sm">Hook Visual</h4>
                                            <p className="text-white/60 text-xs mt-1 italic">"{strategy.meta_setup.creative_1.visual_hook}"</p>
                                        </div>
                                        <div className="mt-auto bg-[#151515] p-4 rounded-xl">
                                            <span className="text-[8px] text-white/30 uppercase block mb-1">Legenda / Copy</span>
                                            <p className="text-white text-xs leading-relaxed whitespace-pre-line">{strategy.meta_setup.creative_1.copy_text}</p>
                                        </div>
                                    </div>

                                    {/* Creative 2 */}
                                    <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col h-full">
                                        <div className="mb-4">
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase rounded mb-2 inline-block">Criativo 02 - {strategy.meta_setup.creative_2.format}</span>
                                            <h4 className="text-white font-bold text-sm">Hook Visual</h4>
                                            <p className="text-white/60 text-xs mt-1 italic">"{strategy.meta_setup.creative_2.visual_hook}"</p>
                                        </div>
                                        <div className="mt-auto bg-[#151515] p-4 rounded-xl">
                                            <span className="text-[8px] text-white/30 uppercase block mb-1">Legenda / Copy</span>
                                            <p className="text-white text-xs leading-relaxed whitespace-pre-line">{strategy.meta_setup.creative_2.copy_text}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: OTIMIZAÇÃO */}
                        {activeTab === 'optimize' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#111] border border-white/10 p-6 rounded-3xl">
                                    <h3 className="text-green-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <TargetIcon className="w-4 h-4"/> Metas de Sucesso
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-white/60 text-xs">CTR Mínimo (Atratividade)</span>
                                            <span className="text-xl font-black text-white">{strategy.optimization_rules.ctr_benchmark}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-white/60 text-xs">CPL Alvo (Custo Lead)</span>
                                            <span className="text-xl font-black text-green-500">{strategy.optimization_rules.cpl_target}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#111] border border-white/10 p-6 rounded-3xl space-y-6">
                                    <h3 className="text-red-500 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <ZapIcon className="w-4 h-4"/> Regras de Decisão
                                    </h3>
                                    
                                    <div className="bg-red-900/10 p-4 rounded-xl border border-red-900/30">
                                        <span className="text-[9px] text-red-500 uppercase font-black block mb-1">QUANDO MATAR UM ANÚNCIO (PAUSAR)</span>
                                        <p className="text-white text-xs font-bold">{strategy.optimization_rules.when_to_kill}</p>
                                    </div>

                                    <div className="bg-green-900/10 p-4 rounded-xl border border-green-900/30">
                                        <span className="text-[9px] text-green-500 uppercase font-black block mb-1">QUANDO ESCALAR (AUMENTAR VERBA)</span>
                                        <p className="text-white text-xs font-bold">{strategy.optimization_rules.when_to_scale}</p>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2 bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
                                    <p className="text-white/40 text-xs italic">
                                        "O segredo não é acertar de primeira, é matar o que dá errado rápido e deixar o que dá certo rodar."
                                    </p>
                                </div>
                            </div>
                        )}

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

// --- MODAL DE ESTRATÉGIA (RAIO-X DETALHADO COM IA) ---
const LeadStrategyModal = ({ 
    lead, 
    onClose, 
    onCopyPitch, 
    onOpenWhatsapp,
    customScripts
}: { 
    lead: Lead, 
    onClose: () => void, 
    onCopyPitch: (text: string) => void, 
    onOpenWhatsapp: (text: string) => void,
    customScripts: typeof DEFAULT_SCRIPTS
}) => {
    
    const [analysis, setAnalysis] = useState<IAAnalysisResult | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        const generateAiAnalysis = async () => {
            setIsAiLoading(true);
            
            // Dados brutos para o Prompt
            const companyName = lead.name;
            const rating = lead.rating;
            const reviewCount = lead.user_ratings_total;
            const address = lead.address;
            const hasSite = lead.status_site !== 'sem_site';
            const siteType = lead.status_site === 'site_basico' ? 'Site Básico (Linktree/AnotaAI)' : 'Site Próprio';
            const priceLevel = lead.price_level ? '$$$ (Alto Padrão)' : 'N/A';

            const prompt = `
                ATUE COMO: O melhor e mais persuasivo Copywriter de Vendas B2B do Brasil, especialista em Cold Messaging.
                
                CONTEXTO: Você está prospectando o cliente "${companyName}" localizado em "${address}".
                
                DADOS DO ALVO:
                - Nota Google: ${rating} (${reviewCount} avaliações).
                - Presença Digital: ${hasSite ? "Tem site ("+siteType+")" : "NÃO TEM SITE (Isso é uma falha grave)"}.
                - Nível: ${priceLevel}.

                MISSÃO: Escreva uma abordagem de venda (Pitch) ÚNICA e EXCLUSIVA para este cliente.
                
                REGRAS ABSOLUTAS (LEIA COM ATENÇÃO):
                1. PROIBIDO USAR TEMPLATES PRONTOS. Não use frases genéricas como "Olá, vi sua empresa no Google".
                2. SEJA ESPECÍFICO: Tente inferir o nicho pelo nome. Se for "Pizzaria X", fale de fome/pedidos. Se for "Clínica Y", fale de pacientes/agenda. Se for "Oficina Z", fale de carros.
                3. USE OS DADOS:
                   - Se a nota for baixa (< 4.2), comece falando: "Vi que vocês têm algumas reclamações recentes no Google..." (Toque na ferida).
                   - Se não tiver site, comece: "Procurei o site da ${companyName} pra fazer um pedido/agendamento e não achei nada..."
                   - Se for tudo perfeito, elogie a reputação e ofereça escala.
                4. TOM DE VOZ: Casual, direto, como um cliente oculto ou consultor preocupado. Não pareça um robô de telemarketing.
                5. FECHAMENTO: Termine com uma pergunta que force resposta (ex: "Vocês cuidam disso aí ou é terceirizado?").

                SAÍDA JSON ESTRITA (APENAS JSON, SEM MARKDOWN):
                {
                    "pitch": "A mensagem de WhatsApp pronta para enviar (sem aspas extras no início/fim).",
                    "products_to_sell": ["Produto 1 focado na dor", "Produto 2 focado no desejo", "Produto 3 de ticket alto"],
                    "sales_strategy": "Qual emoção usar? (ex: Medo de perder clientes, Ganância por crescer, Orgulho da marca)",
                    "suggested_pricing": "Sugestão de valor (ex: Setup R$ 1.500 + R$ 500/mês)",
                    "conquest_tip": "Uma dica psicológica suja para fazer esse dono específico responder.",
                    "pain_points": ["Dor 1 (ex: Invisível no Google)", "Dor 2 (ex: Reputação em risco)", "Dor 3 (ex: Perda para concorrente)"]
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
                
                if (data.error) throw new Error(data.details || data.error);
                if (!data || !data.text) throw new Error("Resposta vazia da IA");
                
                let cleanText = data.text.trim();
                if (cleanText.includes("```json")) {
                    cleanText = cleanText.split("```json")[1].split("```")[0].trim();
                } else if (cleanText.includes("```")) {
                    cleanText = cleanText.split("```")[1].split("```")[0].trim();
                }

                setAnalysis(JSON.parse(cleanText));
            } catch (error) {
                console.error("Erro na IA", error);
                // Fallback básico se IA falhar
                setAnalysis({
                    pitch: customScripts.standard.replace('{EMPRESA}', companyName),
                    products_to_sell: ["Site Profissional", "Google Meu Negócio"],
                    sales_strategy: "Autoridade (Fallback)",
                    suggested_pricing: "Sob Consulta",
                    conquest_tip: "Tente ligar diretamente.",
                    pain_points: ["Baixa visibilidade"]
                });
            } finally {
                setIsAiLoading(false);
            }
        };

        generateAiAnalysis();
    }, [lead]);

    return (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full md:max-w-6xl h-[95vh] md:h-auto md:max-h-[90vh] bg-[#0c0c0c] border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#111] flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter truncate max-w-[250px] md:max-w-none">{lead.name}</h2>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase border ${lead.business_status === 'OPERATIONAL' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {lead.business_status === 'OPERATIONAL' ? 'Aberto' : 'Fechado'}
                            </span>
                        </div>
                        <p className="text-white/50 text-xs flex items-center gap-2">
                            <LocationIcon className="w-3 h-3 text-white/30"/> {lead.address}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#0c0c0c]">
                    {isAiLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <SpinnerIcon />
                            <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">Gerando Raio-X Estratégico...</p>
                        </div>
                    ) : analysis ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Coluna Esquerda: Dados Táticos & Venda */}
                            <div className="lg:col-span-5 space-y-6">
                                {/* Score Card */}
                                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-1">Google Reputation</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-black text-white">{lead.rating}</span>
                                            <div className="flex text-yellow-500 text-xs">{'★'.repeat(Math.round(lead.rating))}</div>
                                        </div>
                                        <span className="text-white/30 text-[10px] uppercase">{lead.user_ratings_total} avaliações</span>
                                    </div>
                                    <div className="text-right">
                                         <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Lead Score</span>
                                         <span className={`text-3xl font-black ${lead.lead_score > 70 ? 'text-green-500' : 'text-red-600'}`}>{lead.lead_score}</span>
                                    </div>
                                </div>

                                {/* O Que Vender & Dores */}
                                <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <TargetIcon className="w-4 h-4"/> Diagnóstico de Venda
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[9px] text-white/30 uppercase block mb-1">Produtos Sugeridos</span>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.products_to_sell.map((prod, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white font-bold uppercase">{prod}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-white/30 uppercase block mb-1">Dores Prováveis</span>
                                            <ul className="list-disc list-inside text-xs text-white/70 space-y-1">
                                                {analysis.pain_points.map((pain, i) => <li key={i}>{pain}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Estratégia & Preço */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#151515] p-4 rounded-2xl border border-white/5">
                                        <span className="text-[9px] text-white/30 uppercase block mb-2">Estratégia</span>
                                        <p className="text-white text-xs font-bold leading-tight">{analysis.sales_strategy}</p>
                                    </div>
                                    <div className="bg-[#151515] p-4 rounded-2xl border border-white/5">
                                        <span className="text-[9px] text-white/30 uppercase block mb-2">Precificação</span>
                                        <p className="text-green-400 text-xs font-bold leading-tight">{analysis.suggested_pricing}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl">
                                    <span className="text-[9px] text-blue-400 uppercase font-black tracking-widest block mb-2">💡 Dica de Conquista</span>
                                    <p className="text-blue-100/80 text-xs italic">"{analysis.conquest_tip}"</p>
                                </div>
                            </div>

                            {/* Coluna Direita: Copy & Ação */}
                            <div className="lg:col-span-7 flex flex-col h-full">
                                 <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                        <ConsultingIcon className="w-4 h-4" /> Script Gerado (IA)
                                    </h3>
                                    <button onClick={() => onCopyPitch(analysis?.pitch || '')} className="text-[9px] bg-white text-black px-3 py-1.5 rounded uppercase font-black hover:bg-gray-200 transition-colors">Copiar</button>
                                 </div>
                                 
                                 <div className="relative flex-1 mb-4">
                                    <textarea 
                                        value={analysis.pitch}
                                        readOnly
                                        className="w-full h-full min-h-[250px] bg-[#151515] border border-white/10 rounded-2xl p-6 text-sm text-white/90 leading-relaxed font-sans focus:outline-none focus:border-red-600/50 resize-none custom-scrollbar"
                                    />
                                 </div>

                                 <button 
                                    onClick={() => onOpenWhatsapp(analysis?.pitch || '')}
                                    className="w-full bg-[#25D366] hover:bg-[#20b858] text-black py-5 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-600/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                 >
                                    <PhoneIcon className="w-5 h-5 text-black fill-current" />
                                    ABRIR WHATSAPP & FECHAR
                                 </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE: GERENCIADOR DE SCRIPTS (FUNCIONAL) ---
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
  const [activeTab, setActiveTab] = useState<'search' | 'contacted' | 'ignored' | 'scripts' | 'brainstorm' | 'marketing'>('search');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Script State
  const [customScripts, setCustomScripts] = useState<typeof DEFAULT_SCRIPTS>(DEFAULT_SCRIPTS);

  // Carregar Scripts Salvos
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
  const [minScore, setMinScore] = useState(50);
  
  // Controle de Paginação e Reset
  const [lastSearchSignature, setLastSearchSignature] = useState('');

  // CRM States
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  const [ignoredLeads, setIgnoredLeads] = useState<Lead[]>([]);
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
  }, []);

  useEffect(() => {
    localStorage.setItem('cbl_contacted_leads', JSON.stringify(contactedLeads));
  }, [contactedLeads]);

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

  const executeSearch = async (token?: string, isNextPage: boolean = false) => {
    if (!searchTerm || !location) return;

    setIsLoading(true);
    setActiveTab('search');
    
    // Se for paginação (Carregar Mais / Próxima Página), movemos os atuais para ignorados
    if (isNextPage && leads.length > 0) {
        setIgnoredLeads(prev => [...prev, ...leads]);
        setLeads([]);
    } else if (!token) {
        // Nova busca limpa tudo
        setLeads([]);
        setIgnoredLeads([]);
    }
    
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

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

      const data = await response.json();
      const rawResults = data.results || [];
      
      setNextPageToken(data.next_page_token || null);

      const processedLeads: Lead[] = rawResults.map((place: any) => {
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

      // Filtra arquivados, já contactados e aplica MIN SCORE
      const filteredLeads = processedLeads.filter((lead: Lead) => {
          const isContacted = contactedLeads.some(cl => cl.id === lead.id);
          const isIgnored = ignoredLeads.some(il => il.id === lead.id);
          const meetsScore = lead.lead_score >= minScore;
          
          if (isContacted || isIgnored) return false;
          if (!meetsScore) return false;
          if (searchMode === 'ghost' && lead.status_site === 'com_site') return false;
          
          return true;
      });

      // Ordena por Score (Maior para menor)
      filteredLeads.sort((a, b) => b.lead_score - a.lead_score);

      setLeads(filteredLeads);

    } catch (error: any) {
      console.error(error);
      alert("Erro na busca: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      
      const currentSignature = `${searchTerm}-${location}-${searchMode}`;
      
      if (currentSignature === lastSearchSignature && nextPageToken) {
          // É a mesma busca, então carrega a próxima página
          executeSearch(nextPageToken, true);
      } else {
          // É uma nova busca
          setLastSearchSignature(currentSignature);
          executeSearch(undefined, false);
      }
  };

  const markAsContacted = (lead: Lead) => {
      const leadWithDate = { ...lead, contactedAt: new Date().toISOString() };
      setContactedLeads(prev => [leadWithDate, ...prev]);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      if (selectedLead?.id === lead.id) setSelectedLead(null);
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

  const LeadCard: React.FC<{ lead: Lead; isArchived?: boolean }> = ({ lead, isArchived = false }) => (
      <div className={`bg-[#0c0c0c] border ${isArchived ? 'border-blue-900/30' : 'border-white/10'} rounded-3xl flex flex-col justify-between h-full group transition-all duration-300 relative overflow-hidden shadow-2xl mb-4 md:mb-0`}>
             <div className="h-40 w-full bg-gray-900 relative overflow-hidden shrink-0">
                 {lead.photos && lead.photos.length > 0 ? (
                     <img src={`/api/photo?ref=${lead.photos[0].photo_reference}`} className={`w-full h-full object-cover transition-all duration-700 ${isArchived ? 'grayscale' : 'opacity-80 group-hover:opacity-100'}`} alt={lead.name} />
                 ) : (
                     <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center opacity-50"><Logo className="scale-75 opacity-20" /></div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-transparent"></div>
                 <div className="absolute top-3 left-3 flex gap-2">
                     {isArchived && <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-wide shadow-lg">Processado</span>}
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
                     <button onClick={() => setSelectedLead(lead)} className="bg-white/5 hover:bg-white/10 text-red-500 text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-lg border border-red-900/30 hover:border-red-600 transition-all flex items-center gap-2">Ver Raio-X <span className="text-[10px]">→</span></button>
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
             <NavButton tab="ignored" icon={<XIcon />} label={<span className="md:hidden lg:inline">Sem Interesse</span>} />
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
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho</label>
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm md:text-base font-bold transition-all placeholder-white/20" placeholder="Ex: Estética" />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-white focus:border-red-600 outline-none text-sm md:text-base font-bold transition-all placeholder-white/20" placeholder="Ex: Pinheiros, SP" />
                            </div>
                            
                            {/* Score Slider */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[9px] font-black text-white/50 uppercase tracking-widest ml-1 flex justify-between">Score Mín: <span className="text-white">{minScore}</span></label>
                                <input type="range" min="0" max="90" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-full accent-red-600 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            <div className="md:col-span-2">
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
                                <p className="text-sm font-black uppercase tracking-widest">Aguardando Parâmetros de Busca</p>
                            </div>
                        )}
                        
                        {leads.length > 0 && (
                            <>
                                <div className="flex justify-between items-end mb-6 px-1 border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-white italic">{leads.length}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2 leading-tight">Leads Filtrados (Score {'>'} {minScore})</span>
                                    </div>
                                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Sorted by: Lead Score</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8">
                                    {leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
                                </div>
                                
                                <div className="mt-10 flex justify-center pb-10">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Para carregar mais, clique em "BUSCAR ALVOS" novamente.</p>
                                </div>
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

            {activeTab === 'ignored' && (
                <div className="flex-1 flex flex-col bg-[#050505] p-4 md:p-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                            <div><h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Sem Interesse</h1><p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Leads Arquivados da Busca</p></div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 pb-20">
                                {ignoredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} isArchived={true} />)}
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

      {selectedLead && <LeadStrategyModal lead={selectedLead} onClose={() => setSelectedLead(null)} onCopyPitch={(text) => copyPitch(selectedLead, text)} onOpenWhatsapp={(text) => openWhatsApp(selectedLead, text)} customScripts={customScripts} />}
    </div>
  );
};

export default AdminDashboard;
