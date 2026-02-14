
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import DifferentiatorsSection from './components/DifferentiatorsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import DiagnosticModal from './components/DiagnosticModal';
import ImagineSiteModal from './components/ImagineSiteModal';
import IntroAnimation from './components/IntroAnimation';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImagineModalOpen, setIsImagineModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Impede a rolagem durante a introdução E quando modais estão abertos
  useEffect(() => {
    if (showIntro || isModalOpen || isImagineModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showIntro, isModalOpen, isImagineModalOpen]);

  return (
    <div className="bg-[#1A1A1A] text-white antialiased">
      {showIntro && <IntroAnimation onFinished={() => setShowIntro(false)} />}
      
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main>
        <HeroSection 
          onOpenModal={() => setIsModalOpen(true)} 
          onOpenImagineModal={() => setIsImagineModalOpen(true)}
          startAnimation={!showIntro} 
        />
        <AboutSection />
        <ServicesSection />
        <DifferentiatorsSection />
        <CtaSection onOpenModal={() => setIsModalOpen(true)} />
      </main>
      <Footer />
      <DiagnosticModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ImagineSiteModal isOpen={isImagineModalOpen} onClose={() => setIsImagineModalOpen(false)} />
    </div>
  );
};

export default App;
