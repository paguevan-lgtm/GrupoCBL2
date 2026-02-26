
import React from 'react';
import { WebDevIcon } from './icons/WebDevIcon';
import { CustomSystemsIcon } from './icons/CustomSystemsIcon';
import { SaaSIcon } from './icons/SaaSIcon';
import { AutomationIcon } from './icons/AutomationIcon';
import { FadeInOnScroll } from './FadeInOnScroll';

const services = [
  {
    num: "01",
    title: "Ecrãs de Elite",
    desc: "Websites que vendem autoridade antes mesmo da primeira frase ser lida.",
    icon: <WebDevIcon />
  },
  {
    num: "02",
    title: "Sistemas Core",
    desc: "Motores de processamento para logística e finanças.",
    icon: <CustomSystemsIcon />
  },
  {
    num: "03",
    title: "Arquitetura SaaS",
    desc: "Infraestrutura preparada para escala vertical instantânea.",
    icon: <SaaSIcon />
  },
  {
    num: "04",
    title: "Automação_UX",
    desc: "Inteligência artificial aplicada ao fluxo de conversão.",
    icon: <AutomationIcon />
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-24 md:py-40 bg-[#050505] relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column - Sticky */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32">
              <FadeInOnScroll>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-red-600"></div>
                  <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em]">
                    Expertise_CBL_V4
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-white uppercase italic leading-[0.85] mb-8">
                  Engenharia <br /> 
                  <span className="text-red-600">sem atalhos.</span>
                </h2>
                <p className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] leading-relaxed max-w-sm">
                  Decompondo desafios complexos em arquiteturas de software robustas e lucrativas.
                </p>
              </FadeInOnScroll>
            </div>
          </div>

          {/* Right Column - Scrolling List */}
          <div className="lg:col-span-7 flex flex-col mt-8 lg:mt-0">
            {services.map((service, index) => (
              <FadeInOnScroll key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="group relative border-t border-white/10 py-12 md:py-16 flex flex-col sm:flex-row gap-8 md:gap-12 items-start sm:items-center transition-colors hover:bg-white/[0.02] -mx-6 px-6 md:mx-0 md:px-8 cursor-default">
                  
                  {/* Number */}
                  <div className="text-6xl md:text-8xl font-black text-white/5 group-hover:text-red-600/20 transition-colors italic tracking-tighter">
                    {service.num}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4 z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                        {service.icon}
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-white/50 uppercase tracking-widest font-bold leading-relaxed max-w-md">
                      {service.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center group-hover:border-red-600 group-hover:bg-red-600 transition-all duration-500 -rotate-45 group-hover:rotate-0 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </FadeInOnScroll>
            ))}
            <div className="border-t border-white/10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
