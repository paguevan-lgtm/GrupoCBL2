
import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';
import { ZapIcon } from './icons/ZapIcon';

const FormField = ({ label, placeholder, name, value, onChange, type = 'text', isTextArea = false }: any) => (
    <div className="space-y-1.5 group">
        <label htmlFor={name} className="block text-[10px] font-black text-red-600 uppercase tracking-[0.2em] group-focus-within:text-white transition-colors">{label}</label>
        {isTextArea ? (
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all h-20 resize-none text-sm"
            />
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all text-sm"
            />
        )}
    </div>
);

interface AnalysisData {
    company: string;
    summary: string;
    score: number;
    kpis: {
        label: string;
        value: string;
        status: 'good' | 'warning' | 'critical';
        analysis: string;
    }[];
    bottlenecks: {
        title: string;
        description: string;
        severity: 'high' | 'medium';
    }[];
    action_plan: string[];
}

const StructuredResultView = ({ result, onRestart }: { result: AnalysisData, onRestart: () => void }) => {
    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col h-full w-full overflow-hidden">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">Parecer Técnico</h3>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{result.company}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl p-3 w-20">
                         <span className="text-[8px] uppercase tracking-widest text-white/50">Score</span>
                         <span className={`text-2xl font-black italic ${result.score > 70 ? 'text-green-500' : (result.score > 40 ? 'text-yellow-500' : 'text-red-600')}`}>
                             {result.score}
                         </span>
                    </div>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                    
                    {/* Summary Box */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                            Resumo Executivo
                        </h4>
                        <p className="text-white/80 text-sm leading-relaxed font-light">{result.summary}</p>
                    </div>

                    {/* KPIs Grid */}
                    <div>
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Métricas Críticas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.kpis.map((kpi, idx) => (
                                <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{kpi.label}</span>
                                        <div className={`w-2 h-2 rounded-full ${kpi.status === 'good' ? 'bg-green-500' : (kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-600')}`}></div>
                                    </div>
                                    <div className="text-lg font-black text-white mb-2">{kpi.value}</div>
                                    <p className="text-xs text-white/40 leading-snug">{kpi.analysis}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottlenecks (Gargalos) */}
                    <div>
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Gargalos Identificados</h4>
                        <div className="space-y-3">
                            {result.bottlenecks.map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border flex gap-4 ${item.severity === 'high' ? 'bg-red-900/10 border-red-900/30' : 'bg-yellow-900/10 border-yellow-900/30'}`}>
                                    <div className={`mt-1 shrink-0 ${item.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h5 className={`font-bold text-sm mb-1 ${item.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>{item.title}</h5>
                                        <p className="text-xs text-white/70 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                     {/* Action Plan */}
                     <div>
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Plano de Ação Sugerido</h4>
                        <div className="bg-[#0A0A0A] rounded-xl border border-white/5 p-1">
                            {result.action_plan.map((step, idx) => (
                                <div key={idx} className="flex gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-[10px] font-black text-white shrink-0">
                                        {idx + 1}
                                    </span>
                                    <p className="text-sm text-white/80 font-light">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                
                <div className="mt-6 flex flex-col md:flex-row gap-4 shrink-0 pt-4 border-t border-white/5">
                    <a href="https://wa.me/13997744720" target="_blank" rel="noopener noreferrer" className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black text-xs text-center uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 hover:scale-[1.02] flex items-center justify-center gap-2">
                        <ZapIcon className="w-4 h-4" />
                        Implementar Soluções
                    </a>
                    <button onClick={onRestart} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-black text-xs uppercase hover:bg-white/10 transition-all tracking-widest hover:border-white/40">Nova Auditoria</button>
                </div>
            </div>
        </div>
    );
};

const DiagnosticModal: React.FC<{ isOpen: boolean; onClose: () => void; onShowToast?: (msg: string, type: 'success'|'error') => void }> = ({ isOpen, onClose, onShowToast }) => {
    const [view, setView] = useState('form');
    const [formData, setFormData] = useState({
        nome: '',
        instagram: '',
        site: '',
        whatsapp: '',
        faturamento: '',
        objetivo: '',
        investimentoAds: '',
        concorrente: '',
        processoVenda: '',
        dificuldade: ''
    });
    const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!formData.nome || !formData.whatsapp) {
            onShowToast?.("Preencha ao menos Nome e WhatsApp.", "error");
            return;
        }

        setView('loading');

        // Structured JSON prompt
        const prompt = `
            Atue como um Consultor Sênior de Estratégia Digital do Grupo CBL.
            Analise estes dados: ${JSON.stringify(formData)}.
            
            Gere um JSON estrito com a seguinte estrutura (sem markdown, apenas JSON cru):
            {
                "company": "${formData.nome}",
                "summary": "Um parágrafo curto (max 30 palavras) direto e impactante sobre o estado atual.",
                "score": (número de 0 a 100 baseada na saúde digital),
                "kpis": [
                    { "label": "Nome do KPI", "value": "Valor Estimado/Real", "status": "good/warning/critical", "analysis": "Explicação curta" }
                ],
                "bottlenecks": [
                    { "title": "Nome do Problema", "description": "Explicação do impacto", "severity": "high/medium" }
                ],
                "action_plan": [
                    "Ação 1 curta", "Ação 2 curta", "Ação 3 curta"
                ]
            }
            Seja incisivo, use termos de 'growth hacking' e vendas.
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

            if (!response.ok) throw new Error('Falha na conexão com o servidor de auditoria');

            const data = await response.json();
            const parsedData = JSON.parse(data.text);
            
            setAnalysisResult(parsedData);
            setView('result');
            onShowToast?.("Diagnóstico concluído com sucesso.", "success");
        } catch (err) {
            console.error(err);
            onShowToast?.("Erro ao processar auditoria. Tente novamente.", "error");
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 md:p-6" onClick={onClose}>
            <div 
                className="bg-[#0c0c0c] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white transition-all z-20 bg-black/50 rounded-full p-2 hover:bg-white/10"><XIcon /></button>
                
                {view === 'form' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="p-6 md:p-8 text-center space-y-2 shrink-0 border-b border-white/5 bg-[#0c0c0c] z-10">
                            <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">Auditoria Estratégica</h2>
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Protocolo de Análise High-End CBL</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Nome do Empreendimento *" name="nome" value={formData.nome} onChange={(e:any) => setFormData({...formData, nome: e.target.value})} placeholder="Ex: CBL Incorporadora" />
                                <FormField label="WhatsApp Comercial *" name="whatsapp" value={formData.whatsapp} onChange={(e:any) => setFormData({...formData, whatsapp: e.target.value})} placeholder="(00) 00000-0000" />
                                <FormField label="Link do Instagram" name="instagram" value={formData.instagram} onChange={(e:any) => setFormData({...formData, instagram: e.target.value})} placeholder="@seuperfil" />
                                <FormField label="Link do Site ou Google" name="site" value={formData.site} onChange={(e:any) => setFormData({...formData, site: e.target.value})} placeholder="https://..." />
                                
                                <div className="md:col-span-2 pt-4 pb-1 border-b border-white/5 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Performance & Métricas</span>
                                </div>

                                <FormField label="Faturamento Médio Mensal" name="faturamento" value={formData.faturamento} onChange={(e:any) => setFormData({...formData, faturamento: e.target.value})} placeholder="R$ 0,00" />
                                <FormField label="Objetivo de Faturamento" name="objetivo" value={formData.objetivo} onChange={(e:any) => setFormData({...formData, objetivo: e.target.value})} placeholder="R$ 0,00" />
                                <FormField label="Investimento em Ads/Mês" name="investimentoAds" value={formData.investimentoAds} onChange={(e:any) => setFormData({...formData, investimentoAds: e.target.value})} placeholder="R$ 0,00" />
                                <FormField label="Principal Concorrente" name="concorrente" value={formData.concorrente} onChange={(e:any) => setFormData({...formData, concorrente: e.target.value})} placeholder="Nome do concorrente" />
                                
                                <div className="md:col-span-2">
                                    <FormField label="Processo de Venda Atual" name="processoVenda" value={formData.processoVenda} onChange={(e:any) => setFormData({...formData, processoVenda: e.target.value})} isTextArea={true} placeholder="Como as vendas acontecem hoje?" />
                                </div>
                                <div className="md:col-span-2">
                                    <FormField label="Maior Dificuldade Atual" name="dificuldade" value={formData.dificuldade} onChange={(e:any) => setFormData({...formData, dificuldade: e.target.value})} isTextArea={true} placeholder="O que trava seu crescimento?" />
                                </div>
                            </div>
                            
                            <div className="pt-4 pb-2">
                                <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs md:text-sm tracking-[0.3em] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20 active:scale-[0.98] group">
                                    Solicitar Parecer Técnico
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {view === 'loading' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
                        <div className="relative">
                           <SpinnerIcon />
                           <div className="absolute inset-0 bg-red-600/20 blur-xl animate-pulse"></div>
                        </div>
                        <div className="space-y-4 max-w-sm mx-auto">
                            <p className="text-white font-black text-xl md:text-2xl uppercase italic animate-pulse tracking-tighter">Cruzando Dados...</p>
                            
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 w-1/2 animate-[shimmer_2s_infinite]"></div>
                            </div>
                            
                            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.4em]">Engenharia CBL em Processamento</p>
                        </div>
                        <style>{`
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(200%); }
                            }
                        `}</style>
                    </div>
                )}
                
                {view === 'result' && analysisResult && <StructuredResultView result={analysisResult} onRestart={() => setView('form')} />}
            </div>
        </div>
    );
};

export default DiagnosticModal;
