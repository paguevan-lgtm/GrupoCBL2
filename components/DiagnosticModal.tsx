
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
        <div className="flex flex-col h-full w-full overflow-hidden bg-[#0A0A0A]">
            <div className="p-6 md:p-8 flex flex-col h-full w-full overflow-hidden">
                {/* Header do Relatório */}
                <div className="flex justify-between items-start mb-8 shrink-0 border-b border-white/5 pb-6">
                    <div>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-2 block">Relatório Técnico</span>
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">{result.company}</h3>
                        <p className="text-xs text-white/40 mt-1 font-light">Análise de Maturidade Digital & Performance</p>
                    </div>
                    <div className="flex flex-col items-end">
                         <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                    className={`${result.score > 70 ? 'text-green-500' : (result.score > 40 ? 'text-yellow-500' : 'text-red-600')}`}
                                    strokeDasharray={226}
                                    strokeDashoffset={226 - (226 * result.score) / 100}
                                />
                            </svg>
                            <span className="absolute text-2xl font-black text-white">{result.score}</span>
                         </div>
                         <span className="text-[9px] uppercase tracking-widest text-white/30 mt-1">Score Digital</span>
                    </div>
                </div>
                
                {/* Área de Conteúdo Scrollável */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                    
                    {/* Resumo Executivo */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                        <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">Diagnóstico Executivo</h4>
                        <p className="text-white/90 text-sm md:text-base leading-relaxed font-light">{result.summary}</p>
                    </div>

                    {/* KPIs Grid */}
                    <div>
                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-600 rounded-full"></span> Indicadores Chave
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.kpis.map((kpi, idx) => (
                                <div key={idx} className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">{kpi.label}</span>
                                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                            kpi.status === 'good' ? 'bg-green-500/10 text-green-500' : 
                                            (kpi.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-600/10 text-red-500')
                                        }`}>
                                            {kpi.status === 'good' ? 'Otimizado' : (kpi.status === 'warning' ? 'Atenção' : 'Crítico')}
                                        </div>
                                    </div>
                                    <div className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-red-500 transition-colors">{kpi.value}</div>
                                    <p className="text-[11px] text-white/60 leading-snug font-light border-t border-white/5 pt-2">{kpi.analysis}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gargalos (Pain Points) */}
                    <div>
                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-600 rounded-full"></span> Pontos de Fricção
                        </h4>
                        <div className="space-y-3">
                            {result.bottlenecks.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-red-900/10 to-transparent border border-red-500/10">
                                    <div className="mt-1 shrink-0 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-white mb-1">{item.title}</h5>
                                        <p className="text-xs text-white/60 leading-relaxed font-light">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                     {/* Action Plan */}
                     <div className="pb-4">
                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span> Plano de Correção
                        </h4>
                        <div className="bg-[#0f0f0f] rounded-xl border border-white/5 overflow-hidden">
                            {result.action_plan.map((step, idx) => (
                                <div key={idx} className="flex gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
                                    <span className="flex items-center justify-center w-6 h-6 rounded bg-white/5 text-[10px] font-black text-white shrink-0 border border-white/10">
                                        {idx + 1}
                                    </span>
                                    <p className="text-sm text-white/80 font-light">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                
                {/* Footer Actions */}
                <div className="mt-6 flex flex-col md:flex-row gap-4 shrink-0 pt-6 border-t border-white/10 bg-[#0A0A0A]">
                    <a href="https://wa.me/13997744720" target="_blank" rel="noopener noreferrer" className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black text-xs text-center uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 hover:scale-[1.02] flex items-center justify-center gap-2">
                        <ZapIcon className="w-4 h-4" />
                        Executar Estratégia
                    </a>
                    <button onClick={onRestart} className="flex-1 border border-white/10 text-white py-4 rounded-xl font-black text-xs uppercase hover:bg-white/5 transition-all tracking-[0.2em] hover:text-white/80">
                        Novo Diagnóstico
                    </button>
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

        // Prompt Estruturado e Rígido
        const prompt = `
            Atue como um Engenheiro de Estratégia Digital Sênior do Grupo CBL.
            Analise os dados fornecidos: ${JSON.stringify(formData)}.
            
            REGRAS RÍGIDAS:
            1. NÃO invente dados. Se o usuário não disse que tem site, assuma que NÃO TEM e critique isso.
            2. NÃO use frases motivacionais ("Você vai longe!", "Parabéns"). Seja técnico, frio e analítico.
            3. Fale APENAS sobre os dados inseridos. Ex: Se o faturamento é 0, o problema é tração. Se é alto, o problema é escala.
            
            Gere um JSON estrito com esta estrutura:
            {
                "company": "${formData.nome}",
                "summary": "Resumo técnico de 2 linhas sobre a situação atual da empresa baseada nos dados.",
                "score": (número inteiro 0-100. Dê nota baixa se faltar site ou ads),
                "kpis": [
                    { "label": "Presença Digital", "value": "Crítico/Em Construção/Sólido", "status": "critical/warning/good", "analysis": "1 frase explicando o porquê." },
                    { "label": "Potencial de Receita", "value": "Baixo/Médio/Alto", "status": "warning", "analysis": "Baseado no faturamento vs objetivo." }
                ],
                "bottlenecks": [
                    { "title": "Nome do Problema (ex: Falta de Site)", "description": "Consequência direta (ex: Perda de autoridade e leads).", "severity": "high" }
                ],
                "action_plan": [
                    "Ação prática 1", "Ação prática 2", "Ação prática 3"
                ]
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

            if (!response.ok) throw new Error('Falha na conexão com o servidor de auditoria');

            const data = await response.json();
            // Parse robusto
            let cleanText = data.text.trim();
            // Remove markdown se houver
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
            }
            
            const parsedData = JSON.parse(cleanText);
            
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
                            <p className="text-white font-black text-xl md:text-2xl uppercase italic animate-pulse tracking-tighter">Analisando Dados...</p>
                            
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 w-1/2 animate-[shimmer_2s_infinite]"></div>
                            </div>
                            
                            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.4em]">Cruzando com benchmarks de mercado</p>
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
