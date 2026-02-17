
import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './icons/Logo';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LocationIcon } from './icons/LocationIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { InstagramIcon } from './icons/InstagramIcon';

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
  international_phone?: string; // Novo campo para garantir DDI
  lead_score: number;
  ai_analysis: string;
  match_reason: string;
  status_site: 'com_site' | 'sem_site';
  place_id: string;
  types: string[];
  price_level?: number;
  business_status?: string;
  opening_hours?: { open_now: boolean };
  photos?: { photo_reference: string }[];
  contactedAt?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'contacted'>('search');
  
  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [siteFilter, setSiteFilter] = useState<'all' | 'with_site' | 'no_site'>('no_site');
  
  // CRM States (Persistência Local)
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  const [chamadosSearch, setChamadosSearch] = useState('');

  // Results States
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Feedback Estado
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debug States
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Carregar contatados do LocalStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('cbl_contacted_leads');
    if (saved) {
        try {
            setContactedLeads(JSON.parse(saved));
        } catch (e) {
            console.error("Erro ao carregar leads salvos", e);
        }
    }
  }, []);

  // Salvar contatados sempre que mudar
  useEffect(() => {
    localStorage.setItem('cbl_contacted_leads', JSON.stringify(contactedLeads));
  }, [contactedLeads]);

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
    
    // Critérios de Avaliação
    if (place.rating && place.rating < 4.2) score += 20; // Nota baixa = Dor
    if (place.user_ratings_total && place.user_ratings_total < 20) score += 10; // Pouca prova social
    
    // Critérios de Nicho ($$)
    if (place.types?.includes('health') || place.types?.includes('lawyer') || place.types?.includes('real_estate_agency')) score += 10; 
    
    // Critérios de Funcionamento
    if (place.business_status === 'OPERATIONAL') score += 5;
    
    return Math.min(score, 99);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || !location) return;

    setIsLoading(true);
    setLeads([]);
    setDebugLogs([]); 
    setActiveTab('search');

    addLog(`Iniciando varredura tática: "${searchTerm}" em "${location}"`);
    
    const fullQuery = `${searchTerm} in ${location}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    try {
      addLog("Conectando ao Google Places API (TextSearch)...");
      
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
      addLog(`${rawResults.length} alvos brutos detectados.`);

      const processedLeads: Lead[] = rawResults.map((place: any) => {
          const hasWebsite = !!place.website;
          const score = calculateLeadScore(place);
          
          let analysisText = "";
          let reasonText = "";

          // Análise de IA Simulada baseada em dados reais
          if (!hasWebsite) {
              analysisText = "OPORTUNIDADE CRÍTICA: Empresa invisível na web. Ideal para oferta de Landing Page High-Ticket.";
              reasonText = "Sem Site";
          } else if (place.rating < 4.0) {
              analysisText = "GESTÃO DE CRISE: Baixa reputação. Ofertar Gestão de Google Meu Negócio e Automação de Reviews.";
              reasonText = "Baixa Nota";
          } else if (place.user_ratings_total < 10) {
              analysisText = "TRAÇÃO INICIAL: Negócio validado mas sem prova social. Ofertar campanhas de tráfego local.";
              reasonText = "Sem Prova Social";
          } else {
              analysisText = "ESCALA: Negócio maduro. Focar em Redesign Premium e CRM.";
              reasonText = "Escala";
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
              international_phone: place.international_phone_number, // Importante para WhatsApp
              lead_score: score,
              status_site: hasWebsite ? 'com_site' : 'sem_site',
              ai_analysis: analysisText,
              match_reason: reasonText,
              types: place.types || [],
              price_level: place.price_level,
              business_status: place.business_status,
              opening_hours: place.opening_hours,
              photos: place.photos
          };
      });

      // Filtros: Remove já contatados e aplica filtro de site
      const filteredLeads = processedLeads.filter((lead: Lead) => {
          // Verifica se já foi contatado
          const isContacted = contactedLeads.some(cl => cl.id === lead.id);
          if (isContacted) return false;

          // Filtro de Site
          if (siteFilter === 'all') return true;
          if (siteFilter === 'no_site') return lead.status_site === 'sem_site';
          if (siteFilter === 'with_site') return lead.status_site === 'com_site';
          return true;
      });

      filteredLeads.sort((a: Lead, b: Lead) => b.lead_score - a.lead_score);

      setLeads(filteredLeads);
      addLog(`Varredura completa. ${filteredLeads.length} oportunidades qualificadas.`);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        addLog("ERRO: Latência excessiva. A operação foi abortada.");
      } else {
        addLog(`FALHA CRÍTICA: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  };

  // --- ACTIONS ---

  const markAsContacted = (lead: Lead) => {
      const leadWithDate = { ...lead, contactedAt: new Date().toISOString() };
      setContactedLeads(prev => [leadWithDate, ...prev]);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      onLogout && console.log('Lead salvo localmente');
  };

  const removeFromContacted = (leadId: string) => {
      setContactedLeads(prev => prev.filter(l => l.id !== leadId));
      // Opcional: Adicionar de volta à lista de pesquisa se necessário, mas geralmente "Desarquivar" é suficiente.
  };

  const openWhatsApp = (lead: Lead) => {
      // Prioridade: Número Internacional (já vem com DDI) > Formatado > Bruto
      const rawPhone = lead.international_phone || lead.phone;

      if (!rawPhone) {
          alert("Telefone não disponível na base do Google.");
          return;
      }

      // Remove tudo que não é dígito
      let cleanPhone = rawPhone.replace(/\D/g, '');
      
      // Lógica de fallback para Brasil (Adiciona 55 se parecer um número local)
      // Números locais tem 10 ou 11 dígitos (DDD + Número)
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
          cleanPhone = '55' + cleanPhone;
      }
      
      const text = encodeURIComponent(`Olá, sou da equipe CBL. Encontrei a *${lead.name}* e vi uma oportunidade de melhoria no posicionamento digital de vocês.`);
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const openInstagram = (lead: Lead) => {
      // 1. Verifica se o site cadastrado JÁ É o Instagram
      if (lead.website && lead.website.toLowerCase().includes('instagram.com')) {
          window.open(lead.website, '_blank');
          return;
      }

      // 2. Se não, usa Deep Search (A API do Places não fornece user do Insta)
      // "site:instagram.com" restringe a busca
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

  const filteredContactedLeads = contactedLeads.filter(l => 
      l.name.toLowerCase().includes(chamadosSearch.toLowerCase()) || 
      (l.types && l.types.some(t => t.includes(chamadosSearch.toLowerCase())))
  );

  // --- COMPONENTE DE CARD REUTILIZÁVEL ---
  const LeadCard = ({ lead, isArchived = false }: { lead: Lead, isArchived?: boolean }) => (
      <div className={`bg-[#0c0c0c] border ${isArchived ? 'border-blue-900/30' : 'border-white/10'} rounded-3xl flex flex-col justify-between h-full group hover:border-red-600/50 transition-all duration-300 relative overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(220,38,38,0.1)]`}>
             
             {/* Imagem de Capa do Local */}
             <div className="h-48 w-full bg-gray-900 relative overflow-hidden shrink-0">
                 {lead.photos && lead.photos.length > 0 ? (
                     <img 
                        src={`/api/photo?ref=${lead.photos[0].photo_reference}`} 
                        className={`w-full h-full object-cover transition-all duration-700 ${isArchived ? 'grayscale hover:grayscale-0' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'}`}
                        alt={lead.name}
                     />
                 ) : (
                     <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center opacity-50">
                         <Logo className="scale-75 opacity-20" />
                     </div>
                 )}
                 
                 {/* Overlay Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/60 to-transparent"></div>

                 {/* Badges Flutuantes */}
                 <div className="absolute top-4 left-4 flex gap-2">
                     {isArchived && (
                         <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1 shadow-lg">
                             Processado
                         </span>
                     )}
                     {lead.opening_hours?.open_now ? (
                         <span className="bg-green-500/90 backdrop-blur text-black text-[9px] font-black px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1">
                             <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span> Aberto
                         </span>
                     ) : (
                         lead.opening_hours && (
                             <span className="bg-red-600/90 backdrop-blur text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wide">
                                 Fechado
                             </span>
                         )
                     )}
                 </div>
                 
                 <div className="absolute top-4 right-4">
                     <div className="bg-black/80 backdrop-blur border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1">
                         <span className="text-yellow-500 text-xs">★</span>
                         <span className="text-white text-xs font-bold">{lead.rating}</span>
                         <span className="text-white/40 text-[9px]">({lead.user_ratings_total})</span>
                     </div>
                 </div>
             </div>

             {/* Corpo do Card */}
             <div className="p-6 relative -mt-6">
                 {/* Header Categorias */}
                 <div className="flex justify-between items-start mb-2">
                     <div className="flex gap-2 flex-wrap mb-2">
                         {lead.types.slice(0, 2).map((t, idx) => (
                             <span key={idx} className="bg-white/5 text-[8px] font-mono text-white/50 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide">
                                 {t.replace(/_/g, ' ')}
                             </span>
                         ))}
                     </div>
                 </div>

                 <h3 className="text-2xl font-black text-white uppercase leading-tight line-clamp-2 mb-3 group-hover:text-red-500 transition-colors h-16">
                     {lead.name}
                 </h3>
                 
                 <div className="flex items-start gap-2 mb-4 min-h-[40px]">
                    <LocationIcon className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                    <p className="text-white/60 text-xs line-clamp-2 font-medium leading-relaxed">
                        {lead.address}
                    </p>
                 </div>

                 {/* LEAD DNA - CRITÉRIOS DETALHADOS */}
                 <div className="grid grid-cols-3 gap-2 mb-4 bg-white/[0.03] p-2 rounded-xl border border-white/5">
                    <div className="text-center">
                        <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-1">Ticket</span>
                        <span className="block text-xs font-bold text-white">
                            {lead.price_level ? Array(lead.price_level).fill('$').join('') : 'N/A'}
                        </span>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-1">Reviews</span>
                        <span className={`block text-xs font-bold ${lead.user_ratings_total > 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {lead.user_ratings_total > 100 ? 'Alto' : (lead.user_ratings_total > 20 ? 'Médio' : 'Baixo')}
                        </span>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-1">Site</span>
                        <span className={`block text-xs font-bold ${lead.status_site === 'sem_site' ? 'text-red-500' : 'text-green-500'}`}>
                            {lead.status_site === 'sem_site' ? 'OFF' : 'ON'}
                        </span>
                    </div>
                 </div>

                 <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-4">
                     <div className="flex flex-col">
                         <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-1">Análise IA</span>
                         <span className="text-[10px] text-white/80 font-medium italic line-clamp-2 max-w-[180px]">
                            {lead.ai_analysis}
                         </span>
                     </div>
                     
                     {/* Score Circle Big */}
                     <div className="relative w-12 h-12 flex items-center justify-center shrink-0 ml-2">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="#222" strokeWidth="4" fill="transparent" />
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                className={lead.lead_score > 70 ? 'text-green-500' : 'text-red-600'}
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * lead.lead_score) / 100}
                            />
                        </svg>
                        <span className="absolute text-sm font-black text-white">{lead.lead_score}</span>
                     </div>
                 </div>
             </div>

             {/* Botões de Ação Grandes */}
             <div className="grid grid-cols-2 gap-px bg-[#111] mt-auto border-t border-white/5">
                 <button 
                    onClick={() => openWhatsApp(lead)}
                    className="col-span-1 bg-[#0c0c0c] hover:bg-[#25D366] text-[#25D366] hover:text-black py-4 flex flex-col items-center justify-center transition-all gap-1 group/btn"
                 >
                     <PhoneIcon className="w-4 h-4 text-current mb-0.5" />
                     <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
                 </button>

                 <button 
                    onClick={() => openInstagram(lead)}
                    className="col-span-1 bg-[#0c0c0c] hover:bg-pink-600 text-pink-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1"
                 >
                     <InstagramIcon />
                     <span className="text-[9px] font-black uppercase tracking-widest mt-1">
                        {lead.website?.includes('instagram') ? 'Abrir Insta' : 'Buscar Insta'}
                     </span>
                 </button>

                 <button 
                    onClick={() => copyPitch(lead)}
                    className={`col-span-1 py-4 flex flex-col items-center justify-center transition-all gap-1 border-t border-white/5
                        ${copiedId === lead.id ? 'bg-green-600 text-white' : 'bg-[#0c0c0c] hover:bg-white text-white hover:text-black'}
                    `}
                 >
                     <span className="text-sm font-black">{copiedId === lead.id ? 'Copiado!' : 'Copy'}</span>
                     <span className="text-[8px] font-black uppercase tracking-widest">Pitch</span>
                 </button>

                 {isArchived ? (
                     <button 
                        onClick={() => removeFromContacted(lead.id)}
                        className="col-span-1 bg-[#0c0c0c] hover:bg-red-600 text-red-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1 border-t border-white/5"
                     >
                         <span className="text-sm font-black">↩</span>
                         <span className="text-[8px] font-black uppercase tracking-widest">Remover</span>
                     </button>
                 ) : (
                     <button 
                        onClick={() => markAsContacted(lead)}
                        className="col-span-1 bg-[#0c0c0c] hover:bg-blue-600 text-blue-500 hover:text-white py-4 flex flex-col items-center justify-center transition-all gap-1 border-t border-white/5"
                     >
                         <span className="text-sm font-black">✓</span>
                         <span className="text-[8px] font-black uppercase tracking-widest">Arquivar</span>
                     </button>
                 )}
             </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Top Bar Tech */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0A0A0A]/90 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="scale-75 origin-left opacity-80 hover:opacity-100 transition-opacity">
            <Logo />
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest hidden md:inline-block">
            Intelligence Hub v4.2
          </span>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Places API: Connected</span>
            </div>
            <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-500 transition-colors">Sair</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-16 md:w-20 bg-[#080808] border-r border-white/10 flex flex-col items-center py-6 shrink-0 z-10 gap-4">
             <button 
                onClick={() => setActiveTab('search')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group
                    ${activeTab === 'search' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'text-white/40 hover:bg-white/10 hover:text-white'}
                `}
                title="Pesquisar Leads"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
             </button>

             <button 
                onClick={() => setActiveTab('contacted')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group
                    ${activeTab === 'contacted' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-white/40 hover:bg-white/10 hover:text-white'}
                `}
                title="Chamados / Histórico"
             >
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-black border border-white/20 rounded-full flex items-center justify-center text-[8px] font-bold text-white z-10">
                    {contactedLeads.length}
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
             </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden">
            
            {/* --- ABA DE PESQUISA --- */}
            {activeTab === 'search' && (
                <>
                {/* Search Header */}
                <div className="p-6 border-b border-white/5 bg-[#050505]/95 backdrop-blur z-10 shrink-0">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="mb-6">
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                                Prospecção <span className="text-red-600">Deep Dive</span>
                            </h1>
                        </div>

                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#0A0A0A] p-5 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho de Mercado</label>
                                <div className="relative">
                                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:border-red-600 outline-none text-base font-bold transition-all" placeholder="Ex: Estética, Hamburgueria..." />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                                </div>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região Alvo</label>
                                <div className="relative">
                                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:border-red-600 outline-none text-base font-bold transition-all" placeholder="Ex: Pinheiros, SP" />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><LocationIcon className="w-5 h-5 text-white/30" /></div>
                                </div>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                 <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Filtro de Site</label>
                                 <select value={siteFilter} onChange={(e: any) => setSiteFilter(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-600 outline-none text-base font-bold appearance-none cursor-pointer">
                                    <option value="no_site" className="bg-black">⚠️ Sem Site (Prioridade)</option>
                                    <option value="with_site" className="bg-black">💻 Com Site</option>
                                    <option value="all" className="bg-black">🌎 Todos</option>
                                 </select>
                            </div>
                            <div className="md:col-span-2">
                                 <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[58px] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                    {isLoading ? <SpinnerIcon /> : 'CAÇAR LEADS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Results Grid / Debug Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#050505]">
                    <div className="max-w-8xl mx-auto">
                        
                        {/* Debug Console Compacto */}
                        {(isLoading || debugLogs.length > 0) && (
                            <div className="mb-6 bg-black border border-white/10 rounded-xl p-3 font-mono text-[9px] text-white/60 max-h-32 overflow-y-auto custom-scrollbar shadow-inner">
                                {debugLogs.map((log, i) => <div key={i}><span className="text-green-500 mr-2">{'>'}</span>{log}</div>)}
                                <div ref={logsEndRef} />
                            </div>
                        )}

                        {!isLoading && leads.length === 0 && searchTerm && debugLogs.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
                                 <div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                     <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                 </div>
                                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Sistema Pronto</h3>
                                 <p className="text-white/40 text-xs font-mono mt-2">Configure os parâmetros acima para iniciar a varredura.</p>
                            </div>
                        )}

                        {!isLoading && leads.length > 0 && (
                            <div className="pb-20">
                                 <div className="flex justify-between items-end mb-8 px-1 border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-white italic">{leads.length}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2">Oportunidades Encontradas</span>
                                    </div>
                                 </div>
                                 
                                 {/* GRID DE CARDS HIGH END - MAIOR E COM FOTOS */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                     {leads.map((lead) => (
                                         <LeadCard key={lead.id} lead={lead} />
                                     ))}
                                 </div>
                            </div>
                        )}
                    </div>
                </div>
                </>
            )}

            {/* --- ABA DE CHAMADOS --- */}
            {activeTab === 'contacted' && (
                <div className="flex-1 flex flex-col bg-[#050505] p-6 overflow-hidden animate-in slide-in-from-right-10 duration-300">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                            <div>
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                                    Histórico de <span className="text-blue-600">Chamados</span>
                                </h1>
                                <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">
                                    Base de Leads Processados
                                </p>
                            </div>
                            
                            {/* Pesquisa Local na Aba Chamados */}
                            <div className="relative w-full md:w-96">
                                <input 
                                    type="text" 
                                    value={chamadosSearch}
                                    onChange={(e) => setChamadosSearch(e.target.value)}
                                    placeholder="Filtrar chamados por nome ou nicho..."
                                    className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-blue-600 outline-none text-sm font-medium"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {filteredContactedLeads.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                                    <svg className="w-16 h-16 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                    <p className="text-sm font-black uppercase tracking-widest">Nenhum registro encontrado</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
                                    {filteredContactedLeads.map((lead) => (
                                        <LeadCard key={lead.id} lead={lead} isArchived={true} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
