
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
    "Sincronizando com Backend Seguro...",
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
      timerInterval = window.setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
      logInterval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev; 
          const next = prev + (Math.random() * 2);
          const logThreshold = (currentLogIndex + 1) * (100 / logs.length);
          if (next >= logThreshold && currentLogIndex < logs.length) {
            const nextLog = logs[currentLogIndex];
            if (nextLog) setBuildLogs(prevLogs => [...prevLogs, `> ${nextLog}`]);
            currentLogIndex++;
          }
          return next;
        });
      }, 180);
    } else {
      setProgress(0);
      setBuildLogs([]);
    }
    return () => { clearInterval(logInterval); clearInterval(timerInterval); };
  }, [step]);

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs(["> Conectando ao cluster de processamento CBL..."]);

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
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          model: 'gemini-3-pro-preview',
          config: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) throw new Error('Falha na comunicação com o servidor');

      const data = await response.json();
      const files = JSON.parse(data.text) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '<html><body style="background:#000;color:#fff;">Erro ao renderizar draft.</body></html>';
      if (files['theme.css']) previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      if (files['interactions.js']) previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setTimeout(() => setStep('preview'), 800);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      setError({ message: 'Falha no processamento. Verifique sua conexão ou se a API_KEY está correta no Vercel.', isQuota: false });
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
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CBL_DRAFT_SERVER_READY</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-2"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl space-y-12 py-4">
              <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Draft <span className="text-red-600">Premium</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">Engenharia Digital via Backend Seguro Grupo CBL.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Nome da Empresa" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white outline-none focus:border-red-600" />
                <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="O que você faz?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white outline-none focus:border-red-600" />
                <textarea value={formData.styleDescription} onChange={(e) => setFormData({...formData, styleDescription: e.target.value})} placeholder="Descreva o Estilo (ex: Moderno, Dark, Clean)" className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white outline-none focus:border-red-600 h-32" />
              </div>
              <button onClick={generateFullWebsite} disabled={!formData.companyName || !formData.essence} className="w-full bg-red-600 text-white py-6 rounded-xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl disabled:opacity-20">Engenhar Agora</button>
              {error && <p className="text-red-500 font-mono text-xs text-center">{error.message}</p>}
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
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="bg-red-600 text-white p-3 flex items-center justify-between px-8">
               <span className="text-[10px] font-black uppercase tracking-widest">DRAFT_VISUAL_ONLY</span>
               <button onClick={() => setStep('form')} className="text-xs font-bold uppercase underline">Novo Draft</button>
            </div>
            <iframe ref={iframeRef} srcDoc={projectFiles['index.html']} className="w-full h-full border-none bg-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
