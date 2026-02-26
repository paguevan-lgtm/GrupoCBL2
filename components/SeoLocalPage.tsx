import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { FadeInOnScroll } from './FadeInOnScroll';
import { WebDevIcon } from './icons/WebDevIcon';
import { CustomSystemsIcon } from './icons/CustomSystemsIcon';
import { AutomationIcon } from './icons/AutomationIcon';

const SeoLocalPage: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Basic SEO Meta Tags Update
    document.title = "Criação de Sites em São Vicente - SP | Grupo CBL";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Especialistas em Criação de Sites em São Vicente. Desenvolvemos sites de alta performance, focados em conversão e autoridade para o seu negócio na Baixada Santista.');
    
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-red-600 selection:text-white">
      <Header onOpenModal={onOpenModal} />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24">
          <FadeInOnScroll>
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                Agência Especializada na Baixada Santista
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.85] mb-8">
                Criação de Sites em <br className="hidden md:block" />
                <span className="text-red-600">São Vicente</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                Transformamos negócios locais em autoridades digitais. Desenvolvemos plataformas web de alta performance focadas em conversão para empresas na região de São Vicente e Baixada Santista.
              </p>
              <button 
                onClick={onOpenModal}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:-translate-y-1"
              >
                Solicitar Diagnóstico Gratuito
              </button>
            </div>
          </FadeInOnScroll>
        </section>

        {/* Detalhamento do Serviço */}
        <section className="bg-[#0a0a0a] py-24 border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeInOnScroll>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-6">
                  Por que sua empresa precisa de um site <span className="text-red-600">profissional?</span>
                </h2>
                <div className="space-y-6 text-white/60 leading-relaxed">
                  <p>
                    Em um mercado competitivo como o de São Vicente e região, depender apenas de redes sociais é um risco para o seu negócio. Um site próprio é o seu terreno na internet, onde você dita as regras e constrói autoridade inabalável.
                  </p>
                  <p>
                    Nossa metodologia de <strong>Criação de Sites em São Vicente</strong> não se baseia em templates genéricos. Nós aplicamos engenharia de software avançada para criar o que chamamos de "Ecrãs de Elite": plataformas desenhadas especificamente para capturar a atenção, reter o usuário e converter visitantes em clientes de alto valor.
                  </p>
                  <p>
                    Seja você um escritório de advocacia no Centro, uma clínica de estética no Itararé, ou uma empresa de logística na região, nós construímos a infraestrutura digital que posiciona sua marca como líder do segmento.
                  </p>
                </div>
              </FadeInOnScroll>
              <FadeInOnScroll style={{ transitionDelay: '200ms' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <div className="text-red-600 mb-6"><WebDevIcon /></div>
                    <h3 className="text-xl font-black uppercase italic mb-2">Design Exclusivo</h3>
                    <p className="text-sm text-white/50">Interfaces luxuosas que comunicam valor e profissionalismo instantaneamente.</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <div className="text-red-600 mb-6"><CustomSystemsIcon /></div>
                    <h3 className="text-xl font-black uppercase italic mb-2">Performance</h3>
                    <p className="text-sm text-white/50">Carregamento ultrarrápido otimizado para dispositivos móveis e desktop.</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-2xl border border-white/10 sm:col-span-2">
                    <div className="text-red-600 mb-6"><AutomationIcon /></div>
                    <h3 className="text-xl font-black uppercase italic mb-2">Otimização SEO Local</h3>
                    <p className="text-sm text-white/50">Estrutura técnica preparada para dominar as buscas no Google por serviços "perto de mim" em São Vicente e Baixada Santista.</p>
                  </div>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* Diferenciais e Benefícios */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">
                  O Padrão <span className="text-red-600">CBL</span>
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  Não somos apenas uma agência de criação de sites. Somos parceiros estratégicos de tecnologia focados no crescimento do seu faturamento.
                </p>
              </div>
            </FadeInOnScroll>

            <div className="space-y-8">
              {[
                { title: "Autoridade Imediata", desc: "Seu site será o seu melhor vendedor, trabalhando 24 horas por dia, 7 dias por semana, apresentando sua empresa com o mais alto nível de sofisticação." },
                { title: "Foco em Conversão (UX/UI)", desc: "Cada botão, cada texto e cada imagem são posicionados estrategicamente para guiar o visitante até o contato ou compra." },
                { title: "Tecnologia de Ponta", desc: "Utilizamos as mesmas tecnologias adotadas pelas maiores empresas do mundo (React, Next.js, Node.js) garantindo segurança e escalabilidade." }
              ].map((item, idx) => (
                <FadeInOnScroll key={idx} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="flex flex-col md:flex-row gap-6 items-start bg-white/[0.02] p-8 rounded-2xl border border-white/5 hover:border-red-600/30 transition-colors">
                    <div className="text-4xl font-black text-red-600/20 italic tracking-tighter shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic mb-3">{item.title}</h3>
                      <p className="text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            <div className="mt-16 text-center">
              <button 
                onClick={onOpenModal}
                className="border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-300"
              >
                Falar com um Especialista
              </button>
            </div>
          </div>
        </section>

        {/* Prova Social / Localização */}
        <section className="bg-red-600 py-20 text-black">
          <div className="container mx-auto px-6 text-center">
            <FadeInOnScroll>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-6">
                Atendimento Especializado na Baixada Santista
              </h2>
              <p className="text-black/80 font-medium max-w-3xl mx-auto text-lg mb-8">
                O Grupo CBL atende empresas de todos os portes em São Vicente, Santos, Praia Grande, Guarujá e Cubatão. Entendemos a dinâmica do mercado local e aplicamos estratégias globais para destacar o seu negócio na região.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['Centro', 'Itararé', 'Gonzaguinha', 'Biquinha', 'Vila Valença', 'Jardim Independência'].map(bairro => (
                  <span key={bairro} className="bg-black/10 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    {bairro}
                  </span>
                ))}
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <FadeInOnScroll>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-12 text-center">
                Perguntas <span className="text-red-600">Frequentes</span>
              </h2>
            </FadeInOnScroll>
            
            <div className="space-y-6">
              <FadeInOnScroll>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-black uppercase italic mb-3">Qual o prazo para criação de um site?</h3>
                  <p className="text-white/60">O desenvolvimento de um projeto de alta performance leva em média de 15 a 30 dias, dependendo da complexidade e das integrações necessárias.</p>
                </div>
              </FadeInOnScroll>
              <FadeInOnScroll style={{ transitionDelay: '100ms' }}>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-black uppercase italic mb-3">Vocês fazem a manutenção do site?</h3>
                  <p className="text-white/60">Sim. Oferecemos planos de suporte contínuo para garantir que seu site esteja sempre atualizado, seguro e performando perfeitamente.</p>
                </div>
              </FadeInOnScroll>
              <FadeInOnScroll style={{ transitionDelay: '200ms' }}>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-black uppercase italic mb-3">O site vai aparecer no Google?</h3>
                  <p className="text-white/60">Com certeza. Todos os nossos sites são desenvolvidos com as melhores práticas de SEO On-Page, otimizados para ranquear em buscas locais como "especialista em [seu serviço] em São Vicente".</p>
                </div>
              </FadeInOnScroll>
              <FadeInOnScroll style={{ transitionDelay: '300ms' }}>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-black uppercase italic mb-3">Atendem apenas São Vicente?</h3>
                  <p className="text-white/60">Não. Nossa base de atuação forte é a Baixada Santista (São Vicente, Santos, Praia Grande), mas atendemos clientes em todo o Brasil e no exterior devido à natureza digital dos nossos serviços.</p>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 border-t border-white/10">
          <div className="container mx-auto px-6 text-center">
            <FadeInOnScroll>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6">
                Pronto para dominar o <br/>
                <span className="text-red-600">mercado digital?</span>
              </h2>
              <p className="text-white/50 mb-10 max-w-xl mx-auto">
                Não deixe seus concorrentes capturarem os clientes que estão buscando pelos seus serviços agora mesmo no Google.
              </p>
              <button 
                onClick={onOpenModal}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-lg transition-all duration-300 shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:-translate-y-1"
              >
                Quero um Site de Elite
              </button>
            </FadeInOnScroll>
          </div>
        </section>

      </main>

      <Footer onOpenAdmin={() => {}} />
    </div>
  );
};

export default SeoLocalPage;
