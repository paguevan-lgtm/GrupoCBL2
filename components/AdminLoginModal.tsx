
import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { Logo } from './icons/Logo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onShowToast }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de delay de rede
    setTimeout(() => {
      // Validação Hardcoded Simples (Para demonstração)
      if (user === 'admin' && pass === 'admin123') {
        onLoginSuccess();
        onShowToast('Acesso Administrativo Concedido', 'success');
      } else {
        onShowToast('Credenciais Inválidas', 'error');
        setLoading(false);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
             
             <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors z-20">
                <XIcon />
             </button>

             <div className="p-8 pb-0 flex flex-col items-center">
                 <div className="mb-8 scale-110 opacity-90">
                    <Logo />
                 </div>
                 <div className="text-center space-y-2">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Acesso Restrito</h2>
                    <p className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em]">CBL Internal System</p>
                 </div>
             </div>

             <div className="p-8 pt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5 group">
                        <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Usuário</label>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20 text-sm font-medium"
                            placeholder="ID Admin"
                        />
                    </div>
                    <div className="space-y-1.5 group">
                        <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Senha</label>
                        <input
                            type="password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20 text-sm font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verificando...' : 'Acessar Painel'}
                    </button>
                </form>
             </div>
        </div>
    </div>
  );
};

export default AdminLoginModal;
