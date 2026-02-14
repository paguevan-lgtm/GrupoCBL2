
import React from 'react';
import { Logo } from './icons/Logo';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationIcon } from './icons/LocationIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { EmailIcon } from './icons/EmailIcon';


const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 text-gray-400">
            {/* Col 1: Logo & About */}
            <div className="md:col-span-2 space-y-4">
                <Logo className="h-10 w-auto" />
                <p className="text-sm max-w-md">
                    Focados em tecnologia e resultados. O Grupo CBL transforma desafios complexos em soluções digitais simples e lucrativas. Atuamos onde existe oportunidade de inovação.
                </p>
                <div className="flex space-x-4 pt-2">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><EmailIcon /></a>
                </div>
            </div>

            {/* Col 2: Menu */}
            <div className="space-y-4">
                <h4 className="font-bold text-white tracking-wider">MENU</h4>
                <nav className="flex flex-col space-y-3 text-sm">
                    <a href="#about" className="hover:text-white transition-colors">Quem Somos</a>
                    <a href="#services" className="hover:text-white transition-colors">Expertise</a>
                    <a href="#differentiators" className="hover:text-white transition-colors">Diferenciais</a>
                    <a href="#contact" className="hover:text-white transition-colors">Contato</a>
                </nav>
            </div>

            {/* Col 3: Contato */}
            <div className="space-y-4">
                 <h4 className="font-bold text-white tracking-wider">CONTATO</h4>
                 <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                        <PhoneIcon className="mt-1 flex-shrink-0" />
                        <div>
                            <span className="block font-semibold">COMERCIAL</span>
                            <span>(13) 99774-4720</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <LocationIcon className="mt-1 flex-shrink-0" />
                        <div>
                            <span className="block font-semibold">SEDE</span>
                            <span>São Paulo, SP</span>
                            <span className="block text-xs text-gray-500">Atendimento Global</span>
                        </div>
                    </li>
                 </ul>
            </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Grupo CBL Soluções Digitais. Todos os direitos reservados.</p>
            <div className="space-x-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacidade</a>
                <a href="#" className="hover:text-white">Legal</a>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
