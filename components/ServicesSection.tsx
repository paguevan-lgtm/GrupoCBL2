
import React, { useState } from 'react';
import { WebDevIcon } from './icons/WebDevIcon';
import { CustomSystemsIcon } from './icons/CustomSystemsIcon';
import { SaaSIcon } from './icons/SaaSIcon';
import { AutomationIcon } from './icons/AutomationIcon';
import { MobileIcon } from './icons/MobileIcon';
import { ConsultingIcon } from './icons/ConsultingIcon';
import { FadeInOnScroll } from './FadeInOnScroll';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, isActive }) => (
  <div className={`bg-[#1C1C1C] h-full p-8 rounded-lg border hover:-translate-y-2 transition-all duration-300 space-y-4 group ${isActive ? 'border-red-600/50 shadow-[0_0_25px_rgba(229,62,62,0.3)]' : 'border-white/10'}`}>
    <div className={`transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}>{icon}</div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
    <div className={`w-8 h-px transition-colors duration-300 ${isActive ? 'bg-red-500' : 'bg-white/20 group-hover:bg-red-500'}`}></div>
  </div>
);

const ServicesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Default active card is "Sistemas Sob Medida"

  const services = [
    {
      icon: <WebDevIcon />,
      title: 'Desenvolvimento Web',
      description: 'Sites institucionais de alto impacto, landing pages que convertem e portais corporativos robustos.'
    },
    {
      icon: <CustomSystemsIcon />,
      title: 'Sistemas Sob Medida',
      description: 'Softwares desenhados especificamente para a regra de negócio da sua empresa. Nada de adaptações forçadas.'
    },
    {
      icon: <SaaSIcon />,
      title: 'Plataformas SaaS',
      description: 'Transformamos sua ideia de startup em um produto digital escalável, seguro e pronto para o mercado.'
    },
    {
      icon: <AutomationIcon />,
      title: 'Automação de Processos',
      description: 'Eliminamos trabalho manual repetitivo integrando sistemas e criando bots inteligentes.'
    },
    {
      icon: <MobileIcon />,
      title: 'Soluções Mobile',
      description: 'APIs e interfaces responsivas que garantem que seu negócio esteja na palma da mão do cliente.'
    },
     {
      icon: <ConsultingIcon />,
      title: 'Consultoria Tech',
      description: 'Análise de dados e tecnologia aplicada para descobrir onde seu negócio está deixando dinheiro na mesa.'
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-[#1A1A1A]">
      <div className="container mx-auto px-6 text-center">
        <FadeInOnScroll>
          <p className="text-red-500 font-bold tracking-widest uppercase mb-2">Nossa Expertise</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-16">Engenharia de Oportunidades</h2>
        </FadeInOnScroll>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" onMouseLeave={() => setActiveIndex(1)}>
          {services.map((service, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <FadeInOnScroll style={{ transitionDelay: `${index * 100}ms`}}>
                  <ServiceCard {...service} isActive={index === activeIndex} />
              </FadeInOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
