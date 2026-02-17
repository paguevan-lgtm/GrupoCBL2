
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

interface StrategyNote {
    id: string;
    author: 'Sócio 1' | 'Sócio 2';
    text: string;
    timestamp: string;
    type: 'general' | 'alert' | 'idea';
}

interface FinancialGoal {
    target: number;
    current: number;
}

// Interface para Marketing
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
        objective: string;
        audience_interests: string[];
        creative_idea: string;
        copy_hook: string;
        copy_body: string;
    };
    tactical_plan: {
        phase1_testing: string;
        phase2_optimization: string;
        budget_distribution_note: string;
    };
}

interface CriticFeedback {
    score: number;
    brutal_feedback: string;
    fixed_copy: string;
    fixed_headline: string;
}

type SearchMode = 'standard' | 'whale' | 'crisis' | 'ghost';

// --- COMPONENTE: MARKETING COMMAND ---
const MarketingCommand = () => {
    const [formData, setFormData] = useState({ niche: '', city: '', budget: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isCriticLoading, setIsCriticLoading] = useState(false);
    const [strategy, setStrategy] = useState<AdsStrategy | null>(null);
    const [criticFeedback, setCriticFeedback] = useState<CriticFeedback | null>(null);
    const [viewMode, setViewMode] = useState<'strategy' | 'tutorial'>('strategy');

    const generateStrategy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.niche || !formData.budget) return;

        setIsLoading(true);
        setStrategy(null);
        setCriticFeedback(null);
        setViewMode('strategy');

        const prompt = `
            Atue como um Gestor de Tráfego de Elite (Top 1% Brasil).
            Crie uma estratégia de ADS REALISTA, MATEMÁTICA e DETALHADA para:
            Nicho: ${formData.niche}
            Cidade: ${formData.city || 'Geral'}
            Verba Mensal: R$ ${formData.budget}

            REGRAS CRÍTICAS DE JSON:
            1. NÃO coloque markdown (\`\`\`json).
            2. Retorne APENAS o objeto JSON válido.
            3. Seja agressivo na copy.

            ESTRUTURA DE SAÍDA:
            {
                "niche": "${formData.niche}",
                "total_budget": "R$ ${formData.budget}",
                "allocation": {
                    "google_percent": (número inteiro ex: 40),
                    "meta_percent": (número inteiro ex: 60),
                    "google_value": "Valor R$",
                    "meta_value": "Valor R$"
                },
                "projections": {
                    "clicks": "Estimativa (ex: 400-600)",
                    "leads": "Estimativa (ex: 30-50)",
                    "cpm": "Custo por mil (ex: R$ 15,00)"
                },
                "google_ads": {
                    "campaign_type": "Ex: Rede de Pesquisa (Fundo de Funil)",
                    "keywords": ["palavra1", "palavra2", "palavra3"],
                    "headline": "Título Chamativo (Max 30 chars)",
                    "description": "Descrição persuasiva (Max 90 chars)"
                },
                "meta_ads": {
                    "objective": "Ex: Mensagens no WhatsApp",
                    "audience_interests": ["Interesse 1", "Interesse 2"],
                    "creative_idea": "Descrição visual da imagem/vídeo.",
                    "copy_hook": "Primeira frase (Gancho)",
                    "copy_body": "Corpo do texto com CTA"
                },
                "tactical_plan": {
                    "phase1_testing": "O que fazer nos dias 1-7 (ex: testar 3 criativos, R$ X/dia)",
                    "phase2_optimization": "O que fazer dias 8-30 (ex: cortar o ruim, escalar o bom)",
                    "budget_distribution_note": "Dica de como dividir a verba diária"
                }
            }
        `;

        try {
            console.log("Enviando prompt para IA...");
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: prompt,
                    model: 'gemini-3-flash-preview', // Modelo rápido
                    config: { responseMimeType: 'application/json' }
                })
            });

            if (!response.ok) throw new Error("Erro na API");

            const data = await response.json();
            
            // LIMPEZA AGRESSIVA DO JSON
            let cleanText = data.text;
            // Remove blocos de código markdown se existirem
            cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');
            // Encontra o primeiro '{' e o último '}'
            const firstBrace = cleanText.indexOf('{');
            const lastBrace = cleanText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                cleanText = cleanText.substring(firstBrace, lastBrace + 1);
            }

            try {
                const parsed = JSON.parse(cleanText);
                setStrategy(parsed);
            } catch (e) {
                console.error("Erro de Parse JSON:", e);
                console.log("Texto recebido:", cleanText);
                alert("A IA retornou um formato inválido. Tente novamente.");
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao gerar estratégia. Verifique sua conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    const runCritic = async () => {
        if (!strategy) return;
        setIsCriticLoading(true);

        const prompt = `
            ATUE COMO: Um Diretor Criativo Rabugento, Crítico e Genial (Estilo Ogilvy/Draper).
            
            ANALISE ESTA COPY E CRIATIVO DE ANÚNCIO:
            Headline Google: "${strategy.google_ads.headline}"
            Copy Meta: "${strategy.meta_ads.copy_hook} ${strategy.meta_ads.copy_body}"
            Criativo: "${strategy.meta_ads.creative_idea}"

            TAREFA:
            1. Dê uma nota de 0 a 10. Seja duro.
            2. Faça uma crítica brutal explicando por que está "médio" ou "ruim".
            3. REESCREVA a Copy e a Headline para serem EXTREMAMENTE persuasivas.

            SAÍDA JSON:
            {
                "score": (número),
                "brutal_feedback": "Texto da crítica",
                "fixed_copy": "Nova copy completa",
                "fixed_headline": "Nova headline matadora"
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
            let cleanText = data.text.replace(/```json/g, '').replace(/```/g, '');
            const firstBrace = cleanText.indexOf('{');
            const lastBrace = cleanText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) cleanText = cleanText.substring(firstBrace, lastBrace + 1);
            
            setCriticFeedback(JSON.parse(cleanText));
        } catch (e) {
            console.error(e);
            alert("A IA crítica está dormindo. Tente de novo.");
        } finally {
            setIsCriticLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0c0c0c] overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-white/10 bg-[#111] shrink-0 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        <MegaphoneIcon className="w-6 h-6 text-red-600" />
                        Marketing Command
                    </h2>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Gerador de Campanhas de Alta Performance</p>
                </div>
                {strategy && (
                    <div className="flex bg-[#050505] p-1 rounded-lg border border-white/10">
                        <button 
                            onClick={() => setViewMode('strategy')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'strategy' ? 'bg-white text-black shadow' : 'text-white/40 hover:text-white'}`}
                        >
                            Estratégia Visual
                        </button>
                        <button 
                            onClick={() => setViewMode('tutorial')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'tutorial' ? 'bg-red-600 text-white shadow' : 'text-white/40 hover:text-white'}`}
                        >
                            Plano de Voo (Tutorial)
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Input */}
                <div className="w-80 bg-[#0a0a0a] border-r border-white/10 p-6 flex flex-col gap-6 shrink-0 overflow-y-auto">
                    <form onSubmit={generateStrategy} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-red-600 uppercase tracking-widest">Nicho do Cliente</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Hamburgueria Artesanal" 
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-all"
                                value={formData.niche}
                                onChange={e => setFormData({...formData, niche: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Cidade / Região</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Santos, SP" 
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 outline-none transition-all"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Verba Mensal (R$)</label>
                            <input 
                                type="number" 
                                placeholder="1000" 
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 outline-none transition-all"
                                value={formData.budget}
                                onChange={e => setFormData({...formData, budget: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <SpinnerIcon /> : 'GERAR ESTRATÉGIA'}
                        </button>
                    </form>
                    
                    <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[9px] text-white/30 leading-relaxed">
                            <strong className="text-white">Dica Pro:</strong> Use o "Plano de Voo" para orientar o cliente sobre os primeiros 30 dias. Isso reduz a ansiedade por resultados imediatos.
                        </p>
                    </div>
                </div>

                {/* Output Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#0c0c0c] custom-scrollbar">
                    {!strategy && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-white/20">
                            <MegaphoneIcon className="w-24 h-24 mb-6 opacity-20" />
                            <p className="text-sm font-mono uppercase tracking-widest">Aguardando dados da missão...</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-t-2 border-red-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-r-2 border-white/20 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-red-500 font-black uppercase tracking-[0.3em] animate-pulse text-xs">Calculando ROI Previsível...</p>
                        </div>
                    )}

                    {strategy && viewMode === 'strategy' && (
                        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-500">
                            
                            {/* Top Cards - Visual Impact */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-[#111] border border-white/10 p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
                                    <div className="absolute -right-4 -top-4 bg-red-600/10 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 relative z-10">Verba Total</span>
                                    <span className="text-2xl font-black text-white relative z-10">{strategy.total_budget}</span>
                                </div>
                                <div className="bg-[#111] border border-white/10 p-4 rounded-2xl flex flex-col justify-between h-32">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Cliques Est.</span>
                                    <span className="text-2xl font-black text-blue-400">{strategy.projections.clicks}</span>
                                </div>
                                <div className="bg-[#111] border border-white/10 p-4 rounded-2xl flex flex-col justify-between h-32">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Leads Est.</span>
                                    <span className="text-2xl font-black text-green-500">{strategy.projections.leads}</span>
                                </div>
                                <div className="bg-[#111] border border-white/10 p-4 rounded-2xl flex flex-col justify-between h-32">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">CPM Médio</span>
                                    <span className="text-2xl font-black text-purple-400">{strategy.projections.cpm}</span>
                                </div>
                            </div>

                            {/* Budget Allocation Graphic */}
                            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-6">Alocação de Verba</h3>
                                <div className="flex h-12 w-full rounded-xl overflow-hidden mb-4">
                                    <div style={{ width: `${strategy.allocation.google_percent}%` }} className="bg-blue-600 flex items-center justify-center relative group">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:scale-110 transition-transform">Google {strategy.allocation.google_percent}%</span>
                                    </div>
                                    <div style={{ width: `${strategy.allocation.meta_percent}%` }} className="bg-purple-600 flex items-center justify-center relative group">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:scale-110 transition-transform">Meta {strategy.allocation.meta_percent}%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs font-mono text-white/40">
                                    <span>{strategy.allocation.google_value} (Intenção de Compra)</span>
                                    <span>{strategy.allocation.meta_value} (Geração de Desejo)</span>
                                </div>
                            </div>

                            {/* Google Strategy */}
                            <div className="bg-[#111] border-l-2 border-blue-500 p-6 rounded-r-2xl space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">Google Search</span>
                                    <span className="text-white/40 text-[10px] uppercase font-bold">{strategy.google_ads.campaign_type}</span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[9px] text-white/30 uppercase tracking-widest mb-1">Palavras-Chave</label>
                                        <div className="flex flex-wrap gap-2">
                                            {strategy.google_ads.keywords.map((kw, i) => (
                                                <span key={i} className="bg-white/5 text-white text-xs px-3 py-1 rounded border border-white/10">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-[#050505] p-4 rounded-xl border border-white/5">
                                        <p className="text-blue-400 text-sm font-bold mb-1 hover:underline cursor-pointer">{strategy.google_ads.headline}</p>
                                        <p className="text-green-500 text-xs mb-1">Anúncio • www.seusite.com.br</p>
                                        <p className="text-white/60 text-xs">{strategy.google_ads.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Meta Strategy */}
                            <div className="bg-[#111] border-l-2 border-purple-500 p-6 rounded-r-2xl space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-purple-500/10 text-purple-500 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">Instagram / Facebook</span>
                                    <span className="text-white/40 text-[10px] uppercase font-bold">{strategy.meta_ads.objective}</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[9px] text-white/30 uppercase tracking-widest mb-2">Criativo (Imagem/Vídeo)</label>
                                            <p className="text-white text-sm font-light leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5 italic">
                                                "{strategy.meta_ads.creative_idea}"
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] text-white/30 uppercase tracking-widest mb-2">Público (Interesses)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {strategy.meta_ads.audience_interests.map((int, i) => (
                                                    <span key={i} className="bg-purple-900/20 text-purple-300 text-[10px] px-2 py-1 rounded border border-purple-500/20 uppercase">{int}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[9px] text-white/30 uppercase tracking-widest mb-2">Copy (Legenda)</label>
                                        <div className="bg-[#050505] p-4 rounded-xl border border-white/5 text-sm text-white/80 h-full flex flex-col justify-between">
                                            <div>
                                                <p className="font-bold text-white mb-2">{strategy.meta_ads.copy_hook}</p>
                                                <p className="whitespace-pre-wrap text-xs text-white/60 leading-relaxed">{strategy.meta_ads.copy_body}</p>
                                            </div>
                                            
                                            {/* Botão de Crítica IA */}
                                            <button 
                                                onClick={runCritic}
                                                disabled={isCriticLoading}
                                                className="mt-4 w-full bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                            >
                                                {isCriticLoading ? <SpinnerIcon /> : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                        Análise Crítica (IA)
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Critic Feedback Result */}
                            {criticFeedback && (
                                <div className="animate-in slide-in-from-top-10 duration-500 bg-red-950/20 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500 font-black text-6xl rotate-12">{criticFeedback.score}</div>
                                    <h4 className="text-red-500 font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
                                        <span className="text-2xl">☠️</span> Feedback do Diretor Criativo
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="bg-black/40 p-4 rounded-xl border border-red-500/10">
                                            <p className="text-red-200 text-xs italic leading-relaxed">"{criticFeedback.brutal_feedback}"</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] font-black text-green-500 uppercase tracking-widest">Headline Corrigida</label>
                                                <p className="text-white text-sm font-bold mt-1 bg-green-900/10 p-2 rounded border border-green-500/20">{criticFeedback.fixed_headline}</p>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-green-500 uppercase tracking-widest">Copy Otimizada</label>
                                                <p className="text-white/80 text-xs mt-1 bg-green-900/10 p-2 rounded border border-green-500/20 whitespace-pre-wrap">{criticFeedback.fixed_copy}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {strategy && viewMode === 'tutorial' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-10 duration-500">
                            <div className="bg-[#111] border-l-4 border-green-500 p-8 rounded-r-2xl">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Plano de Voo</h3>
                                <p className="text-white/40 text-sm mb-6">Guia tático para execução da verba de {strategy.total_budget}.</p>

                                <div className="space-y-8 relative">
                                    {/* Linha do Tempo */}
                                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/10"></div>

                                    {/* Fase 1 */}
                                    <div className="relative pl-12">
                                        <div className="absolute left-0 top-0 w-10 h-10 bg-black border border-white/20 rounded-full flex items-center justify-center text-white font-black text-xs z-10">01</div>
                                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Fase de Teste (Dias 1-7)</h4>
                                        <p className="text-white/60 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                            {strategy.tactical_plan.phase1_testing}
                                        </p>
                                    </div>

                                    {/* Fase 2 */}
                                    <div className="relative pl-12">
                                        <div className="absolute left-0 top-0 w-10 h-10 bg-black border border-white/20 rounded-full flex items-center justify-center text-white font-black text-xs z-10">02</div>
                                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Otimização & Escala (Dias 8-30)</h4>
                                        <p className="text-white/60 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                            {strategy.tactical_plan.phase2_optimization}
                                        </p>
                                    </div>

                                    {/* Configuração */}
                                    <div className="relative pl-12">
                                        <div className="absolute left-0 top-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-black text-xs z-10">$$</div>
                                        <h4 className="text-green-500 font-bold text-sm uppercase tracking-widest mb-2">Configuração Financeira</h4>
                                        <p className="text-white/60 text-sm leading-relaxed bg-green-900/10 p-4 rounded-xl border border-green-500/20">
                                            {strategy.tactical_plan.budget_distribution_note}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE: STRATEGIC WAR ROOM ---
const StrategicWarRoom = () => {
    // Estado Persistente
    const [tasks, setTasks] = useState<StrategyTask[]>([]);
    const [notes, setNotes] = useState<StrategyNote[]>([]);
    const [goal, setGoal] = useState<FinancialGoal>({ target: 50000, current: 0 });
    
    // Estado UI
    const [activeUser, setActiveUser] = useState<'Sócio 1' | 'Sócio 2'>('Sócio 1');
    const [newTaskText, setNewTaskText] = useState('');
    const [newNoteText, setNewNoteText] = useState('');
    const [isEditingGoal, setIsEditingGoal] = useState(false);

    // Load Data
    useEffect(() => {
        const savedTasks = localStorage.getItem('cbl_war_tasks');
        const savedNotes = localStorage.getItem('cbl_war_notes');
        const savedGoal = localStorage.getItem('cbl_war_goal');

        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedNotes) setNotes(JSON.parse(savedNotes));
        if (savedGoal) setGoal(JSON.parse(savedGoal));
    }, []);

    // Save Data
    useEffect(() => { localStorage.setItem('cbl_war_tasks', JSON.stringify(tasks)); }, [tasks]);
    useEffect(() => { localStorage.setItem('cbl_war_notes', JSON.stringify(notes)); }, [notes]);
    useEffect(() => { localStorage.setItem('cbl_war_goal', JSON.stringify(goal)); }, [goal]);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const newTask: StrategyTask = {
            id: Date.now().toString(),
            title: newTaskText,
            desc: '',
            status: 'backlog',
            priority: 'medium',
            value: '0'
        };
        setTasks(prev => [...prev, newTask]);
        setNewTaskText('');
    };

    const addNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteText.trim()) return;
        const newNote: StrategyNote = {
            id: Date.now().toString(),
            author: activeUser,
            text: newNoteText,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            type: 'general'
        };
        setNotes(prev => [newNote, ...prev]);
        setNewNoteText('');
    };

    const moveTask = (id: string, direction: 'next' | 'prev') => {
        setTasks(prev => prev.map(t => {
            if (t.id !== id) return t;
            const flow = ['backlog', 'doing', 'done'];
            const currentIndex = flow.indexOf(t.status);
            const nextIndex = direction === 'next' ? Math.min(currentIndex + 1, 2) : Math.max(currentIndex - 1, 0);
            return { ...t, status: flow[nextIndex] as any };
        }));
    };

    const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
    
    const togglePriority = (id: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== id) return t;
            const nextP = t.priority === 'low' ? 'medium' : (t.priority === 'medium' ? 'high' : 'low');
            return { ...t, priority: nextP };
        }));
    };

    const progressPercent = Math.min((goal.current / goal.target) * 100, 100);

    return (
        <div className="h-full flex flex-col bg-[#0c0c0c] overflow-hidden animate-in fade-in">
            {/* Header: Financial Goal */}
            <div className="p-6 border-b border-white/10 bg-[#111] shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                            <BrainIcon className="w-6 h-6 text-red-600" />
                            CBL Strategic Core
                        </h2>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">QG de Inteligência & Operações</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-black rounded-lg p-1 border border-white/10">
                            {['Sócio 1', 'Sócio 2'].map(u => (
                                <button 
                                    key={u}
                                    onClick={() => setActiveUser(u as any)}
                                    className={`px-3 py-1 text-[9px] uppercase font-bold rounded transition-colors ${activeUser === u ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* North Star Metric */}
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-900/20 to-red-600/10 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mb-1 block">Meta Mensal (North Star)</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-black text-white">R$ {goal.current.toLocaleString('pt-BR')}</span>
                                <span className="text-white/30 text-sm">/ R$ {goal.target.toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             {isEditingGoal ? (
                                 <div className="flex gap-2 items-center">
                                     <input 
                                        type="number" 
                                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-24"
                                        value={goal.current}
                                        onChange={e => setGoal(prev => ({...prev, current: Number(e.target.value)}))}
                                     />
                                     <button onClick={() => setIsEditingGoal(false)} className="text-green-500 text-xs font-bold uppercase">OK</button>
                                 </div>
                             ) : (
                                 <button onClick={() => setIsEditingGoal(true)} className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1 rounded hover:bg-white/5 transition-all">
                                     Atualizar Revenue
                                 </button>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Coluna Esquerda: Kanban (Pipeline) */}
                <div className="flex-1 flex flex-col border-r border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e0e]">
                        <h3 className="text-white/60 text-xs font-black uppercase tracking-widest">Pipeline de Inovação</h3>
                        <form onSubmit={addTask} className="flex gap-2">
                            <input 
                                value={newTaskText}
                                onChange={e => setNewTaskText(e.target.value)}
                                placeholder="Nova ideia / tarefa..." 
                                className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white w-48 focus:border-red-600 outline-none"
                            />
                            <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-3 rounded-lg text-lg leading-none pb-1">+</button>
                        </form>
                    </div>
                    
                    <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
                        <div className="flex gap-4 h-full min-w-[800px]">
                            {[
                                { id: 'backlog', label: 'Ideias / Backlog', color: 'border-white/10' },
                                { id: 'doing', label: 'Em Execução', color: 'border-blue-500/30' },
                                { id: 'done', label: 'Concluído ($)', color: 'border-green-500/30' }
                            ].map(col => (
                                <div key={col.id} className={`flex-1 flex flex-col bg-[#111] rounded-2xl border ${col.color} overflow-hidden`}>
                                    <div className="p-3 bg-black/40 border-b border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{col.label}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                                        {tasks.filter(t => t.status === col.id).map(task => (
                                            <div key={task.id} className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 hover:border-white/20 group transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span 
                                                        onClick={() => togglePriority(task.id)}
                                                        className={`cursor-pointer text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                                            task.priority === 'high' ? 'bg-red-500/20 text-red-500' : 
                                                            (task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-white/40')
                                                        }`}
                                                    >
                                                        {task.priority === 'high' ? 'PRIORIDADE' : task.priority}
                                                    </span>
                                                    <button onClick={() => deleteTask(task.id)} className="text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                                </div>
                                                <p className="text-white text-sm font-medium leading-tight mb-3">{task.title}</p>
                                                
                                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                    <button 
                                                        disabled={col.id === 'backlog'}
                                                        onClick={() => moveTask(task.id, 'prev')}
                                                        className="text-white/20 hover:text-white disabled:opacity-0 text-xs px-2 py-1 bg-white/5 rounded"
                                                    >
                                                        ←
                                                    </button>
                                                    <button 
                                                        disabled={col.id === 'done'}
                                                        onClick={() => moveTask(task.id, 'next')}
                                                        className="text-white/20 hover:text-white disabled:opacity-0 text-xs px-2 py-1 bg-white/5 rounded"
                                                    >
                                                        →
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Link Neural (Chat/Notes) */}
                <div className="w-96 flex flex-col bg-[#0a0a0a] border-l border-white/10">
                    <div className="p-4 border-b border-white/10 bg-[#0e0e0e]">
                        <h3 className="text-white/60 text-xs font-black uppercase tracking-widest">Link Neural</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col-reverse">
                         {notes.length === 0 && (
                             <div className="text-center text-white/20 text-xs py-10 italic">Nenhuma anotação no feed.</div>
                         )}
                         {notes.map(note => (
                             <div key={note.id} className={`p-3 rounded-xl border ${note.author === activeUser ? 'bg-white/5 border-white/10 ml-4' : 'bg-[#151515] border-white/5 mr-4'}`}>
                                 <div className="flex justify-between items-center mb-1">
                                     <span className={`text-[9px] font-black uppercase tracking-wider ${note.author === 'Sócio 1' ? 'text-blue-400' : 'text-purple-400'}`}>{note.author}</span>
                                     <span className="text-[8px] text-white/30 font-mono">{note.timestamp}</span>
                                 </div>
                                 <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">{note.text}</p>
                             </div>
                         ))}
                    </div>

                    <div className="p-4 bg-[#0e0e0e] border-t border-white/10">
                        <form onSubmit={addNote} className="relative">
                            <textarea 
                                value={newNoteText}
                                onChange={e => setNewNoteText(e.target.value)}
                                onKeyDown={e => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        addNote(e);
                                    }
                                }}
                                placeholder="Deixe uma nota ou insight..."
                                className="w-full bg-[#151515] border border-white/10 rounded-xl p-3 pr-10 text-xs text-white focus:border-red-600 outline-none resize-none h-20 custom-scrollbar"
                            />
                            <button type="submit" className="absolute bottom-3 right-3 text-white/40 hover:text-red-500 transition-colors">
                                <ZapIcon className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
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

// --- MODAL DE ESTRATÉGIA (RAIO-X) ---
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
    
    const [editablePitch, setEditablePitch] = useState('');
    const [showAiReasoning, setShowAiReasoning] = useState(false);

    // Lógica de Precificação
    const getPricingStrategy = () => {
        const level = lead.price_level || 1;
        if (level >= 3) {
            return { setup: "R$ 2.500,00", monthly: "R$ 800,00", label: "High Ticket", color: "text-blue-400" };
        } else if (level === 2) {
            return { setup: "R$ 1.200,00", monthly: "R$ 450,00", label: "Standard", color: "text-green-400" };
        } else {
            return { setup: "Isento (12 meses)", monthly: "R$ 299,00", label: "Entrada", color: "text-white" };
        }
    };

    useEffect(() => {
        let template = customScripts.standard;
        if (lead.rating < 4.0) template = customScripts.crisis;
        else if (lead.status_site === 'sem_site') template = customScripts.ghost;
        else if (lead.status_site === 'site_basico') template = customScripts.basic;
        else if (lead.price_level && lead.price_level >= 3) template = customScripts.whale;

        const companyName = lead.name.split('-')[0].trim();
        const neighborhood = lead.address.split(',')[1]?.split('-')[0]?.trim() || "sua região";
        const platform = lead.website?.includes('anota') ? 'Anota AI' : (lead.website?.includes('linktr') ? 'Linktree' : 'Link na Bio');

        const finalPitch = template
            .replace(/{EMPRESA}/g, companyName)
            .replace(/{NOTA}/g, lead.rating.toString())
            .replace(/{BAIRRO}/g, neighborhood)
            .replace(/{PLATAFORMA}/g, platform);

        setEditablePitch(finalPitch);
    }, [lead, customScripts]);

    // Arsenal de Vendas
    const getSalesArsenal = () => {
        const products = [];
        if (lead.status_site === 'sem_site') {
            products.push({ name: "Site Institucional", priority: "ALTA", reason: "Urgência: Invisível no Google." });
            products.push({ name: "Google Meu Negócio", priority: "ALTA", reason: "Fundamental para ser achado." });
        } else if (lead.status_site === 'site_basico') {
            products.push({ name: "Site Profissional", priority: "MÉDIA", reason: "Sair do amadorismo." });
            products.push({ name: "Cardápio Digital", priority: "ALTA", reason: "Facilitar pedidos." });
        } else {
            products.push({ name: "Landing Page", priority: "MÉDIA", reason: "Vender produto específico." });
        }
        if (lead.rating < 4.2) {
            products.push({ name: "Gestão de Reviews", priority: "CRÍTICA", reason: `Nota ${lead.rating} espanta clientes.` });
        } 
        return products;
    };

    // Lógica IA Expandida com Táticas
    const getAiReasoning = () => {
        const insights = [];
        
        if (lead.rating < 4.0) {
            insights.push({
                type: 'critical',
                title: `Reputação Comprometida (${lead.rating})`,
                tactic: "Implementar automação de reviews via QR Code no balcão e disparo de WhatsApp pós-venda para clientes satisfeitos."
            });
        }
        if (lead.user_ratings_total < 10) {
            insights.push({
                type: 'warning',
                title: "Invisibilidade Social",
                tactic: "Campanha 'Avalie e Ganhe': Oferecer um benefício imediato (café, desconto) em troca da primeira avaliação no Google."
            });
        }
        if (lead.status_site === 'sem_site') {
            insights.push({
                type: 'opportunity',
                title: "Perda de Tráfego Orgânico",
                tactic: "Criar One-Page Site otimizado para SEO local ('Melhor [Nicho] em [Bairro]') para capturar buscas de intenção."
            });
        }
        if (lead.status_site === 'site_basico') {
            insights.push({
                type: 'improvement',
                title: "Experiência Amadora (Linktree/Básico)",
                tactic: "Substituir por Site Institucional com fotos profissionais para aumentar percepção de valor e justificar preços maiores."
            });
        }
        if (lead.price_level && lead.price_level >= 3) {
            insights.push({
                type: 'money',
                title: "Público High Ticket",
                tactic: "Focar pitch em 'Exclusividade' e 'Posicionamento Premium'. Oferecer Landing Page de luxo."
            });
        }
        
        return insights;
    };

    const pricing = getPricingStrategy();
    const arsenal = getSalesArsenal();
    const insights = getAiReasoning();

    return (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-sm md:p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full md:max-w-5xl h-[95vh] md:h-auto md:max-h-[95vh] bg-[#0c0c0c] border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="p-5 md:p-6 border-b border-white/5 bg-[#111] flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter truncate max-w-[250px]">{lead.name}</h2>
                            {lead.business_status === 'OPERATIONAL' ? (
                                <span className="bg-green-500/10 text-green-500 text-[8px] font-bold px-2 py-0.5 rounded uppercase border border-green-500/20">Aberto</span>
                            ) : (
                                <span className="bg-red-500/10 text-red-500 text-[8px] font-bold px-2 py-0.5 rounded uppercase border border-red-500/20">{lead.business_status}</span>
                            )}
                        </div>
                        <p className="text-white/50 text-[10px] md:text-xs flex items-center gap-2 truncate">
                            <LocationIcon className="w-3 h-3 text-white/30"/> {lead.address}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                {/* Conteúdo Scrollável */}
                <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar bg-[#0c0c0c]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Coluna Esquerda: Detalhes Técnicos (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Card de Precificação */}
                            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                    Preço Sugerido
                                </div>
                                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {pricing.label}
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                        <span className="block text-white/30 text-[9px] uppercase tracking-widest mb-1">Setup</span>
                                        <span className={`text-xl font-black tracking-tight ${pricing.color}`}>{pricing.setup}</span>
                                    </div>
                                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                        <span className="block text-white/30 text-[9px] uppercase tracking-widest mb-1">Mensal</span>
                                        <span className="text-lg font-bold text-white tracking-tight">{pricing.monthly}</span>
                                    </div>
                                </div>
                            </div>

                            {/* O Que Vender */}
                            <div>
                                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3 flex items-center gap-2">
                                    <TargetIcon className="w-4 h-4 text-red-600" /> Arsenal de Vendas
                                </h3>
                                <div className="space-y-2">
                                    {arsenal.map((item, idx) => (
                                        <div key={idx} className="bg-[#111] border border-white/5 p-3 rounded-xl flex justify-between items-center">
                                            <div className="pr-2">
                                                <span className="block text-white font-bold text-xs">{item.name}</span>
                                                <span className="block text-white/40 text-[10px] mt-0.5 leading-tight">{item.reason}</span>
                                            </div>
                                            <span className={`shrink-0 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                                                item.priority === 'CRÍTICA' ? 'bg-red-600/20 text-red-500 border border-red-600/30' : 
                                                'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                                            }`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             {/* Detalhes Extras */}
                             <div className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-3">
                                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">Dados Operacionais</h3>
                                <div className="flex flex-wrap gap-2">
                                    {lead.types.slice(0, 5).map((t, i) => (
                                        <span key={i} className="text-[9px] bg-white/5 px-2 py-1 rounded border border-white/10 text-white/60 uppercase">{t.replace(/_/g, ' ')}</span>
                                    ))}
                                </div>
                                {lead.opening_hours?.weekday_text && (
                                    <div className="text-[10px] text-white/50 font-mono mt-2 bg-black/30 p-2 rounded max-h-24 overflow-y-auto custom-scrollbar">
                                        {lead.opening_hours.weekday_text.map((day, i) => <div key={i}>{day}</div>)}
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* Coluna Direita: Editor de Script e Lógica IA (8 cols) */}
                        <div className="lg:col-span-8 flex flex-col h-full">
                             
                             {/* AI Reasoning Expander - MELHORADO */}
                             <div className="mb-4">
                                <button 
                                    onClick={() => setShowAiReasoning(!showAiReasoning)}
                                    className="w-full flex items-center justify-between bg-gradient-to-r from-red-900/10 to-transparent border border-red-500/20 p-3 rounded-xl hover:border-red-500/40 transition-all group"
                                >
                                    <div className="flex items-center gap-2">
                                        <ZapIcon className="w-4 h-4 text-red-500" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Análise Tática & Implementação</span>
                                    </div>
                                    <span className={`text-white/40 transition-transform ${showAiReasoning ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {showAiReasoning && (
                                    <div className="mt-2 bg-[#080808] border border-white/5 rounded-xl p-4 animate-in slide-in-from-top-2 space-y-3">
                                        {insights.map((insight, i) => (
                                            <div key={i} className="flex gap-3 items-start pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                                    insight.type === 'critical' ? 'bg-red-500 shadow-[0_0_5px_red]' : 
                                                    (insight.type === 'money' ? 'bg-green-500' : 'bg-blue-500')
                                                }`}></div>
                                                <div>
                                                    <p className="text-xs font-bold text-white mb-1 uppercase tracking-wide">{insight.title}</p>
                                                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                                        <span className="block text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Como Resolver (Tática):</span>
                                                        <p className="text-[11px] text-white/70 font-light leading-relaxed">{insight.tactic}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>

                             <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                    Editor de Abordagem
                                </h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onCopyPitch(editablePitch)}
                                        className="text-[9px] text-black bg-white hover:bg-gray-200 uppercase font-bold tracking-widest flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg"
                                    >
                                        Copiar Texto
                                    </button>
                                </div>
                             </div>
                             
                             <div className="flex-1 relative group mb-4">
                                 <textarea 
                                    value={editablePitch}
                                    onChange={(e) => setEditablePitch(e.target.value)}
                                    className="w-full h-full min-h-[300px] bg-[#151515] border border-white/10 rounded-2xl p-6 text-sm md:text-base text-white/90 leading-relaxed font-sans focus:outline-none focus:border-white/30 resize-none custom-scrollbar shadow-inner"
                                 />
                                 <div className="absolute bottom-3 right-3 text-[9px] text-white/20 font-mono uppercase bg-black/50 px-2 py-1 rounded">
                                     Editável
                                 </div>
                             </div>

                             <button 
                                onClick={() => onOpenWhatsapp(editablePitch)}
                                className="w-full bg-[#25D366] hover:bg-[#20b858] text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-600/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
                             >
                                <PhoneIcon className="w-4 h-4 text-black fill-current" />
                                Enviar no WhatsApp
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE: GERENCIADOR DE SCRIPTS ---
const ScriptManager = ({ scripts, onSave }: { scripts: typeof DEFAULT_SCRIPTS, onSave: (s: typeof DEFAULT_SCRIPTS) => void }) => {
    const [localScripts, setLocalScripts] = useState(scripts);
    const [activeCategory, setActiveCategory] = useState<keyof typeof DEFAULT_SCRIPTS>('standard');

    const categories: {key: keyof typeof DEFAULT_SCRIPTS, label: string}[] = [
        { key: 'standard', label: 'Padrão' },
        { key: 'crisis', label: 'Crise/Nota Baixa' },
        { key: 'ghost', label: 'Sem Site' },
        { key: 'basic', label: 'Site Amador' },
        { key: 'whale', label: 'Ticket Alto' },
    ];

    const handleChange = (val: string) => {
        setLocalScripts(prev => ({ ...prev, [activeCategory]: val }));
    };

    return (
        <div className="bg-[#0c0c0c] rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full animate-in slide-in-from-right-10">
            <div className="p-6 border-b border-white/10 bg-[#111] flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Central de Scripts</h2>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Personalize a abordagem da IA</p>
                </div>
                <button 
                    onClick={() => onSave(localScripts)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                    Salvar Alterações
                </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Categorias */}
                <div className="w-48 bg-[#080808] border-r border-white/10 p-4 space-y-2">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeCategory === cat.key ? 'bg-white/10 text-white border border-white/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                    
                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
                        <span className="block text-[9px] font-bold text-white/50 mb-2">Variáveis Disponíveis:</span>
                        <code className="block text-[8px] text-green-500 font-mono mb-1">{`{EMPRESA}`}</code>
                        <code className="block text-[8px] text-green-500 font-mono mb-1">{`{BAIRRO}`}</code>
                        <code className="block text-[8px] text-green-500 font-mono mb-1">{`{NOTA}`}</code>
                        <code className="block text-[8px] text-green-500 font-mono">{`{PLATAFORMA}`}</code>
                    </div>
                </div>

                {/* Área de Edição */}
                <div className="flex-1 p-6 bg-[#0c0c0c] flex flex-col">
                    <label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Modelo de Mensagem ({activeCategory})</label>
                    <textarea 
                        value={localScripts[activeCategory]}
                        onChange={(e) => handleChange(e.target.value)}
                        className="flex-1 w-full bg-[#151515] border border-white/10 rounded-2xl p-6 text-white/90 font-sans text-sm leading-relaxed focus:outline-none focus:border-red-600/50 resize-none custom-scrollbar"
                    />
                </div>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'contacted' | 'scripts' | 'brainstorm' | 'marketing'>('search');
  
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
  
  // CRM States
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  const [chamadosSearch, setChamadosSearch] = useState('');

  // Results States
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debug
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cbl_contacted_leads');
    if (saved) {
        try { setContactedLeads(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cbl_contacted_leads', JSON.stringify(contactedLeads));
  }, [contactedLeads]);

  const addLog = (msg: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debugLogs]);

  const classifySite = (url?: string): 'com_site' | 'sem_site' | 'site_basico' => {
      if (!url) return 'sem_site';
      const lowerUrl = url.toLowerCase();
      const weakDomains = ['anota.ai', 'ifood', 'facebook', 'instagram', 'linktr.ee', 'wa.me', 'whatsapp', 'wix', 'google.com/view', 'bit.ly'];
      if (weakDomains.some(domain => lowerUrl.includes(domain))) return 'site_basico';
      return 'com_site';
  };

  // Algoritmo de Pontuação
  const calculateLeadScore = (place: any, siteStatus: string, mode: SearchMode) => {
    let score = 50; 
    if (siteStatus === 'sem_site') score += 30;
    else if (siteStatus === 'site_basico') score += 20;
    else score -= 10;

    switch (mode) {
        case 'whale': 
            if (place.price_level >= 3) score += 40; 
            else if (place.price_level === 2) score += 10;
            else if (!place.price_level) score -= 10;
            if (siteStatus === 'com_site') score += 15; 
            break;
        case 'crisis': 
            if (place.rating < 3.8) score += 40; 
            else if (place.rating < 4.3) score += 20;
            else score -= 20; 
            if (place.user_ratings_total < 10) score += 10; 
            break;
        case 'ghost': 
            if (siteStatus === 'com_site') score = 0; 
            if (siteStatus === 'sem_site') score += 20;
            if (place.business_status === 'OPERATIONAL') score += 10;
            break;
        default: 
            if (place.rating < 4.2) score += 10;
            if (place.types?.includes('health') || place.types?.includes('lawyer')) score += 10;
            break;
    }
    return Math.min(Math.max(score, 0), 99);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || !location) return;

    setIsLoading(true);
    setLeads([]);
    setDebugLogs([]); 
    setActiveTab('search');

    addLog(`Ativando Protocolo: ${searchMode.toUpperCase()}`);
    
    let queryPrefix = "";
    if (searchMode === 'whale') queryPrefix = "Luxury High End ";
    
    const fullQuery = `${queryPrefix}${searchTerm} in ${location}`;
    addLog(`Query Otimizada: "${fullQuery}"`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      addLog("Conectando Google Places API (Deep Fetch)...");
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

      const data = await response.json();
      const rawResults = data.results || [];
      addLog(`${rawResults.length} alvos brutos capturados.`);

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

      const filteredLeads = processedLeads.filter((lead: Lead) => {
          const isContacted = contactedLeads.some(cl => cl.id === lead.id);
          if (isContacted) return false;
          if (searchMode === 'ghost' && lead.status_site === 'com_site') return false;
          if (searchMode === 'crisis' && lead.rating >= 4.5) return false; 
          return true;
      });

      filteredLeads.sort((a: Lead, b: Lead) => b.lead_score - a.lead_score);
      setLeads(filteredLeads);
      addLog(`Refinamento concluído. ${filteredLeads.length} leads táticos prontos.`);

    } catch (error: any) {
      if (error.name === 'AbortError') addLog("ERRO: Timeout na operação Deep Fetch.");
      else addLog(`FALHA CRÍTICA: ${error.message}`);
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  };

  const markAsContacted = (lead: Lead) => {
      const leadWithDate = { ...lead, contactedAt: new Date().toISOString() };
      setContactedLeads(prev => [leadWithDate, ...prev]);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      if (selectedLead?.id === lead.id) setSelectedLead(null);
  };

  const removeFromContacted = (leadId: string) => {
      setContactedLeads(prev => prev.filter(l => l.id !== leadId));
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

  // CLEAN COPY FUNCTION
  const copyPitch = (lead: Lead, pitchText?: string) => {
      let textToCopy = pitchText || "Olá";
      
      // Sanitização agressiva de espaços extras
      textToCopy = textToCopy.trim().replace(/\n\s+\n/g, '\n\n'); 

      navigator.clipboard.writeText(textToCopy);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContactedLeads = contactedLeads.filter(l => 
      l.name.toLowerCase().includes(chamadosSearch.toLowerCase()) || 
      (l.types && l.types.some(t => t.includes(chamadosSearch.toLowerCase())))
  );

  const ModeSelector = () => (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {[{id: 'standard', label: 'Radar Padrão', sub: 'Geral', color: 'red'}, {id: 'whale', label: 'Whale Hunter', sub: 'Ticket Alto', color: 'blue'}, {id: 'crisis', label: 'Gestão de Crise', sub: 'Reputação', color: 'orange'}, {id: 'ghost', label: 'Ghost Protocol', sub: 'Sem Site', color: 'purple'}].map((m: any) => (
             <button 
                key={m.id}
                type="button"
                onClick={() => setSearchMode(m.id as SearchMode)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${searchMode === m.id ? `bg-${m.color}-600 border-${m.color}-500 text-white shadow-lg` : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
             >
                 <span className="block text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                 <span className="block text-[8px] text-white/50 mt-1">{m.sub}</span>
             </button>
          ))}
      </div>
  );

  const LeadCard = ({ lead, isArchived = false }: { lead: Lead, isArchived?: boolean }) => (
      <div className={`bg-[#0c0c0c] border ${isArchived ? 'border-blue-900/30' : 'border-white/10'} rounded-3xl flex flex-col justify-between h-full group hover:border-red-600/50 transition-all duration-300 relative overflow-hidden shadow-2xl`}>
             <div className="h-48 w-full bg-gray-900 relative overflow-hidden shrink-0">
                 {lead.photos && lead.photos.length > 0 ? (
                     <img src={`/api/photo?ref=${lead.photos[0].photo_reference}`} className={`w-full h-full object-cover transition-all duration-700 ${isArchived ? 'grayscale' : 'opacity-60 group-hover:opacity-100'}`} alt={lead.name} />
                 ) : (
                     <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center opacity-50"><Logo className="scale-75 opacity-20" /></div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/60 to-transparent"></div>
                 <div className="absolute top-4 left-4 flex gap-2">
                     {isArchived && <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1 shadow-lg">Processado</span>}
                     {lead.opening_hours?.open_now ? <span className="bg-green-500/90 text-black text-[9px] font-black px-2 py-1 rounded uppercase">Aberto</span> : <span className="bg-red-600/90 text-white text-[9px] font-black px-2 py-1 rounded uppercase">Fechado</span>}
                 </div>
                 <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 rounded-lg flex items-center gap-1">
                     <span className="text-yellow-500 text-xs">★</span><span className="text-white text-xs font-bold">{lead.rating}</span>
                 </div>
             </div>
             <div className="p-6 relative -mt-6 flex-1 flex flex-col">
                 <h3 className="text-2xl font-black text-white uppercase leading-tight line-clamp-2 mb-3 group-hover:text-red-500 transition-colors">{lead.name}</h3>
                 <div className="flex items-start gap-2 mb-4 min-h-[40px]"><LocationIcon className="w-4 h-4 text-white/30 mt-0.5 shrink-0" /><span className="text-white/60 text-xs line-clamp-2 font-medium">{lead.address}</span></div>
                 <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-4 mt-auto">
                     <button onClick={() => setSelectedLead(lead)} className="bg-white/5 hover:bg-white/10 text-red-500 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border border-red-900/30 hover:border-red-600 transition-all flex items-center gap-2">Ver Raio-X <span className="text-xs">→</span></button>
                     <div className="relative w-12 h-12 flex items-center justify-center shrink-0 ml-2">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="#222" strokeWidth="4" fill="transparent" />
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className={lead.lead_score > 70 ? 'text-green-500' : 'text-red-600'} strokeDasharray={126} strokeDashoffset={126 - (126 * lead.lead_score) / 100} />
                        </svg>
                        <span className="absolute text-sm font-black text-white">{lead.lead_score}</span>
                     </div>
                 </div>
             </div>
             <div className="grid grid-cols-2 gap-px bg-[#111] mt-auto border-t border-white/5">
                 <button onClick={() => openWhatsApp(lead)} className="col-span-1 bg-[#0c0c0c] hover:bg-[#25D366] text-[#25D366] hover:text-black py-4 flex flex-col items-center justify-center transition-all gap-1 group/btn"><PhoneIcon className="w-4 h-4 text-current mb-0.5" /><span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span></button>
                 <button onClick={() => openInstagram(lead)} className="col-span-1 bg-[#0c0c0c] hover:bg-pink-600 text-pink-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1"><InstagramIcon /><span className="text-[9px] font-black uppercase tracking-widest mt-1">{lead.website?.includes('instagram') ? 'Abrir Insta' : 'Buscar Insta'}</span></button>
                 <button onClick={() => copyPitch(lead, undefined)} className={`col-span-1 py-4 flex flex-col items-center justify-center transition-all gap-1 border-t border-white/5 ${copiedId === lead.id ? 'bg-green-600 text-white' : 'bg-[#0c0c0c] hover:bg-white text-white hover:text-black'}`}><span className="text-sm font-black">{copiedId === lead.id ? 'Copiado!' : 'Copy'}</span><span className="text-[8px] font-black uppercase tracking-widest">Pitch</span></button>
                 {isArchived ? (
                     <button onClick={() => removeFromContacted(lead.id)} className="col-span-1 bg-[#0c0c0c] hover:bg-red-600 text-red-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1 border-t border-white/5"><span className="text-sm font-black">↩</span><span className="text-[8px] font-black uppercase tracking-widest">Remover</span></button>
                 ) : (
                     <button onClick={() => markAsContacted(lead)} className="col-span-1 bg-[#0c0c0c] hover:bg-blue-600 text-blue-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1 border-t border-white/5"><span className="text-sm font-black">✓</span><span className="text-[8px] font-black uppercase tracking-widest">Arquivar</span></button>
                 )}
             </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden selection:bg-red-600 selection:text-white">
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0A0A0A]/90 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-4"><Logo className="scale-75 origin-left" /><div className="h-4 w-px bg-white/10"></div><span className="text-[10px] font-mono text-white/50 uppercase tracking-widest hidden md:inline-block">Intelligence Hub v4.4</span></div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span><span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Deep Search: ON</span></div>
            <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-500 transition-colors">Sair</button>
        </div>
      </header>

      {selectedLead && <LeadStrategyModal lead={selectedLead} onClose={() => setSelectedLead(null)} onCopyPitch={(text) => copyPitch(selectedLead, text)} onOpenWhatsapp={(text) => openWhatsApp(selectedLead, text)} customScripts={customScripts} />}

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-16 md:w-20 bg-[#080808] border-r border-white/10 flex flex-col items-center py-6 shrink-0 z-10 gap-4">
             <button onClick={() => setActiveTab('search')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${activeTab === 'search' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'text-white/40 hover:bg-white/10 hover:text-white'}`} title="Pesquisar Leads"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg></button>
             <button onClick={() => setActiveTab('contacted')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${activeTab === 'contacted' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-white/40 hover:bg-white/10 hover:text-white'}`} title="Chamados / Histórico"><div className="absolute -top-1 -right-1 w-4 h-4 bg-black border border-white/20 rounded-full flex items-center justify-center text-[8px] font-bold text-white z-10">{contactedLeads.length}</div><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg></button>
             <button onClick={() => setActiveTab('brainstorm')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${activeTab === 'brainstorm' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]' : 'text-white/40 hover:bg-white/10 hover:text-white'}`} title="War Room"><BrainIcon className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('marketing')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${activeTab === 'marketing' ? 'bg-yellow-600 text-white shadow-[0_0_20px_rgba(202,138,4,0.4)]' : 'text-white/40 hover:bg-white/10 hover:text-white'}`} title="Marketing Command"><MegaphoneIcon className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('scripts')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${activeTab === 'scripts' ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'text-white/40 hover:bg-white/10 hover:text-white'}`} title="Configurar Scripts"><ConsultingIcon /></button>
        </aside>

        <main className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden">
            {activeTab === 'search' && (
                <>
                <div className="p-6 border-b border-white/5 bg-[#050505]/95 backdrop-blur z-10 shrink-0">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="mb-6"><h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Prospecção <span className="text-red-600">Deep Dive</span></h1></div>
                        <div className="mb-4"><label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 block ml-1">Estratégia Tática</label><ModeSelector /></div>
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#0A0A0A] p-5 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="md:col-span-5 space-y-2"><label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho de Mercado</label><div className="relative"><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:border-red-600 outline-none text-base font-bold transition-all" placeholder="Ex: Estética, Hamburgueria..." /><div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div></div></div>
                            <div className="md:col-span-4 space-y-2"><label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região Alvo</label><div className="relative"><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:border-red-600 outline-none text-base font-bold transition-all" placeholder="Ex: Pinheiros, SP" /><div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><LocationIcon className="w-5 h-5 text-white/30" /></div></div></div>
                            <div className="md:col-span-3"><button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[58px] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">{isLoading ? <SpinnerIcon /> : 'EXECUTAR'}</button></div>
                        </form>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#050505]">
                    <div className="max-w-8xl mx-auto">
                        {(isLoading || debugLogs.length > 0) && (
                            <div className="mb-6 bg-black border border-white/10 rounded-xl p-3 font-mono text-[9px] text-white/60 max-h-32 overflow-y-auto custom-scrollbar shadow-inner">
                                {debugLogs.map((log, i) => <div key={i}><span className="text-green-500 mr-2">{'>'}</span>{log}</div>)}
                                <div ref={logsEndRef} />
                            </div>
                        )}
                        {!isLoading && leads.length === 0 && searchTerm && debugLogs.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-center opacity-50"><div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse"><svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div><h3 className="text-xl font-black text-white uppercase italic tracking-widest">Sistema Pronto</h3><p className="text-white/40 text-xs font-mono mt-2">Selecione uma estratégia e configure os parâmetros.</p></div>
                        )}
                        {!isLoading && leads.length > 0 && (
                            <div className="pb-20">
                                 <div className="flex justify-between items-end mb-8 px-1 border-b border-white/5 pb-4"><div className="flex items-center gap-4"><span className="text-3xl font-black text-white italic">{leads.length}</span><span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2">Oportunidades {searchMode.toUpperCase()} Encontradas</span></div></div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">{leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}</div>
                            </div>
                        )}
                    </div>
                </div>
                </>
            )}

            {activeTab === 'contacted' && (
                <div className="flex-1 flex flex-col bg-[#050505] p-6 overflow-hidden animate-in slide-in-from-right-10 duration-300">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                            <div><h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Histórico de <span className="text-blue-600">Chamados</span></h1><p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Base de Leads Processados</p></div>
                            <div className="relative w-full md:w-96"><input type="text" value={chamadosSearch} onChange={(e) => setChamadosSearch(e.target.value)} placeholder="Filtrar chamados..." className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-blue-600 outline-none text-sm font-medium" /><div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div></div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {filteredContactedLeads.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center opacity-30"><svg className="w-16 h-16 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg><p className="text-sm font-black uppercase tracking-widest">Nenhum registro encontrado</p></div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">{filteredContactedLeads.map((lead) => <LeadCard key={lead.id} lead={lead} isArchived={true} />)}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'brainstorm' && (
                <div className="flex-1 overflow-hidden h-full">
                    <StrategicWarRoom />
                </div>
            )}

            {activeTab === 'marketing' && (
                <div className="flex-1 overflow-hidden h-full">
                    <MarketingCommand />
                </div>
            )}
            
            {activeTab === 'scripts' && (
                <div className="flex-1 p-6 overflow-hidden">
                    <ScriptManager scripts={customScripts} onSave={handleSaveScripts} />
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
