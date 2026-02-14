
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
    styleDescription: '',
    referenceUrl: '',
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
    "Analisando Diretrizes de Estilo: " + (formData.toneOfVoice || "High-End"),
    "Validando IDs de Imagens High-Resolution...",
    "Configurando Script de Autocorreção de Mídia...",
    "Desenhando Interface High-End exclusiva...",
    "Compilando Design System sob medida...",
    "Arquitetando Estrutura de Conversão...",
    "Otimizando Performance e UX Premium...",
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
          const next = prev + (Math.random() * 3.2);
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

        PROTOCOLO DE IMAGENS REAIS (CRÍTICO):
        - JAMAIS use placeholders de texto ou nomes de arquivos inexistentes.
        - Use APENAS links REAIS do Unsplash em todas as tags <img>.
        - IDs de Imagens Reais (Utilize estes IDs):
          * Hero/Business: 1486406146926-c627a92ad1ab
          * Tech/Futuro: 1451187580459-43490279c0fa
          * Escritório Elite: 1497366216548-37526070297c
          * Equipe/Meeting: 1522202176988-66273c2fd55f
          * Análise/Dados: 1551288049-2d13f99723f1
        - Formato obrigatório da URL: https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=1200
        - Certifique-se de que cada seção tenha uma imagem de alta qualidade.

        DIRETRIZES DE DESIGN:
        - Estética solicitada: ${formData.toneOfVoice}
        - Empresa: ${formData.companyName}
        - Foco: ${formData.essence}
        - Cores: ${formData.brandColors}
        - Layout: Bento Grids, Tipografia Gigante, Scroll suave.

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
      
      // Script de proteção contra imagens quebradas forçado injetado no HTML
      const imgFixScript = `
        <script>
          function applyImageFallback() {
            const fallback = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200';
            document.querySelectorAll('img').forEach(img => {
              // Se a imagem for placeholder ou vazia, troca pelo fallback
              if(!img.src || img.src.includes('undefined') || img.src === window.location.href || img.src.length < 10) {
                img.src = fallback;
              }
              // Listener para erros de carregamento
              img.onerror = function() {
                this.onerror = null;
                this.src = fallback;
              };
            });
          }
          window.addEventListener('load', applyImageFallback);
          setInterval(applyImageFallback, 3000);
        </script>
      `;

      if (files['theme.css']) previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      previewHtml = previewHtml.replace('</body>', `${imgFixScript}</body>`);
      if (files['interactions.js']) previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setTimeout(() => setStep('preview'), 1200);
    } catch (err: any) {
      setError({ message: 'Erro na engenharia. Tente novamente.' });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* HUD de Topo */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CBL_ENGINEERING_HUD_V5</span>
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
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">01. Identidade</h3>
                   <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Nome da Empresa" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 transition-all placeholder-white/20 outline-none" />
                   <input type="text" value={formData.brandColors} onChange={(e) => setFormData({...formData, brandColors: e.target.value})} placeholder="Cores Predominantes" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 transition-all placeholder-white/20 outline-none" />
                   <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                     {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover opacity-60" alt="Preview" /> : <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Referência Visual</span>}
                     <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                   </div>
                </div>

                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">02. Personalidade</h3>
                   <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="O que sua empresa faz?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 transition-all placeholder-white/20 outline-none" />
                   <textarea value={formData.toneOfVoice} onChange={(e) => setFormData({...formData, toneOfVoice: e.target.value})} placeholder="Como você quer o site? (Ex: Moderno, Minimalista, Estilo Apple, Luxuoso...)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 transition-all h-[155px] resize-none placeholder-white/20 outline-none" />
                </div>

                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">03. Metas</h3>
                   <input type="text" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} placeholder="Público-Alvo?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 transition-all placeholder-white/20 outline-none" />
                   <textarea value={formData.objectives} onChange={(e) => setFormData({...formData, objectives: e.target.value})} placeholder="Objetivo Principal (Vendas, Autoridade...)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 transition-all h-[155px] resize-none placeholder-white/20 outline-none" />
                </div>
              </div>

              <button onClick={generateFullWebsite} disabled={!formData.companyName || !formData.essence || !formData.toneOfVoice} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 disabled:opacity-20 flex items-center justify-center gap-4 group">
                Materializar Interface CBL
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center bg-black p-6 relative">
            {/* Background Glows para profundidade */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="w-full max-w-4xl space-y-12 text-center relative z-10">
               <div className="space-y-4">
                 <p className="text-red-600 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Engenharia em Atividade</p>
                 <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
                   CONSTRUINDO <span className="text-white/20">INTERFACE...</span>
                 </h2>
                 <p className="text-white/40 font-mono text-4xl font-bold">{elapsedSeconds}s</p>
               </div>

               {/* Console Box - Estilo Hacker */}
               <div className="bg-[#080808]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 h-80 overflow-y-auto font-mono text-[11px] text-left custom-scrollbar shadow-2xl relative">
                  <div className="absolute top-4 right-6 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-red-600/40 text-[9px] uppercase font-black">Core_Link_Active</span>
                  </div>
                  {buildLogs.map((log, i) => (
                    <div key={i} className="mb-3 flex gap-4 items-start animate-fade-in">
                      <span className="text-red-900/60 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className={i === buildLogs.length - 1 ? 'text-white font-bold brightness-125' : 'text-white/30'}>
                        {i === buildLogs.length - 1 ? '> ' : '  '} {log}
                      </span>
                    </div>
                  ))}
                  <div className="h-4"></div>
               </div>

               {/* Progress Bar na base */}
               <div className="pt-8 space-y-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-red-600 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(220,38,38,0.8)]" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">
                    <span>STATUS: {progress < 100 ? 'DEPLOYING' : 'COMPLETED'}</span>
                    <span className="text-white">{Math.round(progress)}%</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            {/* Banner Superior Expansível */}
            {bannerState === 'full' && (
              <div className="bg-[#0c0c0c]/98 backdrop-blur-3xl border-b border-white/10 p-5 px-10 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative z-20 shadow-2xl animate-slide-down">
                <div className="text-center md:text-left">
                  <p className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Visualização de Engenharia CBL</p>
                  <p className="text-white font-black text-xl italic tracking-tighter uppercase">Este é o padrão de excelência Grupo CBL.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/30 hover:scale-105 transition-all">Contratar Implementação Real</button>
                  <button onClick={() => setBannerState('minimized')} className="text-white/20 hover:text-white p-2.5 border border-white/5 rounded-full transition-colors"><XIcon /></button>
                </div>
              </div>
            )}

            <iframe ref={iframeRef} srcDoc={projectFiles['index.html']} className="w-full h-full border-none bg-white" />

            {/* Rodapé Persistente (Estado Minimizado) */}
            {bannerState === 'minimized' && (
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-black/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl flex items-center justify-between gap-12 shadow-2xl z-30 animate-float">
                  <div className="flex items-center gap-5 px-6 border-r border-white/10">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,1)]"></div>
                    <div className="flex flex-col">
                      <span className="text-white font-black italic text-xs uppercase tracking-wider">Draft Pronto</span>
                      <span className="text-white/30 text-[9px] uppercase font-bold">Inicie sua presença digital hoje</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pr-4">
                    <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 text-white px-10 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
                      Contratar Agora
                    </button>
                    <button onClick={() => setBannerState('full')} className="text-white/20 hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                    </button>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -8px); } }
        @keyframes fade-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-down { animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ImagineSiteModal;
