
import React from 'react';
import { FadeInOnScroll } from './FadeInOnScroll';
import { ZapIcon } from './icons/ZapIcon';

const CtaSection: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenModal();
  };

  return (
    <section id="contact" className="py-24 md:py-56 bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decorativo com contenção */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full h-full bg-radial-gradient from-red-600/5 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10 w-full max-w-full overflow-hidden">
        <FadeInOnScroll className="space-y-10 md:space-y-16">
            <div className="inline-block max-w-full overflow-hidden px-4 py-2 border border-red-600/30 rounded-full bg-red-600/5">
              <span className="text-[9px] md:text-[10px] font-black text-red-600 uppercase tracking-[0.2em] md:tracking-[0.5em] animate-pulse whitespace-nowrap block">
                Protocolo_De_Abertura_Disponível
              </span>
            </div>

            <h2 className="text-monumental font-black tracking-tighter text-white uppercase italic mb-8 mx-auto">
              Crie seu <br /> <span className="text-red-600">Domínio.</span>
            </h2>

            <div className="flex flex-col items-center gap-12 w-full">
                <a 
                  href="#"
                  onClick={handleOpenModal}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-white text-black px-10 py-5 md:px-12 md:py-6 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all hover:scale-105 cta-glow active:scale-95"
                >
                  <ZapIcon className="h-4 w-4" />
                  Iniciar Projeto
                </a>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-12 md:pt-16 w-full max-w-3xl">
                    <div className="text-center md:text-left space-y-2">
                      <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">WhatsApp_Oficial_CBL</span>
                      <a href="tel:+5513996033433" className="text-xl md:text-2xl font-black text-white italic tracking-tighter hover:text-red-600 transition-colors">(13) 99603-3433</a>
                    </div>
                    <div className="text-center md:text-right space-y-2">
                      <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Email_Estratégico</span>
                      <a href="mailto:contato@grupocbl.com" className="text-xl md:text-2xl font-black text-white italic tracking-tighter hover:text-red-600 transition-colors">contato@grupocbl.com</a>
                    </div>
                </div>
            </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default CtaSection;
