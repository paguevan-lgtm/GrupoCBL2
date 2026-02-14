
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
    targetAudience: '',
    toneOfVoice: '', // Agora será usado para a descrição livre do estilo
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
    "Analisando diretrizes de estilo: " + (formData.toneOfVoice || "Padrão CBL High-End"),
    "Processando referências visuais e paleta cromática...",
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
      setShowBanner(true);
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
        Sua missão é materializar um website institucional de ULTRA-LUXO, ESTÉTICA PREMIUM e ALTA PERFORMANCE técnica.

        DIRETRIZES DE DESIGN DE ELITE:
        1. ESTÉTICA: Respeite rigorosamente o desejo do usuário: "${formData.toneOfVoice}". 
           - Se ele pedir "Moderno", use fontes sans-serif geométricas e muito espaço em branco.
           - Se pedir "Premium/Luxo", use contrastes altos, dourado sutil ou vermelho CBL, e animações de fade suaves.
           - Se pedir "Minimalista", foque em tipografia monumental e quase nenhum adereço visual.
        2. LAYOUT: Use grades assimétricas modernas, Bento Grids para serviços e seções de impacto visual.
        3. IMAGENS (SISTEMA DE VERIFICAÇÃO):
           - USE APENAS LINKS DIRETOS DO UNSPLASH QUE EXISTAM.
           - Formato obrigatório: https://images.unsplash.com/[ID]?auto=format&fit=crop&q=80&w=1200
           - IDs Recomendados (Garantidos):
             - Corporativo Moderno: photo-1486406146926-c627a92ad1ab
             - Escritório Luxo: photo-1497366216548-37526070297c
             - Tecnologia Abstrata: photo-1451187580459-43490279c0fa
             - Reunião de Negócios: photo-1522202176988-66273c2fd55f
           - Se precisar de uma imagem específica que não saiba o ID, use o sistema de busca do Unsplash: https://source.unsplash.com/featured/1200x800?[KEYWORD]
        
        DADOS DO BRIEFING:
        - Empresa: ${formData.companyName}
        - Essência/O que faz: ${formData.essence}
        - Personalidade Desejada: ${formData.toneOfVoice}
        - Cores da Marca: ${formData.brandColors}
        - Público: ${formData.targetAudience}
        - Objetivos: ${formData.objectives}

        RETORNE UM JSON PURO:
        {
          "index.html": "HTML5 completo com Tailwind CSS via CDN e fontes Google Fonts",
          "theme.css": "CSS para efeitos de vidro, gradientes animados e scroll suave",
          "interactions.js": "JS para revelar elementos ao scroll e interações de botão"
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

      if (!response.ok) throw new Error('Falha na comunicação com o servidor de engenharia.');

      const data = await response.json();
      let cleanText = data.text.trim();
      cleanText = cleanText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

      const files = JSON.parse(cleanText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '';
      if (files['theme.css']) previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      if (files['interactions.js']) previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setBuildLogs(prev => [...prev, "> Draft finalizado pela equipe de engenharia."]);
      
      setTimeout(() => setStep('preview'), 1200);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      setError({ message: 'Erro na engenharia do draft. Verifique os dados e tente novamente.' });
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
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
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
                <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">Defina os parâmetros técnicos para a materialização da sua interface premium.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coluna 1 */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">01. Identidade</h3>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Nome da Empresa *</label>
                      <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Ex: Grupo CBL Tech" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Cores da Marca</label>
                      <input type="text" value={formData.brandColors} onChange={(e) => setFormData({...formData, brandColors: e.target.value})} placeholder="Ex: Preto, Vermelho e Branco" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Referência Visual</label>
                      <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:border-red-600/50 transition-all overflow-hidden">
                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover opacity-60" alt="Preview" /> : (
                          <div className="text-center p-4">
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Subir Logo ou Print</span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      </div>
                   </div>
                </div>

                {/* Coluna 2 */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">02. Personalidade</h3>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Essência do Negócio *</label>
                      <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="O que sua empresa faz?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Público-Alvo</label>
                      <input type="text" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} placeholder="Para quem você vende?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Estilo & Tom de Voz *</label>
                      <textarea 
                        value={formData.toneOfVoice} 
                        onChange={(e) => setFormData({...formData, toneOfVoice: e.target.value})} 
                        placeholder="Ex: Quero um site moderno, minimalista, com fontes grandes e luxuoso..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all h-[118px] resize-none placeholder-white/20"
                      />
                   </div>
                </div>

                {/* Coluna 3 */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">03. Metas</h3>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Link de Referência</label>
                      <input type="text" value={formData.referenceUrl} onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})} placeholder="https://apple.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Objetivo Principal</label>
                      <textarea 
                        value={formData.objectives} 
                        onChange={(e) => setFormData({...formData, objectives: e.target.value})} 
                        placeholder="Vender mais? Autoridade? Novo lançamento?" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all h-[118px] resize-none placeholder-white/20"
                      />
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <button onClick={generateFullWebsite} disabled={!formData.companyName || !formData.essence || !formData.toneOfVoice} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 disabled:opacity-20 flex items-center justify-center gap-4 group">
                  Materializar Interface CBL
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                {error && <p className="text-red-500 font-black text-xs text-center uppercase tracking-widest">{error.message}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-full max-w-lg space-y-10 text-center">
               <div className="space-y-2">
                 <p className="text-red-600 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Engenharia em Atividade</p>
                 <p className="text-white font-black text-3xl italic uppercase tracking-tighter">Processando seu Projeto Especial...</p>
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
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-red-600 transition-all duration-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            {showBanner && (
              <div className="bg-[#0c0c0c]/98 backdrop-blur-2xl border-b border-white/10 p-5 px-10 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative z-20 shadow-2xl">
                <div className="text-center md:text-left">
                  <p className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Engenharia de Draft CBL Concluída</p>
                  <p className="text-white font-black text-lg italic tracking-tighter uppercase">Este é o padrão de qualidade da nossa equipe de design.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-600/40">Contratar Implementação Real</button>
                  <button onClick={() => setShowBanner(false)} className="text-white/20 hover:text-white p-2 border border-white/5 rounded-full"><XIcon /></button>
                </div>
              </div>
            )}
            <iframe ref={iframeRef} srcDoc={projectFiles['index.html']} className="w-full h-full border-none bg-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
