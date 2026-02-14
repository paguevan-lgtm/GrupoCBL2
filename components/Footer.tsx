
import React from 'react';
import { Logo } from './icons/Logo';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationIcon } from './icons/LocationIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { EmailIcon } from './icons/EmailIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute bottom-0 right-0 text-[20vw] font-black text-white/[0.02] leading-none pointer-events-none select-none -mb-10 -mr-10 italic">CBL</div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-12 gap-16 md:gap-8">
            {/* Col 1: Brand */}
            <div className="md:col-span-5 space-y-8">
                <Logo className="scale-125 origin-left" />
                <p className="text-white/60 text-lg max-w-sm font-light leading-relaxed">
                    Elevando o padrão da tecnologia no Brasil através de engenharia rigorosa e design de alta performance.
                </p>
                <div className="flex space-x-8 pt-4">
                    <a href="https://instagram.com/grupocbl" target="_blank" className="text-white/30 hover:text-white transition-all transform hover:scale-110"><InstagramIcon /></a>
                    <a href="mailto:contato@grupocbl.com" className="text-white/30 hover:text-white transition-all transform hover:scale-110"><EmailIcon /></a>
                </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="md:col-span-3 space-y-8">
                <h4 className="font-black text-white text-[10px] tracking-[0.4em] uppercase border-b border-white/10 pb-4">Navegação</h4>
                <nav className="flex flex-col space-y-4">
                    {['Quem Somos', 'Expertise', 'Diferenciais', 'Contato'].map((item) => (
                      <a key={item} href={`#${item.toLowerCase()}`} className="text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{item}</a>
                    ))}
                </nav>
            </div>

            {/* Col 3: Contact Details - ULTRA HIGH CONTRAST */}
            <div className="md:col-span-4 space-y-8">
                 <h4 className="font-black text-white text-[10px] tracking-[0.4em] uppercase border-b border-white/10 pb-4">Conectividade</h4>
                 <div className="space-y-8">
                    <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                          <PhoneIcon className="scale-125" />
                        </div>
                        <div className="space-y-1">
                            <span className="block font-black text-red-600 text-[9px] uppercase tracking-widest">WhatsApp Comercial</span>
                            <span className="text-white text-xl font-black tracking-tight">(13) 99774-4720</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500">
                          <LocationIcon className="scale-125" />
                        </div>
                        <div className="space-y-1">
                            <span className="block font-black text-white/30 text-[9px] uppercase tracking-widest">Escritório Central</span>
                            <span className="text-white text-base font-bold">São Paulo, SP — Brasil</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} Grupo CBL Soluções Digitais. All Rights Reserved.
            </p>
            <div className="flex gap-10">
                <a href="#" className="text-[9px] text-white/20 hover:text-white font-black uppercase tracking-widest transition-colors">Políticas de Segurança</a>
                <a href="#" className="text-[9px] text-white/20 hover:text-white font-black uppercase tracking-widest transition-colors">Termos de Atendimento</a>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
