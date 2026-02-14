
import { GoogleGenAI } from '@google/genai';
import React, { useEffect, useRef, useState } from 'react';
import { XIcon } from './icons/XIcon';

interface ProjectFiles {
  'index.html'?: string;
  'theme.css'?: string;
  'interactions.js'?: string;
  'README.md'?: string;
}

const ImagineSiteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'preview'>('form');
  const [isCtaVisible, setIsCtaVisible] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    styleDescription: '',
    referenceUrl: '',
    essence: '',
  });
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles | null>(null);
  const [error, setError] = useState<{ message: string; isQuota: boolean } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const logs = [
    "Acessando Core Engine CBL...",
    "Sincronizando com API Gemini Pro (Paga)...",
    "Analizando identidade de marca e concorrência...",
    "Gerando arquitetura de conversão...",
    "Codificando interface Ultra-Responsive...",
    "Otimizando SEO e Meta-tags...",
    "Implementando scripts de interação avançada...",
    "Validando design system de alto padrão...",
    "Projeto finalizado com sucesso."
  ];

  useEffect(() => {
    let logInterval: number;
    let timerInterval: number;

    if (step === 'loading') {
      let currentLogIndex = 0;
      setElapsedSeconds(0);
      
      timerInterval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

      logInterval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev; 
          const next = prev + (Math.random() * 2);
          const logThreshold = (currentLogIndex + 1) * (100 / logs.length);
          if (next >= logThreshold && currentLogIndex < logs.length) {
            setBuildLogs(prevLogs => [...prevLogs, `> ${logs[currentLogIndex]}`]);
            currentLogIndex++;
          }
          return next;
        });
      }, 200);
    } else {
      setProgress(0);
      setBuildLogs([]);
    }

    return () => {
      clearInterval(logInterval);
      clearInterval(timerInterval);
    };
  }, [step]);

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
    }
  };

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs(["> Inicializando Sistema de Engenharia Grupo CBL..."]);

    // Criar nova instância para garantir o uso da chave mais recente do ambiente ou diálogo
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Você é o Engenheiro Chefe do Grupo CBL. Crie um website institucional completo.
      EMPRESA: ${formData.companyName}
      ESTILO: ${formData.styleDescription || 'Moderno, Executivo, Alta Tecnologia'}
      ESSÊNCIA: ${formData.essence}
      
      RETORNE APENAS JSON:
      {
        "index.html": "...",
        "theme.css": "...",
        "interactions.js": "..."
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Uso do modelo Pro para resultados de alta qualidade
        contents: prompt,
        config: { 
          responseMimeType: 'application/json',
          temperature: 0.9
        }
      });

      const files = JSON.parse(response.text || '{}') as ProjectFiles;
      
      let previewHtml = files['index.html'] || '<html><body>Erro no motor.</body></html>';
      
      // Injeção de estilos globais para garantir que o preview não quebre a página principal
      const headInjection = `
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
        </style>
        ${files['theme.css'] ? `<style>${files['theme.css']}</style>` : ''}
      `;

      previewHtml = previewHtml.replace('</head>', `${headInjection}</head>`);
      if (files['interactions.js']) {
        previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      }
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setTimeout(() => setStep('preview'), 500);
      
    } catch (err: any) {
      console.error("API Error:", err);
      if (err?.message?.includes("entity was not found") || err?.status === 404) {
        setError({ message: 'Modelo Gemini Pro não encontrado nesta chave. Verifique o faturamento.', isQuota: true });
      } else if (err?.status === 429) {
        setError({ message: 'Limite de requisições atingido. Use sua chave paga para prioridade.', isQuota: true });
      } else {
        setError({ message: 'Erro ao processar projeto. Verifique sua conexão e chave de API.', isQuota: false });
      }
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 md:p-4">
      <div className="relative w-full h-full max-w-7xl bg-[#080808] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* IDE-Style Control Bar */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-2">
                <span className="animate-pulse text-red-600">●</span> CBL_ENGINE_READY
             </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all">
            <XIcon />
          </button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-3xl space-y-10 py-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
                  Visualize o <span className="text-red-600">Impossível</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto font-light">
                  A nossa inteligência desenha a base do seu sucesso digital em segundos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Nome da Empresa</label>
                      <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        placeholder="Ex: Grupo CBL Tech" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Referência</label>
                      <input 
                        type="text" 
                        value={formData.referenceUrl}
                        onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})}
                        placeholder="Link opcional" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Conceito e Estilo</label>
                    <textarea 
                      value={formData.styleDescription}
                      onChange={(e) => setFormData({...formData, styleDescription: e.target.value})}
                      placeholder="Ex: Minimalista, luxuoso, cores dark com acentos neons..." 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all h-[134px] resize-none" 
                    />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-bold text-red-600 uppercase tracking-widest">O que você faz?</label>
                  <textarea 
                    value={formData.essence}
                    onChange={(e) => setFormData({...formData, essence: e.target.value})}
                    placeholder="Descreva seu core business..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all h-24 resize-none" 
                  />
              </div>

              <div className="space-y-6">
                <button 
                  onClick={generateFullWebsite}
                  disabled={!formData.companyName || !formData.essence}
                  className="w-full bg-red-600 text-white py-5 rounded-xl font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-3 group"
                >
                  Engenhar Draft Visual
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center space-y-4">
                    <p className="text-red-500 font-mono text-xs">{error.message}</p>
                    {error.isQuota && (
                      <button 
                        onClick={handleOpenSelectKey}
                        className="bg-white text-black text-[10px] font-bold px-4 py-2 rounded hover:bg-gray-200 uppercase"
                      >
                        Configurar Chave Paga
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-12 bg-black relative">
            <div className="w-full max-w-xl space-y-8">
               <div className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 h-64 overflow-y-auto font-mono text-[10px] custom-scrollbar">
                  {buildLogs.map((log, i) => (
                    <div key={i} className="text-white/40 mb-2 flex gap-4">
                      <span className="text-red-900 select-none">[{new Date().toLocaleTimeString()}]</span>
                      <span className={i === buildLogs.length - 1 ? 'text-white animate-pulse' : ''}>{log}</span>
                    </div>
                  ))}
               </div>

               <div className="text-center space-y-4">
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">Criando sua Infraestrutura...</h3>
                  <div className="flex flex-col items-center gap-2">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-white/20 font-mono text-[10px] uppercase">Progresso: {Math.round(progress)}%</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="bg-red-600 text-white p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 px-8 shrink-0">
               <div className="flex items-center gap-4">
                  <span className="bg-black/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Draft Exclusivo Grupo CBL</span>
                  <p className="text-[11px] font-medium hidden sm:block">Este é um rascunho. O site final será superior em todos os aspectos.</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setStep('form')} className="text-xs font-bold uppercase hover:underline">Novo Draft</button>
                  <button 
                    onClick={() => { onClose(); window.location.hash = '#contact'; }}
                    className="bg-white text-red-600 px-6 py-2 rounded font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all"
                  >
                    Contratar Site Real
                  </button>
               </div>
            </div>
            <div className="flex-grow bg-white">
                <iframe 
                  ref={iframeRef}
                  srcDoc={projectFiles['index.html']}
                  className="w-full h-full border-none"
                  title="Draft Preview"
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
