
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
import { Toast } from './components/Toast';
import { ScrollProgress } from './components/ui/ScrollProgress';

const MainLayout: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (show: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (show: boolean) => void;
  setIsAdminLoggedIn: (show: boolean) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
  children: React.ReactNode;
}> = ({ isModalOpen, setIsModalOpen, isAdminLoginOpen, setIsAdminLoginOpen, setIsAdminLoggedIn, showToast, children }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#1A1A1A] text-white antialiased selection:bg-red-600 selection:text-white min-h-screen flex flex-col">
      <ScrollProgress />
      <Header onOpenModal={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20 md:pt-24">
        {children}
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
      {showIntro && <IntroAnimation onFinished={() => setShowIntro(false)} />}
      <Routes>
        <Route path="/" element={
          <MainLayout 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isAdminLoginOpen={isAdminLoginOpen}
            setIsAdminLoginOpen={setIsAdminLoginOpen}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            showToast={showToast}
          >
            <HeroSection 
              onOpenModal={() => setIsModalOpen(true)} 
              startAnimation={!showIntro} 
            />
          </MainLayout>
        } />
        <Route path="/quem-somos" element={
          <MainLayout 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isAdminLoginOpen={isAdminLoginOpen}
            setIsAdminLoginOpen={setIsAdminLoginOpen}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            showToast={showToast}
          >
            <AboutSection />
            <MissionVisionValuesSection />
          </MainLayout>
        } />
        <Route path="/expertise" element={
          <MainLayout 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isAdminLoginOpen={isAdminLoginOpen}
            setIsAdminLoginOpen={setIsAdminLoginOpen}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            showToast={showToast}
          >
            <ServicesSection />
          </MainLayout>
        } />
        <Route path="/diferenciais" element={
          <MainLayout 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isAdminLoginOpen={isAdminLoginOpen}
            setIsAdminLoginOpen={setIsAdminLoginOpen}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            showToast={showToast}
          >
            <DifferentiatorsSection />
          </MainLayout>
        } />
        <Route path="/contato" element={
          <MainLayout 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isAdminLoginOpen={isAdminLoginOpen}
            setIsAdminLoginOpen={setIsAdminLoginOpen}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            showToast={showToast}
          >
            <CtaSection onOpenModal={() => setIsModalOpen(true)} />
          </MainLayout>
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
