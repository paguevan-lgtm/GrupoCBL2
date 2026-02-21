import React from 'react';
import { FadeInOnScroll } from './FadeInOnScroll';
import { Target, Eye, Shield } from 'lucide-react';

const Card = ({ icon: Icon, title, subtitle, description, delay }: { icon: any, title: string, subtitle: string, description: string, delay: string }) => (
  <div className="group relative h-full">
    <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
    
    <div className="relative h-full bg-[#0A0A0A] border border-white/10 hover:border-red-600/30 rounded-3xl p-8 flex flex-col transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Icon size={120} strokeWidth={0.5} />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-auto">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 text-white/50">
          <Icon size={24} />
        </div>
        <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">{subtitle}</span>
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h3>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-8">
        <p className="text-sm text-white/60 font-light leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {description}
        </p>
        
        {/* Decorative Line */}
        <div className="w-full h-px bg-white/10 mt-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-red-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
        </div>
      </div>
    </div>
  </div>
);

const MissionVisionValuesSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <FadeInOnScroll className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-red-600"></span>
            <span className="text-red-600 font-black text-[9px] uppercase tracking-[0.4em]">Core_Directives_V2</span>
            <span className="w-8 h-px bg-red-600"></span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] uppercase italic mb-6">
            O código moral <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">da nossa existência.</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base font-light max-w-xl mx-auto">
            Não somos apenas uma empresa de software. Somos uma ideologia de performance, precisão e dominação de mercado manifestada em código.
          </p>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <FadeInOnScroll style={{ transitionDelay: '0ms' }} className="h-full">
            <Card 
              icon={Target}
              subtitle="Diretriz Primária"
              title="Missão"
              description="Erradicar a ineficiência digital. Nossa missão é armar empresas visionárias com tecnologia de nível militar para obliterar a concorrência e estabelecer novos padrões de mercado."
              delay="0ms"
            />
          </FadeInOnScroll>

          <FadeInOnScroll style={{ transitionDelay: '150ms' }} className="h-full">
            <Card 
              icon={Eye}
              subtitle="Horizonte Evento"
              title="Visão"
              description="Ser a infraestrutura invisível e onipresente por trás dos maiores impérios digitais do próximo século. Onde houver sucesso em escala, haverá uma linha de código do Grupo CBL."
              delay="150ms"
            />
          </FadeInOnScroll>

          <FadeInOnScroll style={{ transitionDelay: '300ms' }} className="h-full">
            <Card 
              icon={Shield}
              subtitle="Protocolos Base"
              title="Valores"
              description="1. Precisão Cirúrgica: O erro é inaceitável. 2. Inovação Radical: O status quo é o inimigo. 3. Lealdade ao Código: Entregamos o que prometemos, custe o que custar."
              delay="300ms"
            />
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionValuesSection;
