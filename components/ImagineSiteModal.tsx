
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
  const [bannerState, setBannerState] = useState<'full' | 'minimized'>('full');
  const [formData, setFormData] = useState({
    companyName: '',
    essence: '',
    targetAudience: '',
    toneOfVoice: '', 
    brandColors: '',
    objectives: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logs = [
    "Iniciando Protocolo de Draft CBL...",
    "Sincronizando com Servidores de Engenharia...",
    "Mapeando Essência de Negócio e Público-alvo...",
    "Analisando referências visuais e paleta cromática...",
    "Processando diretrizes de tom de voz...",
    "Desenhando Interface High-End exclusiva...",
    "Compilando Design System sob medida...",
    "Arquitetando Estrutura de Conversão focada em objetivos...",
    "Otimizando Performance, SEO e Acessibilidade...",
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
          if (prev >= 98.5) return prev; 
          const next = prev + (Math.random() * 2.2);
          const logThreshold = (currentLogIndex + 1) * (100 / logs.length);
          
          if (next >= logThreshold && currentLogIndex < logs.length) {
            const nextLog = logs[currentLogIndex];
            if (nextLog) {
              setBuildLogs(prevLogs => [...prevLogs, nextLog]);
            }
            currentLogIndex++;
          }
          return next;
        });
      }, 300);
    } else {
      setProgress(0);
      setBuildLogs([]);
      setBannerState('full');
    }

    return () => {
      clearInterval(logInterval);
      clearInterval(timerInterval);
    };
  }, [step]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImageBase64(base64String);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs(["> Conectando ao Núcleo de Engenharia Grupo CBL..."]);

    const textPart = {
      text: `
        VOCÊ É O HEAD DE DESIGN E ENGENHARIA DO GRUPO CBL. 
        Sua missão é materializar um website institucional de ULTRA-LUXO.
        
        REGRAS DE OURO PARA EXCLUSIVIDADE:
        1. NÃO use o estilo visual do site atual do Grupo CBL (preto com globo central).
        2. DESIGN: Use layouts inovadores (Bento Grid, Typographic Focus, ou Asymmetric layouts).
        3. EXCLUSIVIDADE: O design deve ser único para o estilo solicitado: "${formData.toneOfVoice}".
        4. IMAGENS REAIS: Use links Unsplash reais (ex: 1486406146926-c627a92ad1ab, 1451187580459-43490279c0fa).
        
        DADOS DO CLIENTE:
        - Nome: ${formData.companyName}
        - O que faz: ${formData.essence}
        - Cores: ${formData.brandColors}
        - Objetivo: ${formData.objectives}
        
        RETORNE JSON PURO COM index.html, theme.css e interactions.js.
      `
    };

    const contents = imageBase64 
      ? { parts: [{ inlineData: { mimeType: "image/jpeg", data: imageBase64 } }, textPart] }
      : { parts: [textPart] };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          model: 'gemini-3-pro-preview',
          config: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) throw new Error('Falha técnica.');

      const data = await response.json();
      let cleanText = data.text.trim();
      cleanText = cleanText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

      const files = JSON.parse(cleanText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '';
      
      const imgFixScript = `
        <script>
          function fixImages() {
            const fallback = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200';
            document.querySelectorAll('img').forEach(img => {
              if(!img.src || img.src.includes('undefined') || img.src.length < 10 || img.src === window.location.href) {
                img.src = fallback;
              }
              img.onerror = function() { this.onerror=null; this.src=fallback; };
            });
          }
          window.addEventListener('load', fixImages);
          setInterval(fixImages, 3000);
        </script>
      `;

      if (files['theme.css']) previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      previewHtml = previewHtml.replace('</body>', `${imgFixScript}</body>`);
      if (files['interactions.js']) previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setTimeout(() => setStep('preview'), 1200);
    } catch (err: any) {
      setError({ message: 'Erro na engenharia do draft.' });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header HUD */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CBL_ENGINEERING_CORE_V5</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all p-2 rounded-lg"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-start justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-6xl space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Engenhe seu <span className="text-red-600">Draft</span>
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">Especifique os parâmetros técnicos para a materialização da sua interface.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 01. Identidade */}
                <div className="space-y-6 bg-[#0c0c0c] p-8 rounded-3xl border border-white/5 shadow-xl">
                   <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] border-b border-white/5 pb-5 mb-6">01. Identidade</h3>
                   <div className="space-y-2">
                     <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Nome da Empresa *</label>
                     <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Ex: CBL Incorporadora" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-red-600 transition-all outline-none text-sm" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Cores da Marca</label>
                     <input type="text" value={formData.brandColors} onChange={(e) => setFormData({...formData, brandColors: e.target.value})} placeholder="Ex: Vermelho e Cinza Chumbo" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-red-600 transition-all outline-none text-sm" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Logo ou Referência</label>
                     <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden hover:border-red-600/30 transition-all">
                       {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover opacity-60" alt="Preview" /> : <span className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] text-center px-4">Subir logo ou referência</span>}
                       <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                     </div>
                   </div>
                </div>

                {/* 02. Alma do Projeto */}
                <div className="space-y-6 bg-[#0c0c0c] p-8 rounded-3xl border border-white/5 shadow-xl">
                   <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] border-b border-white/5 pb-5 mb-6">02. Alma do Projeto</h3>
                   <div className="space-y-2">
                     <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">O que a empresa faz? *</label>
                     <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="Ex: Construção Civil de Luxo" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-red-600 transition-all outline-none text-sm" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Estilo do Site *</label>
                     <textarea value={formData.toneOfVoice} onChange={(e) => setFormData({...formData, toneOfVoice: e.target.value})} placeholder="Descreva o Estilo (Ex: Moderno, Minimalista Apple, Dark Futurista com Neon...)" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-red-600 transition-all h-[175px] resize-none outline-none text-sm" />
                   </div>
                </div>

                {/* 03. Metas */}
                <div className="space-y-6 bg-[#0c0c0c] p-8 rounded-3xl border border-white/5 shadow-xl">
                   <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] border-b border-white/5 pb-5 mb-6">03. Metas</h3>
                   <div className="space-y-2">
                     <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Público-Alvo</label>
                     <input type="text" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} placeholder="Ex: Investidores Classe A" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-red-600 transition-all outline-none text-sm" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Objetivo Principal</label>
                     <textarea value={formData.objectives} onChange={(e) => setFormData({...formData, objectives: e.target.value})} placeholder="Ex: Gerar Leads de alto valor e passar autoridade monumental." className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-red-600 transition-all h-[175px] resize-none outline-none text-sm" />
                   </div>
                </div>
              </div>

              <button onClick={generateFullWebsite} disabled={!formData.companyName || !formData.essence || !formData.toneOfVoice} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 disabled:opacity-20 flex items-center justify-center gap-4 text-sm">
                Materializar Interface Profissional
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center bg-black p-6 relative">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-red-600/5 blur-[160px] rounded-full pointer-events-none"></div>
            
            <div className="w-full max-w-5xl space-y-20 text-center relative z-10">
               {/* Cabeçalho de Carregamento */}
               <div className="relative inline-block w-full">
                 <div className="flex flex-col items-center gap-4">
                    <p className="text-red-600 font-black text-[10px] md:text-[12px] uppercase tracking-[0.6em] animate-pulse">Engenharia em Atividade</p>
                    <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
                      PROCESSANDO <span className="text-white">PROJETO...</span>
                    </h2>
                 </div>
                 {/* Timer Indicators */}
                 <div className="mt-8 flex justify-center gap-12 text-white/30 font-mono text-[10px] uppercase tracking-[0.4em]">
                    <div className="flex flex-col items-center">
                      <span className="mb-2">DECORRIDO</span>
                      <span className="text-white text-4xl font-black italic">{elapsedSeconds}s</span>
                    </div>
                    <div className="flex flex-col items-center opacity-40">
                      <span className="mb-2">MÉDIA CBL</span>
                      <span className="text-white/60 text-4xl font-black italic">120s</span>
                    </div>
                 </div>
               </div>

               {/* Console Box - Estilo Hacker */}
               <div className="bg-[#080808]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-10 h-80 overflow-y-auto font-mono text-[11px] text-left custom-scrollbar shadow-2xl">
                  {buildLogs.map((log, i) => (
                    <div key={i} className="mb-3 flex gap-5 items-start animate-fade-in">
                      <span className="text-red-600 font-bold shrink-0">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                      <span className={i === buildLogs.length - 1 ? 'text-white font-black brightness-150' : 'text-white/30'}>
                        {i === buildLogs.length - 1 ? '> ' : '  '} {log}
                      </span>
                    </div>
                  ))}
               </div>

               {/* Progress Section */}
               <div className="space-y-6">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-[1px]">
                    <div className="h-full bg-red-600 transition-all duration-1000 ease-out shadow-[0_0_25px_rgba(220,38,38,0.9)] rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-white/30 font-mono text-[10px] uppercase tracking-[0.5em] px-2">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       <span>NÚCLEO_ENG_ATIVO</span>
                    </div>
                    <span className="text-white font-bold">{Math.round(progress)}% CONCLUÍDO</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            {/* Banner Superior Principal */}
            {bannerState === 'full' && (
              <div className="bg-[#0c0c0c]/98 backdrop-blur-3xl border-b border-white/10 p-6 px-12 flex flex-col md:flex-row items-center justify-between gap-8 shrink-0 relative z-20 shadow-2xl animate-slide-down">
                <div className="text-center md:text-left">
                  <p className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-1">Engenharia de Draft Concluída</p>
                  <p className="text-white font-black text-2xl italic tracking-tighter uppercase leading-none">Este é o Padrão de Excelência Grupo CBL.</p>
                </div>
                <div className="flex items-center gap-6">
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all">Contratar Implementação Real</button>
                  <button onClick={() => setBannerState('minimized')} className="text-white/20 hover:text-white p-3 border border-white/10 rounded-full transition-colors"><XIcon /></button>
                </div>
              </div>
            )}

            <iframe ref={iframeRef} srcDoc={projectFiles['index.html']} className="w-full h-full border-none bg-white" />

            {/* Rodapé Persistente ao Minimizar */}
            {bannerState === 'minimized' && (
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] md:w-auto bg-black/95 backdrop-blur-3xl border border-white/10 p-6 rounded-[32px] flex items-center justify-between gap-16 shadow-[0_0_60px_rgba(0,0,0,0.8)] z-30 animate-float">
                  <div className="flex items-center gap-6 px-8 border-r border-white/10">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
                    <div className="flex flex-col">
                      <span className="text-white font-black italic text-sm uppercase tracking-wider">Draft Pronto</span>
                      <span className="text-white/30 text-[9px] uppercase font-bold tracking-widest">Inicie sua presença digital hoje</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 pr-6">
                    <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all">
                      Contratar Projeto
                    </button>
                    <button onClick={() => setBannerState('full')} className="text-white/20 hover:text-white transition-all transform hover:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                    </button>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -10px); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slide-down 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ImagineSiteModal;
