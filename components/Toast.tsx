
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50';
  const textColor = type === 'success' ? 'text-green-500' : 'text-red-500';
  const icon = type === 'success' ? (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  ) : (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  );

  return (
    <div className={`fixed top-24 right-6 z-[150] flex items-center gap-4 px-6 py-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 ${bgColor}`}>
      <div className={textColor}>{icon}</div>
      <div>
        <h4 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>{type === 'success' ? 'Sucesso' : 'Atenção'}</h4>
        <p className="text-white text-xs font-medium mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="text-white/40 hover:text-white transition-colors ml-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};
