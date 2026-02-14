
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
  const [formData, setFormData] = useState({
    companyName: '',
    styleDescription: '',
    referenceUrl: '',
    essence: '',
  });
  const [progress, setProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
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

    if (step === 'loading') {
      let currentLogIndex = 0;
      logInterval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev; 
          const next = prev + (Math.random() * 3);
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
      }, 250);
    } else {
      setProgress(0);
      setBuildLogs([]);
    }

    return () => clearInterval(logInterval);
  }, [step]);

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs(["> Acionando Cluster de Engenharia CBL..."]);

    const prompt = `
      Você é um Lead Developer & UI Designer Senior da CBL Tech.
      Crie um website institucional COMPLETO, MODERNO e PROFISSIONAL.
      
      DADOS DO CLIENTE:
      Empresa: ${formData.companyName}
      O que fazem (Essência): ${formData.essence}
      Estilo Desejado: ${formData.styleDescription || 'Moderno, High-End, Dark Mode'}
      Referência Visual: ${formData.referenceUrl || 'Não informada'}

      REQUISITOS TÉCNICOS:
      1. Use Tailwind CSS via CDN no HTML.
      2. Crie uma seção Hero impactante, Sobre, Serviços e Contato.
      3. Design Responsivo (Mobile First).
      4. Animações suaves.

      RETORNE ESTRITAMENTE APENAS UM JSON VÁLIDO (SEM MARKDOWN, SEM TEXTO ADICIONAL):
      {
        "index.html": "código html completo aqui",
        "theme.css": "estilos adicionais aqui",
        "interactions.js": "lógica de js aqui"
      }
    `;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          model: 'gemini-3-pro-preview',
          config: { 
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor. Verifique sua API_KEY no Vercel.');
      }

      const data = await response.json();
      
      // Limpeza de possíveis blocos de código Markdown retornados pela IA
      let cleanText = data.text.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
      }

      const files = JSON.parse(cleanText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '<html><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">Erro ao gerar estrutura.</body></html>';
      
      if (files['theme.css']) {
        previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      }
      if (files['interactions.js']) {
        previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      }
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setBuildLogs(prev => [...prev, "> Draft finalizado com sucesso!"]);
      
      setTimeout(() => setStep('preview'), 1000);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      setError({ message: 'Ocorreu um erro na engenharia do site. Verifique se o prompt não é muito complexo ou se a API_KEY está ativa.' });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header do Modal */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-1.5">
                <span className="animate-pulse text-red-600">●</span> CBL_GEN_ENGINE_V3
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
                  Visualize seu <span className="text-red-600">Site</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                  Preencha os dados e deixe nossa inteligência desenhar seu futuro digital.
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
                        placeholder="Nome da sua marca" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Referência (URL)</label>
                      <input 
                        type="text" 
                        value={formData.referenceUrl}
                        onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})}
                        placeholder="https://exemplo.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">O que vocês fazem?</label>
                      <input 
                        type="text" 
                        value={formData.essence}
                        onChange={(e) => setFormData({...formData, essence: e.target.value})}
                        placeholder="Ex: Consultoria de Investimentos" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Conceito Visual</label>
                      <input 
                        type="text" 
                        value={formData.styleDescription}
                        onChange={(e) => setFormData({...formData, styleDescription: e.target.value})}
                        placeholder="Ex: Minimalista, Tech, Dark Mode, Luxury" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={generateFullWebsite}
                  disabled={!formData.companyName || !formData.essence}
                  className="w-full bg-red-600 text-white py-6 rounded-xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3 group"
                >
                  Engenhar Draft Agora
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
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-white/30 font-mono text-[10px] uppercase tracking-widest">Processando Draft: {Math.round(progress)}%</p>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="bg-red-600 text-white p-3 flex items-center justify-between px-8 shrink-0">
               <span className="text-[10px] font-black uppercase tracking-widest">Visualização em Tempo Real</span>
               <div className="flex gap-4">
                  <button onClick={() => setStep('form')} className="text-xs font-bold uppercase hover:underline">Novo Draft</button>
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-white text-red-600 px-4 py-1.5 rounded font-black uppercase text-[10px]">Contratar Projeto Real</button>
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
