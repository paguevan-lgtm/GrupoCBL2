
import React from 'react';
import { StrategicVisionIcon } from './icons/StrategicVisionIcon';
import { HighPerformanceIcon } from './icons/HighPerformanceIcon';
import { Solutions360Icon } from './icons/Solutions360Icon';
import { FadeInOnScroll } from './FadeInOnScroll';

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-start gap-4 bg-black/20 p-6 rounded-lg border border-white/10">
    <div className="flex-shrink-0 text-red-500">{icon}</div>
    <div>
      <h3 className="font-bold text-lg mb-1 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden bg-[#111]">
      <div className="absolute top-0 right-0 -mt-40 -mr-40 text-white/5 text-9xl font-black select-none z-0">CBL</div>
      <div className="container mx-auto px-6 z-10 relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeInOnScroll>
            <div className="space-y-6">
              <p className="text-red-500 font-bold tracking-widest uppercase">Quem Somos</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Não somos apenas uma <span className="text-gray-400">agência</span>. Somos um <span className="text-white">motor de negócios.</span>
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                      O Grupo CBL é uma holding multifuncional focada em inovação e alta performance. Atuamos onde a tecnologia pode gerar alavancagem de resultados.
                  </p>
                  <p>
                      Não nos limitamos ao básico. Nosso core é o desenvolvimento de soluções digitais sob medida, inteligência de dados e automação de processos. Entregamos o que o mercado exige: velocidade e eficiência.
                  </p>
              </div>
              <div className="border-l-4 border-red-600 pl-6 py-2">
                  <p className="text-lg italic text-gray-300">
                      "Não vendemos apenas código. Entregamos autoridade, escalabilidade e novos canais de receita para sua empresa."
                  </p>
              </div>
            </div>
          </FadeInOnScroll>
          <div className="space-y-6">
            <FadeInOnScroll style={{ transitionDelay: '100ms' }}>
                <FeatureCard 
                icon={<StrategicVisionIcon />}
                title="Visão Estratégica"
                description="Identificamos lacunas no mercado e criamos a ponte tecnológica para preenchê-las com lucro."
                />
            </FadeInOnScroll>
            <FadeInOnScroll style={{ transitionDelay: '200ms' }}>
                <FeatureCard 
                icon={<HighPerformanceIcon />}
                title="Alta Performance"
                description="Sistemas rápidos, interfaces fluidas e infraestrutura robusta para suportar o crescimento do seu negócio."
                />
            </FadeInOnScroll>
            <FadeInOnScroll style={{ transitionDelay: '300ms' }}>
                <FeatureCard 
                icon={<Solutions360Icon />}
                title="Soluções 360°"
                description="Do design da interface à arquitetura de banco de dados. Resolvemos o problema de ponta a ponta."
                />
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
