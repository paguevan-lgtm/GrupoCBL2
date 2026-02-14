
import { GoogleGenAI } from '@google/genai';
import React, { useCallback, useEffect, useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

const FormField = ({ label, placeholder, name, value, onChange, onCheckboxChange, isChecked, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={isChecked}
            className="w-full bg-[#3d4451] border border-transparent rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none transition-shadow duration-300 modal-input disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex items-center mt-2">
            <label htmlFor={`checkbox-${name}`} className="flex items-center cursor-pointer group">
                <input
                    type="checkbox"
                    id={`checkbox-${name}`}
                    checked={isChecked}
                    onChange={onCheckboxChange}
                    name={name}
                    className="sr-only peer"
                />
                <span 
                    className="w-4 h-4 bg-gray-700 rounded-sm flex-shrink-0 flex items-center justify-center border border-gray-500 group-hover:border-gray-400
                             peer-checked:bg-red-600 peer-checked:border-red-600 transition-colors"
                >
                    <svg 
                        className="w-3 h-3 text-white hidden peer-checked:block" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </span>
                <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Não possuo</span>
            </label>
        </div>
    </div>
);

const LoadingView = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <SpinnerIcon />
        <p className="text-lg font-semibold mt-4 text-white">Analisando seu negócio...</p>
        <p className="text-gray-400 mt-2">{message}</p>
    </div>
);

const ResultView = ({ result, onRestart }) => {
    const whatsappNumber = "13997744720";
    const whatsappMessage = "Olá! Recebi o Raio-X de Negócios e gostaria de conversar sobre as soluções da CBL.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    const protocol = `CBL-${Math.floor(1000 + Math.random() * 9000)}`;

    const formatResult = (text) => {
        if (!text) return '';
        return text
            .replace(/^####?\s*(.*)$/gm, '<h3 class="text-xl font-bold text-white mb-4">$1</h3>')
            .replace(/^(---|###)$/gm, '<hr class="border-t border-red-600/30 my-6" />')
            .replace(/^(\d+\.\s.*)$/gm, '<h4 class="text-lg font-bold text-red-500 mt-8 mb-4">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
            .replace(/^\s*>\s?/gm, '')
            .replace(/\n/g, '<br />');
    };


    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold tracking-widest text-gray-300 flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                      <path d="M4 18H6V10H4V18ZM10 18H12V4H10V18ZM16 18H18V14H16V18Z" fill="currentColor"/>
                    </svg>
                    RAIO-X DE NEGÓCIOS
                </h3>
            </div>

            <div className="mb-6">
                <h4 className="text-xl font-semibold text-white flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Relatório Gerado
                </h4>
                <p className="text-sm text-gray-400 ml-9">PROTOCOLO: {protocol}</p>
            </div>

            <div className="bg-[#111] border-t border-red-500 p-6 max-h-[45vh] overflow-y-auto custom-scrollbar">
                <div 
                    className="prose-sm prose-invert text-left text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                />
            </div>
            <p className="text-xs text-center text-gray-500 mt-6 px-4">
                *Este é um diagnóstico estratégico do Grupo CBL e representa uma estimativa com base nos dados fornecidos. Os resultados reais podem variar e dependem de múltiplos fatores de mercado e execução.
            </p>
             <div className="mt-6 flex flex-col sm:flex-row gap-4">
                 <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 text-center bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors duration-300"
                >
                    Falar com um Especialista
                </a>
                <button 
                    onClick={onRestart}
                    className="flex-1 text-center bg-[#4A5568] text-white px-6 py-3 rounded-md font-bold hover:bg-[#5A6578] transition-colors duration-300"
                >
                    Refazer Análise
                </button>
            </div>
        </div>
    );
};

interface DiagnosticModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState('form'); // 'form', 'loading', 'result'
    const [formData, setFormData] = useState({
        nome: '', link: '', instagram: '', whatsapp: '', faturamento: '', investimento: '', concorrente: '', processo: '', dificuldade: ''
    });
    const [checkboxes, setCheckboxes] = useState({
        nome: false, link: false, instagram: false, whatsapp: false, faturamento: false, investimento: false, concorrente: false, processo: false, dificuldade: false
    });
    const [loadingMessage, setLoadingMessage] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState<{ message: string; isQuota: boolean } | null>(null);

    const loadingMessages = [
        "Conectando com nossa Engenharia Estratégica...",
        "Analisando dados de faturamento e investimento...",
        "Cruzando informações com benchmarks de mercado...",
        "Avaliando processo de vendas e dificuldades...",
        "Identificando gargalos e oportunidades ocultas...",
        "Estruturando seu diagnóstico personalizado..."
    ];

    useEffect(() => {
        if (view !== 'loading') return;
        let index = 0;
        setLoadingMessage(loadingMessages[index]);
        const interval = setInterval(() => {
            index = (index + 1);
            if(index < loadingMessages.length) {
              setLoadingMessage(loadingMessages[index]);
            } else {
              clearInterval(interval);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [view, loadingMessages]);

    const handleClose = useCallback(() => {
        onClose();
        setTimeout(() => {
            setView('form');
            setFormData({ nome: '', link: '', instagram: '', whatsapp: '', faturamento: '', investimento: '', concorrente: '', processo: '', dificuldade: '' });
            setCheckboxes({ nome: false, link: false, instagram: false, whatsapp: false, faturamento: false, investimento: false, concorrente: false, processo: false, dificuldade: false });
            setAnalysisResult('');
            setError(null);
        }, 300);
    }, [onClose]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxes(prev => ({ ...prev, [name]: checked }));
    };

    const handleOpenSelectKey = async () => {
        if (window.aistudio?.openSelectKey) {
            await window.aistudio.openSelectKey();
            setError(null);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setView('loading');
        setError(null);

        const prompt = `
            Você é um consultor de negócios sênior e especialista em marketing digital do 'Grupo CBL - Inovação & Tech', conhecido como 'Raio-X de Negócios'. Sua tarefa é analisar os dados de um potencial cliente de forma crítica e construtiva.

            **REGRAS DE DETECÇÃO DE DADOS INVÁLIDOS:**
            1. Analise se os campos preenchidos contêm dados aleatórios (ex: "asdf", "123", "teste", "sua mae", etc) ou se os links são claramente falsos.
            2. Se você perceber que o usuário colocou dados no aleatório (mesmo que alguns campos pareçam reais), você DEVE:
               - Iniciar o relatório com um aviso claro: "#### ATENÇÃO: DADOS INCONSISTENTES DETECTADOS".
               - Escrever: "Percebemos que as informações fornecidas parecem não corresponder à realidade de um negócio estruturado. Isso torna extremamente difícil gerar um diagnóstico tático preciso e personalizado para o seu caso agora."
               - Em seguida, mude o foco totalmente para a nossa empresa: "Como o Grupo CBL pode ajudar empresas reais?".
               - Fale sobre nossa expertise em transformar negócios com tecnologia de ponta, estratégia de crescimento e engenharia de software sob medida.
               - Seja persuasivo sobre por que ele deve agendar uma call conosco para que possamos extrair os dados reais e ajudar de verdade.

            **REGRAS PARA DADOS VÁLIDOS:**
            1. Se os dados forem coerentes, crie um relatório altamente personalizado dividido em: Contexto, Gargalos Identificados, Plano de Ação e Projeção de Escala.
            
            **FORMATO DE SAÍDA:**
            - Markdown simples para UI Premium.
            - Use '###' ou '####' para títulos e '---' para divisórias.
            - Tonalidade: Profissional, executiva e focada em resultados. Não mencione IA.

            **Dados do Cliente para Análise:**
            ${Object.entries(formData).filter(([key, value]) => value && !checkboxes[key]).map(([key, value]) => `* **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}`).join('\n')}
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            setAnalysisResult(response.text ?? '');
            setView('result');
        } catch (err: any) {
            console.error("Gemini Diagnostic API Error:", err);
            if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota")) {
                setError({ 
                    message: 'A cota de análise gratuita foi atingida. Configure sua própria chave para continuar.', 
                    isQuota: true 
                });
            } else {
                setError({ 
                    message: 'Ocorreu um erro ao analisar os dados. Por favor, tente novamente.', 
                    isQuota: false 
                });
            }
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={handleClose}>
            <div className="bg-[#1A1A1A] rounded-lg shadow-2xl w-full max-w-3xl mx-4 border border-gray-700/50 transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
                    <XIcon />
                </button>
                
                {view === 'form' && (
                     <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-center mb-1 text-gray-200 flex items-center justify-center gap-3">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                             <path d="M4 18H6V10H4V18ZM10 18H12V4H10V18ZM16 18H18V14H16V18Z" fill="currentColor"/>
                           </svg>
                           RAIO-X DE NEGÓCIOS
                        </h2>
                        <p className="text-center text-gray-400 mb-6">Preencha os dados reais. Nossa equipe identificará gargalos ocultos.</p>
                        
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center space-y-3">
                                <p className="text-red-500 text-sm font-medium">{error.message}</p>
                                {error.isQuota && (
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={handleOpenSelectKey}
                                            className="text-[10px] font-bold uppercase tracking-widest text-white border border-white/20 px-3 py-1.5 rounded hover:bg-white/10"
                                        >
                                            Configurar Minha Chave
                                        </button>
                                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[9px] text-gray-500 underline uppercase tracking-widest">Ver Faturamento</a>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                           <FormField label="Nome do Empreendimento" placeholder="Ex: Tech Solutions" name="nome" value={formData.nome} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.nome} />
                           <FormField label="Link (Site ou Google)" placeholder="www.suaempresa.com" name="link" value={formData.link} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.link} />
                           <FormField label="Link do Instagram" placeholder="@seuinsta" name="instagram" value={formData.instagram} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.instagram} />
                           <FormField label="WhatsApp Comercial" placeholder="(11) 99999-9999" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.whatsapp} />
                           <FormField label="Faturamento Médio Mensal" placeholder="R$ 150.000" name="faturamento" value={formData.faturamento} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.faturamento} type="number" />
                           <FormField label="Investimento em Ads/Mês" placeholder="R$ 2.000" name="investimento" value={formData.investimento} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.investimento} type="number" />
                           <FormField label="Principal Concorrente" placeholder="Quem lidera seu mercado?" name="concorrente" value={formData.concorrente} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.concorrente} />
                           <FormField label="Como você vende hoje? (Processo)" placeholder="Ex: Cliente chama no Whats, atendo manualmente..." name="processo" value={formData.processo} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.processo} />
                           <div className="md:col-span-2">
                            <FormField label="Qual sua maior dificuldade hoje?" placeholder="Ex: Tenho muitos curiosos e poucas vendas..." name="dificuldade" value={formData.dificuldade} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} isChecked={checkboxes.dificuldade} />
                           </div>
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white mt-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors duration-300 cta-pulse">
                            Gerar Raio-X
                        </button>
                    </form>
                )}
                {view === 'loading' && <LoadingView message={loadingMessage} />}
                {view === 'result' && <ResultView result={analysisResult} onRestart={() => setView('form')} />}
            </div>
        </div>
    );
};

export default DiagnosticModal;
