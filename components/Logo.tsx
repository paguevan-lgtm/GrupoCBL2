
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`font-bold text-white text-center ${className}`}>
    <span className="block text-xl tracking-tighter leading-none">GRUPO CBL</span>
    <span className="block text-[0.5rem] text-gray-400 tracking-widest leading-none">INOVAÇÃO & TECH</span>
  </div>
);
