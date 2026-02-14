
import React from 'react';
import { FadeInOnScroll } from './FadeInOnScroll';

const DiffCard = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="relative group p-10 bg-[#0A0A0A] border border-white/5 rounded-3xl hover:border-red-600/30 transition-all overflow-hidden">
    <div className="absolute -top-10 -left-10 text-[120px] font-black text-white/[0.02] italic leading-none">{num}</div>
    <div className="relative z-10 space-y-6">
      <div className="w-8 h-8 rounded-full border border-red-600 flex items-center justify-center text-red-600 font-black text-xs">
        {num}
      </div>
      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed font-light">{desc}</p>
    </div>
  </div>
);

const DifferentiatorsSection: React.FC = () => {
  return (
    <section id="differentiators" className="py-24 md:py-40 bg-[#050505]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24 space-y-6">
          <FadeInOnScroll>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
              Não somos <span className="text-red-600">mais um.</span>
            </h2>
            <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] mt-4">Padrão de Qualidade Grupo CBL</p>
          </FadeInOnScroll>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FadeInOnScroll style={{ transitionDelay: '100ms' }}>
            <DiffCard 
              num="01" 
              title="Tailor-Made" 
              desc="Esqueça templates. Sua solução é desenhada pixel a pixel, linha a linha, para seu desafio específico."
            />
          </FadeInOnScroll>
          <FadeInOnScroll style={{ transitionDelay: '200ms' }}>
            <DiffCard 
              num="02" 
              title="ROI Driven" 
              desc="O código é um meio. O lucro é o fim. Cada feature é validada contra o retorno financeiro que ela traz."
            />
          </FadeInOnScroll>
          <FadeInOnScroll style={{ transitionDelay: '300ms' }}>
            <DiffCard 
              num="03" 
              title="Scale-Ready" 
              desc="Desenvolvemos pensando no sucesso. Se amanhã você tiver 1 milhão de usuários, seu sistema não pisca."
            />
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorsSection;
