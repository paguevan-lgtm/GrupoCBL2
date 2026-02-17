
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

// --- Interfaces Globais ---
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

interface AdsStrategy {
    niche: string;
    opportunity_score: number; // 0-100
    market_difficulty: 'Baixa' | 'Média' | 'Alta';
    suggested_budget: string;
    cpl_average: string; // Cost per Lead
    
    funnel_metrics: {
        traffic_potential: number; // % relative to max
        conversion_rate: string;
        estimated_leads: number;
    };

    platform_mix: {
        google: number; // %
        meta: number; // %
        tiktok: number; // %
    };

    top_keywords: string[];
    
    winning_creative: {
        headline: string;
        visual_style: string;
    };

    action_timeline: {
        day_1_7: string;
        day_8_14: string;
        day_15_30: string;
    };
}

interface CriticalAnalysis {
    score: number;
    verdict: string;
    visual_critique: string;
    copy_critique: string;
    fixed_headline: string;
    fixed_copy: string;
}

type SearchMode = 'standard' | 'deep';

const DEFAULT_SCRIPTS = {
    cold_call: "Olá, falo com o responsável pelo marketing? Vi que vocês não têm site e estão perdendo posicionamento para [Concorrente]. Nós resolvemos isso em 7 dias.",
    whatsapp_initial: "Oi [Nome], tudo bem? Aqui é do Grupo CBL. Vi seu negócio no Google e identifiquei uma oportunidade de aumentar seu faturamento com uma estrutura digital profissional. Podemos conversar?",
    follow_up: "Oi [Nome], conseguiu analisar a proposta? A oportunidade de dominar o nicho na sua região ainda está aberta.",
    objection_price: "Entendo a questão do investimento. Mas pense: quanto custa para você perder 10 clientes por mês por não passar credibilidade? Nosso site se paga com 2 vendas.",
    objection_time: "O processo é extremamente ágil. Em 7 dias entregamos a primeira versão e não tomamos seu tempo. Nós cuidamos da engenharia, você cuida do negócio."
};

