
import React, { useCallback, useEffect, useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

const FormField = ({ label, placeholder, name, value, onChange, onCheckboxChange, isChecked, type = 'text' }: any) => (
    <div>
        <label htmlFor={name} className="block text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={isChecked}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-red-600 outline-none transition-all disabled:opacity-20"
        />
        <div className="flex items-center mt-2">
            <label className="flex items-center cursor-pointer group">
                <input type="checkbox" checked={isChecked} onChange={onCheckboxChange} name={name} className="sr-only peer" />
                <span className="w-3.5 h-3.5 bg-gray-800 rounded border border-gray-600 peer-checked:bg-red-600 transition-colors"></span>
                <span className="ml-2 text-[10px] text-gray-500 uppercase font-bold group-hover:text-gray-400">Não possuo</span>
            </label>
        </div>
    </div>
);

const ResultView = ({ result, onRestart }: any) => {
    const formatResult = (text: string) => {
        return text
            .replace(/^####?\s*(.*)$/gm, '<h3 class="text-xl font-bold text-white mb-4">$1</h3>')
            .replace(/^(---|###)$/gm, '<hr class="border-t border-red-600/30 my-6" />')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-500">$1</strong>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="p-8">
            <h3 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter">Análise Estratégica Backend</h3>
            <div className="bg-black/40 border border-white/5 rounded-xl p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                <div 
                    className="text-gray-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                />
            </div>
            <div className="mt-8 flex gap-4">
                <a href="https://wa.me/13997744720" className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black text-xs text-center uppercase tracking-widest hover:bg-red-700 transition-all">WhatsApp Direto</a>
                <button onClick={onRestart} className="flex-1 border border-white/10 text-white py-4 rounded-xl font-black text-xs uppercase hover:bg-white/5 transition-all">Refazer</button>
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

        const prompt = `Analise os seguintes dados de negócio para o Grupo CBL e dê um diagnóstico tático: ${JSON.stringify(formData)}. Seja direto e profissional.`;

        try {
            const response = await fetch('/api/gemini', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: prompt,
                model: 'gemini-3-flash-preview'
              })
            });

            if (!response.ok) throw new Error('Falha no servidor');

            const data = await response.json();
            setAnalysisResult(data.text || '');
            setView('result');
        } catch (err) {
            setError("Falha ao processar análise via Backend. Tente novamente.");
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={onClose}>
            <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white"><XIcon /></button>
                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Raio-X Seguro</h2>
                            <p className="text-gray-500 text-[10px] uppercase font-bold mt-1">Sincronizado via Grupo CBL Cloud</p>
                        </div>
                        {error && <p className="text-red-500 text-[10px] text-center font-bold">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            <FormField label="Empresa" name="nome" value={formData.nome} onChange={(e:any) => setFormData({...formData, nome: e.target.value})} onCheckboxChange={(e:any) => setCheckboxes({...checkboxes, nome: e.target.checked})} isChecked={checkboxes.nome} />
                            <FormField label="Website" name="link" value={formData.link} onChange={(e:any) => setFormData({...formData, link: e.target.value})} onCheckboxChange={(e:any) => setCheckboxes({...checkboxes, link: e.target.checked})} isChecked={checkboxes.link} />
                            <FormField label="Faturamento" name="faturamento" type="number" value={formData.faturamento} onChange={(e:any) => setFormData({...formData, faturamento: e.target.value})} onCheckboxChange={(e:any) => setCheckboxes({...checkboxes, faturamento: e.target.checked})} isChecked={checkboxes.faturamento} />
                            <FormField label="Dificuldade" name="dificuldade" value={formData.dificuldade} onChange={(e:any) => setFormData({...formData, dificuldade: e.target.value})} onCheckboxChange={(e:any) => setCheckboxes({...checkboxes, dificuldade: e.target.checked})} isChecked={checkboxes.dificuldade} />
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs hover:bg-red-700 transition-all">Processar via Cloud</button>
                    </form>
                )}
                {view === 'loading' && (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <SpinnerIcon />
                        <p className="text-white font-black uppercase italic animate-pulse">Consultando Cérebro CBL...</p>
                    </div>
                )}
                {view === 'result' && <ResultView result={analysisResult} onRestart={() => setView('form')} />}
            </div>
        </div>
    );
};

export default DiagnosticModal;
