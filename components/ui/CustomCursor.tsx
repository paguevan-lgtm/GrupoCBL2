
import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Desabilita em touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        
        // Follower com delay sutil
        followerRef.current.animate({
          transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        }, { duration: 500, fill: "forwards" });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      {/* CSS para esconder o cursor padrão globalmente */}
      <style>{`
        body, a, button, input, textarea { cursor: none !important; }
      `}</style>

      {/* Cursor Principal (Ponto) */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 bg-red-600 rounded-full pointer-events-none z-[9999] -ml-1 -mt-1 transition-transform duration-75 ease-out mix-blend-difference ${!isVisible ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Seguidor (Círculo/Mira) */}
      <div 
        ref={followerRef}
        className={`fixed top-0 left-0 border border-white/30 rounded-full pointer-events-none z-[9998] -ml-4 -mt-4 transition-all duration-300 ease-out flex items-center justify-center
          ${isHovering ? 'w-12 h-12 -ml-6 -mt-6 border-red-500 bg-red-500/10' : 'w-8 h-8'}
          ${!isVisible ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {/* Crosshair decorativo quando hovering */}
        <div className={`w-full h-[1px] bg-red-500 absolute transition-all duration-300 ${isHovering ? 'scale-100 opacity-50' : 'scale-0 opacity-0'}`}></div>
        <div className={`h-full w-[1px] bg-red-500 absolute transition-all duration-300 ${isHovering ? 'scale-100 opacity-50' : 'scale-0 opacity-0'}`}></div>
      </div>
    </>
  );
};
