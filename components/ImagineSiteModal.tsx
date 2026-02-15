
import React, { useEffect, useRef, useState } from 'react';
import { XIcon } from './icons/XIcon';

interface ProjectFiles {
  'index.html'?: string;
  'theme.css'?: string;
  'interactions.js'?: string;
  'README.md'?: string;
}

interface UploadedImage {
  id: string;
  preview: string;
  base64: string;
}

const ImagineSiteModal: React.FC<{ isOpen: boolean; onClose: () => void; onShowToast?: (msg: string, type: 'success'|'error') => void }> = ({ isOpen, onClose, onShowToast }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'preview'>('form');
  const [showBanner, setShowBanner] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    customInstructions: '', 
    essence: '',
    targetAudience: '',
    toneOfVoice: '', 
    brandColors: '',
    referenceUrl: '',
  });
  
  // Imagem de Referência (Identidade Visual)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Galeria de Imagens Reais (Produtos/Estabelecimento)
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const logs = [
    "Iniciando Protocolo de Draft CBL...",
    "Configurando Arquitetura Mobile-First...",
    "Sincronizando com Servidores de Engenharia...",
    "Mapeando Essência de Negócio e Público-alvo...",
    "Analisando referências visuais e paleta cromática...",
    "Processando diretrizes de estilo customizado...",
    "Processando acervo de imagens reais do cliente...",
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

  // Função utilitária para comprimir imagens
  const compressImage = (file: File): Promise<{ base64: string, preview: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Limita largura para reduzir tamanho do payload
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprime para JPEG 0.7
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve({
            base64: dataUrl.split(',')[1],
            preview: dataUrl
          });
        };
      };
    });
  };

  // Upload da Referência Visual
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { base64, preview } = await compressImage(file);
        setImageBase64(base64);
        setImagePreview(preview);
        onShowToast?.("Referência visual carregada.", "success");
      } catch (err) {
        console.error("Erro ao processar imagem", err);
        onShowToast?.("Erro ao carregar imagem.", "error");
      }
    }
  };

  // Upload da Galeria
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const remainingSlots = 6 - galleryImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

      for (const file of filesToProcess) {
        try {
          const { base64, preview } = await compressImage(file);
          const newImage: UploadedImage = {
            id: Math.random().toString(36).substr(2, 9),
            preview: preview,
            base64: base64
          };
          setGalleryImages(prev => [...prev, newImage]);
        } catch (err) {
          console.error("Erro ao processar imagem da galeria", err);
        }
      }
      onShowToast?.(`${filesToProcess.length} imagens adicionadas à galeria.`, "success");
    }
    // Reset input
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const generateFullWebsite = async () => {
    // Validação Visual e Lógica
    if (!formData.companyName || !formData.essence) {
       setError({ message: "Campos obrigatórios: Nome da Empresa e Essência." });
       onShowToast?.("Preencha os campos obrigatórios para continuar.", "error");
       
       // Shake effect visual (opcional implementation logic would go here)
       return;
    }

    setStep('loading');
    setError(null);
    setBuildLogs(["> Conectando ao Núcleo de Engenharia Grupo CBL..."]);

    const textPart = {
      text: `
        Você é o Senior Lead Developer e Head de Design da CBL Tech.
        Crie um website de ELITE, profissional e eficaz para o cliente.
        
        CRÍTICO - REGRAS DE LAYOUT E DESIGN: 
        1. O layout DEVE SER 100% RESPONSIVO PARA MOBILE. Use classes como 'w-full', 'max-w-full', 'overflow-x-hidden' no body e containers.
        2. O design deve ser ÚNICO e seguir estritamente o ESTILO solicitado.
        3. Identifique o TIPO DE SITE (Institucional, Loja, Landing Page, Blog) com base na ESSÊNCIA e nas INSTRUÇÕES do usuário.
        
        IMAGENS FORNECIDAS PELO USUÁRIO (SISTEMA DE PLACEHOLDERS):
        O usuário enviou arquivos reais. Para garantir que eles apareçam, você DEVE usar os códigos abaixo no atributo 'src' das tags <img> ou em 'background-image'. NÃO tente inventar URLs.
        
        - Para o Logo (se fornecido): Use estritamente "PLACEHOLDER_LOGO"
        - Para as imagens da Galeria (${galleryImages.length} disponíveis): Use estritamente "PLACEHOLDER_GALLERY_0", "PLACEHOLDER_GALLERY_1", etc. até o limite.
        
        Exemplo: <img src="PLACEHOLDER_GALLERY_0" alt="Produto destaque" class="..." />
        
        IMPORTANTE: 
        - PRIORIZE usar "PLACEHOLDER_GALLERY_X" nas seções principais (Hero, Vitrine, Sobre Nós).
        - Se o design precisar de MAIS imagens do que as ${galleryImages.length} fornecidas, complete com imagens do Unsplash (ex: 'https://source.unsplash.com/random/800x600/?business').
        - Analise as imagens visualmente (que estou enviando) para entender as cores e o estilo, mas USE OS PLACEHOLDERS no código HTML.

        DADOS DO BRIEFING:
        Empresa: ${formData.companyName}
        Essência do Negócio: ${formData.essence}
        Público-Alvo: ${formData.targetAudience || 'Geral'}
        Estilo Visual: ${formData.toneOfVoice}
        Cores da Marca: ${formData.brandColors || 'Harmônicas com o estilo'}
        
        INSTRUÇÕES ESPECÍFICAS:
        ${formData.customInstructions || 'Seguir boas práticas de UX/UI.'}

        DIRETRIZES TÉCNICAS:
        - Código HTML5 semântico.
        - CSS via Tailwind CSS (CDN).
        - JavaScript para interatividade (menu mobile FUNCIONAL, scroll suave).
        
        RETORNE APENAS UM JSON PURO:
        {
          "index.html": "...",
          "theme.css": "...",
          "interactions.js": "..."
        }
      `
    };

    // Construir o payload de conteúdo
    const parts = [];

    // 1. Adicionar imagem de referência visual (Logo/Print) se existir
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64 } });
    }

    // 2. Adicionar imagens da galeria (Produtos/Fotos reais)
    galleryImages.forEach(img => {
      parts.push({ inlineData: { mimeType: "image/jpeg", data: img.base64 } });
    });

    // 3. Adicionar o texto (Prompt) - DEVE SER O ÚLTIMO
    parts.push(textPart);

    const contents = { parts };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          model: 'gemini-3-flash-preview',
          config: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) throw new Error('Falha na comunicação com o servidor de engenharia.');

      const data = await response.json();
      
      let cleanText = data.text.trim();
      cleanText = cleanText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

      const files = JSON.parse(cleanText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '';

      // ---- INJEÇÃO DAS IMAGENS REAIS NO HTML ----
      
      // 1. Injetar Logo/Referência
      if (imageBase64) {
        if (previewHtml.includes('PLACEHOLDER_LOGO')) {
          previewHtml = previewHtml.replace(/PLACEHOLDER_LOGO/g, `data:image/jpeg;base64,${imageBase64}`);
        }
      }

      // 2. Injetar Galeria
      galleryImages.forEach((img, index) => {
        const placeholder = `PLACEHOLDER_GALLERY_${index}`;
        const regex = new RegExp(placeholder, 'g');
        previewHtml = previewHtml.replace(regex, `data:image/jpeg;base64,${img.base64}`);
      });
      
      // Scripts para corrigir comportamento no iframe
      const clickBlockerScript = `
        <script>
          document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button, input[type="submit"]');
            if (target) {
              const href = target.getAttribute('href');
              if (href && href.startsWith('#')) return;
              e.preventDefault();
              console.log('Navegação simulada bloqueada no preview.');
              target.style.transform = 'scale(0.95)';
              setTimeout(() => target.style.transform = '', 150);
            }
          }, true);
          document.body.style.overflowX = 'hidden';
          document.body.style.width = '100%';
        </script>
      `;

      if (files['theme.css']) {
        previewHtml = previewHtml.replace('</head>', `<style>body { overflow-x: hidden; max-width: 100vw; } ${files['theme.css']}</style></head>`);
      } else {
        previewHtml = previewHtml.replace('</head>', `<style>body { overflow-x: hidden; max-width: 100vw; }</style></head>`);
      }
      
      if (files['interactions.js']) {
        previewHtml = previewHtml.replace('</body>', `${clickBlockerScript}<script>${files['interactions.js']}</script></body>`);
      } else {
        previewHtml = previewHtml.replace('</body>', `${clickBlockerScript}</body>`);
      }
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setBuildLogs(prev => [...prev, "> Draft finalizado pela equipe de engenharia."]);
      
      onShowToast?.("Draft gerado com sucesso.", "success");
      setTimeout(() => setStep('preview'), 1200);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      setError({ message: 'Conexão instável. Reduza o número de imagens e tente novamente.' });
      onShowToast?.("Erro ao gerar draft. Verifique sua conexão.", "error");
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
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase hidden md:inline-block">CBL_ENGINEERING_CORE_V5</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all p-2 rounded-lg hover:bg-white/10"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-start justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-6xl space-y-12 pb-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Visualize seu <span className="text-red-600">Site</span>
                </h2>
                <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto font-light">Briefing estratégico para materialização de interface pela equipe CBL.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coluna 1: Identidade Visual */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">01. Identidade Visual</h3>
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 group-focus-within:text-white transition-colors">Nome da Empresa *</label>
                      <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Ex: Grupo CBL Tech" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all placeholder-white/20 text-sm" />
                   </div>
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 group-focus-within:text-white transition-colors">Cores da Marca</label>
                      <input type="text" value={formData.brandColors} onChange={(e) => setFormData({...formData, brandColors: e.target.value})} placeholder="Ex: Azul Marinho e Branco" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all placeholder-white/20 text-sm" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Referência Visual (Logo)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative cursor-pointer aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:border-red-600/50 hover:bg-white/10 transition-all overflow-hidden"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity" alt="Preview" />
                        ) : (
                          <div className="flex flex-col items-center text-center p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/20 group-hover:text-red-600 transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest group-hover:text-white transition-colors">Clique para subir imagem</span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      </div>
                   </div>
                </div>

                {/* Coluna 2: Estrutura & Estilo */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">02. Estrutura & Estilo</h3>
                   
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 group-focus-within:text-white transition-colors">Essência do Negócio *</label>
                      <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="Ex: Consultoria Financeira" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all placeholder-white/20 text-sm" />
                   </div>
                   
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 group-focus-within:text-white transition-colors">Estilo Visual</label>
                      <input 
                        type="text"
                        value={formData.toneOfVoice} 
                        onChange={(e) => setFormData({...formData, toneOfVoice: e.target.value})}
                        placeholder="Ex: Moderno, Minimalista, Dark Mode..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all placeholder-white/20 text-sm"
                      />
                   </div>

                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 group-focus-within:text-white transition-colors">Público-Alvo</label>
                      <input type="text" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} placeholder="Ex: Pequenas e médias empresas" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all placeholder-white/20 text-sm" />
                   </div>
                </div>

                {/* Coluna 3: Detalhes & Conteúdo Visual */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">03. Detalhes & Conteúdo</h3>
                   
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Galeria de Fotos (Max 6)</label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {galleryImages.map(img => (
                          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                            <img src={img.preview} alt="Upload" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => removeGalleryImage(img.id)}
                              className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <XIcon />
                            </button>
                          </div>
                        ))}
                        {galleryImages.length < 6 && (
                          <div 
                            onClick={() => galleryInputRef.current?.click()}
                            className="aspect-square bg-white/5 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-red-600/10 transition-all group"
                          >
                            <span className="text-2xl text-white/30 group-hover:text-red-500 font-light transition-colors">+</span>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={galleryInputRef} 
                        onChange={handleGalleryUpload} 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                      />
                      <p className="text-[9px] text-white/30 mt-1 font-mono">JPG/PNG. Fotos reais aumentam a fidelidade do draft.</p>
                   </div>
                   
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 group-focus-within:text-white transition-colors">Detalhes / Instruções Livres</label>
                      <textarea 
                        value={formData.customInstructions} 
                        onChange={(e) => setFormData({...formData, customInstructions: e.target.value})} 
                        placeholder="Descreva livremente: 'Quero uma Loja Virtual', 'Site para meu escritório', 'Landing page para vender curso'..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all h-[100px] resize-none placeholder-white/20 leading-relaxed text-sm"
                      />
                   </div>
                   
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 group-focus-within:text-white transition-colors">Referência Externa (URL)</label>
                      <input type="text" value={formData.referenceUrl} onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})} placeholder="https://exemplo.com.br" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] outline-none transition-all placeholder-white/20 text-sm" />
                   </div>
                </div>
              </div>

              <div className="space-y-6 pt-6">
                <button 
                  onClick={generateFullWebsite} 
                  className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Engenhar Draft de Alta Performance
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                {error && <p className="text-red-500 font-black text-xs text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20 uppercase tracking-widest animate-shake">{error.message}</p>}
                <p className="text-white/20 text-center font-mono text-[9px] uppercase tracking-[0.3em]">Briefing sujeito a análise técnica imediata pelo Núcleo CBL.</p>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-full max-w-lg space-y-10">
               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-red-600 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Engenharia em Atividade</p>
                    <p className="text-white font-black text-3xl italic uppercase tracking-tighter">Processando Projeto...</p>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-1">Decorrido</p>
                      <p className="text-white font-mono text-2xl leading-none font-bold">{elapsedSeconds}s</p>
                      <p className="text-white/20 font-mono text-[9px] uppercase mt-2 tracking-widest">Média CBL: 120s</p>
                    </div>
                  </div>
               </div>

               <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 h-80 overflow-y-auto font-mono text-[10px] custom-scrollbar shadow-inner relative group">
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                  {buildLogs.map((log, i) => (
                    <div key={i} className="text-white/30 mb-3 flex gap-4 items-start">
                      <span className="text-red-900/60 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className={i === buildLogs.length - 1 ? 'text-white font-bold' : ''}>{log}</span>
                    </div>
                  ))}
                  <div className="h-4"></div>
               </div>

               <div className="space-y-5">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-red-600 transition-all duration-500 shadow-[0_0_25px_rgba(220,38,38,0.8)]" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-white/40 font-mono text-[10px] uppercase tracking-[0.4em]">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> NÚCLEO_ENG_ATIVO</span>
                    <span className="animate-pulse text-white">{Math.round(progress)}% Concluído</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            {showBanner && (
              <div className="bg-[#0c0c0c]/98 backdrop-blur-2xl border-b border-white/10 p-5 px-10 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative z-20 shadow-2xl animate-in slide-in-from-top-10 fade-in duration-500">
                <div className="flex flex-col text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                    <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em]">Visualização de Engenharia</span>
                    <span className="bg-red-600/10 text-red-500 text-[8px] px-2 py-0.5 rounded border border-red-600/20 font-black">HIGH-FIDELITY</span>
                  </div>
                  <span className="text-white font-black text-lg md:text-xl leading-none italic tracking-tighter">O projeto final profissional será 100% superior em todos os aspectos.</span>
                  <span className="text-white/40 text-[10px] uppercase font-bold mt-2 tracking-[0.2em]">Protótipo conceitual em escala real • Engenharia Grupo CBL</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => { onClose(); window.location.hash = '#contact'; }} 
                    className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black uppercase text-xs transition-all cta-pulse tracking-[0.2em] shadow-xl shadow-red-600/40 hover:scale-105"
                  >
                    Contratar Projeto Real
                  </button>
                  
                  <button 
                    onClick={() => setShowBanner(false)}
                    className="text-white/20 hover:text-white transition-all p-3 rounded-full border border-white/5 hover:border-white/10"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>
            )}

            {!showBanner && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-3xl bg-[#0c0c0c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-10 fade-in duration-500">
                <div className="flex items-center gap-4 pl-2">
                   <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                   <div className="flex flex-col">
                      <span className="text-white font-black text-xs uppercase tracking-widest">Gostou do Resultado?</span>
                      <span className="text-white/40 text-[9px] uppercase font-bold tracking-wider">Transforme este draft em realidade</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                      onClick={() => { onClose(); window.location.hash = '#contact'; }} 
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                   >
                      Contratar
                   </button>
                   <button 
                      onClick={() => setShowBanner(true)}
                      className="p-3 text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl"
                      title="Expandir"
                   >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                   </button>
                </div>
              </div>
            )}

            <iframe 
              ref={iframeRef}
              srcDoc={projectFiles['index.html']}
              className="w-full h-full border-none bg-white shadow-inner"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
