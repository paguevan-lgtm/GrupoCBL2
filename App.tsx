
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
import { Toast } from './components/Toast';
import { ScrollProgress } from './components/ui/ScrollProgress';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImagineModalOpen, setIsImagineModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Impede a rolagem durante a introdução E quando modais estão abertos
  useEffect(() => {
    if (showIntro || isModalOpen || isImagineModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showIntro, isModalOpen, isImagineModalOpen]);

  return (
    <div className="bg-[#1A1A1A] text-white antialiased selection:bg-red-600 selection:text-white">
      {/* Componentes de UI Globais */}
      <ScrollProgress />
      
      {showIntro && <IntroAnimation onFinished={() => setShowIntro(false)} />}
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
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
      
      <DiagnosticModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onShowToast={showToast}
      />
      
      <ImagineSiteModal 
        isOpen={isImagineModalOpen} 
        onClose={() => setIsImagineModalOpen(false)} 
        onShowToast={showToast}
      />
    </div>
  );
};

export default App;
