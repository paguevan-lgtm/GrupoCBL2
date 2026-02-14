
import React, { useState, useEffect } from 'react';
import { Logo } from './icons/Logo';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-gray-400 hover:text-white transition-colors duration-300 text-[10px] font-black uppercase tracking-[0.2em]"
  >
    {children}
  </a>
);

const Header: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const closeMenu = () => setIsOpen(false);
  
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMenu();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMenu();
    onOpenModal();
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5 md:py-8'} ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <a href="#hero" className="transition-transform hover:scale-105 active:scale-95" onClick={(e) => handleNavLinkClick(e, '#hero')}>
            <Logo className="h-6 md:h-8 w-auto origin-left transform scale-90 md:scale-100" />
          </a>
          
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink href="#about" onClick={(e) => handleNavLinkClick(e, '#about')}>Quem Somos</NavLink>
            <NavLink href="#services" onClick={(e) => handleNavLinkClick(e, '#services')}>Expertise</NavLink>
            <NavLink href="#differentiators" onClick={(e) => handleNavLinkClick(e, '#differentiators')}>Diferenciais</NavLink>
            <NavLink href="#contact" onClick={(e) => handleNavLinkClick(e, '#contact')}>Contato</NavLink>
            <a href="#" onClick={handleContactClick} className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer shadow-lg shadow-white/5 active:scale-95">
              Iniciar Projeto
            </a>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none p-2 rounded-lg bg-white/5 border border-white/10 active:scale-90 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-black/98 backdrop-blur-3xl transition-all duration-500 z-[-1] md:hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <nav className="flex flex-col items-center justify-center h-full space-y-10 px-10">
          <NavLink href="#about" onClick={(e) => handleNavLinkClick(e, '#about')}>Quem Somos</NavLink>
          <NavLink href="#services" onClick={(e) => handleNavLinkClick(e, '#services')}>Expertise</NavLink>
          <NavLink href="#differentiators" onClick={(e) => handleNavLinkClick(e, '#differentiators')}>Diferenciais</NavLink>
          <NavLink href="#contact" onClick={(e) => handleNavLinkClick(e, '#contact')}>Contato</NavLink>
          <a href="#" onClick={handleContactClick} className="bg-red-600 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] w-full text-center shadow-2xl shadow-red-600/20 active:scale-95 transition-all">
            Iniciar Projeto
          </a>
          <button onClick={closeMenu} className="text-white/30 uppercase text-[9px] font-black tracking-[0.5em] pt-10">Fechar_Menu</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
