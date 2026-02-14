
import { GoogleGenAI } from '@google/genai';
import React, { useCallback, useEffect, useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

// FIX: Added explicit types and made placeholder optional with a default value to resolve TS errors.
const FormField = ({ 
    label, 
    placeholder = '', 
    name, 
    value, 
    onChange, 
    onCheckboxChange, 
    isChecked, 
    type = 'text' 
}: {
    label: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isChecked: boolean;
    type?: string;
}) => (
    <div className="space-y-1.5">
        <label htmlFor={name} className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={isChecked}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-red-600 outline-none transition-all disabled:opacity-20"
        />
        <div className="flex items-center gap-2 mt-1">
            <input
                type="checkbox"
                id={`chk-${name}`}
                checked={isChecked}
                onChange={onCheckboxChange}
                name={name}
                className="w-3 h-3 accent-red-600"
            />
            <label htmlFor={`chk-${name}`} className="text-[10px] text-gray-500 uppercase cursor-pointer">Não possuo</label>
        </div>
    </div>
);

// FIX: Added explicit types for ResultView props.
const ResultView = ({ result, onRestart }: { result: string; onRestart: () => void }) => {
    const formatResult = (text: string) => {
        return text
            .replace(/^####?\s*(.*)$/gm, '<h3 class="text-xl font-bold text-white mb-4">$1</h3>')
            .replace(/^(---|###)$/gm, '<hr class="border-t border-red-600/30 my-6" />')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-500">$1</strong>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="p-8">
            <h3 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter flex items-center gap-3">
                <span className="w-2 h-8 bg-red-600 block"></span>
                Análise Estratégica Concluída
            </h3>
            <div className="bg-black/40 border border-white/5 rounded-xl p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                <div 
                    className="text-gray-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                />
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a 
                    href="https://wa.me/13997744720" 
                    className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black text-xs text-center uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                    Executar Plano de Ação
                </a>
                <button 
                    onClick={onRestart}
                    className="flex-1 border border-white/10 text-white py-4 rounded-xl font-black text-xs uppercase hover:bg-white/5 transition-all"
                >
                    Nova Consulta
                </button>
            </div>
        </div>
    );
};

const DiagnosticModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [view, setView] = useState('form');
    const [formData, setFormData] = useState({ nome: '', link: '', instagram: '', whatsapp: '', faturamento: '', investimento: '', concorrente: '', processo: '', dificuldade: '' });
    const [checkboxes, setCheckboxes] = useState({ nome: false, link: false, instagram: false, whatsapp: false, faturamento: false, investimento: false, concorrente: false, processo: false, dificuldade: false });
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setView('loading');
        setError(null);

        // FIX: Ensuring GoogleGenAI is initialized inside the handler to use the current API key environment.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analise estes dados de negócio para o Grupo CBL e dê um diagnóstico tático: ${JSON.stringify(formData)}. Seja direto, crítico e profissional.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            setAnalysisResult(response.text || '');
            setView('result');
        } catch (err) {
            setError("O motor de análise falhou. Tente novamente em instantes.");
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
            <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-2xl relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white"><XIcon /></button>
                
                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Raio-X de Negócios</h2>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Engenharia de Resultados Grupo CBL</p>
                        </div>

                        {error && <p className="bg-red-500/10 text-red-500 text-[10px] p-3 rounded-lg text-center uppercase font-bold">{error}</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            <FormField label="Nome" name="nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} onCheckboxChange={e => setCheckboxes({...checkboxes, nome: e.target.checked})} isChecked={checkboxes.nome} />
                            <FormField label="Website" name="link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} onCheckboxChange={e => setCheckboxes({...checkboxes, link: e.target.checked})} isChecked={checkboxes.link} />
                            <FormField label="Faturamento" name="faturamento" type="number" value={formData.faturamento} onChange={e => setFormData({...formData, faturamento: e.target.value})} onCheckboxChange={e => setCheckboxes({...checkboxes, faturamento: e.target.checked})} isChecked={checkboxes.faturamento} />
                            <FormField label="Investimento" name="investimento" type="number" value={formData.investimento} onChange={e => setFormData({...formData, investimento: e.target.value})} onCheckboxChange={e => setCheckboxes({...checkboxes, investimento: e.target.checked})} isChecked={checkboxes.investimento} />
                            <div className="md:col-span-2">
                                <FormField label="Maior Dificuldade Hoje" name="dificuldade" value={formData.dificuldade} onChange={e => setFormData({...formData, dificuldade: e.target.value})} onCheckboxChange={e => setCheckboxes({...checkboxes, dificuldade: e.target.checked})} isChecked={checkboxes.dificuldade} />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all cta-pulse">
                            Gerar Diagnóstico
                        </button>
                    </form>
                )}

                {view === 'loading' && (
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                        <SpinnerIcon />
                        <p className="text-white font-black uppercase italic tracking-widest animate-pulse">Cruzando Dados do Mercado...</p>
                    </div>
                )}

                {view === 'result' && <ResultView result={analysisResult} onRestart={() => setView('form')} />}
            </div>
        </div>
    );
};

export default DiagnosticModal;
