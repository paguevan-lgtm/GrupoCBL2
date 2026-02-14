
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
    "Clonando repositório de alta performance...",
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

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
    }
  };

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs(["> Acionando Engenharia Grupo CBL v8.0 (Mobile Ultra-Responsive)..."]);

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    
    const responseData = await response.json();
    const responseText = responseData.text || '{}';
    const files = JSON.parse(responseText) as ProjectFiles;

    
    const prompt = `
      Você é um Lead Developer & UI Designer de Elite na CBL Tech.
      Sua tarefa é criar um projeto de website institucional COMPLETO, ÚNICO e PROFISSIONAL.
      
      DADOS DO CLIENTE:
      Empresa: ${formData.companyName}
      Estilo: ${formData.styleDescription || 'Premium modern luxury'}
      Referência: ${formData.referenceUrl || 'Nenhuma'}
      Essência: ${formData.essence}

      DIRETRIZES DE DESIGN CRÍTICAS (MOBILE-FIRST):
      1. ZERO SOBREPOSIÇÃO: O menu de navegação JAMAIS deve cobrir o título principal ou botões de ação. Use padding-top generoso no Hero para compensar o header.
      2. ESPAÇAMENTO VERTICAL: Cada seção deve ter margens claras (py-12 no mobile, py-24 no desktop).
      3. TIPOGRAFIA: No mobile, use títulos com tamanho equilibrado (text-3xl a 4xl).
      4. IMAGENS RESILIENTES: Use URLs reais do Unsplash.
      5. BOTÕES: Botões no mobile devem ter largura total (w-full).
      
      IMPORTANTE: Não mencione "IA" ou "Inteligência Artificial" em nenhuma parte do site.
      O site deve parecer ter sido feito sob medida por uma equipe de especialistas.
      Adicione um selo discreto "DRAFT BY GRUPO CBL" no rodapé.
      
      RETORNO OBRIGATÓRIO (JSON):
      Retorne um objeto JSON com: 'index.html', 'theme.css', 'interactions.js', 'README.md'.
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
      
      let previewHtml = files['index.html'] || '<html><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">Erro ao renderizar draft. Tente novamente.</body></html>';
      
      const globalStyles = `
        <style>
          * { box-sizing: border-box; }
          html, body { overflow-x: hidden; width: 100%; margin: 0; padding: 0; }
          img { max-width: 100%; height: auto; display: block; }
          nav { z-index: 50; }
        </style>
      `;

      const imageFallbackScript = `
        <script>
          function applyFallback(img) {
            img.onerror = null;
            const keywords = "${formData.essence}".split(' ').slice(0, 3).join(',');
            img.src = "https://source.unsplash.com/800x600/?" + keywords;
            img.style.objectFit = 'cover';
            img.style.backgroundColor = '#111';
            
            img.onerror = function() {
              this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231a1a1a%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20fill%3D%22%23444%22%20text-anchor%3D%22middle%22%3EEspaço para sua Foto Profissional%3C/text%3E%3C/svg%3E';
            };
          }
          window.addEventListener('load', () => {
            document.querySelectorAll('img').forEach(img => {
              if (!img.complete || img.naturalWidth === 0) applyFallback(img);
              img.onerror = () => applyFallback(img);
            });
          });
        </script>
      `;

      if (files['theme.css']) {
        previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      }
      previewHtml = previewHtml.replace('</head>', `${globalStyles}${imageFallbackScript}</head>`);
      
      if (files['interactions.js']) {
        previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      }
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setBuildLogs(prev => [...prev, "> Draft finalizado pela equipe Grupo CBL."]);
      setTimeout(() => {
        setStep('preview');
        setIsCtaVisible(true);
      }, 800);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      
      if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota")) {
        setError({ 
          message: 'Limite de requisições excedido. Por favor, configure sua chave de API para continuar.', 
          isQuota: true 
        });
      } else {
        setError({ 
          message: 'Nossa equipe técnica está ocupada. Tente novamente em alguns segundos.', 
          isQuota: false 
        });
      }
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl overflow-hidden p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* IDE-Style Control Bar */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-2.5 md:p-4 flex justify-between items-center px-4 md:px-6 shrink-0 h-14 md:h-16">
          <div className="flex items-center gap-2 md:gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <div className="hidden sm:block h-4 w-px bg-white/10 mx-2"></div>
             <span className="text-[8px] md:text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                <span className="animate-pulse text-red-600">●</span> CBL_DRAFT_SYSTEM_V8.0
             </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2 rounded-lg">
            <XIcon />
          </button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-start md:items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl space-y-8 md:space-y-12 py-4">
              <div className="text-center space-y-3 md:space-y-4">
                <h2 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  A Força da <span className="text-red-600">Sua Marca</span>
                </h2>
                <p className="text-gray-400 text-xs md:text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed px-2">
                  Visualize uma infraestrutura digital de elite, desenhada pelo Grupo CBL especificamente para o seu negócio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                   <div className="group">
                      <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Empresa</label>
                      <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        placeholder="Ex: Tupi Desentupidora" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 md:py-4 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all text-sm" 
                      />
                   </div>
                   <div className="group">
                      <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Referência Visual</label>
                      <input 
                        type="text" 
                        value={formData.referenceUrl}
                        onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})}
                        placeholder="Opcional: URL inspiradora" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 md:py-4 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all text-sm" 
                      />
                   </div>
                </div>
                <div className="group">
                    <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Estilo e Conceito</label>
                    <textarea 
                      value={formData.styleDescription}
                      onChange={(e) => setFormData({...formData, styleDescription: e.target.value})}
                      placeholder="Ex: Limpo, autoritário, cores fortes, focado em chamadas de WhatsApp..." 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 md:py-4 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all h-28 md:h-[136px] resize-none text-sm" 
                    />
                </div>
              </div>

              <div className="group">
                  <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Essência do Negócio</label>
                  <textarea 
                    value={formData.essence}
                    onChange={(e) => setFormData({...formData, essence: e.target.value})}
                    placeholder="O que você faz de melhor?" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 md:py-4 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all h-24 md:h-32 resize-none text-sm" 
                  />
              </div>

              <div className="space-y-4">
                <button 
                  onClick={generateFullWebsite}
                  disabled={!formData.companyName || !formData.essence}
                  className="w-full bg-white text-black py-4 md:py-6 rounded-lg md:rounded-xl font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3 group text-xs md:text-sm"
                >
                  Engenhar Draft Visual
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>

                {error && (
                  <div className="text-center space-y-3">
                    <p className="text-red-500 font-mono text-[10px] md:text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error.message}</p>
                    {error.isQuota && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                         <button 
                          onClick={handleOpenSelectKey}
                          className="text-[10px] font-bold uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded hover:bg-white/10 transition-all"
                        >
                          Configurar Minha Chave de API
                        </button>
                        <a 
                          href="https://ai.google.dev/gemini-api/docs/billing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-gray-500 underline uppercase tracking-widest"
                        >
                          Documentação de Faturamento
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black relative">
            <div className="relative mb-8 md:mb-12">
              <div className="w-24 h-24 md:w-36 md:h-36 border-2 border-red-600/5 rounded-full flex items-center justify-center">
                 <div className="absolute inset-0 border-t-2 border-red-600 rounded-full animate-spin"></div>
                 <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center bg-white/[0.02] shadow-inner animate-pulse">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
              </div>
            </div>

            <div className="w-full max-w-lg space-y-6 md:space-y-8">
               <div className="bg-[#080808] border border-white/5 rounded-xl p-6 h-48 md:h-60 overflow-y-auto font-mono text-[9px] md:text-xs custom-scrollbar">
                  {buildLogs.map((log, i) => (
                    <div key={i} className={`${i === buildLogs.length - 1 ? 'text-white' : 'text-white/10'} mb-2 flex gap-3 transition-all`}>
                      <span className="text-red-900/40 select-none">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                      <span className="tracking-tight">{log}</span>
                    </div>
                  ))}
                  <div className="text-red-600 animate-pulse ml-16 md:ml-20">_</div>
               </div>

               <div className="text-center space-y-3">
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase italic">Grupo CBL está montando seu site...</h3>
                  <div className="flex flex-col items-center gap-2">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="flex items-center gap-4 text-white/30 font-mono text-[9px] uppercase">
                        <span>Tempo: <span className="text-red-600">{elapsedSeconds}s</span></span>
                        <span>Progresso: {Math.round(progress)}%</span>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            
            {/* Top Conversion Bar (Mobile Integrated) */}
            {isCtaVisible ? (
              <div className="bg-red-600 text-white p-2.5 md:p-4 shrink-0 shadow-2xl relative z-[110] border-b border-black/10 transition-all flex items-center justify-center">
                 <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4 px-2">
                    <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center md:text-left">
                       <div className="bg-black/20 px-3 py-0.5 rounded-full border border-white/10 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">ESTUDO PRELIMINAR GRUPO CBL</span>
                       </div>
                       <p className="text-[7px] md:text-[9px] uppercase tracking-wider text-white/80">
                         O projeto final será <span className="text-white font-black underline">100% superior</span>.
                       </p>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                       <button 
                         onClick={() => setStep('form')}
                         className="flex-1 md:flex-none text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest bg-black/10 py-2 px-3 rounded border border-white/5"
                       >
                         Gerar Outro
                       </button>
                       <button 
                         onClick={() => { onClose(); window.location.hash = '#contact'; }}
                         className="flex-[1.5] md:flex-none bg-white text-red-600 px-5 py-2 rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                       >
                         Contratar Site Profissional
                       </button>
                       {/* Dismiss Button (X) */}
                       <button 
                         onClick={() => setIsCtaVisible(false)}
                         className="ml-1 bg-black/20 p-1.5 rounded text-white/60 hover:text-white"
                         title="Ocultar barra"
                       >
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>
                 </div>
              </div>
            ) : (
              /* Compact "Show Options" Button for Mobile */
              <div className="bg-black/90 md:hidden border-b border-white/10 p-1.5 flex justify-center z-[110]">
                <button 
                  onClick={() => setIsCtaVisible(true)}
                  className="text-red-600 text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-2 animate-pulse"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  Exibir Opções de Contratação
                </button>
              </div>
            )}

            {/* Immersive Mobile-First Preview Area */}
            <div className="flex-grow relative flex flex-col bg-white overflow-hidden">
                <iframe 
                  ref={iframeRef}
                  srcDoc={projectFiles['index.html']}
                  className="w-full h-full border-none bg-white"
                  title="CBL Draft Viewer"
                />
            </div>
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ImagineSiteModal;
