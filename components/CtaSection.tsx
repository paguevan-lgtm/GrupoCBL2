
import React from 'react';
import { FadeInOnScroll } from './FadeInOnScroll';
import { ZapIcon } from './icons/ZapIcon';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';

const CtaSection: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenModal();
  };

  return (
    <section id="contact" className="py-20 md:py-32 cta-glow-bg">
      <div className="container mx-auto px-6 text-center">
        <FadeInOnScroll>
            <p className="text-red-500 font-bold tracking-widest uppercase mb-4">Vamos Conversar?</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
              Se você tem uma ideia,
              <br />
              <span className="font-normal text-gray-400">nós damos forma.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Oportunidades não esperam. Transforme seu negócio hoje com a estratégia e tecnologia do Grupo CBL.
            </p>
            
            <div className="flex flex-col items-center gap-6">
                <a 
                  href="#"
                  onClick={handleOpenModal}
                  className="inline-flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors duration-300"
                >
                  <ZapIcon className="h-4 w-4" />
                  INICIAR PROJETO
                  <ArrowUpRightIcon className="h-4 w-4" />
                </a>
                
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    BASE EM SÃO PAULO • ATUAÇÃO NACIONAL
                </p>
                <p className="text-xs text-gray-600">Atendimento direto: (13) 99774-4720</p>
            </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default CtaSection;
