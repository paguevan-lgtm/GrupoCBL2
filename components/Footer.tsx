
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './icons/Logo';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationIcon } from './icons/LocationIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { EmailIcon } from './icons/EmailIcon';

interface FooterProps {
    onOpenAdmin?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      e.preventDefault();
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
      { label: 'Quem Somos', path: '/quem-somos' },
      { label: 'Expertise', path: '/expertise' },
      { label: 'Diferenciais', path: '/diferenciais' },
      { label: 'Contato', path: '/contato' }
  ];

  return (
    <footer className="bg-black py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background Element - Adjusted for mobile visibility */}
      <div className="absolute bottom-0 right-0 text-[35vw] md:text-[20vw] font-black text-white/[0.02] leading-none pointer-events-none select-none -mb-6 -mr-6 md:-mb-10 md:-mr-10 italic">
        CBL
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-12 gap-16 md:gap-8">
            {/* Col 1: Brand - Centered on mobile */}
            <div className="md:col-span-5 flex flex-col items-center text-center md:items-start md:text-left space-y-8">
                <Logo className="scale-110 md:scale-125 origin-center md:origin-left" />
                <p className="text-white/60 text-base md:text-lg max-w-sm font-light leading-relaxed">
                    Elevando o padrão da tecnologia no Brasil através de engenharia rigorosa e design de alta performance.
                </p>
                <div className="flex space-x-8 pt-4">
                    <a href="https://instagram.com/grupocbl" target="_blank" className="text-white/30 hover:text-white transition-all transform hover:scale-110"><InstagramIcon /></a>
                    <a href="mailto:contato@grupocbl.com" className="text-white/30 hover:text-white transition-all transform hover:scale-110"><EmailIcon /></a>
                </div>
            </div>

            {/* Col 2: Navigation - Centered on mobile */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start space-y-8">
                <h4 className="font-black text-white text-[10px] tracking-[0.4em] uppercase border-b border-white/10 pb-4 w-full text-center md:text-left">Navegação</h4>
                <nav className="flex flex-col items-center md:items-start space-y-4">
                    {navLinks.map((item) => (
                      <a 
                        key={item.label} 
                        href={item.path} 
                        onClick={(e) => handleNavClick(e, item.path)}
                        className="text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                      >
                        {item.label}
                      </a>
                    ))}
                </nav>
            </div>

            {/* Col 3: Contact Details - ULTRA HIGH CONTRAST - Centered on mobile */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-8">
                 <h4 className="font-black text-white text-[10px] tracking-[0.4em] uppercase border-b border-white/10 pb-4 w-full text-center md:text-left">Conectividade</h4>
                 <div className="space-y-8 flex flex-col items-center md:items-start">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 group">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                          <PhoneIcon className="scale-125" />
                        </div>
                        <div className="space-y-1 text-center md:text-left">
                            <span className="block font-black text-red-600 text-[9px] uppercase tracking-widest">WhatsApp Comercial</span>
                            <span className="text-white text-xl font-black tracking-tight">(13) 99603-3433</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500">
                          <LocationIcon className="scale-125" />
                        </div>
                        <div className="space-y-1 text-center md:text-left">
                            <span className="block font-black text-white/30 text-[9px] uppercase tracking-widest">Escritório Central</span>
                            <span className="text-white text-base font-bold">São Paulo, SP — Brasil</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] text-center md:text-left">
              &copy; {new Date().getFullYear()} Grupo CBL Soluções Digitais. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                <a href="#" className="text-[9px] text-white/20 hover:text-white font-black uppercase tracking-widest transition-colors">Políticas de Segurança</a>
                
                {/* Botão de Admin Discreto */}
                {onOpenAdmin && (
                    <button 
                        onClick={(e) => { e.preventDefault(); onOpenAdmin(); }}
                        className="text-white/10 hover:text-white/40 transition-colors p-2"
                        title="Acesso Administrativo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
