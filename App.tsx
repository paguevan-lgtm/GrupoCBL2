
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import MissionVisionValuesSection from './components/MissionVisionValuesSection';
import ServicesSection from './components/ServicesSection';
import DifferentiatorsSection from './components/DifferentiatorsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import DiagnosticModal from './components/DiagnosticModal';
import ImagineSiteModal from './components/ImagineSiteModal';
import NeuroSalesModal from './components/NeuroSalesModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import IntroAnimation from './components/IntroAnimation';
import { Toast } from './components/Toast';
import { ScrollProgress } from './components/ui/ScrollProgress';

import InternalBrowser from './components/InternalBrowser';

const App: React.FC = () => {
  // Estados do Site Público
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImagineModalOpen, setIsImagineModalOpen] = useState(false);
  const [isNeuroModalOpen, setIsNeuroModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  
  // Estados Administrativos
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Impede a rolagem durante a introdução E quando modais estão abertos
  useEffect(() => {
    if (showIntro || isModalOpen || isImagineModalOpen || isNeuroModalOpen || isAdminLoginOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showIntro, isModalOpen, isImagineModalOpen, isNeuroModalOpen, isAdminLoginOpen]);

  // Se o Admin estiver logado, renderiza APENAS o Dashboard (O site principal "some")
  if (isAdminLoggedIn) {
    return (
      <>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
        <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />
        <InternalBrowser isOpen={isBrowserOpen} onClose={() => setIsBrowserOpen(false)} />
        
        {/* Floating Toggle for Browser when Admin is logged in */}
        {!isBrowserOpen && (
            <button 
                onClick={() => setIsBrowserOpen(true)}
                className="fixed bottom-4 right-4 z-50 bg-[#0A0A0A] border border-white/10 text-white p-3 rounded-full shadow-2xl hover:bg-white/10 transition-all group"
                title="Abrir Navegador Interno"
            >
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </button>
        )}
      </>
    );
  }

  // Renderização do Site Público
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
          onOpenNeuroModal={() => setIsNeuroModalOpen(true)}
          startAnimation={!showIntro} 
        />
        <AboutSection />
        <MissionVisionValuesSection />
        <ServicesSection />
        <DifferentiatorsSection />
        <CtaSection onOpenModal={() => setIsModalOpen(true)} />
      </main>
      
      {/* Footer recebe a função para abrir o login admin */}
      <Footer onOpenAdmin={() => setIsAdminLoginOpen(true)} />
      
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

      <NeuroSalesModal 
        isOpen={isNeuroModalOpen}
        onClose={() => setIsNeuroModalOpen(false)}
        onOpenDiagnostic={() => {
          setIsNeuroModalOpen(false);
          setTimeout(() => setIsModalOpen(true), 300);
        }}
        onShowToast={showToast}
      />

      {/* Modal de Login Admin */}
      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsAdminLoggedIn(true);
        }}
        onShowToast={showToast}
      />
    </div>
  );
};

export default App;
