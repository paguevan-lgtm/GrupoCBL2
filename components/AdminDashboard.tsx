
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Debug States
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debugLogs]);

  // Função para calcular o Score matematicamente
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
    setDebugLogs([]); // Limpa logs anteriores
    setExpandedCard(null);

    addLog(`Iniciando varredura para: "${searchTerm}" em "${location}"`);
    addLog("Configurando conexão com API Google Maps...");

    const fullQuery = `${searchTerm} in ${location}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout

    try {
      addLog("Enviando requisição POST para /api/places...");
      
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      addLog(`Status da Resposta: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Erro HTTP ${response.status}`);
      }

      addLog("Processando dados JSON recebidos...");
      const data = await response.json();
      
      const rawResults = data.results || [];
      addLog(`${rawResults.length} locais brutos encontrados.`);

      if (rawResults.length === 0) {
        addLog("AVISO: Nenhum resultado retornado pelo Google.");
      }

      const processedLeads: Lead[] = rawResults.map((place: any) => {
          const hasWebsite = !!place.website;
          const score = calculateLeadScore(place);
          
          let analysisText = "";
          let reasonText = "";

          if (!hasWebsite) {
              analysisText = "Empresa invisível digitalmente. Alta probabilidade de fechamento.";
              reasonText = "Sem Site";
          } else if (place.rating < 4.0) {
              analysisText = "Presença digital negativa. Oportunidade para gestão de reputação.";
              reasonText = "Baixa Reputação";
          } else {
              analysisText = "Empresa estabelecida. Focar em modernização ou tráfego.";
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

      addLog("Aplicando filtros de inteligência...");
      // Aplicar Filtro no Frontend
      const filteredLeads = processedLeads.filter((lead: Lead) => {
          if (siteFilter === 'all') return true;
          if (siteFilter === 'no_site') return lead.status_site === 'sem_site';
          if (siteFilter === 'with_site') return lead.status_site === 'com_site';
          return true;
      });

      // Ordenar por Score
      filteredLeads.sort((a: Lead, b: Lead) => b.lead_score - a.lead_score);

      setLeads(filteredLeads);
      addLog(`Processo concluído. ${filteredLeads.length} leads qualificados.`);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        addLog("ERRO: Tempo limite excedido (Timeout). A API demorou muito.");
      } else {
        addLog(`ERRO CRÍTICO: ${error.message}`);
      }
      console.error("Erro na busca:", error);
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  };

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
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
            <button 
                onClick={onLogout}
                className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
                Sair
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Minimalista */}
        <aside className="w-20 md:w-64 bg-[#080808] border-r border-white/10 flex flex-col shrink-0 transition-all">
            <nav className="p-4 space-y-2">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`w-full text-left px-0 md:px-4 py-4 rounded-xl transition-all duration-300 flex items-center justify-center md:justify-start gap-4 ${
                        activeTab === 'search' 
                        ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-xs font-black uppercase tracking-widest hidden md:block">Procurar Leads</span>
                </button>
            </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Search Header Area */}
            <div className="p-6 md:p-10 border-b border-white/5 bg-[#050505]/95 backdrop-blur z-10 shrink-0">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
                            Busca Google <span className="text-red-600">Maps</span>
                        </h1>
                        <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                            Conexão direta API. Dados Reais.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#0A0A0A] p-4 rounded-2xl border border-white/10 shadow-2xl">
                        {/* Termo */}
                        <div className="md:col-span-4 space-y-1.5 group">
                            <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho / Termo</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20 text-sm font-medium"
                                placeholder="Ex: Barbearia, Dentista..."
                            />
                        </div>

                        {/* Localização */}
                        <div className="md:col-span-3 space-y-1.5 group">
                            <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Localização</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder-white/20 text-sm font-medium"
                                placeholder="Ex: Santos, SP"
                            />
                        </div>

                        {/* Filtro */}
                        <div className="md:col-span-3 space-y-1.5 group">
                             <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Filtro Inteligente</label>
                             <div className="relative">
                                 <select 
                                    value={siteFilter}
                                    onChange={(e: any) => setSiteFilter(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:bg-white/10 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                                 >
                                    <option value="no_site" className="bg-black text-white">⚠️ Sem Site (Prioridade)</option>
                                    <option value="with_site" className="bg-black text-white">💻 Com Site</option>
                                    <option value="all" className="bg-black text-white">🌎 Todos</option>
                                 </select>
                                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                 </div>
                             </div>
                        </div>

                        {/* Botão */}
                        <div className="md:col-span-2">
                             <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[46px]"
                            >
                                {isLoading ? <SpinnerIcon /> : 'Varredura'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Grid / Debug Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Debug Console - Mostra sempre se tiver logs e estiver carregando ou houver erro */}
                    {(isLoading || debugLogs.length > 0) && (
                        <div className="mb-8 bg-black border border-white/10 rounded-xl p-4 font-mono text-[10px] text-white/60 shadow-inner max-h-48 overflow-y-auto custom-scrollbar">
                            <div className="text-white/30 uppercase tracking-widest mb-2 border-b border-white/5 pb-1 sticky top-0 bg-black">System_Log_Console</div>
                            {debugLogs.map((log, i) => (
                                <div key={i} className="mb-1">
                                    <span className="text-green-500 mr-2">{'>'}</span>
                                    {log}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    )}

                    {!isLoading && leads.length === 0 && searchTerm && debugLogs.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
                             <h3 className="text-xl font-black text-white uppercase italic">Aguardando Comando</h3>
                             <p className="text-sm text-white/50">Insira os parâmetros acima para iniciar a varredura.</p>
                        </div>
                    )}

                    {!isLoading && leads.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 pb-20">
                             <div className="flex justify-between items-end mb-2 px-2">
                                <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">{leads.length} LEADS ENCONTRADOS</span>
                             </div>
                             
                             {leads.map((lead) => (
                                 <div 
                                    key={lead.id}
                                    className={`bg-[#0c0c0c] border rounded-2xl overflow-hidden transition-all duration-300 group
                                        ${expandedCard === lead.id ? 'border-red-600/50 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-white/5 hover:border-white/10'}
                                    `}
                                 >
                                     {/* Card Header (Always Visible) */}
                                     <div 
                                        onClick={() => toggleCard(lead.id)}
                                        className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 relative"
                                     >
                                         {/* Barra de Score Vertical Lateral */}
                                         <div 
                                            className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300
                                                ${lead.lead_score > 75 ? 'bg-green-500' : (lead.lead_score > 40 ? 'bg-yellow-500' : 'bg-red-600')}
                                            `}
                                         />

                                         <div className="flex items-start gap-4 pl-3">
                                             <div className="flex-1">
                                                 <div className="flex items-center gap-3 mb-1">
                                                     <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                                         {lead.name}
                                                     </h3>
                                                     {lead.status_site === 'sem_site' && (
                                                         <span className="bg-red-600/10 text-red-500 text-[8px] px-2 py-0.5 rounded border border-red-600/20 font-black uppercase tracking-wider">
                                                             Sem Site
                                                         </span>
                                                     )}
                                                     {lead.status_site === 'com_site' && (
                                                         <span className="bg-blue-600/10 text-blue-400 text-[8px] px-2 py-0.5 rounded border border-blue-600/20 font-black uppercase tracking-wider">
                                                             Com Site
                                                         </span>
                                                     )}
                                                 </div>
                                                 <p className="text-white/40 text-xs flex items-center gap-2">
                                                    <LocationIcon className="w-3 h-3" />
                                                    {lead.address}
                                                 </p>
                                             </div>
                                         </div>

                                         <div className="flex items-center gap-6 justify-between md:justify-end pl-3 md:pl-0">
                                             {/* Mini Stats */}
                                             <div className="text-right">
                                                 <div className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-1">Google Rating</div>
                                                 <div className="flex items-center justify-end gap-1">
                                                     <span className="text-white font-bold">{lead.rating || 'N/A'}</span>
                                                     <span className="text-yellow-500 text-xs">★</span>
                                                     <span className="text-white/30 text-[9px]">({lead.user_ratings_total || 0})</span>
                                                 </div>
                                             </div>

                                             {/* Score Circle */}
                                             <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                                 <svg className="w-full h-full transform -rotate-90">
                                                     <circle cx="24" cy="24" r="20" stroke="#333" strokeWidth="4" fill="transparent" />
                                                     <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                                         className={lead.lead_score > 75 ? 'text-green-500' : (lead.lead_score > 40 ? 'text-yellow-500' : 'text-red-600')}
                                                         strokeDasharray={126}
                                                         strokeDashoffset={126 - (126 * lead.lead_score) / 100}
                                                     />
                                                 </svg>
                                                 <span className="absolute text-xs font-black text-white">{lead.lead_score}</span>
                                             </div>

                                             <div className={`transform transition-transform duration-300 ${expandedCard === lead.id ? 'rotate-180' : ''}`}>
                                                 <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                             </div>
                                         </div>
                                     </div>

                                     {/* Expanded Content */}
                                     <div 
                                        className={`overflow-hidden transition-all duration-500 ease-in-out bg-white/[0.02] border-t border-white/5
                                            ${expandedCard === lead.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                                        `}
                                     >
                                         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                             <div className="space-y-6">
                                                 <div>
                                                     <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                         <span className="w-1 h-1 bg-red-600 rounded-full"></span> Diagnóstico Automático
                                                     </h4>
                                                     <p className="text-sm text-white/80 leading-relaxed font-light italic">
                                                         "{lead.ai_analysis}"
                                                     </p>
                                                     <div className="mt-3 inline-block px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-red-400">
                                                         Gatilho de Venda: {lead.match_reason}
                                                     </div>
                                                 </div>

                                                 <div className="flex gap-4">
                                                     {/* Nota: O TextSearch as vezes nao retorna telefone. Se vier, mostramos. */}
                                                     {lead.phone ? (
                                                        <a href={`tel:${lead.phone.replace(/\D/g,'')}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5">
                                                            <PhoneIcon className="w-3 h-3" /> Ligar
                                                        </a>
                                                     ) : (
                                                         <span className="text-white/20 text-xs border border-white/5 px-4 py-2 rounded-lg cursor-not-allowed" title="Número não disponível na busca rápida">Sem Telefone</span>
                                                     )}
                                                     
                                                     {lead.website ? (
                                                         <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-xs font-bold uppercase tracking-wider border border-blue-500/20 px-4 py-2 rounded-lg hover:bg-blue-500/10">
                                                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                             Acessar Site
                                                         </a>
                                                     ) : (
                                                         <span className="text-white/20 text-xs border border-white/5 px-4 py-2 rounded-lg cursor-not-allowed">Site Não Cadastrado</span>
                                                     )}
                                                 </div>
                                             </div>

                                             <div className="space-y-4">
                                                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                                      <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Dados Cadastrais</h4>
                                                      <div className="space-y-2 text-xs">
                                                          <div className="flex justify-between border-b border-white/5 pb-2">
                                                              <span className="text-white/50">Endereço</span>
                                                              <span className="text-white text-right max-w-[60%] line-clamp-2" title={lead.address}>{lead.address}</span>
                                                          </div>
                                                          <div className="flex justify-between border-b border-white/5 pb-2">
                                                              <span className="text-white/50">ID Google</span>
                                                              <span className="text-white/30 text-right font-mono text-[9px]">{lead.place_id.substring(0,10)}...</span>
                                                          </div>
                                                          <div className="flex justify-between pt-1">
                                                              <span className="text-white/50">Total Avaliações</span>
                                                              <span className="text-white text-right">{lead.user_ratings_total}</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  
                                                  <button className="w-full bg-white text-black py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                                                      <ZapIcon className="w-3 h-3 text-red-600" />
                                                      Gerar Proposta Comercial
                                                  </button>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             ))}
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
