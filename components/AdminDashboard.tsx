
import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './icons/Logo';
import { ZapIcon } from './icons/ZapIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LocationIcon } from './icons/LocationIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Lead {
  id: string;
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  website?: string;
  phone?: string;
  lead_score: number;
  ai_analysis: string;
  match_reason: string;
  status_site: 'com_site' | 'sem_site';
  place_id: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('search');
  
  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [siteFilter, setSiteFilter] = useState<'all' | 'with_site' | 'no_site'>('no_site');
  
  // Results States
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Feedback Estado
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debug States
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debugLogs]);

  const calculateLeadScore = (place: any) => {
    let score = 30; // Base score
    if (!place.website) score += 40; // Sem site é ouro
    else score -= 10;
    if (place.rating && place.rating < 4.2) score += 20; // Nota baixa
    if (place.user_ratings_total && place.user_ratings_total < 20) score += 10; // Pouca avaliação
    return Math.min(score, 99);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || !location) return;

    setIsLoading(true);
    setLeads([]);
    setDebugLogs([]); 

    addLog(`Iniciando varredura para: "${searchTerm}" em "${location}"`);
    
    const fullQuery = `${searchTerm} in ${location}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    try {
      addLog("Enviando requisição POST para /api/places...");
      
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawResults = data.results || [];
      addLog(`${rawResults.length} locais brutos encontrados.`);

      const processedLeads: Lead[] = rawResults.map((place: any) => {
          const hasWebsite = !!place.website;
          const score = calculateLeadScore(place);
          
          let analysisText = "";
          let reasonText = "";

          if (!hasWebsite) {
              analysisText = "Invisível digitalmente.";
              reasonText = "Sem Site";
          } else if (place.rating < 4.0) {
              analysisText = "Reputação frágil.";
              reasonText = "Baixa Nota";
          } else {
              analysisText = "Potencial de escala.";
              reasonText = "Expansão";
          }

          return {
              id: place.place_id,
              place_id: place.place_id,
              name: place.name,
              address: place.formatted_address,
              rating: place.rating || 0,
              user_ratings_total: place.user_ratings_total || 0,
              website: place.website,
              phone: place.formatted_phone_number,
              lead_score: score,
              status_site: hasWebsite ? 'com_site' : 'sem_site',
              ai_analysis: analysisText,
              match_reason: reasonText
          };
      });

      const filteredLeads = processedLeads.filter((lead: Lead) => {
          if (siteFilter === 'all') return true;
          if (siteFilter === 'no_site') return lead.status_site === 'sem_site';
          if (siteFilter === 'with_site') return lead.status_site === 'com_site';
          return true;
      });

      filteredLeads.sort((a: Lead, b: Lead) => b.lead_score - a.lead_score);

      setLeads(filteredLeads);
      addLog(`Processo concluído. ${filteredLeads.length} leads qualificados.`);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        addLog("ERRO: Timeout na requisição.");
      } else {
        addLog(`ERRO: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  };

  // --- ACTIONS ---

  const openWhatsApp = (lead: Lead) => {
      if (!lead.phone) {
          alert("Telefone não disponível.");
          return;
      }
      // Limpa tudo que não é número
      let cleanPhone = lead.phone.replace(/\D/g, '');
      // Tenta adivinhar se precisa de DDI (Brasil = 55)
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
          cleanPhone = '55' + cleanPhone;
      }
      
      const text = encodeURIComponent(`Olá, encontrei a *${lead.name}* no Google e notei uma oportunidade para melhorarem o posicionamento online de vocês. Gostaria de falar com o responsável.`);
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const findInstagram = (lead: Lead) => {
      // Deep search no Google focado em Instagram
      const query = `site:instagram.com "${lead.name}" ${location}`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const copyPitch = (lead: Lead) => {
      const pitch = `
Olá, tudo bem? 

Me chamo [Seu Nome], sou especialista em posicionamento digital.

Estava fazendo uma pesquisa na região de ${location || 'sua cidade'} e encontrei a *${lead.name}*. 

Notei que vocês ${lead.status_site === 'sem_site' ? 'ainda não possuem um site profissional' : 'poderiam modernizar a presença online'} para captar mais clientes.

Atualmente, empresas do seu setor estão perdendo cerca de 40% das vendas por não terem uma vitrine digital otimizada.

Gostaria de apresentar uma proposta rápida de como podemos resolver isso. Podemos conversar?
      `.trim();

      navigator.clipboard.writeText(pitch);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0A0A0A] shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="scale-75 origin-left opacity-80">
            <Logo />
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest hidden md:inline-block">
            CBL Intelligence Hub
          </span>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Maps API: ON</span>
            </div>
            <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Sair</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 md:w-20 bg-[#080808] border-r border-white/10 flex flex-col items-center py-6 shrink-0 z-10">
             <button className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
             </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden">
            {/* Search Header Area */}
            <div className="p-6 border-b border-white/5 bg-[#050505]/95 backdrop-blur z-10 shrink-0">
                <div className="max-w-7xl mx-auto w-full">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#0A0A0A] p-4 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="md:col-span-4 space-y-1.5 group">
                            <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho</label>
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none text-sm font-medium" placeholder="Ex: Barbearia" />
                        </div>
                        <div className="md:col-span-3 space-y-1.5 group">
                            <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Local</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none text-sm font-medium" placeholder="Ex: Santos" />
                        </div>
                        <div className="md:col-span-3 space-y-1.5 group">
                             <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Filtro</label>
                             <select value={siteFilter} onChange={(e: any) => setSiteFilter(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none text-sm font-medium appearance-none cursor-pointer">
                                <option value="no_site" className="bg-black">⚠️ Sem Site</option>
                                <option value="with_site" className="bg-black">💻 Com Site</option>
                                <option value="all" className="bg-black">🌎 Todos</option>
                             </select>
                        </div>
                        <div className="md:col-span-2">
                             <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[46px]">
                                {isLoading ? <SpinnerIcon /> : 'Buscar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Grid / Debug Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Debug Console Compacto */}
                    {(isLoading || debugLogs.length > 0) && (
                        <div className="mb-6 bg-black border border-white/10 rounded-xl p-3 font-mono text-[9px] text-white/60 max-h-32 overflow-y-auto">
                            {debugLogs.map((log, i) => <div key={i}><span className="text-green-500 mr-2">{'>'}</span>{log}</div>)}
                            <div ref={logsEndRef} />
                        </div>
                    )}

                    {!isLoading && leads.length === 0 && searchTerm && debugLogs.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
                             <h3 className="text-xl font-black text-white uppercase italic">Aguardando Comando</h3>
                        </div>
                    )}

                    {!isLoading && leads.length > 0 && (
                        <div className="pb-20">
                             <div className="flex justify-between items-end mb-4 px-1">
                                <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">{leads.length} OPORTUNIDADES</span>
                             </div>
                             
                             {/* GRID DE CARDS QUADRADOS */}
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                 {leads.map((lead) => (
                                     <div key={lead.id} className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-full group hover:border-red-600/30 transition-all duration-300 relative overflow-hidden">
                                         
                                         {/* Topo do Card */}
                                         <div className="flex justify-between items-start mb-4">
                                             <div className="flex-1 pr-2">
                                                 <h3 className="text-lg font-black text-white uppercase leading-tight line-clamp-2 mb-2 group-hover:text-red-500 transition-colors">
                                                     {lead.name}
                                                 </h3>
                                                 <div className="flex items-center gap-2 mb-2">
                                                    {lead.status_site === 'sem_site' ? (
                                                        <span className="bg-red-900/20 text-red-500 text-[9px] font-black px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wider">Sem Site</span>
                                                    ) : (
                                                        <span className="bg-blue-900/20 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-wider">Com Site</span>
                                                    )}
                                                    <span className="text-[9px] text-white/30 font-mono border border-white/5 px-1.5 rounded">{lead.rating} ★</span>
                                                 </div>
                                                 <p className="text-white/40 text-[10px] line-clamp-2 leading-relaxed h-8">
                                                    {lead.address}
                                                 </p>
                                             </div>
                                             
                                             {/* Score Circular */}
                                             <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                                                 <svg className="w-full h-full transform -rotate-90">
                                                     <circle cx="28" cy="28" r="24" stroke="#222" strokeWidth="4" fill="transparent" />
                                                     <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent"
                                                         className={lead.lead_score > 75 ? 'text-green-500' : (lead.lead_score > 40 ? 'text-yellow-500' : 'text-red-600')}
                                                         strokeDasharray={150}
                                                         strokeDashoffset={150 - (150 * lead.lead_score) / 100}
                                                     />
                                                 </svg>
                                                 <span className="absolute text-sm font-black text-white">{lead.lead_score}</span>
                                             </div>
                                         </div>

                                         {/* Insights Rápidos */}
                                         <div className="mb-6 bg-white/[0.02] rounded-lg p-3 border border-white/5">
                                             <p className="text-[10px] text-white/60 italic leading-relaxed">
                                                 "{lead.ai_analysis}"
                                             </p>
                                         </div>

                                         {/* Botões de Ação */}
                                         <div className="grid grid-cols-3 gap-2 mt-auto">
                                             {/* WhatsApp */}
                                             <button 
                                                onClick={() => openWhatsApp(lead)}
                                                className="col-span-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/20 rounded-xl py-3 flex items-center justify-center transition-all group/btn"
                                                title="Abrir WhatsApp"
                                             >
                                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                             </button>

                                             {/* Instagram Search */}
                                             <button 
                                                onClick={() => findInstagram(lead)}
                                                className="col-span-1 bg-pink-600/10 hover:bg-pink-600 text-pink-500 hover:text-white border border-pink-500/20 rounded-xl py-3 flex items-center justify-center transition-all"
                                                title="Buscar Instagram"
                                             >
                                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                             </button>

                                             {/* Copy Pitch */}
                                             <button 
                                                onClick={() => copyPitch(lead)}
                                                className={`col-span-1 border rounded-xl py-3 flex items-center justify-center transition-all
                                                    ${copiedId === lead.id 
                                                        ? 'bg-green-600 border-green-600 text-white' 
                                                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                                                    }
                                                `}
                                                title="Copiar Script de Venda"
                                             >
                                                 {copiedId === lead.id ? (
                                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                 ) : (
                                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                 )}
                                             </button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
