
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './icons/Logo';

const NavLink: React.FC<{ 
  href: string; 
  isActive: boolean;
  children: React.ReactNode; 
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void 
}> = ({ href, isActive, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] relative group py-2
      ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
    `}
  >
    {children}
    <span className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></span>
  </a>
);

const Header: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Bloqueio de scroll quando o menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen]);

  // Scroll Spy e Header Hide/Show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Hide/Show Logic
      if (!isOpen && currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  const closeMenu = () => setIsOpen(false);
  
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMenu();
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMenu();
    onOpenModal();
  };

  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 
    ${isOpen ? 'bg-transparent border-transparent' : (isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-lg' : 'bg-transparent py-5 md:py-8')} 
    ${isHidden ? '-translate-y-full' : 'translate-y-0'}`;

  const navLinks = [
    { href: '/quem-somos', label: 'Quem Somos' },
    { href: '/expertise', label: 'Expertise' },
    { href: '/diferenciais', label: 'Diferenciais' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <>
      <header className={headerClasses}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <a href="/" className="transition-transform hover:scale-105 active:scale-95 group" onClick={(e) => handleNavLinkClick(e, '/')}>
              <Logo className="h-6 md:h-8 w-auto origin-left transform scale-90 md:scale-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all" />
            </a>
            
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.href}
                  href={link.href} 
                  isActive={location.pathname === link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                >
                  {link.label}
                </NavLink>
              ))}
              <a href="#" onClick={handleContactClick} className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer shadow-lg shadow-white/5 hover:shadow-red-600/30 active:scale-95 border border-transparent hover:border-red-500/50">
                Iniciar Projeto
              </a>
            </nav>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none p-2 rounded-lg bg-white/5 border border-white/10 active:scale-90 transition-all relative z-50 hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-black/98 backdrop-blur-3xl transition-all duration-500 z-40 md:hidden flex flex-col items-center justify-center ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center justify-center space-y-8 px-10 w-full">
          {navLinks.map((link) => (
             <a 
               key={link.href}
               href={link.href} 
               onClick={(e) => handleNavLinkClick(e, link.href)}
               className={`text-2xl font-black uppercase tracking-tighter transition-all ${location.pathname === link.href ? 'text-red-600 scale-110' : 'text-white/60 hover:text-white'}`}
             >
                {link.label}
             </a>
          ))}
          <div className="w-12 h-0.5 bg-white/10 my-4"></div>
          <a href="#" onClick={handleContactClick} className="bg-red-600 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] w-full text-center shadow-2xl shadow-red-600/20 active:scale-95 transition-all">
            Iniciar Projeto
          </a>
          <button onClick={closeMenu} className="text-white/30 uppercase text-[9px] font-black tracking-[0.5em] pt-10 hover:text-white transition-colors">Fechar_Menu</button>
        </nav>
      </div>
    </>
  );
};

export default Header;
