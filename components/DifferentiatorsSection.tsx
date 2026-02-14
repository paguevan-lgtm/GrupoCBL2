
import React, { useState } from 'react';
import { FadeInOnScroll } from './FadeInOnScroll';
import { DifferentiatorImage1, DifferentiatorImage2, DifferentiatorImage3 } from './icons/DifferentiatorImages';

interface Differentiator {
    number: string;
    title: string;
    description: string;
    image: React.ReactNode;
}

const differentiatorsData: Differentiator[] = [
    {
        number: '1',
        title: 'Pensamento Fora da Caixa',
        description: 'Não usamos templates prontos para resolver problemas complexos. Se a solução não existe, nós a construímos do zero, com uma arquitetura pensada para o seu desafio específico.',
        image: <DifferentiatorImage1 />
    },
    {
        number: '2',
        title: 'Tecnologia + Estratégia',
        description: 'Código limpo é importante, mas código que gera lucro é essencial. Unimos desenvolvimento técnico de ponta com uma visão comercial afiada para garantir que cada linha de código contribua para o seu ROI.',
        image: <DifferentiatorImage2 />
    },
    {
        number: '3',
        title: 'Foco no Resultado',
        description: 'Design bonito é obrigação. Nosso foco está nas métricas, na conversão e na eficiência operacional que entregamos. O sucesso do seu projeto é medido por resultados tangíveis.',
        image: <DifferentiatorImage3 />
    },
];


const DifferentiatorsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [contentPhase, setContentPhase] = useState('entered');
    const [content, setContent] = useState(differentiatorsData[0]);

    const handleSelect = (index: number) => {
        if (index === activeIndex) return;
        setContentPhase('entering');
        setTimeout(() => {
            setActiveIndex(index);
            setContent(differentiatorsData[index]);
            setContentPhase('entered');
        }, 300);
    };

    return (
        <section id="differentiators" className="py-20 md:py-40 bg-[#111] overflow-hidden">
            <div className="container mx-auto px-6">
                <FadeInOnScroll className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                        Por que somos <span className="text-red-600">diferentes?</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6 font-light">
                        O mercado está saturado de soluções genéricas. No Grupo CBL, nós criamos o caminho onde a inovação se torna vantagem competitiva real.
                    </p>
                </FadeInOnScroll>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Coluna Esquerda: Itens Clicáveis */}
                    <div className="space-y-4">
                       {differentiatorsData.map((item, index) => (
                           <FadeInOnScroll key={item.number} style={{ transitionDelay: `${index * 150}ms`}}>
                                <div
                                    onClick={() => handleSelect(index)}
                                    className={`p-6 md:p-8 rounded-xl border-2 cursor-pointer transition-all duration-500 group relative overflow-hidden ${activeIndex === index ? 'border-red-600 bg-red-600/5' : 'border-white/5 hover:border-white/10 hover:bg-white/5'}`}
                                >
                                    {/* Indicador de progresso sutil no item ativo */}
                                    {activeIndex === index && (
                                        <div className="absolute bottom-0 left-0 h-[2px] bg-red-600 animate-[progress_5s_linear_infinite]" style={{ width: '100%' }}></div>
                                    )}
                                    
                                    <div className="flex items-center space-x-6">
                                        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 font-black text-sm ${activeIndex === index ? 'border-red-600 bg-red-600 text-white scale-110 shadow-[0_0_15px_rgba(229,62,62,0.4)]' : 'border-white/20 text-gray-500 group-hover:border-white/40'}`}>
                                            {item.number}
                                        </div>
                                        <h3 className={`text-xl md:text-2xl font-bold transition-all duration-500 tracking-tight ${activeIndex === index ? 'text-white translate-x-2' : 'text-gray-400 group-hover:text-gray-300'}`}>{item.title}</h3>
                                    </div>
                                </div>
                           </FadeInOnScroll>
                       ))}
                    </div>

                    {/* Coluna Direita: Conteúdo Dinâmico */}
                    <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
                         <div className={`differentiator-content ${contentPhase} absolute inset-0 flex flex-col justify-center items-center lg:items-start`}>
                            <div className="relative h-64 lg:h-80 w-full mb-8 perspective-1000">
                                {content.image}
                            </div>
                            <div className="max-w-md">
                                <p className="text-gray-300 leading-relaxed text-center lg:text-left text-lg font-light italic border-l-2 border-red-600/30 pl-4 lg:pl-6">
                                    {content.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </section>
    );
};

export default DifferentiatorsSection;
