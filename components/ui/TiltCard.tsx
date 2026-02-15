
import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    const x = xPct * 20; // Max rotation X
    const y = yPct * 20; // Max rotation Y

    setTransform(`perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`);
    setOpacity(1);
    
    // Atualiza variáveis CSS para o brilho (glow) seguir o mouse
    ref.current.style.setProperty('--mouse-x', `${mouseX}px`);
    ref.current.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setOpacity(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transform }}
    >
      {/* Glow Effect Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 rounded-3xl transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(239, 68, 68, 0.15), transparent 40%)`
        }}
      />
      {children}
    </div>
  );
};
