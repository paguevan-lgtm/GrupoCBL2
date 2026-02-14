
import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

const FormField = ({ label, placeholder, name, value, onChange, type = 'text', isTextArea = false }: any) => (
    <div className="space-y-1.5">
        <label htmlFor={name} className="block text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">{label}</label>
        {isTextArea ? (
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:bg-white/10 outline-none transition-all h-20 resize-none text-sm"
            />
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:bg-white/10 outline-none transition-all text-sm"
            />
        )}
    </div>
);

const ResultView = ({ result, onRestart }: any) => {
    const formatResult = (text: string) => {
        return text
            .replace(/^####?\s*(.*)$/gm, '<h3 class="text-xl font-bold text-white mb-4 mt-6">$1</h3>')
            .replace(/^(---|###)$/gm, '<hr class="border-t border-red-600/30 my-6" />')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="p-6 md:p-8 flex flex-col h-full">
            <h3 className="text-xl md:text-2xl font-black text-white mb-4 uppercase italic tracking-tighter shrink-0">Parecer Técnico Engenharia CBL</h3>
            <div className="bg-black/60 border border-white/10 rounded-xl p-6 overflow-y-auto custom-scrollbar shadow-inner flex-grow">
                <div 
                    className="text-gray-200 text-sm md:text-base leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                />
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4 shrink-0">
                <a href="https://wa.me/13997744720" target="_blank" rel="noopener noreferrer" className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black text-xs text-center uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/30">Falar com Consultor</a>
                <button onClick={onRestart} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-black text-xs uppercase hover:bg-white/10 transition-all tracking-widest">Nova Auditoria</button>
            </div>
        </div>
    );
};

const DiagnosticModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
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
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setView('loading');
        setError(null);

        const prompt = `Analise os seguintes dados estratégicos de negócio para o Grupo CBL e forneça um parecer técnico de alta performance: ${JSON.stringify(formData)}. O objetivo é identificar gargalos e oportunidades de escala digital. Seja direto, técnico e use terminologia de negócios de elite.`;

        try {
            const response = await fetch('/api/gemini', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: prompt,
                model: 'gemini-3-flash-preview'
              })
            });

            if (!response.ok) throw new Error('Falha na conexão com o servidor de auditoria');

            const data = await response.json();
            setAnalysisResult(data.text || '');
            setView('result');
        } catch (err) {
            setError("Falha ao processar auditoria. Tente novamente em instantes.");
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 md:p-6" onClick={onClose}>
            <div 
                className="bg-[#0c0c0c] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,1)]" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white transition-all z-20 bg-black/50 rounded-full p-2"><XIcon /></button>
                
                {view === 'form' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="p-6 md:p-8 text-center space-y-2 shrink-0 border-b border-white/5 bg-[#0c0c0c] z-10">
                            <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">Auditoria Estratégica</h2>
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Protocolo de Análise High-End CBL</p>
                            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2">{error}</p>}
                        </div>

                        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Nome do Empreendimento" name="nome" value={formData.nome} onChange={(e:any) => setFormData({...formData, nome: e.target.value})} placeholder="Ex: CBL Incorporadora" />
                                <FormField label="Link do Instagram" name="instagram" value={formData.instagram} onChange={(e:any) => setFormData({...formData, instagram: e.target.value})} placeholder="@seuperfil" />
                                <FormField label="Link do Site ou Google" name="site" value={formData.site} onChange={(e:any) => setFormData({...formData, site: e.target.value})} placeholder="https://..." />
                                <FormField label="WhatsApp Comercial" name="whatsapp" value={formData.whatsapp} onChange={(e:any) => setFormData({...formData, whatsapp: e.target.value})} placeholder="(00) 00000-0000" />
                                
                                <div className="md:col-span-2 pt-4 pb-1 border-b border-white/5">
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
                                <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs md:text-sm tracking-[0.3em] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20">Solicitar Parecer Técnico</button>
                            </div>
                        </form>
                    </div>
                )}
                
                {view === 'loading' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
                        <SpinnerIcon />
                        <div className="space-y-4">
                            <p className="text-white font-black text-xl md:text-2xl uppercase italic animate-pulse tracking-tighter">Cruzando Dados de Performance...</p>
                            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.4em]">Engenharia CBL em Processamento Profundo</p>
                        </div>
                    </div>
                )}
                
                {view === 'result' && <ResultView result={analysisResult} onRestart={() => setView('form')} />}
            </div>
        </div>
    );
};

export default DiagnosticModal;