// --- SUB-COMPONENTE: CRITICAL LAB ---
const CriticalLab = () => {
    const [headline, setHeadline] = useState('');
    const [copy, setCopy] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<CriticalAnalysis | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const runAnalysis = async () => {
        if (!headline && !copy && !image) {
            alert("Preencha ao menos um campo (Headline, Copy ou Imagem).");
            return;
        }
        setIsLoading(true);
        setAnalysis(null);

        const prompt = `
            ATUE COMO: Um Diretor Criativo Premiado e Sarcástico (Nível Ogilvy/Draper).
            TAREFA: Destruir e reconstruir o anúncio do usuário.
            
            ANÁLISE OS SEGUINTES DADOS:
            Headline: "${headline}"
            Copy: "${copy}"
            Imagem: [Imagem fornecida em base64]

            SEJA BRUTALMENTE HONESTO. Se a imagem for amadora, diga. Se a copy for chata, diga.
            
            SAÍDA JSON OBRIGATÓRIA:
            {
                "score": (0-100),
                "verdict": "Uma frase de impacto resumindo a qualidade (Ex: 'Isso queima dinheiro' ou 'Potencial de Ouro').",
                "visual_critique": "Análise técnica da imagem (iluminação, composição, apelo emocional). Se não tiver imagem, diga 'N/A'.",
                "copy_critique": "Análise da persuasão textual.",
                "fixed_headline": "Uma versão muito melhor da headline.",
                "fixed_copy": "A copy reescrita focada em conversão agressiva."
            }
        `;

        try {
            const payload: any = {
                model: 'gemini-3-flash-preview', // Modelo multimodal
                contents: {
                    parts: [{ text: prompt }]
                },
                config: { responseMimeType: 'application/json' }
            };

            // Adiciona imagem se houver
            if (image) {
                const base64Data = image.split(',')[1];
                payload.contents.parts.unshift({
                    inlineData: {
                        mimeType: "image/jpeg", // Assume JPEG/PNG genérico
                        data: base64Data
                    }
                });
            }

            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
            setAnalysis(JSON.parse(cleanText));

        } catch (error) {
            console.error(error);
            alert("Erro ao analisar. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6 md:p-8 gap-8">
            <div className="bg-gradient-to-r from-red-900/20 to-transparent border border-red-500/20 p-6 rounded-3xl">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center gap-2">
                    <span className="text-2xl">☠️</span> Laboratório Crítico
                </h3>
                <p className="text-white/60 text-sm max-w-2xl">
                    Envie seu criativo e sua copy. A IA vai analisar visualmente a imagem e a persuasão do texto para prever o fracasso ou sucesso antes de você gastar 1 centavo.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Headline (Título)</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all"
                            placeholder="Ex: Perca 10kg em 2 dias..."
                            value={headline}
                            onChange={e => setHeadline(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Copy (Texto do Anúncio)</label>
                        <textarea 
                            className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all h-32 resize-none"
                            placeholder="Cole o texto do seu anúncio aqui..."
                            value={copy}
                            onChange={e => setCopy(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Criativo (Imagem)</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-red-500/50 transition-all group"
                        >
                            {image ? (
                                <img src={image} alt="Preview" className="h-40 object-contain rounded-lg shadow-lg" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className="text-xs text-white/40 group-hover:text-white transition-colors">Clique para enviar imagem</span>
                                </>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                    </div>

                    <button 
                        onClick={runAnalysis}
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <SpinnerIcon /> : 'DESTRUIR MEU ANÚNCIO'}
                    </button>
                </div>

                {/* Resultado */}
                <div className="relative">
                    {!analysis && !isLoading && (
                        <div className="h-full flex items-center justify-center text-white/10 border-2 border-dashed border-white/5 rounded-2xl">
                            <span className="text-4xl font-black uppercase tracking-tighter opacity-20">Aguardando Vítima</span>
                        </div>
                    )}

                    {analysis && (
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6 animate-in slide-in-from-right-10">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <div>
                                    <span className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Veredito Final</span>
                                    <h4 className="text-xl font-bold text-white italic">"{analysis.verdict}"</h4>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4 ${analysis.score > 70 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                                    {analysis.score}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-2">Crítica Visual</span>
                                    <p className="text-white/80 text-xs leading-relaxed">{analysis.visual_critique}</p>
                                </div>
                                <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-2">Crítica de Texto</span>
                                    <p className="text-white/80 text-xs leading-relaxed">{analysis.copy_critique}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <div>
                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest block mb-1">Headline Corrigida</span>
                                    <div className="bg-green-900/10 border border-green-500/20 p-3 rounded-lg text-white font-bold text-sm">
                                        {analysis.fixed_headline}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest block mb-1">Copy Otimizada</span>
                                    <div className="bg-green-900/10 border border-green-500/20 p-3 rounded-lg text-white/80 text-xs whitespace-pre-wrap leading-relaxed">
                                        {analysis.fixed_copy}
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

// --- SUB-COMPONENTE: MARKETING GENERATOR (ATUALIZADO - VISUAL MOBILE APP) ---
const MarketingGenerator = () => {
    const [niche, setNiche] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [strategy, setStrategy] = useState<AdsStrategy | null>(null);

    const generateStrategy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!niche) return;

        setIsLoading(true);
        setStrategy(null);

        const prompt = `
            Atue como um Gestor de Tráfego de Elite.
            Nicho: ${niche}

            Gere uma estratégia visual de alto impacto baseada neste nicho.
            Como o usuário não informou budget, SUGIRA o budget ideal para começar.
            
            JSON ESTRITO:
            {
                "niche": "${niche}",
                "opportunity_score": (0-100),
                "market_difficulty": "Baixa" | "Média" | "Alta",
                "suggested_budget": "R$ X.XXX",
                "cpl_average": "R$ XX,XX",
                "funnel_metrics": {
                    "traffic_potential": (0-100 - porcentagem relativa),
                    "conversion_rate": "X%",
                    "estimated_leads": (numero inteiro estimado com base no budget sugerido)
                },
                "platform_mix": {
                    "google": (0-100),
                    "meta": (0-100),
                    "tiktok": (0-100)
                },
                "top_keywords": ["kw1", "kw2", "kw3", "kw4"],
                "winning_creative": {
                    "headline": "Uma headline curta e impactante",
                    "visual_style": "Descrição do estilo visual (ex: Vídeo UGC, Imagem Clean)"
                },
                "action_timeline": {
                    "day_1_7": "Ação concreta semana 1",
                    "day_8_14": "Ação concreta semana 2",
                    "day_15_30": "Ação concreta escala"
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
            setStrategy(JSON.parse(data.text));
        } catch (e) {
            console.error(e);
            alert("Erro na geração.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#0A0A0A]">
            {!strategy ? (
                // --- TELA DE INPUT (Minimalista) ---
                <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in">
                    <div className="w-full max-w-md space-y-10 text-center relative">
                        {/* Glow de fundo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-[#111] border border-white/10 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-red-900/20 mb-6">
                                <MegaphoneIcon className="w-10 h-10 text-red-600" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                                Target <span className="text-red-600">Locked.</span>
                            </h2>
                            <p className="text-white/40 text-xs mt-2 font-mono uppercase tracking-[0.2em]">
                                Defina seu alvo. A IA calcula a rota.
                            </p>
                        </div>

                        <form onSubmit={generateStrategy} className="relative z-10 space-y-4">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="Digite o Nicho (ex: Hamburgueria)" 
                                    className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-5 text-center text-white text-lg font-bold focus:border-red-600 focus:bg-[#151515] outline-none transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] placeholder-white/20"
                                    value={niche}
                                    onChange={e => setNiche(e.target.value)}
                                    autoFocus
                                />
                                <div className="absolute inset-0 rounded-2xl bg-red-600/20 blur opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading || !niche}
                                className="w-full bg-white text-black hover:bg-gray-200 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon /> CALCULANDO VARIÁVEIS...
                                    </>
                                ) : 'GERAR ESTRATÉGIA'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                // --- TELA DE RESULTADO (Estilo Mobile App Financeiro) ---
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Header: Score Card */}
                        <div className="relative bg-gradient-to-br from-[#151515] to-[#0c0c0c] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] pointer-events-none"></div>
                            
                            <div className="flex justify-between items-start relative z-10">
                                <button onClick={() => setStrategy(null)} className="text-white/30 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-4">
                                    ← Novo Alvo
                                </button>
                                <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold text-white/60 uppercase tracking-widest">
                                    Dificuldade: <span className={strategy.market_difficulty === 'Alta' ? 'text-red-500' : (strategy.market_difficulty === 'Média' ? 'text-yellow-500' : 'text-green-500')}>{strategy.market_difficulty}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                                <div>
                                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-1">{strategy.niche}</h1>
                                    <p className="text-white/40 text-xs font-mono mb-6">Relatório de Inteligência de Mercado</p>
                                    
                                    <div className="flex gap-4">
                                        <div className="bg-black/30 rounded-xl p-3 border border-white/5 backdrop-blur-md">
                                            <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-1">Budget Sugerido</span>
                                            <span className="text-lg font-black text-white">{strategy.suggested_budget}</span>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-3 border border-white/5 backdrop-blur-md">
                                            <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-1">CPL Médio</span>
                                            <span className="text-lg font-black text-green-500">{strategy.cpl_average}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Radial Gauge Visual */}
                                <div className="flex justify-center md:justify-end">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="64" cy="64" r="60" stroke="#333" strokeWidth="8" fill="transparent" />
                                            <circle cx="64" cy="64" r="60" stroke="#ef4444" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * strategy.opportunity_score) / 100} strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-3xl font-black text-white">{strategy.opportunity_score}</span>
                                            <span className="text-[8px] uppercase tracking-widest text-white/40">Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Funnel Visual */}
                            <div className="md:col-span-2 bg-[#111] border border-white/10 rounded-[2rem] p-6 flex flex-col">
                                <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <TargetIcon className="w-4 h-4" /> Projeção de Funil
                                </h3>
                                <div className="flex-1 flex flex-col justify-center space-y-3">
                                    {/* Topo */}
                                    <div className="w-full bg-white/5 rounded-r-xl h-10 flex items-center px-4 relative group">
                                        <div className="absolute left-0 top-0 bottom-0 bg-blue-600/20 rounded-r-xl transition-all duration-1000" style={{ width: `${strategy.funnel_metrics.traffic_potential}%` }}></div>
                                        <span className="relative z-10 text-[10px] font-bold text-white uppercase tracking-widest flex justify-between w-full">
                                            <span>Tráfego (Impressões)</span>
                                            <span>Alto Volume</span>
                                        </span>
                                    </div>
                                    {/* Meio */}
                                    <div className="w-[60%] bg-white/5 rounded-r-xl h-10 flex items-center px-4 relative group">
                                        <div className="absolute left-0 top-0 bottom-0 bg-purple-600/20 rounded-r-xl w-full"></div>
                                        <span className="relative z-10 text-[10px] font-bold text-white uppercase tracking-widest flex justify-between w-full">
                                            <span>Cliques</span>
                                            <span>CTR Otimizado</span>
                                        </span>
                                    </div>
                                    {/* Fundo */}
                                    <div className="w-[30%] bg-white/5 rounded-r-xl h-10 flex items-center px-4 relative group">
                                        <div className="absolute left-0 top-0 bottom-0 bg-green-600/20 rounded-r-xl w-full"></div>
                                        <span className="relative z-10 text-[10px] font-bold text-white uppercase tracking-widest flex justify-between w-full">
                                            <span>Leads: {strategy.funnel_metrics.estimated_leads}</span>
                                            <span className="text-green-400">{strategy.funnel_metrics.conversion_rate}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Platform Mix (Vertical Bars) */}
                            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 flex flex-col">
                                <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-6">Mix de Mídia</h3>
                                <div className="flex-1 flex items-end justify-center gap-4">
                                    <div className="flex flex-col items-center gap-2 group w-1/3">
                                        <span className="text-[10px] font-bold text-white">{strategy.platform_mix.google}%</span>
                                        <div className="w-full bg-blue-500/20 rounded-t-xl relative overflow-hidden group-hover:bg-blue-500/30 transition-colors" style={{ height: `${strategy.platform_mix.google * 1.5}px` }}>
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                                        </div>
                                        <span className="text-[8px] uppercase tracking-widest text-white/40">Google</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 group w-1/3">
                                        <span className="text-[10px] font-bold text-white">{strategy.platform_mix.meta}%</span>
                                        <div className="w-full bg-purple-500/20 rounded-t-xl relative overflow-hidden group-hover:bg-purple-500/30 transition-colors" style={{ height: `${strategy.platform_mix.meta * 1.5}px` }}>
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
                                        </div>
                                        <span className="text-[8px] uppercase tracking-widest text-white/40">Meta</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 group w-1/3">
                                        <span className="text-[10px] font-bold text-white">{strategy.platform_mix.tiktok}%</span>
                                        <div className="w-full bg-pink-500/20 rounded-t-xl relative overflow-hidden group-hover:bg-pink-500/30 transition-colors" style={{ height: `${strategy.platform_mix.tiktok * 1.5}px` }}>
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"></div>
                                        </div>
                                        <span className="text-[8px] uppercase tracking-widest text-white/40">TikTok</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Creative & Keywords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6">
                                <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-4">Keywords Alpha</h3>
                                <div className="flex flex-wrap gap-2">
                                    {strategy.top_keywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/10 hover:border-red-500/30 transition-all cursor-default">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-6 opacity-10">
                                    <MegaphoneIcon className="w-16 h-16" />
                                </div>
                                <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-4">Diretriz Criativa</h3>
                                <div className="space-y-3 relative z-10">
                                    <div>
                                        <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest">Headline Vencedora</span>
                                        <p className="text-white font-bold italic text-lg leading-tight">"{strategy.winning_creative.headline}"</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Estilo Visual</span>
                                        <p className="text-white/60 text-xs">{strategy.winning_creative.visual_style}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Vertical (Action Plan) */}
                        <div className="bg-[#0e0e0e] border border-white/10 rounded-[2.5rem] p-8">
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-8 text-center">Protocolo de Execução</h3>
                            <div className="relative space-y-8 pl-4">
                                {/* Linha Vertical */}
                                <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-600 via-white/10 to-transparent"></div>

                                {[
                                    { period: "Dia 1-7", title: "Setup & Teste A/B", desc: strategy.action_timeline.day_1_7, color: "bg-red-600" },
                                    { period: "Dia 8-14", title: "Otimização", desc: strategy.action_timeline.day_8_14, color: "bg-white" },
                                    { period: "Dia 15-30", title: "Escala", desc: strategy.action_timeline.day_15_30, color: "bg-green-500" }
                                ].map((step, i) => (
                                    <div key={i} className="relative pl-10 group">
                                        <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full ${step.color} border-4 border-[#0e0e0e] z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
                                        <div className="bg-[#151515] border border-white/5 p-5 rounded-2xl group-hover:border-white/10 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-sm font-black text-white uppercase tracking-wide">{step.title}</h4>
                                                <span className="text-[9px] text-white/30 font-mono uppercase tracking-widest">{step.period}</span>
                                            </div>
                                            <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

// Define StrategicWarRoom component
const StrategicWarRoom = () => {
    const [notes, setNotes] = useState('');
    
    return (
        <div className="flex flex-col h-full bg-[#0A0A0A] p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-600/10 rounded-xl border border-red-600/20">
                    <BrainIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">War Room</h2>
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Centro de Estratégia & Anotações</p>
                </div>
            </div>
            
            <div className="flex-1 bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Digite suas ideias, estratégias de ataque ao mercado e rascunhos aqui..."
                    className="w-full h-full bg-transparent border-none outline-none text-white/80 font-mono text-sm resize-none custom-scrollbar"
                />
                <div className="absolute bottom-4 right-4 text-[10px] text-white/20 font-black uppercase tracking-widest pointer-events-none">
                    CBL TACTICAL NOTES
                </div>
            </div>
        </div>
    );
};

// Define ScriptManager component
const ScriptManager = ({ scripts, onSave }: { scripts: typeof DEFAULT_SCRIPTS, onSave: (s: typeof DEFAULT_SCRIPTS) => void }) => {
    const [localScripts, setLocalScripts] = useState(scripts);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (key: keyof typeof DEFAULT_SCRIPTS, value: string) => {
        setLocalScripts({ ...localScripts, [key]: value });
        setHasChanges(true);
    };

    const handleSave = () => {
        onSave(localScripts);
        setHasChanges(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#0A0A0A] overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-[#0c0c0c] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <ConsultingIcon className="w-6 h-6 text-white/60" />
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Protocolos de Venda</h2>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={!hasChanges}
                    className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Salvar Alterações
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {Object.entries(localScripts).map(([key, value]) => (
                    <div key={key} className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-3">
                        <label className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {key.replace(/_/g, ' ')}
                        </label>
                        <textarea 
                            value={value}
                            onChange={(e) => handleChange(key as keyof typeof DEFAULT_SCRIPTS, e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white/80 text-sm leading-relaxed focus:border-white/30 outline-none transition-all min-h-[100px] resize-y font-light"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Define LeadStrategyModal component
const LeadStrategyModal = ({ lead, onClose, customScripts, onCopyPitch, onOpenWhatsapp }: { 
    lead: Lead, 
    onClose: () => void, 
    customScripts: typeof DEFAULT_SCRIPTS,
    onCopyPitch: (text: string) => void,
    onOpenWhatsapp: (text: string) => void
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full max-w-5xl h-[90vh] bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 md:p-8 border-b border-white/10 bg-[#111] flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{lead.name}</h2>
                             <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white/60 uppercase tracking-widest">{lead.business_status || 'Operacional'}</div>
                        </div>
                        <p className="text-white/40 text-sm font-mono flex items-center gap-2">
                            <LocationIcon className="w-4 h-4" /> {lead.address}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Coluna Esquerda: Dados do Lead */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* Score Card */}
                            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <TargetIcon className="w-20 h-20" />
                                </div>
                                <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Lead Score</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-6xl font-black text-white leading-none">{lead.lead_score}</span>
                                    <span className="text-xl font-bold text-white/20 mb-1">/100</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-red-600 to-green-500" style={{ width: `${lead.lead_score}%` }}></div>
                                </div>
                            </div>

                            {/* Detalhes */}
                            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 space-y-4">
                                <div>
                                    <span className="block text-[9px] text-white/40 uppercase tracking-widest mb-1">Status Web</span>
                                    <div className={`flex items-center gap-2 font-bold uppercase tracking-wide text-sm ${lead.status_site === 'sem_site' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        <span className={`w-2 h-2 rounded-full ${lead.status_site === 'sem_site' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                        {lead.status_site === 'sem_site' ? 'Sem Presença Digital' : 'Site Desatualizado'}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[9px] text-white/40 uppercase tracking-widest mb-1">Contato</span>
                                    <div className="text-white font-mono text-lg">{lead.phone || 'Não disponível'}</div>
                                </div>
                                {lead.website && (
                                    <div>
                                        <span className="block text-[9px] text-white/40 uppercase tracking-widest mb-1">Website Atual</span>
                                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate block">{lead.website}</a>
                                    </div>
                                )}
                            </div>

                            {/* Foto */}
                            {lead.photos && lead.photos[0] && (
                                <div className="rounded-2xl overflow-hidden border border-white/10 h-48 relative">
                                    <img src={`/api/photo?ref=${lead.photos[0].photo_reference}`} className="w-full h-full object-cover" alt="Place" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Visualização do Local</span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Coluna Direita: Scripts & Ação */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <ZapIcon className="w-4 h-4 text-green-500" /> Ações Imediatas
                                </h3>
                                
                                <div className="space-y-6">
                                    {/* WhatsApp Action */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Script WhatsApp (Primeiro Contato)</span>
                                            <button onClick={() => onCopyPitch(customScripts.whatsapp_initial.replace('[Nome]', lead.name))} className="text-[9px] text-white/30 hover:text-white uppercase tracking-widest transition-colors">Copiar</button>
                                        </div>
                                        <div className="bg-[#050505] p-4 rounded-xl text-white/70 text-sm border border-white/5 font-light leading-relaxed">
                                            {customScripts.whatsapp_initial.replace('[Nome]', lead.name)}
                                        </div>
                                        <button 
                                            onClick={() => onOpenWhatsapp(customScripts.whatsapp_initial.replace('[Nome]', lead.name))}
                                            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                                        >
                                            <PhoneIcon className="w-4 h-4" /> Iniciar Conversa no WhatsApp
                                        </button>
                                    </div>

                                    {/* Cold Call Action */}
                                    <div className="space-y-2 pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Script Cold Call (Telefone)</span>
                                            <button onClick={() => onCopyPitch(customScripts.cold_call)} className="text-[9px] text-white/30 hover:text-white uppercase tracking-widest transition-colors">Copiar</button>
                                        </div>
                                        <div className="bg-[#050505] p-4 rounded-xl text-white/70 text-sm border border-white/5 font-light leading-relaxed">
                                            {customScripts.cold_call}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL (ADMIN DASHBOARD) ---
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'contacted' | 'scripts' | 'brainstorm' | 'marketing'>('search');
  const [marketingSubTab, setMarketingSubTab] = useState<'generator' | 'critical'>('generator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customScripts, setCustomScripts] = useState<typeof DEFAULT_SCRIPTS>(DEFAULT_SCRIPTS);
  
  // States para Search
  const [searchMode, setSearchMode] = useState<SearchMode>('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // States para Contacted
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  const [chamadosSearch, setChamadosSearch] = useState('');

  // Loaders
  useEffect(() => {
      const savedScripts = localStorage.getItem('cbl_custom_scripts');
      if (savedScripts) setCustomScripts(JSON.parse(savedScripts));
      
      const savedLeads = localStorage.getItem('cbl_contacted_leads');
      if (savedLeads) setContactedLeads(JSON.parse(savedLeads));
  }, []);

  useEffect(() => { localStorage.setItem('cbl_contacted_leads', JSON.stringify(contactedLeads)); }, [contactedLeads]);

  // Helpers
  const handleSaveScripts = (newScripts: typeof DEFAULT_SCRIPTS) => {
      setCustomScripts(newScripts);
      localStorage.setItem('cbl_custom_scripts', JSON.stringify(newScripts));
      alert("Scripts salvos!");
  };

  const markAsContacted = (lead: Lead) => {
      setContactedLeads([ { ...lead, contactedAt: new Date().toISOString() }, ...contactedLeads ]);
      setLeads(leads.filter(l => l.id !== lead.id));
      setSelectedLead(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchTerm || !location) return;
      setIsLoading(true);
      setLeads([]);
      
      // Simulação de delay para UX (na vida real chamaria API)
      try {
          const response = await fetch('/api/places', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: `${searchTerm} in ${location}` })
          });
          const data = await response.json();
          // Mapper simples
          const mapped = (data.results || []).map((p: any) => ({
              id: p.place_id,
              name: p.name,
              address: p.formatted_address,
              rating: p.rating || 0,
              user_ratings_total: p.user_ratings_total || 0,
              website: p.website,
              phone: p.formatted_phone_number,
              lead_score: Math.floor(Math.random() * 40) + 60, // Fake score for demo
              status_site: p.website ? 'com_site' : 'sem_site',
              place_id: p.place_id,
              types: p.types || [],
              business_status: p.business_status,
              photos: p.photos
          }));
          setLeads(mapped);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const filteredContacted = contactedLeads.filter(l => l.name.toLowerCase().includes(chamadosSearch.toLowerCase()));

  // Sub-Components de Navegação
  const NavButton = ({ tab, icon, label }: any) => (
      <button 
        onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === tab ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10' : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'}`}
      >
          <div className={`p-2 rounded-lg transition-colors ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>{icon}</div>
          <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </button>
  );

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row overflow-hidden relative selection:bg-red-600 selection:text-white">
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-50 shrink-0">
          <Logo className="scale-75 origin-left" />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">{isSidebarOpen ? <XIcon /> : <MenuIcon className="w-6 h-6" />}</button>
      </div>

      {/* Sidebar Overlay */}
      <div className={`fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 top-0 left-0 h-full w-72 bg-[#080808] border-r border-white/10 flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-8 hidden md:block border-b border-white/5"><Logo className="scale-90 origin-left" /></div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <NavButton tab="search" icon={<TargetIcon className="w-5 h-5" />} label="Prospecção" />
              <NavButton tab="contacted" icon={<PhoneIcon className="w-5 h-5" />} label="Histórico" />
              <NavButton tab="brainstorm" icon={<BrainIcon className="w-5 h-5" />} label="War Room" />
              <NavButton tab="marketing" icon={<MegaphoneIcon className="w-5 h-5" />} label="Marketing" />
              <NavButton tab="scripts" icon={<ConsultingIcon className="w-5 h-5" />} label="Scripts" />
          </div>
          <div className="p-6 border-t border-white/5">
              <button onClick={onLogout} className="w-full text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-red-500 transition-colors flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-white/5"><XIcon /> Encerrar Sessão</button>
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111] to-[#050505]">
          
          {/* Desktop Header */}
          <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Sistema Operacional CBL v4.5</span>
              </div>
              <div className="flex items-center gap-4"><div className="px-3 py-1 rounded border border-white/10 bg-white/5"><span className="text-[9px] font-bold text-white/50">Ping: 12ms</span></div></div>
          </header>

          <div className="flex-1 overflow-hidden relative">
              {/* --- SEARCH TAB --- */}
              {activeTab === 'search' && (
                  <div className="h-full flex flex-col">
                      <div className="p-6 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md z-10 shrink-0">
                          <div className="max-w-7xl mx-auto w-full">
                              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-6">Prospecção <span className="text-red-600">Tática</span></h1>
                              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#0A0A0A] p-5 rounded-3xl border border-white/10 shadow-2xl">
                                  <div className="md:col-span-5 space-y-2">
                                      <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho</label>
                                      <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-600 outline-none text-sm font-bold" placeholder="Ex: Hamburgueria" />
                                  </div>
                                  <div className="md:col-span-4 space-y-2">
                                      <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região</label>
                                      <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-600 outline-none text-sm font-bold" placeholder="Ex: Jardins, SP" />
                                  </div>
                                  <div className="md:col-span-3">
                                      <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all h-[54px] flex items-center justify-center">
                                          {isLoading ? <SpinnerIcon /> : 'BUSCAR ALVOS'}
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#050505]">
                          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                              {leads.map(lead => (
                                  <div key={lead.id} className="bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden group hover:border-red-600/50 transition-all shadow-2xl flex flex-col h-full">
                                      <div className="h-40 bg-gray-900 relative">
                                          {lead.photos && lead.photos.length > 0 ? (
                                              <img src={`/api/photo?ref=${lead.photos[0].photo_reference}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt={lead.name} />
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center bg-white/5"><Logo className="scale-50 opacity-20" /></div>
                                          )}
                                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent"></div>
                                          <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-bold text-yellow-500 flex gap-1 items-center">★ {lead.rating}</div>
                                      </div>
                                      <div className="p-5 flex-1 flex flex-col">
                                          <h3 className="text-xl font-black text-white uppercase leading-tight mb-2 group-hover:text-red-500 transition-colors line-clamp-1">{lead.name}</h3>
                                          <p className="text-white/50 text-xs mb-4 line-clamp-2 min-h-[2.5em]">{lead.address}</p>
                                          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                              <button onClick={() => setSelectedLead(lead)} className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-white border border-red-900/30 px-3 py-1.5 rounded hover:bg-red-600 transition-all">Ver Raio-X</button>
                                              <span className="text-2xl font-black text-white/20">{lead.lead_score}</span>
                                          </div>
                                      </div>
                                      <button onClick={() => markAsContacted(lead)} className="w-full bg-white/5 hover:bg-blue-600 text-blue-500 hover:text-white py-3 text-[9px] font-black uppercase tracking-widest transition-all">Arquivar</button>
                                  </div>
                              ))}
                              {!isLoading && leads.length === 0 && <div className="col-span-full text-center py-20 text-white/20 uppercase tracking-widest text-xs">Nenhum alvo detectado</div>}
                          </div>
                      </div>
                  </div>
              )}

              {/* --- CONTACTED TAB --- */}
              {activeTab === 'contacted' && (
                  <div className="h-full flex flex-col p-6 overflow-hidden">
                      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-6 shrink-0">
                              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Histórico</h1>
                              <input type="text" value={chamadosSearch} onChange={e => setChamadosSearch(e.target.value)} placeholder="Filtrar..." className="bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-600" />
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                              {filteredContacted.map(lead => (
                                  <div key={lead.id} className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-5 flex flex-col opacity-60 hover:opacity-100 transition-all">
                                      <div className="flex justify-between items-start mb-4">
                                          <h3 className="font-bold text-white text-lg">{lead.name}</h3>
                                          <span className="text-[9px] bg-blue-900/20 text-blue-400 px-2 py-1 rounded uppercase tracking-widest">Contatado</span>
                                      </div>
                                      <p className="text-white/40 text-xs mb-4 line-clamp-1">{lead.address}</p>
                                      <button className="mt-auto w-full border border-white/10 text-white/40 hover:text-white py-2 rounded text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all">Ver Detalhes</button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {/* --- BRAINSTORM / WAR ROOM TAB --- */}
              {activeTab === 'brainstorm' && <StrategicWarRoom />}

              {/* --- MARKETING TAB --- */}
              {activeTab === 'marketing' && (
                  <div className="flex flex-col h-full">
                      <div className="flex border-b border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md shrink-0">
                          <button onClick={() => setMarketingSubTab('generator')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${marketingSubTab === 'generator' ? 'border-red-600 text-white bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>Gerador</button>
                          <button onClick={() => setMarketingSubTab('critical')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${marketingSubTab === 'critical' ? 'border-red-600 text-white bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>Lab Crítico</button>
                      </div>
                      <div className="flex-1 overflow-hidden relative">
                          {marketingSubTab === 'generator' ? <MarketingGenerator /> : <CriticalLab />}
                      </div>
                  </div>
              )}

              {/* --- SCRIPTS TAB --- */}
              {activeTab === 'scripts' && <ScriptManager scripts={customScripts} onSave={handleSaveScripts} />}
          </div>
      </main>

      {/* Modal Raio-X */}
      {selectedLead && (
          <LeadStrategyModal 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)} 
            customScripts={customScripts} 
            onCopyPitch={(txt) => navigator.clipboard.writeText(txt)} 
            onOpenWhatsapp={(txt) => window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`)} 
          />
      )}
    </div>
  );
};

export default AdminDashboard;
