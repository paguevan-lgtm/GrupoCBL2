
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
  const [showBanner, setShowBanner] = useState(true);
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
  const [error, setError] = useState<{ message: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const logs = [
    "Iniciando Protocolo de Draft CBL...",
    "Sincronizando com Servidores de Engenharia...",
    "Mapeando Essência de Negócio...",
    "Processando Referências Visuais...",
    "Desenhando Interface High-End...",
    "Compilando Design System Exclusivo...",
    "Arquitetando Estrutura de Conversão...",
    "Otimizando Performance e SEO...",
    "Finalizando Auditoria de Qualidade CBL...",
    "Draft Pronto para Revisão do Cliente."
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
      setShowBanner(true);
    }

    return () => {
      clearInterval(logInterval);
      clearInterval(timerInterval);
    };
  }, [step]);

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs(["> Conectando ao Núcleo de Engenharia Grupo CBL..."]);

    const prompt = `
      Você é o Senior Lead Developer e Head de Design da CBL Tech.
      Crie um website institucional de ELITE, com estética LUXO e TECH.
      
      DADOS DO CLIENTE:
      Empresa: ${formData.companyName}
      Essência do Negócio: ${formData.essence}
      Estilo Desejado: ${formData.styleDescription || 'Premium, Dark Mode, Minimalista'}
      Referência: ${formData.referenceUrl || 'Estilo Moderno High-End'}

      DIRETRIZES OBRIGATÓRIAS:
      - NUNCA mencione "Inteligência Artificial", "IA" ou "AI" no código ou no texto.
      - O site deve parecer feito 100% à mão pela equipe de elite CBL.
      - Use Tailwind CSS (CDN) para um design ultra-moderno.
      - Seção Hero impactante, Serviços, Sobre e Contato.
      - Animações fluidas e tipografia refinada (Inter/Lexend).

      RETORNE APENAS UM JSON PURO:
      {
        "index.html": "código completo",
        "theme.css": "estilos extras",
        "interactions.js": "animações"
      }
    `;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          model: 'gemini-3-pro-preview',
          config: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) throw new Error('Falha na comunicação com o servidor de engenharia.');

      const data = await response.json();
      
      let cleanText = data.text.trim();
      cleanText = cleanText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

      const files = JSON.parse(cleanText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '';
      
      if (files['theme.css']) {
        previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      }
      if (files['interactions.js']) {
        previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      }
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setBuildLogs(prev => [...prev, "> Draft finalizado pela equipe de engenharia."]);
      
      setTimeout(() => setStep('preview'), 1200);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      setError({ message: 'Ocorreu um erro técnico na engenharia do draft. Tente novamente em alguns instantes.' });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Superior do Modal */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CBL_ENGINEERING_CORE_V4</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all p-2 rounded-lg"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl space-y-12 py-4">
              <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Visualize seu <span className="text-red-600">Site</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">Tecnologia exclusiva do Grupo CBL para materializar sua visão digital.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Nome da Empresa</label>
                      <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Ex: Grupo CBL Tech" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Referência (URL)</label>
                      <input type="text" value={formData.referenceUrl} onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})} placeholder="https://exemplo.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Essência do Negócio</label>
                      <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="Ex: Consultoria em Logística Avançada" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Estilo Visual</label>
                      <input type="text" value={formData.styleDescription} onChange={(e) => setFormData({...formData, styleDescription: e.target.value})} placeholder="Ex: Luxo Minimalista, Dark Mode, Futurista" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" />
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={generateFullWebsite} disabled={!formData.companyName || !formData.essence} className="w-full bg-red-600 text-white py-6 rounded-xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl disabled:opacity-20">Engenhar Draft Agora</button>
                {error && <p className="text-red-500 font-mono text-xs text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error.message}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-full max-w-lg space-y-8">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Status da Engenharia</p>
                    <p className="text-white font-black text-xl italic uppercase tracking-tighter">Processando Projeto...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-mono text-[10px] uppercase tracking-widest">Tempo Decorrido</p>
                    <p className="text-white font-mono text-xl">{elapsedSeconds}s</p>
                  </div>
               </div>

               <div className="bg-[#080808] border border-white/5 rounded-xl p-6 h-64 overflow-y-auto font-mono text-[10px] custom-scrollbar shadow-inner">
                  {buildLogs.map((log, i) => (
                    <div key={i} className="text-white/20 mb-2 flex gap-3">
                      <span className="text-red-900/40">[{new Date().toLocaleTimeString()}]</span>
                      <span className={i === buildLogs.length - 1 ? 'text-white' : ''}>{log}</span>
                    </div>
                  ))}
               </div>

               <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-white/30 font-mono text-[10px] uppercase tracking-widest">
                    <span>CBL_CORE_V4</span>
                    <span className="animate-pulse">{Math.round(progress)}% Concluído</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            
            {/* BANNER DE VISUALIZAÇÃO DE ENGENHARIA REFORMULADO */}
            {showBanner && (
              <div className="bg-[#0c0c0c]/98 backdrop-blur-2xl border-b border-white/10 p-4 px-8 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 relative z-20 shadow-xl">
                <div className="flex flex-col text-center md:text-left">
                  <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] mb-0.5">Visualização de Engenharia</span>
                  <span className="text-white font-bold text-sm md:text-base leading-tight">Projeto final profissional, 100% superior em todos os aspectos</span>
                  <span className="text-gray-500 text-[10px] uppercase font-medium mt-1">Protótipo conceitual em escala real</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { onClose(); window.location.hash = '#contact'; }} 
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] transition-all cta-pulse tracking-widest shadow-lg shadow-red-600/30"
                  >
                    Contratar o site
                  </button>
                  
                  {/* Botão de Fechar Banner para Mobile */}
                  <button 
                    onClick={() => setShowBanner(false)}
                    className="text-white/30 hover:text-white transition-all p-2 rounded-full border border-white/5 hover:border-white/20"
                    title="Fechar Banner"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>
            )}

            {!showBanner && (
              <button 
                onClick={() => setShowBanner(true)}
                className="absolute top-4 left-4 z-30 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            )}

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
