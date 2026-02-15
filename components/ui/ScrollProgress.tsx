
import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setWidth(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-white/5">
      <div 
        className="h-full bg-red-600 shadow-[0_0_10px_#ef4444] transition-all duration-100 ease-out relative"
        style={{ width: `${width}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]"></div>
      </div>
    </div>
  );
};
