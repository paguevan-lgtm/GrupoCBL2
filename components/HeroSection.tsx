
import React, { useEffect, useState } from 'react';
import TechGlobe from './TechGlobe';

interface HeroSectionProps {
  onOpenModal: () => void;
  onOpenImagineModal: () => void;
  startAnimation: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal, onOpenImagineModal, startAnimation }) => {
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

  const handleOpenImagineModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenImagineModal();
  };

  return (
    <section 
        id="hero" 
        className="h-[100svh] min-h-[700px] lg:min-h-screen relative overflow-hidden bg-black" 
    >
      {/* Globo para Desktop */}
      <TechGlobe startAnimation={startAnimation} />
      
      {/* Background Especial para Mobile (Substitui o Globo) */}
      <div className="md:hidden absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.15]" 
               style={{ 
                 backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.2) 1px, transparent 1px)`,
                 backgroundSize: '40px 40px',
                 maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                 transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)',
                 transformOrigin: 'bottom'
               }}>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-red-600/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute top-24 left-6 flex flex-col gap-1 opacity-40">
            <div className="w-8 h-0.5 bg-red-600"></div>
            <span className="text-[7px] font-mono text-white tracking-[0.3em]">LATENCY_012MS</span>
          </div>
          <div className="absolute top-24 right-6 text-right opacity-40">
            <span className="text-[7px] font-mono text-white tracking-[0.3em]">CORE_ENGINE_v5.0</span>
          </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-[#000] z-0"></div>
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6">
          <div className="w-full relative flex flex-col items-center">
             <div className={`md:hidden absolute -inset-4 border-x border-white/5 pointer-events-none transition-all duration-1000 ${animateText ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}></div>

             <div 
              className={`mb-6 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="inline-block bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.3em] uppercase">
                <span className="text-red-500 animate-pulse mr-2">●</span> High-End Digital Solutions
              </span>
            </div>
            
            <h1 className="w-full text-[10vw] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] flex flex-col items-center">
              {/* Linhas de texto com overflow-hidden e padding simétrico para acomodar o itálico sem deslocar o centro */}
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
              className={`text-sm md:text-xl text-white/60 max-w-sm md:max-w-2xl mx-auto my-8 md:my-8 transition-all duration-700 ease-out font-light leading-relaxed ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '750ms' }}
            >
              Especialistas em transformar ideias complexas em <span className="text-white font-medium">ecossistemas digitais de alta performance</span>. Estratégia, engenharia e lucro.
            </p>

            <div 
              className={`flex flex-col sm:flex-row w-full max-w-[280px] sm:max-w-none mx-auto justify-center items-center gap-4 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '850ms' }}
            >
              <a href="#" onClick={handleOpenModal} className="group w-full sm:w-auto bg-red-600 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30">
                INICIAR PROJETO 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </a>
              <a href="#" onClick={handleOpenImagineModal} className="w-full sm:w-auto bg-white/5 backdrop-blur-xl border border-white/10 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75V19a2 2 0 11-4 0v-.25c0-1.012-.367-1.956-1.023-2.686l-.548-.547z" /></svg>
                Visualize seu Site
              </a>
            </div>
          </div>
      </div>
      
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/30 text-[9px] font-black tracking-[0.6em] uppercase z-10 transition-opacity duration-700 ease-out ${animateText ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '1050ms' }}
      >
        EXPLORE_CBL
        <div className="w-px h-12 bg-gradient-to-b from-red-600 to-transparent mx-auto mt-4 animate-bounce"></div>
      </div>
    </section>
  );
};

export default HeroSection;
