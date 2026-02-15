
import React, { useEffect, useState } from 'react';
import TechGlobe from './TechGlobe';

interface HeroSectionProps {
  onOpenModal: () => void;
  onOpenImagineModal: () => void;
  onOpenNeuroModal: () => void;
  startAnimation: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal, onOpenImagineModal, onOpenNeuroModal, startAnimation }) => {
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    if (startAnimation) {
      const timer = setTimeout(() => setAnimateText(true), 100);
      return () => clearTimeout(timer);
    }
  }, [startAnimation]);

  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenModal();
  };

  const handleOpenImagineModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onOpenImagineModal();
  };

  const handleOpenNeuroModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenNeuroModal();
  }

  return (
    <section 
        id="hero" 
        className="min-h-[100svh] relative overflow-hidden bg-black flex flex-col items-center justify-center py-12 md:py-20" 
    >
      {/* Globo para Desktop */}
      <TechGlobe startAnimation={startAnimation} />
      
      {/* Background Dinâmico para Mobile (Cyber Grid) */}
      <div className="md:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Grid em movimento perspectiva */}
          <div className="absolute inset-0 opacity-30"
               style={{
                 backgroundImage: `linear-gradient(transparent 95%, rgba(239, 68, 68, 0.5) 95%),
                                   linear-gradient(90deg, transparent 95%, rgba(239, 68, 68, 0.3) 95%)`,
                 backgroundSize: '40px 40px',
                 transform: 'perspective(300px) rotateX(60deg) translateY(0)',
                 transformOrigin: 'top center',
                 animation: 'grid-move 10s linear infinite'
               }}>
          </div>
          
          <style>{`
            @keyframes grid-move {
              0% { background-position: 0 0; }
              100% { background-position: 0 400px; }
            }
          `}</style>

          {/* Glow Central */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150vw] h-[60vh] bg-gradient-to-t from-red-900/20 to-transparent blur-3xl"></div>

          {/* Elementos HUD Flutuantes */}
          <div className="absolute top-24 left-6 flex flex-col gap-1 opacity-60">
            <div className="w-8 h-0.5 bg-red-600 animate-pulse"></div>
            <span className="text-[7px] font-mono text-white tracking-[0.3em]">LATENCY_012MS</span>
          </div>
          <div className="absolute top-24 right-6 text-right opacity-60">
             <div className="flex justify-end gap-1 mb-1">
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="w-1 h-1 bg-white/30 rounded-full"></span>
             </div>
            <span className="text-[7px] font-mono text-white tracking-[0.3em]">CORE_ENGINE_v5.0</span>
          </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#000] z-0"></div>
      
      {/* Conteúdo Principal com Padding Bottom Extra no Desktop para subir visualmente */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center w-full px-4 md:pb-24">
          <div className="w-full relative flex flex-col items-center">
             <div className={`md:hidden absolute -inset-4 border-x border-white/5 pointer-events-none transition-all duration-1000 ${animateText ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}></div>

             <div 
              className={`mb-4 md:mb-6 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="inline-block bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.3em] uppercase hover:border-red-500/50 transition-colors cursor-default">
                <span className="text-red-500 animate-pulse mr-2">●</span> High-End Digital Solutions
              </span>
            </div>
            
            <h1 className="w-full text-[10vw] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] flex flex-col items-center drop-shadow-2xl">
              <div className="overflow-hidden py-1 px-8 w-full flex justify-center">
                <span className={`block transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '200ms' }}>
                  Oportunidade
                </span>
              </div>
              <div className="overflow-hidden py-1 px-8 w-full flex justify-center">
                <span className={`block text-white/30 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '350ms' }}>
                  Não se
                </span>
              </div>
              <div className="overflow-hidden py-1 px-8 w-full flex justify-center">
                <span className={`block text-white/30 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '400ms' }}>
                  Espera.
                </span>
              </div>
              <div className="overflow-hidden py-1 px-8 w-full flex justify-center">
                <span className={`text-red-600 block transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '550ms' }}>
                  Se cria.
                </span>
              </div>
            </h1>

            <p 
              className={`text-sm md:text-xl text-white/70 max-w-sm md:max-w-2xl mx-auto my-6 md:my-8 transition-all duration-700 ease-out font-light leading-relaxed ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '750ms' }}
            >
              Especialistas em transformar ideias complexas em <span className="text-white font-medium">ecossistemas digitais de alta performance</span>. Estratégia, engenharia e lucro.
            </p>

            <div 
              className={`flex flex-col sm:flex-row w-full max-w-[280px] sm:max-w-none mx-auto justify-center items-center gap-4 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '850ms' }}
            >
              <a href="#" onClick={handleOpenModal} className="group w-full sm:w-auto bg-red-600 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30 hover:bg-red-700 hover:shadow-red-600/50">
                INICIAR PROJETO 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </a>
              <a href="#" onClick={handleOpenNeuroModal} className="w-full sm:w-auto bg-white/5 backdrop-blur-xl border border-white/10 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <span className="relative z-10">Sales_Lab</span>
              </a>
            </div>
            
            {/* Command Prompt para Visualização */}
            <div 
              className={`mt-6 md:mt-4 transition-all duration-700 ease-out flex flex-col items-center gap-2 ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '950ms' }}
            >
               {/* Linha Conectora mais curta */}
               <div className="h-4 w-px bg-gradient-to-b from-white/10 to-transparent"></div>

               <button 
                 onClick={handleOpenImagineModal} 
                 className="group relative flex items-center gap-4 pl-4 pr-6 py-2.5 rounded-full bg-[#0A0A0A] border border-white/10 hover:border-red-600/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] active:scale-95"
               >
                  {/* Ícone Container */}
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-red-600 transition-colors duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>

                  <div className="flex flex-col items-start text-left">
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest group-hover:text-red-500 transition-colors">Tem ideia visual?</span>
                    <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.1em] md:tracking-[0.2em] group-hover:tracking-[0.15em] md:group-hover:tracking-[0.25em] transition-all">
                       Visualize seu futuro site aqui
                    </span>
                  </div>
               </button>
            </div>
          </div>
      </div>
      
      {/* Scroll Indicator - Posicionado Absolutamente no Bottom */}
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white/30 text-[9px] font-black tracking-[0.6em] uppercase z-10 transition-opacity duration-700 ease-out hidden md:block ${animateText ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '1050ms' }}
      >
        EXPLORE_CBL
        <div className="w-px h-12 bg-gradient-to-b from-red-600 to-transparent mx-auto mt-4 animate-bounce"></div>
      </div>
    </section>
  );
};

export default HeroSection;
