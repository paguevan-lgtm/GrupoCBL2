
import React, { useEffect, useRef, useState } from 'react';
import { XIcon } from './icons/XIcon';
import { jsPDF } from 'jspdf';

interface ProjectFiles {
  'index.html'?: string;
  'theme.css'?: string;
  'interactions.js'?: string;
  'README.md'?: string;
}

interface StrategicInsight {
    section: string;
    decision: string;
    impact: string;
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
  const [strategyData, setStrategyData] = useState<StrategicInsight[]>([]);
  const [error, setError] = useState<{ message: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const logs = [
    "Inicializando Núcleo de Design High-End...",
    "Carregando bibliotecas de UI/UX premiadas...",
    "Definindo paleta cromática e tipografia monumental...",
    "Estruturando seções de conversão (Hero, Bento Grid, CTA)...",
    "Aplicando efeitos de Glassmorphism e Neumorphism...",
    "Otimizando imagens e assets visuais...",
    "Escrevendo Copywriting persuasivo e neurolinguístico...",
    "Compilando código limpo e performático...",
    "Realizando polimento visual final...",
    "Gerando Dossiê Estratégico com insights visuais...",
    "Projeto pronto para renderização."
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

  const compressImage = (file: File): Promise<{ base64: string, preview: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
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
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve({
            base64: dataUrl.split(',')[1],
            preview: dataUrl
          });
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { base64, preview } = await compressImage(file);
        setImageBase64(base64);
        setImagePreview(preview);
        onShowToast?.("Identidade visual carregada.", "success");
      } catch (err) {
        console.error("Erro ao processar imagem", err);
        onShowToast?.("Erro ao carregar imagem.", "error");
      }
    }
  };

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
      onShowToast?.(`${filesToProcess.length} imagens adicionadas.`, "success");
    }
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const colors = {
      primary: '#EF4444', // Red 500
      secondary: '#000000',
      text: '#374151',
      lightText: '#6B7280',
      bg: '#F3F4F6'
    };

    // --- CAPA ---
    doc.setFillColor(5, 5, 5); // Quase preto
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Elemento decorativo capa
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(1);
    doc.line(20, 20, pageWidth - 20, 20);
    doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text("DOSSIÊ TÉCNICO &", 20, 100);
    doc.text("ESTRATÉGIA VISUAL", 20, 112);
    
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text("GRUPO CBL ENGINEERING", 20, 125);
    
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(`Projeto: ${formData.companyName}`, 20, 140);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 146);

    // --- PÁGINA 2: IDENTIDADE VISUAL & IMAGENS ---
    doc.addPage();
    
    // Sidebar vermelha
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 15, pageHeight, 'F');

    doc.setTextColor(colors.secondary);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("1. ARSENAL VISUAL APLICADO", 25, 25);
    
    let yPos = 40;

    // Logo
    if (imagePreview) {
        doc.setFontSize(12);
        doc.text("Logo / Identidade Principal:", 25, yPos);
        yPos += 5;
        try {
            // Mantendo aspect ratio simples
            doc.addImage(imagePreview, 'JPEG', 25, yPos, 40, 40);
            doc.setDrawColor(200, 200, 200);
            doc.rect(25, yPos, 40, 40); // Borda
            yPos += 50;
        } catch (e) {
            console.error("Erro ao adicionar logo ao PDF", e);
        }
    }

    // Galeria
    if (galleryImages.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(colors.secondary);
        doc.text("Ativos da Galeria & Produtos:", 25, yPos);
        yPos += 10;
        
        let xPos = 25;
        const imgSize = 45;
        const gap = 5;

        galleryImages.forEach((img, index) => {
             // Quebra de linha se necessário
             if (xPos + imgSize > pageWidth - 10) {
                 xPos = 25;
                 yPos += imgSize + gap + 5;
             }
             // Quebra de página se necessário
             if (yPos + imgSize > pageHeight - 20) {
                 doc.addPage();
                 doc.setFillColor(colors.primary);
                 doc.rect(0, 0, 15, pageHeight, 'F');
                 yPos = 30;
                 xPos = 25;
             }

             try {
                doc.addImage(img.preview, 'JPEG', xPos, yPos, imgSize, imgSize);
                xPos += imgSize + gap;
             } catch (e) { console.error("Erro img galeria PDF", e); }
        });
        yPos += imgSize + 20;
    }

    // --- PÁGINAS DE ESTRATÉGIA ---
    // Se não quebrou página, adiciona uma nova para o texto não ficar espremido
    if (yPos > pageHeight - 100) {
        doc.addPage();
        yPos = 30;
    } else {
        yPos += 10;
    }

    // Header Estratégia
    if (yPos === 30) { // Se for nova página
       doc.setFillColor(colors.primary);
       doc.rect(0, 0, 15, pageHeight, 'F');
    }
    
    doc.setTextColor(colors.secondary);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("2. RACIONAL ESTRATÉGICO (POR QUE FUNCIONA)", 25, yPos);
    yPos += 15;

    strategyData.forEach((item) => {
        if (yPos > pageHeight - 50) {
            doc.addPage();
            doc.setFillColor(colors.primary);
            doc.rect(0, 0, 15, pageHeight, 'F');
            yPos = 30;
        }

        // Box de fundo para cada item
        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(220, 220, 220);
        doc.roundedRect(25, yPos, pageWidth - 40, 35, 3, 3, 'FD');

        doc.setFontSize(12);
        doc.setTextColor(colors.primary);
        doc.setFont("helvetica", "bold");
        doc.text(item.section.toUpperCase(), 30, yPos + 8);

        doc.setFontSize(10);
        doc.setTextColor(colors.secondary);
        doc.setFont("helvetica", "bold");
        doc.text("Decisão de Design:", 30, yPos + 16);
        
        doc.setFont("helvetica", "normal");
        const decisionText = doc.splitTextToSize(item.decision, pageWidth - 55);
        doc.text(decisionText, 70, yPos + 16);

        doc.setFont("helvetica", "bold");
        doc.text("Impacto de Vendas:", 30, yPos + 26);
        
        doc.setFont("helvetica", "italic");
        doc.setTextColor(colors.lightText);
        const impactText = doc.splitTextToSize(item.impact, pageWidth - 55);
        doc.text(impactText, 70, yPos + 26);

        yPos += 45;
    });

    // Rodapé em todas as páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        if (i === 1) continue; // Pula capa
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Engenharia Grupo CBL - Documento Confidencial - Pág ${i}/${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
    }

    doc.save(`Dossie_CBL_${formData.companyName.replace(/\s+/g, '_')}.pdf`);
  };

  const generateFullWebsite = async () => {
    if (!formData.companyName || !formData.essence) {
       setError({ message: "Campos obrigatórios: Nome da Empresa e Essência." });
       onShowToast?.("Preencha os campos obrigatórios.", "error");
       return;
    }

    setStep('loading');
    setError(null);
    setBuildLogs(["> Inicializando arquitetura High-End..."]);

    const textPart = {
      text: `
        Você é um Designer UI/UX Premiado (Awwwards/Behance) e Engenheiro Frontend Sênior.
        
        TAREFA: Crie um site "One-Page" EXTRAORDINÁRIO, MODERNO e HIGH-END para o cliente abaixo.
        O site deve parecer uma produção de estúdio de design de elite. Nada de layouts genéricos ou infantis.
        
        CLIENTE:
        Empresa: ${formData.companyName}
        Essência: ${formData.essence}
        Público: ${formData.targetAudience}
        Estilo: ${formData.toneOfVoice} (Mas force um estilo visual moderno e impactante)
        Cores: ${formData.brandColors}
        Instruções Extras: ${formData.customInstructions}

        DIRETRIZES VISUAIS OBRIGATÓRIAS (ESTILO "AWWWARDS"):
        1.  **Tipografia:** Use tipografia GRANDE (Headlines), fontes modernas (Inter, Syne, Clash Display via Google Fonts).
        2.  **Layout:** Use Bento Grids, Seções Full-Screen, Espaçamento generoso (whitespace).
        3.  **Efeitos:** Use Glassmorphism (backdrop-blur), Gradientes Sutis, Bordas finas (1px white/10), Sombras coloridas suaves (glow).
        4.  **Imagens:** Use os placeholders fornecidos de forma inteligente.
        5.  **Tema:** Predominantemente DARK MODE (fundo escuro, texto claro) com acentos vibrantes das cores da marca, para passar sofisticação.
        6.  **Ícones:** Use FontAwesome (CDN) para ícones.

        ESTRUTURA OBRIGATÓRIA (One Page Scroll):
        1.  **Header:** Sticky, com efeito de vidro (blur), logo e botão de CTA.
        2.  **Hero Section:** DEVE SER IMPACTANTE. Título gigante, subtítulo persuasivo, botão de CTA pulsante. Fundo com gradiente ou imagem escura.
        3.  **Marcas/Parceiros (Marquee):** Uma faixa com logos de parceiros (use ícones genéricos ou texto estilizado) em movimento ou grid.
        4.  **Bento Grid de Serviços/Benefícios:** Um grid assimétrico mostrando o valor da empresa. Cada card deve ter um ícone e efeito de hover.
        5.  **Galeria Showcase:** Seção para exibir as imagens da galeria (use os placeholders).
        6.  **Depoimentos / Prova Social:** Cards com design limpo.
        7.  **FAQ Interativo:** Accordion moderno.
        8.  **CTA Final + Footer:** Rodapé completo com links e newsletter.

        PLACEHOLDERS DE IMAGEM (Use exatamente estas strings nas tags <img src="...">):
        - Logo: "PLACEHOLDER_LOGO"
        - Galeria: "PLACEHOLDER_GALLERY_0", "PLACEHOLDER_GALLERY_1", etc.

        SAÍDA ESPERADA (JSON):
        {
          "files": {
             "index.html": "<!DOCTYPE html>... (HTML completo com Tailwind via CDN e FontAwesome)",
             "theme.css": "... (CSS adicional para animações personalizadas, scrollbar, etc)",
             "interactions.js": "... (JS para menu mobile, accordions, scroll reveal, etc)"
          },
          "strategy": [
             { "section": "Hero", "decision": "...", "impact": "..." },
             { "section": "Bento Grid", "decision": "...", "impact": "..." }
             ... (Explique 5 decisões chave de design high-end)
          ]
        }
      `
    };

    const parts = [];
    if (imageBase64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64 } });
    galleryImages.forEach(img => parts.push({ inlineData: { mimeType: "image/jpeg", data: img.base64 } }));
    parts.push(textPart);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: { parts },
          model: 'gemini-3-flash-preview',
          config: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) throw new Error('Erro na API');

      const data = await response.json();
      const parsed = JSON.parse(data.text);
      const files = parsed.files;
      setStrategyData(parsed.strategy || []);
      
      let previewHtml = files['index.html'] || '';

      // Injeção de Imagens
      if (imageBase64 && previewHtml.includes('PLACEHOLDER_LOGO')) {
        previewHtml = previewHtml.replace(/PLACEHOLDER_LOGO/g, `data:image/jpeg;base64,${imageBase64}`);
      }
      galleryImages.forEach((img, index) => {
        const regex = new RegExp(`PLACEHOLDER_GALLERY_${index}`, 'g');
        previewHtml = previewHtml.replace(regex, `data:image/jpeg;base64,${img.base64}`);
      });
      
      // Limpeza de placeholders não usados
      previewHtml = previewHtml.replace(/PLACEHOLDER_GALLERY_\d+/g, 'https://placehold.co/600x400/1a1a1a/FFF?text=Image');
      if (!imageBase64) previewHtml = previewHtml.replace(/PLACEHOLDER_LOGO/g, 'https://placehold.co/100x40/transparent/FFF?text=LOGO');

      // Scripts de segurança e estilo
      const clickBlockerScript = `
        <script>
          document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button');
            if (target && target.getAttribute('href')?.startsWith('#')) return;
            if (target) { e.preventDefault(); console.log('Preview mode: click blocked'); }
          }, true);
        </script>
      `;

      previewHtml = previewHtml.replace('</head>', `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #000; }
            ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
            ${files['theme.css'] || ''}
        </style>
        </head>
      `);
      
      previewHtml = previewHtml.replace('</body>', `${clickBlockerScript}<script>${files['interactions.js'] || ''}</script></body>`);
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setBuildLogs(prev => [...prev, "> Renderização Concluída."]);
      
      onShowToast?.("Site gerado com sucesso.", "success");
      setTimeout(() => setStep('preview'), 1000);
    } catch (err: any) {
      console.error(err);
      setError({ message: 'Erro na geração. Tente novamente.' });
      onShowToast?.("Falha na geração.", "error");
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
             </div>
             <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase hidden md:inline-block">CBL_ENGINEERING_CORE_V6</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all p-2 rounded-lg hover:bg-white/10"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-start justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-6xl space-y-12 pb-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Visualize o <span className="text-red-600">Extraordinário</span>
                </h2>
                <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto font-light">Engine V6: Gera interfaces de nível "Award-Winning" baseadas na sua essência.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coluna 1 */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">01. Identidade</h3>
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Nome da Empresa *</label>
                      <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Ex: Grupo CBL Tech" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all text-sm" />
                   </div>
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Cores da Marca</label>
                      <input type="text" value={formData.brandColors} onChange={(e) => setFormData({...formData, brandColors: e.target.value})} placeholder="Ex: Preto e Ouro" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none text-sm" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Logo (Obrigatório para Branding)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative cursor-pointer aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:border-red-600/50 hover:bg-white/10 transition-all overflow-hidden"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-contain p-4" alt="Preview" />
                        ) : (
                          <div className="flex flex-col items-center text-center p-4">
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest group-hover:text-white">Upload Logo</span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      </div>
                   </div>
                </div>

                {/* Coluna 2 */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">02. Estratégia</h3>
                   
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Essência / Nicho *</label>
                      <input type="text" value={formData.essence} onChange={(e) => setFormData({...formData, essence: e.target.value})} placeholder="Ex: Arquitetura de Alto Padrão" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none text-sm" />
                   </div>
                   
                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Público-Alvo</label>
                      <input type="text" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} placeholder="Ex: Classe A/B" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none text-sm" />
                   </div>

                   <div className="space-y-1.5 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Diferencial</label>
                      <textarea value={formData.customInstructions} onChange={(e) => setFormData({...formData, customInstructions: e.target.value})} placeholder="O que torna seu negócio único?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none h-24 resize-none text-sm" />
                   </div>
                </div>

                {/* Coluna 3 */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">03. Galeria (Max 6)</h3>
                   <div className="grid grid-cols-3 gap-2">
                        {galleryImages.map(img => (
                          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                            <img src={img.preview} alt="Upload" className="w-full h-full object-cover" />
                            <button onClick={() => removeGalleryImage(img.id)} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"><XIcon /></button>
                          </div>
                        ))}
                        {galleryImages.length < 6 && (
                          <div onClick={() => galleryInputRef.current?.click()} className="aspect-square bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-600 transition-all">
                            <span className="text-2xl text-white/30">+</span>
                          </div>
                        )}
                   </div>
                   <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} accept="image/*" multiple className="hidden" />
                   <p className="text-[9px] text-white/30 font-mono">Imagens reais aumentam drasticamente a qualidade do draft.</p>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={generateFullWebsite} 
                  className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)] hover:scale-[1.01] active:scale-[0.99] group"
                >
                  Gerar Site Extraordinário
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
             <div className="w-full max-w-lg space-y-10 text-center">
                 <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Construindo...</h2>
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                 </div>
                 <div className="font-mono text-[10px] text-red-500 uppercase tracking-widest space-y-2">
                    {buildLogs.slice(-3).map((log, i) => <div key={i}>{log}</div>)}
                 </div>
             </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            {showBanner && (
              <div className="bg-[#0c0c0c]/98 backdrop-blur-xl border-b border-white/10 p-4 px-8 flex justify-between items-center shrink-0 relative z-20 shadow-2xl">
                <div>
                   <h3 className="text-white font-black uppercase italic tracking-tighter text-lg">Draft Gerado</h3>
                   <button onClick={handleDownloadPDF} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-white transition-colors underline decoration-red-600 underline-offset-4">
                      Baixar Dossiê Estratégico & Visual (PDF)
                   </button>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all">
                    Contratar Este Projeto
                  </button>
                  <button onClick={() => setShowBanner(false)} className="text-white/30 hover:text-white"><XIcon /></button>
                </div>
              </div>
            )}
            
            {!showBanner && (
               <div className="absolute bottom-6 right-6 z-50">
                  <button onClick={() => setShowBanner(true)} className="bg-black/80 backdrop-blur text-white p-3 rounded-full border border-white/10 shadow-xl hover:bg-red-600 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  </button>
               </div>
            )}

            <iframe 
              ref={iframeRef}
              srcDoc={projectFiles['index.html']}
              className="w-full h-full border-none bg-black"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
