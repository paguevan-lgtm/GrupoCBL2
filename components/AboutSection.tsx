
import React from 'react';
import { StrategicVisionIcon } from './icons/StrategicVisionIcon';
import { HighPerformanceIcon } from './icons/HighPerformanceIcon';
import { FadeInOnScroll } from './FadeInOnScroll';

const StatBlock = ({ label, value }: { label: string, value: string }) => (
  <div className="border-l border-white/10 pl-4 md:pl-6 py-1">
    <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">{label}</span>
    <span className="block text-xl md:text-2xl font-black text-white italic tracking-tighter">{value}</span>
  </div>
);

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-40 relative bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <FadeInOnScroll className="space-y-10 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-6 md:w-8 h-px bg-red-600"></span>
                <span className="text-red-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em]">Protocolo_Identidade_V1</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-[0.95] uppercase italic">
                Sua vantagem <br /> <span className="text-red-600">competitiva</span> <br /> <span className="text-white/20">é nosso código.</span>
              </h2>
              <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-lg">
                O Grupo CBL opera no limiar entre a estratégia de negócios e a engenharia bruta. Não entregamos apenas software; entregamos dominação de mercado através de tecnologia proprietária.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-8 border-t border-white/5 pt-8 md:pt-10">
              <StatBlock label="Performance" value="99.9%" />
              <StatBlock label="Segurança" value="AES-256" />
              <StatBlock label="ROI Médio" value="+412%" />
              <StatBlock label="Uptime" value="24/7/365" />
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll style={{ transitionDelay: '300ms' }} className="relative mt-8 lg:mt-0">
             <div className="relative p-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-3xl overflow-hidden tech-border">
                <div className="bg-[#0A0A0A] rounded-[22px] overflow-hidden p-6 md:p-12 space-y-8 md:space-y-10 relative">
                   {/* HUD Decor */}
                   <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-1">
                      <div className="w-0.5 h-3 md:w-1 md:h-4 bg-red-600"></div>
                      <div className="w-0.5 h-2 md:w-1 md:h-3 bg-red-600/50"></div>
                      <div className="w-0.5 h-1 md:w-1 md:h-2 bg-red-600/20"></div>
                   </div>

                   <div className="space-y-6 md:space-y-8">
                      <div className="flex items-start gap-4 md:gap-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 border border-red-600/20">
                          <StrategicVisionIcon />
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase text-xs md:text-sm tracking-widest mb-1 md:mb-2 italic">Visão Disruptiva</h4>
                          <p className="text-[10px] md:text-xs text-white/50 leading-relaxed uppercase tracking-tight">Análise de lacunas de mercado e criação de soluções que tornam a concorrência irrelevante.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 md:gap-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 border border-red-600/20">
                          <HighPerformanceIcon />
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase text-xs md:text-sm tracking-widest mb-1 md:mb-2 italic">Escala Infinita</h4>
                          <p className="text-[10px] md:text-xs text-white/50 leading-relaxed uppercase tracking-tight">Arquitetura de microsserviços desenhada para suportar hipercrescimento sem degradação de performance.</p>
                        </div>
                      </div>
                   </div>

                   <div className="bg-black/50 border border-white/5 p-5 md:p-6 rounded-2xl relative overflow-hidden">
                      <p className="text-xs md:text-sm text-white italic font-medium leading-relaxed relative z-10">
                        "O Grupo CBL não usa templates. Construímos do zero a infraestrutura que vai carregar o seu faturamento para o próximo dígito."
                      </p>
                      <span className="block mt-4 text-[8px] font-black text-red-600 uppercase tracking-widest relative z-10">— ENGENHARIA_CBL_DRAFT</span>
                      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                         <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                      </div>
                   </div>
                </div>
             </div>
          </FadeInOnScroll>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
