
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import MissionVisionValuesSection from './components/MissionVisionValuesSection';
import ServicesSection from './components/ServicesSection';
import DifferentiatorsSection from './components/DifferentiatorsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import DiagnosticModal from './components/DiagnosticModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import IntroAnimation from './components/IntroAnimation';
import SeoLocalPage from './components/SeoLocalPage';
import { Toast } from './components/Toast';
import { ScrollProgress } from './components/ui/ScrollProgress';

const MainSite: React.FC<{
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (show: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (show: boolean) => void;
  setIsAdminLoggedIn: (show: boolean) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}> = ({ showIntro, setShowIntro, isModalOpen, setIsModalOpen, isAdminLoginOpen, setIsAdminLoginOpen, setIsAdminLoggedIn, showToast }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#1A1A1A] text-white antialiased selection:bg-red-600 selection:text-white">
      <ScrollProgress />
      {showIntro && <IntroAnimation onFinished={() => setShowIntro(false)} />}
      
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main>
        <HeroSection 
          onOpenModal={() => setIsModalOpen(true)} 
          startAnimation={!showIntro} 
        />
        <AboutSection />
        <MissionVisionValuesSection />
        <ServicesSection />
        <DifferentiatorsSection />
        <CtaSection onOpenModal={() => setIsModalOpen(true)} />
      </main>
      
      <Footer onOpenAdmin={() => setIsAdminLoginOpen(true)} />
      
      <DiagnosticModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onShowToast={showToast}
      />
      
      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsAdminLoggedIn(true);
            localStorage.setItem('cbl_admin_logged_in', 'true');
            navigate('/dashboard');
        }}
        onShowToast={showToast}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('cbl_admin_logged_in') === 'true';
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (showIntro || isModalOpen || isAdminLoginOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showIntro, isModalOpen, isAdminLoginOpen]);

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cbl_admin_logged_in');
  };

  return (
    <Router>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <Routes>
        <Route path="/" element={
          <MainSite 
            showIntro={showIntro} 
            setShowIntro={setShowIntro}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isAdminLoginOpen={isAdminLoginOpen}
            setIsAdminLoginOpen={setIsAdminLoginOpen}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            showToast={showToast}
          />
        } />
        <Route path="/criacao-de-sites-sao-vicente" element={
          <>
            <SeoLocalPage onOpenModal={() => setIsModalOpen(true)} />
            <DiagnosticModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onShowToast={showToast}
            />
          </>
        } />
        <Route path="/dashboard/*" element={
          isAdminLoggedIn ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
