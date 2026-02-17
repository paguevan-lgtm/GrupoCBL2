
import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './icons/Logo';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LocationIcon } from './icons/LocationIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TargetIcon } from './icons/TargetIcon';
import { ZapIcon } from './icons/ZapIcon';
import { XIcon } from './icons/XIcon';

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
  url?: string;
  phone?: string;
  international_phone?: string;
  lead_score: number;
  status_site: 'com_site' | 'sem_site' | 'site_basico';
  place_id: string;
  types: string[];
  price_level?: number;
  business_status?: string;
  opening_hours?: { open_now: boolean, weekday_text?: string[] };
  photos?: { photo_reference: string }[];
  contactedAt?: string;
  ai_analysis?: string;
}

type SearchMode = 'standard' | 'whale' | 'crisis' | 'ghost';

// --- MODAL DE ESTRATÉGIA (RAIO-X) ---
const LeadStrategyModal = ({ lead, onClose, onCopyPitch, onOpenWhatsapp }: { lead: Lead, onClose: () => void, onCopyPitch: (text: string) => void, onOpenWhatsapp: () => void }) => {
    
    // Lógica de Precificação - MODO DE ENTRADA (Preços mais acessíveis)
    const getPricingStrategy = () => {
        const level = lead.price_level || 1;
        if (level >= 3) { // Whale / High End
            return {
                setup: "R$ 2.500,00 (Entrada facilitada)",
                monthly: "R$ 800,00 (Manutenção)",
                label: "High Ticket (Oportunidade)",
                color: "text-blue-400"
            };
        } else if (level === 2) { // Médio
            return {
                setup: "R$ 1.200,00",
                monthly: "R$ 450,00",
                label: "Standard",
                color: "text-green-400"
            };
        } else { // Pequeno / Popular
            return {
                setup: "Isento (Fidelidade 12 meses)",
                monthly: "R$ 299,00",
                label: "Volume / Escala",
                color: "text-white"
            };
        }
    };

    // Lógica de Produtos para Vender
    const getSalesArsenal = () => {
        const products = [];
        
        // Estratégia de Site
        if (lead.status_site === 'sem_site') {
            products.push({ name: "Site Institucional Express", priority: "ALTA", reason: "Urgência: Invisível no Google." });
            products.push({ name: "Ficha Google (GMB)", priority: "ALTA", reason: "Porta de entrada rápida." });
        } else if (lead.status_site === 'site_basico') {
            products.push({ name: "Profissionalização Visual", priority: "MÉDIA", reason: "Sair do amadorismo (Linktree/Wix)." });
            products.push({ name: "Cardápio/Catálogo Digital", priority: "ALTA", reason: "Facilitar o pedido do cliente." });
        } else {
            products.push({ name: "Landing Page de Oferta", priority: "MÉDIA", reason: "Página específica para vender um produto." });
        }

        // Estratégia de Reputação
        if (lead.rating < 4.2) {
            products.push({ name: "Gestão de Avaliações", priority: "CRÍTICA", reason: `Subir nota ${lead.rating} para atrair mais gente.` });
        } 
        
        return products;
    };

    // Lógica de Pitch Anti-Porteiro (Gatekeeper)
    const generateSmartPitch = () => {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Bom dia' : (hour < 18 ? 'Boa tarde' : 'Boa noite');
        
        // Dados Reais para Humanização
        const company = lead.name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '); // Title Case

        // Estratégia: Não vender o produto, vender a IMPORTÂNCIA de falar com o dono.
        
        let context = "";
        
        // Cenário 1: CRISE (Nota Baixa)
        if (lead.rating < 4.0) {
            context = `Notei um problema nas avaliações do Google da ${company} que pode estar afastando clientes novos, e tenho uma solução rápida pra isso.`;
        } 
        // Cenário 2: INVISÍVEL (Sem Site)
        else if (lead.status_site === 'sem_site') {
            context = `Não encontrei o site oficial da ${company} no Google, e isso está jogando clientes para os concorrentes da região.`;
        }
        // Cenário 3: AMADOR (Linktree/AnotaAI/Wix)
        else if (lead.status_site === 'site_basico') {
            context = `Vi uma oportunidade de melhorar a apresentação digital da ${company} para passar mais profissionalismo e vender mais.`;
        }
        // Cenário 4: BALEIA (Ticket Alto)
        else if (lead.price_level && lead.price_level >= 3) {
            context = `Tenho um projeto de posicionamento digital focado em público de alto padrão que se encaixa perfeitamente na ${company}.`;
        }
        // Fallback
        else {
            context = `Trabalho com posicionamento digital aqui na região e vi alguns pontos que podem aumentar as vendas da ${company}.`;
        }

        // O Script final foca em passar pelo funcionário
        return `${greeting}, tudo bem?\n\nPoderia me fazer uma gentileza? 🙏\n\nEstou tentando contato com o responsável pelo marketing ou o proprietário da ${company}.\n\n${context}\n\nVocê consegue me passar o contato de quem cuida dessa parte, ou encaminhar essa mensagem para ele(a)?\n\nObrigado!`;
    };

    const pricing = getPricingStrategy();
    const arsenal = getSalesArsenal();
    const pitch = generateSmartPitch();

    return (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-sm md:p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full md:max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] bg-[#0c0c0c] border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl" 
                onClick={e => e.stopPropagation()}
            >
                
                {/* Header Modal */}
                <div className="p-5 md:p-6 border-b border-white/5 bg-[#111] flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter truncate max-w-[250px]">{lead.name}</h2>
                            {lead.business_status === 'OPERATIONAL' && <span className="bg-green-500/10 text-green-500 text-[8px] font-bold px-2 py-0.5 rounded uppercase border border-green-500/20">Ativo</span>}
                        </div>
                        <p className="text-white/50 text-[10px] md:text-xs flex items-center gap-2 truncate">
                            <LocationIcon className="w-3 h-3 text-white/30"/> {lead.address}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                {/* Conteúdo Scrollável */}
                <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar bg-[#0c0c0c]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Coluna da Esquerda: Dados Financeiros e Produtos */}
                        <div className="space-y-6">
                            
                            {/* Card de Precificação */}
                            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                    Sugestão de Preço
                                </div>
                                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {pricing.label}
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                        <span className="block text-white/30 text-[9px] uppercase tracking-widest mb-1">Setup (Criação)</span>
                                        <span className={`text-xl md:text-2xl font-black tracking-tight ${pricing.color}`}>{pricing.setup}</span>
                                    </div>
                                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                        <span className="block text-white/30 text-[9px] uppercase tracking-widest mb-1">Mensalidade (Recorrência)</span>
                                        <span className="text-lg md:text-xl font-bold text-white tracking-tight">{pricing.monthly}</span>
                                    </div>
                                </div>
                            </div>

                            {/* O Que Vender */}
                            <div>
                                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3 flex items-center gap-2">
                                    <TargetIcon className="w-4 h-4 text-red-600" /> Oportunidades
                                </h3>
                                <div className="space-y-2">
                                    {arsenal.map((item, idx) => (
                                        <div key={idx} className="bg-[#111] border border-white/5 p-3 rounded-xl flex justify-between items-center group hover:border-white/10 transition-colors">
                                            <div className="pr-2">
                                                <span className="block text-white font-bold text-xs md:text-sm">{item.name}</span>
                                                <span className="block text-white/40 text-[10px] mt-0.5 leading-tight">{item.reason}</span>
                                            </div>
                                            <span className={`shrink-0 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                                                item.priority === 'CRÍTICA' ? 'bg-red-600/20 text-red-500 border border-red-600/30' : 
                                                (item.priority === 'ALTA' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-blue-500/20 text-blue-500 border border-blue-500/30')
                                            }`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Coluna da Direita: Script de Vendas */}
                        <div className="flex flex-col h-full mt-2 lg:mt-0">
                             <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                    <ZapIcon className="w-4 h-4 text-yellow-500" /> Abordagem (Falar com Dono)
                                </h3>
                                <button 
                                    onClick={() => onCopyPitch(pitch)}
                                    className="text-[9px] text-white/40 hover:text-white uppercase font-bold tracking-widest flex items-center gap-1 transition-colors bg-white/5 px-2 py-1 rounded-lg"
                                >
                                    Copiar
                                </button>
                             </div>
                             
                             <div 
                                className="flex-1 bg-[#151515] border border-white/10 rounded-2xl p-4 md:p-6 relative group cursor-pointer hover:border-yellow-500/30 transition-colors min-h-[250px]" 
                                onClick={() => onCopyPitch(pitch)}
                             >
                                 <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm text-white/80 leading-relaxed h-full overflow-y-auto custom-scrollbar">
                                    {pitch}
                                 </pre>
                                 <div className="absolute bottom-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-[9px] text-black uppercase font-bold bg-white/90 px-2 py-1 rounded shadow-lg pointer-events-none">
                                     Toque para Copiar
                                 </div>
                             </div>

                             <button 
                                onClick={onOpenWhatsapp}
                                className="w-full bg-[#25D366] hover:bg-[#20b858] text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-600/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-2 transition-all"
                             >
                                <PhoneIcon className="w-4 h-4 text-black fill-current" />
                                Abrir WhatsApp
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'contacted'>('search');
  
  // Search Configuration
  const [searchMode, setSearchMode] = useState<SearchMode>('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  
  // CRM States
  const [contactedLeads, setContactedLeads] = useState<Lead[]>([]);
  const [chamadosSearch, setChamadosSearch] = useState('');

  // Results States
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debug
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cbl_contacted_leads');
    if (saved) {
        try { setContactedLeads(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cbl_contacted_leads', JSON.stringify(contactedLeads));
  }, [contactedLeads]);

  const addLog = (msg: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debugLogs]);

  const classifySite = (url?: string): 'com_site' | 'sem_site' | 'site_basico' => {
      if (!url) return 'sem_site';
      const lowerUrl = url.toLowerCase();
      const weakDomains = ['anota.ai', 'ifood', 'facebook', 'instagram', 'linktr.ee', 'wa.me', 'whatsapp', 'wix', 'google.com/view', 'bit.ly'];
      if (weakDomains.some(domain => lowerUrl.includes(domain))) return 'site_basico';
      return 'com_site';
  };

  // Algoritmo de Pontuação Adaptativo (Muda conforme o Modo Tático)
  const calculateLeadScore = (place: any, siteStatus: string, mode: SearchMode) => {
    let score = 50; // Base

    // 1. Critério: Site (Universalmente importante)
    if (siteStatus === 'sem_site') score += 30;
    else if (siteStatus === 'site_basico') score += 20;
    else score -= 10;

    // 2. Critérios Específicos por Modo
    switch (mode) {
        case 'whale': // Foco em High Ticket ($$$)
            if (place.price_level >= 3) score += 40; // Jackpot
            else if (place.price_level === 2) score += 10;
            else if (!place.price_level) score -= 10; // Sem info de preço é arriscado
            
            // Baleias costumam ter site, então penalizamos menos se tiver site
            if (siteStatus === 'com_site') score += 15; 
            break;

        case 'crisis': // Foco em Reputação Ruim
            if (place.rating < 3.8) score += 40; // Alvo perfeito
            else if (place.rating < 4.3) score += 20;
            else score -= 20; // Reputação boa não serve pra esse modo
            
            if (place.user_ratings_total < 10) score += 10; // Fantasma
            break;

        case 'ghost': // Foco em Sem Site
            if (siteStatus === 'com_site') score = 0; // Mata o lead
            if (siteStatus === 'sem_site') score += 20;
            // Se for ghost, queremos empresas ativas
            if (place.business_status === 'OPERATIONAL') score += 10;
            break;

        default: // Standard
            if (place.rating < 4.2) score += 10;
            if (place.types?.includes('health') || place.types?.includes('lawyer')) score += 10;
            break;
    }

    return Math.min(Math.max(score, 0), 99);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || !location) return;

    setIsLoading(true);
    setLeads([]);
    setDebugLogs([]); 
    setActiveTab('search');

    addLog(`Ativando Protocolo: ${searchMode.toUpperCase()}`);
    
    // Modificação da Query baseada no Modo
    let queryPrefix = "";
    if (searchMode === 'whale') queryPrefix = "Luxury High End ";
    
    const fullQuery = `${queryPrefix}${searchTerm} in ${location}`;
    addLog(`Query Otimizada: "${fullQuery}"`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      addLog("Conectando Google Places API (Deep Fetch)...");
      
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

      const data = await response.json();
      const rawResults = data.results || [];
      addLog(`${rawResults.length} alvos brutos capturados.`);

      const processedLeads: Lead[] = rawResults.map((place: any) => {
          const siteStatus = classifySite(place.website);
          const score = calculateLeadScore(place, siteStatus, searchMode);
          
          let analysisText = "";

          if (searchMode === 'whale') {
               if (place.price_level >= 3) analysisText = "Ticket $$$ detectado. Potencial alto.";
               else analysisText = "Ticket incerto. Verificar visualmente.";
          } else if (searchMode === 'crisis') {
               if (place.rating < 4.0) analysisText = `Reputação crítica (${place.rating}). Urgente.`;
               else analysisText = "Reputação estável.";
          } else if (searchMode === 'ghost') {
               if (siteStatus !== 'com_site') analysisText = "Sem presença digital sólida.";
               else analysisText = "Possui site.";
          } else {
              if (siteStatus === 'sem_site') analysisText = "Sem site. Vulnerável.";
              else if (place.rating < 4.2) analysisText = "Reputação moderada.";
              else analysisText = "Empresa sólida.";
          }

          return {
              id: place.place_id,
              place_id: place.place_id,
              name: place.name,
              address: place.formatted_address,
              rating: place.rating || 0,
              user_ratings_total: place.user_ratings_total || 0,
              website: place.website,
              url: place.url,
              phone: place.formatted_phone_number,
              international_phone: place.international_phone_number,
              lead_score: score,
              status_site: siteStatus,
              ai_analysis: analysisText,
              types: place.types || [],
              price_level: place.price_level,
              business_status: place.business_status,
              opening_hours: place.opening_hours,
              photos: place.photos
          };
      });

      // Filtros Finais Rígidos
      const filteredLeads = processedLeads.filter((lead: Lead) => {
          const isContacted = contactedLeads.some(cl => cl.id === lead.id);
          if (isContacted) return false;

          // Filtros específicos do modo
          if (searchMode === 'ghost' && lead.status_site === 'com_site') return false;
          if (searchMode === 'crisis' && lead.rating >= 4.5) return false; 
          
          return true;
      });

      filteredLeads.sort((a: Lead, b: Lead) => b.lead_score - a.lead_score);

      setLeads(filteredLeads);
      addLog(`Refinamento concluído. ${filteredLeads.length} leads táticos prontos.`);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        addLog("ERRO: Timeout na operação Deep Fetch.");
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
      if (selectedLead?.id === lead.id) setSelectedLead(null);
  };

  const removeFromContacted = (leadId: string) => {
      setContactedLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const openWhatsApp = (lead: Lead) => {
      const rawPhone = lead.international_phone || lead.phone;
      if (!rawPhone) { alert("Telefone não disponível."); return; }
      let cleanPhone = rawPhone.replace(/\D/g, '');
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11) cleanPhone = '55' + cleanPhone;
      
      const text = encodeURIComponent(`Olá, sou da equipe CBL. Encontrei a *${lead.name}* e vi uma oportunidade de melhoria no posicionamento digital de vocês.`);
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const openInstagram = (lead: Lead) => {
      if (lead.website && lead.website.toLowerCase().includes('instagram.com')) {
          window.open(lead.website, '_blank');
          return;
      }
      const query = `site:instagram.com "${lead.name}" ${location}`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const copyPitch = (lead: Lead, pitchText?: string) => {
      if (pitchText) {
          navigator.clipboard.writeText(pitchText);
          setCopiedId(lead.id);
          setTimeout(() => setCopiedId(null), 2000);
          return;
      }
      // Fallback simples se não vier do modal
      navigator.clipboard.writeText(`Olá ${lead.name}, vi seu perfil e tenho uma proposta.`);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContactedLeads = contactedLeads.filter(l => 
      l.name.toLowerCase().includes(chamadosSearch.toLowerCase()) || 
      (l.types && l.types.some(t => t.includes(chamadosSearch.toLowerCase())))
  );

  // --- UI Components ---

  const ModeSelector = () => (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button 
            type="button"
            onClick={() => setSearchMode('standard')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all group ${searchMode === 'standard' ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <div className="text-center">
                  <span className="block text-[9px] font-black uppercase tracking-widest">Radar Padrão</span>
                  <span className="block text-[8px] text-white/50 mt-1">Varredura Equilibrada</span>
              </div>
          </button>
          
          <button 
            type="button"
            onClick={() => setSearchMode('whale')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${searchMode === 'whale' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="text-center">
                  <span className="block text-[9px] font-black uppercase tracking-widest">Whale Hunter</span>
                  <span className="block text-[8px] text-white/50 mt-1">Ticket Alto / Luxo</span>
              </div>
          </button>

          <button 
            type="button"
            onClick={() => setSearchMode('crisis')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${searchMode === 'crisis' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div className="text-center">
                  <span className="block text-[9px] font-black uppercase tracking-widest">Gestão de Crise</span>
                  <span className="block text-[8px] text-white/50 mt-1">Reputação Baixa</span>
              </div>
          </button>

          <button 
            type="button"
            onClick={() => setSearchMode('ghost')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${searchMode === 'ghost' ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              <div className="text-center">
                  <span className="block text-[9px] font-black uppercase tracking-widest">Ghost Protocol</span>
                  <span className="block text-[8px] text-white/50 mt-1">Sem Site / Invisíveis</span>
              </div>
          </button>
      </div>
  );

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
             <div className="p-6 relative -mt-6 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                     <div className="flex gap-2 flex-wrap mb-2">
                         {lead.types.slice(0, 2).map((t, idx) => (
                             <span key={idx} className="bg-white/5 text-[8px] font-mono text-white/50 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide">
                                 {t.replace(/_/g, ' ')}
                             </span>
                         ))}
                     </div>
                 </div>

                 <h3 className="text-2xl font-black text-white uppercase leading-tight line-clamp-2 mb-3 group-hover:text-red-500 transition-colors">
                     {lead.name}
                 </h3>
                 
                 <div className="flex items-start gap-2 mb-4 min-h-[40px]">
                    <LocationIcon className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                    <a href={lead.url} target="_blank" rel="noreferrer" className="text-white/60 text-xs line-clamp-2 font-medium leading-relaxed hover:text-white hover:underline">
                        {lead.address}
                    </a>
                 </div>

                 {/* Website Display */}
                 <div className="mb-4 bg-white/5 p-2 rounded-lg border border-white/5 overflow-hidden">
                     <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full shrink-0 ${
                             lead.status_site === 'sem_site' ? 'bg-red-500 animate-pulse' : 
                             (lead.status_site === 'site_basico' ? 'bg-yellow-500' : 'bg-green-500')
                         }`}></div>
                         <span className="text-[9px] font-mono text-white/50 uppercase tracking-wide truncate">
                             {lead.website ? lead.website.replace(/^https?:\/\//, '').replace(/^www\./, '') : 'NENHUM SITE DETECTADO'}
                         </span>
                     </div>
                 </div>

                 <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-4 mt-auto">
                     <div className="flex flex-col">
                         <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-1">Análise Tática</span>
                         <button 
                            onClick={() => setSelectedLead(lead)} 
                            className="bg-white/5 hover:bg-white/10 text-red-500 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border border-red-900/30 hover:border-red-600 transition-all flex items-center gap-2"
                         >
                            Ver Raio-X Completo <span className="text-xs">→</span>
                         </button>
                     </div>
                     
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
                    onClick={() => copyPitch(lead, undefined)}
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
            Intelligence Hub v4.4
          </span>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Deep Search: ON</span>
            </div>
            <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-500 transition-colors">Sair</button>
        </div>
      </header>

      {/* LEAD STRATEGY MODAL */}
      {selectedLead && (
        <LeadStrategyModal 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)} 
            onCopyPitch={(text) => copyPitch(selectedLead, text)}
            onOpenWhatsapp={() => openWhatsApp(selectedLead)}
        />
      )}

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

                        {/* Tactical Mode Selector */}
                        <div className="mb-4">
                            <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 block ml-1">Estratégia Tática</label>
                            <ModeSelector />
                        </div>

                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#0A0A0A] p-5 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Nicho de Mercado</label>
                                <div className="relative">
                                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:border-red-600 outline-none text-base font-bold transition-all" placeholder="Ex: Estética, Hamburgueria..." />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                                </div>
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-red-600 uppercase tracking-widest ml-1">Região Alvo</label>
                                <div className="relative">
                                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:border-red-600 outline-none text-base font-bold transition-all" placeholder="Ex: Pinheiros, SP" />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><LocationIcon className="w-5 h-5 text-white/30" /></div>
                                </div>
                            </div>
                            
                            <div className="md:col-span-3">
                                 <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 h-[58px] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                    {isLoading ? <SpinnerIcon /> : 'EXECUTAR'}
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
                                 <p className="text-white/40 text-xs font-mono mt-2">Selecione uma estratégia e configure os parâmetros.</p>
                            </div>
                        )}

                        {!isLoading && leads.length > 0 && (
                            <div className="pb-20">
                                 <div className="flex justify-between items-end mb-8 px-1 border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-white italic">{leads.length}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2">Oportunidades {searchMode.toUpperCase()} Encontradas</span>
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
