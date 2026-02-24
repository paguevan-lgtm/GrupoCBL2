import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, X, Search, Globe, MessageCircle, RefreshCw, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

interface InternalBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

const InternalBrowser: React.FC<InternalBrowserProps> = ({ isOpen, onClose, initialUrl = 'https://www.google.com/webhp?igu=1' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Position state for dragging
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);

  // WhatsApp Window Reference
  const whatsappWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset position if off-screen
      if (position.x > window.innerWidth - 100 || position.y > window.innerHeight - 100) {
        setPosition({ x: 20, y: 80 });
      }
    }
  }, [isOpen]);

  // Handle Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node) && !isMaximized) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleNavigate = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!newUrl.startsWith('http')) {
      if (newUrl.includes('.') && !newUrl.includes(' ')) {
        finalUrl = `https://${newUrl}`;
      } else {
        finalUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(newUrl)}`;
      }
    }
    
    // Check for WhatsApp
    if (finalUrl.includes('whatsapp.com') || finalUrl.includes('wa.me')) {
        handleOpenWhatsApp();
        return;
    }

    setIsLoading(true);
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevUrl = history[historyIndex - 1];
      setUrl(prevUrl);
      setInputUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextUrl = history[historyIndex + 1];
      setUrl(nextUrl);
      setInputUrl(nextUrl);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleOpenWhatsApp = () => {
      // Open dedicated popup
      const width = 1000;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const win = window.open(
          'https://web.whatsapp.com', 
          'cbl_whatsapp_window', 
          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
      );
      
      whatsappWindowRef.current = win;
      
      if (win) {
          win.focus();
      } else {
          alert("Pop-up bloqueado! Permita pop-ups para abrir o WhatsApp.");
      }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-[9999] bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-red-600/50 transition-all animate-in slide-in-from-bottom-4"
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-bold text-white uppercase tracking-widest">Navegador Interno</span>
        <Maximize2 className="w-4 h-4 text-white/50" />
      </div>
    );
  }

  return (
    <div 
      className={`fixed z-[9999] bg-[#0c0c0c] border border-white/10 shadow-2xl flex flex-col transition-all duration-200 ${isMaximized ? 'inset-0 rounded-none' : 'rounded-2xl'}`}
      style={!isMaximized ? { 
        left: position.x, 
        top: position.y, 
        width: '800px', 
        height: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh'
      } : {}}
    >
      {/* Browser Header */}
      <div 
        ref={headerRef}
        className="h-12 bg-[#111] border-b border-white/5 flex items-center px-4 gap-4 shrink-0 select-none"
        onMouseDown={handleMouseDown}
        style={{ cursor: isMaximized ? 'default' : 'move' }}
      >
        {/* Window Controls */}
        <div className="flex gap-2 mr-2">
          <button onClick={() => onClose()} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
          <button onClick={() => setIsMinimized(true)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
          <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-2 text-white/50">
          <button onClick={handleBack} disabled={historyIndex === 0} className="hover:text-white disabled:opacity-30 transition-colors"><ArrowLeft size={16} /></button>
          <button onClick={handleForward} disabled={historyIndex === history.length - 1} className="hover:text-white disabled:opacity-30 transition-colors"><ArrowRight size={16} /></button>
          <button onClick={handleReload} className={`hover:text-white transition-colors ${isLoading ? 'animate-spin' : ''}`}><RefreshCw size={14} /></button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                {url.includes('google') ? <Search size={14} className="text-white/30" /> : <Globe size={14} className="text-white/30" />}
            </div>
            <input 
                type="text" 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigate(inputUrl)}
                className="w-full bg-[#050505] border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white font-mono focus:border-red-600/50 outline-none transition-all text-center group-hover:text-left"
            />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
            <button 
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-[#25D366]/20"
                title="Abrir WhatsApp em Janela Dedicada"
            >
                <MessageCircle size={14} />
                <span className="hidden md:inline">WhatsApp</span>
            </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600/20">
                <div className="h-full bg-red-600 animate-progress origin-left"></div>
            </div>
        )}
        
        {/* Iframe for Content */}
        <iframe 
            ref={iframeRef}
            src={url}
            name="cbl_internal_frame"
            className="w-full h-full border-none"
            onLoad={handleIframeLoad}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Internal Browser"
        />

        {/* Overlay for blocked sites */}
        {(url.includes('whatsapp') || url.includes('instagram') || url.includes('facebook')) && (
             <div className="absolute inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center text-center p-8 z-10">
                 <MessageCircle size={48} className="text-[#25D366] mb-4" />
                 <h3 className="text-xl font-black text-white uppercase italic mb-2">Acesso Externo Necessário</h3>
                 <p className="text-white/50 text-sm max-w-md mb-6">
                     Por motivos de segurança, o WhatsApp Web e redes sociais não permitem ser carregados dentro de outros sites (iframe).
                 </p>
                 <button 
                    onClick={handleOpenWhatsApp}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
                 >
                     <ExternalLink size={16} />
                     Abrir Janela do WhatsApp
                 </button>
                 <p className="text-white/30 text-[10px] mt-4 uppercase tracking-widest">
                     As requisições de mensagem serão enviadas para esta janela.
                 </p>
             </div>
        )}
      </div>
      
      {/* Footer Status */}
      <div className="h-6 bg-[#111] border-t border-white/5 flex items-center justify-between px-3 text-[9px] text-white/30 uppercase tracking-widest select-none">
          <span>CBL Secure Browser v1.0</span>
          <span>{isLoading ? 'Carregando...' : 'Pronto'}</span>
      </div>
    </div>
  );
};

export default InternalBrowser;
