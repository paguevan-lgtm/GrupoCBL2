
import React, { useState } from 'react';
import { Logo } from './icons/Logo';
import { ZapIcon } from './icons/ZapIcon';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Credenciais inválidas. Acesso negado.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // --- TELA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 relative z-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10 space-y-4">
            <Logo className="scale-110" />
            <div className="h-px w-12 bg-white/10"></div>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] animate-pulse">Área Restrita</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Login ID</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600 focus:bg-[#1A1A1A] outline-none transition-all placeholder-white/10 text-sm font-mono"
                placeholder="Identificação"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Chave de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600 focus:bg-[#1A1A1A] outline-none transition-all placeholder-white/10 text-sm font-mono"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-xs font-medium">{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              <ZapIcon className="w-4 h-4" /> Acessar Painel
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="/" className="text-[9px] font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest">← Retornar ao Site</a>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DO PAINEL (CONTEÚDO EM BRANCO) ---
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans text-white">
      {/* Header do Painel */}
      <header className="h-16 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-4">
            <Logo className="scale-75 origin-left" />
            <span className="h-4 w-px bg-white/10"></span>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Dashboard v1.0</span>
        </div>
        <button 
            onClick={handleLogout}
            className="text-[10px] font-bold text-red-500 hover:text-white uppercase tracking-widest transition-colors border border-red-900/30 hover:border-white/20 px-4 py-2 rounded-lg bg-red-900/10 hover:bg-white/5"
        >
            Desconectar
        </button>
      </header>

      {/* Conteúdo Principal (Em Branco como solicitado) */}
      <main className="flex-1 p-8 md:p-12 relative">
         <div className="border border-dashed border-white/10 rounded-3xl h-full w-full flex flex-col items-center justify-center text-white/10">
            <ZapIcon className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-black uppercase tracking-tighter opacity-30">Painel Administrativo</h2>
            <p className="font-mono text-xs uppercase tracking-[0.2em] mt-2 opacity-30">Aguardando Módulos...</p>
         </div>
      </main>
    </div>
  );
};

export default AdminPanel;
