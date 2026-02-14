
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
        className="h-[100svh] min-h-[700px] lg:min-h-screen relative overflow-hidden" 
    >
      <TechGlobe startAnimation={startAnimation} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#1A1A1A] z-0"></div>
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6">
          <div className="w-full">
             <div 
              className={`mb-4 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="inline-block bg-gray-800/50 text-white border border-white/20 rounded-full px-3 py-1 text-xs sm:px-4 sm:text-sm font-semibold tracking-wider">
                <span className="text-red-500">•</span> GRUPO CBL • HIGH-END DIGITAL SOLUTIONS
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase flex flex-col items-center">
              <div className="overflow-hidden py-1"><span className={`block transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '200ms' }}>Oportunidade</span></div>
              <div className="overflow-hidden py-1"><span className={`block text-gray-400 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '350ms' }}>Não se</span></div>
              <div className="overflow-hidden py-1"><span className={`block text-gray-400 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '400ms' }}>Espera.</span></div>
              <div className="overflow-hidden py-1"><span className={`text-red-600 block transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '550ms' }}>Se cria.</span></div>
            </h1>

            <p 
              className={`text-base md:text-xl text-gray-300 max-w-2xl mx-auto my-4 md:my-8 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '750ms' }}
            >
              Especialistas em transformar ideias complexas em ecossistemas digitais de alta performance. Estratégia, desenvolvimento e lucro em um só lugar.
            </p>
            <div 
              className={`flex flex-col sm:flex-row w-full max-w-xs sm:max-w-none mx-auto justify-center items-center gap-4 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '850ms' }}
            >
              <a href="#" onClick={handleOpenModal} className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
                INICIAR PROJETO 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </a>
              <a href="#" onClick={handleOpenImagineModal} className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75V19a2 2 0 11-4 0v-.25c0-1.012-.367-1.956-1.023-2.686l-.548-.547z" /></svg>
                Visualize seu Futuro Site
              </a>
            </div>
          </div>
      </div>
      
      <div 
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white/50 text-xs tracking-widest uppercase z-10 transition-opacity duration-700 ease-out ${animateText ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '1050ms' }}
      >
        Explore
        <svg className="w-4 h-4 mx-auto mt-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
};

export default HeroSection;
