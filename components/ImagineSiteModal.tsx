
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
    "Iniciando Sistema de Draft Grupo CBL...",
    "Sincronizando com API Gemini Paga...",
    "Escaneando identidade visual e referências...",
    "Gerando design tokens personalizados...",
    "Arquitetando layout mobile-first...",
    "Escrevendo estrutura com boas práticas de SEO...",
    "Implementando interações de alto padrão...",
    "Otimizando ativos para carregamento rápido...",
    "Executando auditoria final de interface...",
    "Projeto pronto para visualização."
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
            const nextLog = logs[currentLogIndex];
            if (nextLog) {
              setBuildLogs(prevLogs => [...prevLogs, `> ${nextLog}`]);
            }
            currentLogIndex++;
          }
          
          return next;
        });
      }, 180);
    } else {
      setProgress(0);
      setBuildLogs([]);
    }

    return () => {
      clearInterval(logInterval);
      clearInterval(timerInterval);
    };
  }, [step]);

  const generateFullWebsite = async () => {
    // Validar se a chave existe antes de começar
    if (!process.env.API_KEY) {
      setError({ message: 'A chave de API não foi detectada no ambiente. Verifique as variáveis no painel de controle.', isQuota: false });
      return;
    }

    setStep('loading');
    setError(null);
    setBuildLogs(["> Acionando Engenharia Grupo CBL v8.0..."]);

    // Criar instância aqui dentro para garantir que pega a chave do ambiente atualizada
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Você é um Lead Developer & UI Designer de Elite na CBL Tech.
      Crie um projeto de website institucional COMPLETO, ÚNICO e PROFISSIONAL.
      Empresa: ${formData.companyName}
      Estilo: ${formData.styleDescription || 'Premium modern luxury'}
      Essência: ${formData.essence}
      
      RETORNE APENAS UM JSON VÁLIDO:
      {
        "index.html": "...",
        "theme.css": "...",
        "interactions.js": "..."
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: 'application/json',
          temperature: 0.85 
        }
      });

      const responseText = response.text || '{}';
      const files = JSON.parse(responseText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '<html><body style="background:#000;color:#fff;">Erro ao renderizar draft.</body></html>';
      
      if (files['theme.css']) {
        previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      }
      if (files['interactions.js']) {
        previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      }
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setTimeout(() => setStep('preview'), 800);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      setError({ message: 'Falha na conexão com o servidor. Verifique se sua API Key é válida e tem faturamento ativo.', isQuota: err?.status === 429 });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-1.5">
                <span className="animate-pulse text-red-600">●</span> CBL_DRAFT_SYSTEM_V8.0
             </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all p-2 rounded-lg">
            <XIcon />
          </button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl space-y-12 py-4">
              <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Sua Marca em <span className="text-red-600">Alta Performance</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                  A engenharia do Grupo CBL desenha seu futuro digital em segundos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Empresa</label>
                      <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        placeholder="Ex: Grupo CBL Tech" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Referência</label>
                      <input 
                        type="text" 
                        value={formData.referenceUrl}
                        onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})}
                        placeholder="Link opcional" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Conceito</label>
                    <textarea 
                      value={formData.styleDescription}
                      onChange={(e) => setFormData({...formData, styleDescription: e.target.value})}
                      placeholder="Ex: Dark, Minimalista, Foco em Conversão..." 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all h-[136px] resize-none" 
                    />
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={generateFullWebsite}
                  disabled={!formData.companyName || !formData.essence}
                  className="w-full bg-red-600 text-white py-6 rounded-xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3 group"
                >
                  Engenhar Projeto Agora
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>

                {error && (
                  <p className="text-red-500 font-mono text-xs text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-full max-w-lg space-y-8">
               <div className="bg-[#080808] border border-white/5 rounded-xl p-6 h-60 overflow-y-auto font-mono text-xs custom-scrollbar">
                  {buildLogs.map((log, i) => (
                    <div key={i} className="text-white/20 mb-2 flex gap-3">
                      <span className="text-red-900/40">[{new Date().toLocaleTimeString()}]</span>
                      <span className={i === buildLogs.length - 1 ? 'text-white' : ''}>{log}</span>
                    </div>
                  ))}
               </div>
               <div className="text-center space-y-3">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-white/30 font-mono text-[10px] uppercase">Progresso do Sistema: {Math.round(progress)}%</p>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="bg-red-600 text-white p-4 flex items-center justify-between px-8 shrink-0">
               <span className="text-[10px] font-black uppercase tracking-widest">Draft Provisório Grupo CBL</span>
               <div className="flex gap-4">
                  <button onClick={() => setStep('form')} className="text-xs font-bold uppercase hover:underline">Novo Draft</button>
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-white text-red-600 px-6 py-2 rounded font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all">Contratar Agora</button>
               </div>
            </div>
            <iframe 
              ref={iframeRef}
              srcDoc={projectFiles['index.html']}
              className="w-full h-full border-none bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
