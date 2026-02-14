
import React, { useState, useEffect } from 'react';
import { Logo } from './icons/Logo';

interface IntroAnimationProps {
  onFinished: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinished }) => {
  const [phase, setPhase] = useState('start'); // start -> logo -> fadeOut

  useEffect(() => {
    const sequence = [
      setTimeout(() => setPhase('logo'), 500), // Mostra o logo após 0.5s
      setTimeout(() => setPhase('fadeOut'), 2500), // Começa a desaparecer após 2.5s (0.5s + 2s de espera)
      setTimeout(onFinished, 3500), // Anuncia o término após 3.5s (0.5s + 2s + 1s de fade)
    ];

    return () => {
      sequence.forEach(clearTimeout);
    };
  }, [onFinished]);

  const overlayClasses = `
    fixed inset-0 bg-black z-[100] flex items-center justify-center
    transition-opacity duration-1000 ease-in-out
    ${phase === 'fadeOut' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
  `;

  const logoWrapperClasses = `
    transition-all duration-1000 ease-out
    ${phase === 'logo' || phase === 'fadeOut' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
  `;

  return (
    <div className={overlayClasses}>
      <div className={logoWrapperClasses}>
        <Logo />
      </div>
    </div>
  );
};

export default IntroAnimation;
