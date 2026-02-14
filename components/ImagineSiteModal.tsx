
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
          const next = prev + (Math.random() * 2.5);
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
      }, 200);
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
        VOCÊ É O HEAD DE DESIGN DO GRUPO CBL. 
        Sua missão é criar um website de ULTRA-LUXO.

        SISTEMA DE IMAGENS INFALÍVEL (OBRIGATÓRIO):
        1. Use links reais: https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=1200
        2. IDs Reais Testados:
           - Corporativo: 1486406146926-c627a92ad1ab
           - Tecnologia: 1518770660439-4636190af475
           - Escritório Premium: 1497366216548-37526070297c
           - Reunião Elite: 1522202176988-66273c2fd55f
           - Data/Código: 1550752627-124b810d297a
        3. FALLBACK: Em todas as tags <img>, adicione: onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800';"
        4. No script interactions.js, adicione um listener global que verifica se imagens estão vazias e as preenche.

        BRIEFING:
        - Nome: ${formData.companyName}
        - Estilo: ${formData.toneOfVoice}
        - O que faz: ${formData.essence}
        - Cores: ${formData.brandColors}
        
        RETORNE JSON:
        {
          "index.html": "HTML completo com Tailwind e fontes",
          "theme.css": "Animações e Glassmorphism",
          "interactions.js": "JS com tratamento de erro de imagem global"
        }
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

      if (!response.ok) throw new Error('Falha na comunicação.');

      const data = await response.json();
      let cleanText = data.text.trim();
      cleanText = cleanText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

      const files = JSON.parse(cleanText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '';
      
      // Adicionar script de verificação de imagem forçado se a IA esquecer
      const imgFixScript = `
        <script>
          window.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
              console.log('Fixing broken image...');
              e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200';
            }
          }, true);
          document.querySelectorAll('img').forEach(img => {
            if(!img.src || img.src.includes('undefined') || img.src === window.location.href) {
               img.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200';
            }
          });
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
        
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CBL_CORE_V5</span>
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
                <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">Materialização imediata de interface premium pela engenharia CBL.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">01. Identidade</h3>
                   <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Nome da Empresa" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-all" />
                   <input type="text" value={formData.brandColors} onChange={(e) => setFormData({...formData, brandColors: e.target.value})} placeholder="Cores Predominantes" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-all" />
                   <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                     {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover opacity-60" alt="Preview" /> : <span className="text-[10px] text-white/30 uppercase font-black">Subir Referência Visual</span>}
                     <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                   </div>
                </div>

                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">02. Alma do Projeto</h3>
                   <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="O que a empresa faz?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-all" />
                   <textarea value={formData.toneOfVoice} onChange={(e) => setFormData({...formData, toneOfVoice: e.target.value})} placeholder="Descreva o estilo (Ex: Minimalista, Futuro, Dark...)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-all h-[155px] resize-none" />
                </div>

                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">03. Metas</h3>
                   <input type="text" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} placeholder="Para quem você vende?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-all" />
                   <textarea value={formData.objectives} onChange={(e) => setFormData({...formData, objectives: e.target.value})} placeholder="Qual o objetivo do site?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-all h-[155px] resize-none" />
                </div>
              </div>

              <button onClick={generateFullWebsite} disabled={!formData.companyName || !formData.essence || !formData.toneOfVoice} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 disabled:opacity-20 flex items-center justify-center gap-4">
                Gerar Draft Profissional
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-full max-w-lg space-y-10 text-center">
               <div className="space-y-2">
                 <p className="text-red-600 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Engenharia em Atividade</p>
                 <p className="text-white font-black text-3xl italic uppercase tracking-tighter">Construindo Interface...</p>
                 <p className="text-white/40 font-mono text-xl">{elapsedSeconds}s</p>
               </div>
               <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 h-64 overflow-y-auto font-mono text-[10px] text-left custom-scrollbar">
                  {buildLogs.map((log, i) => (
                    <div key={i} className="text-white/30 mb-2 flex gap-3">
                      <span className="text-red-900/60">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                      <span className={i === buildLogs.length - 1 ? 'text-white' : ''}>{log}</span>
                    </div>
                  ))}
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            {/* Banner Superior Principal */}
            {bannerState === 'full' && (
              <div className="bg-[#0c0c0c]/98 backdrop-blur-2xl border-b border-white/10 p-5 px-10 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative z-20 shadow-2xl animate-fade-in">
                <div className="text-center md:text-left">
                  <p className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Visualização de Engenharia CBL</p>
                  <p className="text-white font-black text-lg italic tracking-tighter uppercase">Este é o padrão de qualidade da nossa equipe de design.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-600/40 hover:scale-105 transition-all">Contratar Implementação Real</button>
                  <button onClick={() => setBannerState('minimized')} className="text-white/20 hover:text-white p-2 border border-white/5 rounded-full"><XIcon /></button>
                </div>
              </div>
            )}

            <iframe ref={iframeRef} srcDoc={projectFiles['index.html']} className="w-full h-full border-none bg-white" />

            {/* Rodapé Persistente ao Minimizar */}
            {bannerState === 'minimized' && (
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-10 shadow-2xl z-30 animate-bounce-subtle">
                  <div className="flex items-center gap-4 px-4 border-r border-white/10">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-white font-black italic text-[11px] uppercase tracking-wider">Draft Pronto para Implementação</span>
                  </div>
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
                    Iniciar Agora
                  </button>
                  <button onClick={() => setBannerState('full')} className="text-white/30 hover:text-white text-[9px] uppercase font-bold pr-4">Expandir</button>
               </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-subtle { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -5px); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-bounce-subtle { animation: bounce-subtle 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ImagineSiteModal;
