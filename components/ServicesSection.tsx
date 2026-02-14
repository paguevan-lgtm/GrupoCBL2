
import React from 'react';
import { WebDevIcon } from './icons/WebDevIcon';
import { CustomSystemsIcon } from './icons/CustomSystemsIcon';
import { SaaSIcon } from './icons/SaaSIcon';
import { AutomationIcon } from './icons/AutomationIcon';
import { FadeInOnScroll } from './FadeInOnScroll';

const ServiceTile = ({ icon, title, desc, colSpan = "col-span-1" }: any) => (
  <div className={`${colSpan} group relative bg-white/5 border border-white/10 p-8 rounded-3xl overflow-hidden hover:bg-red-600 transition-all duration-700`}>
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">{icon}</div>
    <div className="relative z-10 h-full flex flex-col justify-between space-y-12">
      <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-white group-hover:text-red-600 transition-colors">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-white">{title}</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest font-bold leading-tight group-hover:text-white/80">{desc}</p>
      </div>
    </div>
  </div>
);

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-24 md:py-40 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <FadeInOnScroll className="max-w-xl">
             <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Expertise_CBL_V4</span>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
               Engenharia <br /> <span className="text-red-600">sem atalhos.</span>
             </h2>
          </FadeInOnScroll>
          <FadeInOnScroll style={{ transitionDelay: '200ms' }} className="max-w-xs pb-2">
             <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
               Decompondo desafios complexos em arquiteturas de software robustas e lucrativas.
             </p>
          </FadeInOnScroll>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <ServiceTile 
            icon={<WebDevIcon />} 
            title="Ecrãs de Elite" 
            desc="Websites que vendem autoridade antes mesmo da primeira frase ser lida." 
            colSpan="md:col-span-2"
          />
          <ServiceTile 
            icon={<CustomSystemsIcon />} 
            title="Sistemas Core" 
            desc="Motores de processamento para logística e finanças." 
          />
          <ServiceTile 
            icon={<SaaSIcon />} 
            title="Arquitetura SaaS" 
            desc="Infraestrutura preparada para escala vertical instantânea." 
          />
          <ServiceTile 
            icon={<AutomationIcon />} 
            title="Automação_UX" 
            desc="Inteligência artificial aplicada ao fluxo de conversão." 
            colSpan="md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
