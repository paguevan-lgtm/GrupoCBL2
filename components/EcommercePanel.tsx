import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calculator, DollarSign, Percent, TrendingUp, RefreshCw } from 'lucide-react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface Marketplace {
    id: string;
    name: string;
    feePercent: number;
    fixedFee: number;
    threshold: number;
    brandColor: string;
    bgColor: string;
    borderColor: string;
}

const EcommercePanel = () => {
    const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
    const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [costPrice, setCostPrice] = useState<string>('');
    const [sellPrice, setSellPrice] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [aiError, setAiError] = useState<string | null>(null);

    const fetchMarketplaces = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/marketplaces');
            if (response.ok) {
                const data = await response.json();
                setMarketplaces(data);
                if (selectedMarketplaces.length === 0) {
                    setSelectedMarketplaces(data.map((m: Marketplace) => m.id));
                }
            }
        } catch (error) {
            console.error("Erro ao buscar marketplaces estáticos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeWithAI = async () => {
        if (!sellPrice) {
            setAiError("Por favor, preencha o preço de venda para análise.");
            return;
        }
        setIsAiLoading(true);
        setAiError(null);
        try {
            const aiResponse = await fetch('/api/marketplaces-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, price: sellPrice })
            });
            const aiData = await aiResponse.json();
            
            if (aiResponse.ok && Array.isArray(aiData) && aiData.length > 0) {
                 setMarketplaces(aiData);
                 setAiError(null);
            } else {
                 setMarketplaces(aiData.fallback || []);
                 setAiError(aiData.error || "Erro ao consultar modelo de IA. Utilizando taxas médias de mercado.");
            }
        } catch (error: any) {
            console.error("Erro ao consultar modelo de IA:", error);
            setAiError("Erro na conexão com IA. Verifique as chaves.");
        } finally {
            setIsAiLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketplaces();
    }, []);

    const parseCurrency = (val: string) => {
        const clean = val.replace(/[^\d.,]/g, '').replace(',', '.');
        return parseFloat(clean) || 0;
    };

    const cost = parseCurrency(costPrice);
    const price = parseCurrency(sellPrice);

    const toggleMarketplace = (id: string) => {
        setSelectedMarketplaces(prev => 
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const activeMarketplaces = marketplaces.filter(mkp => selectedMarketplaces.includes(mkp.id));

    return (
        <div className="h-full flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar p-4 md:p-6 pb-24 md:pb-6">
            <div className="max-w-6xl mx-auto w-full">
                
                {/* HEAD */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-red-600" />
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Ecommerce Hub</h2>
                            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Calculadora de Margem & Inteligência de Marketplace</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => fetchMarketplaces()}
                        className="flex items-center gap-2 hover:bg-white/5 px-3 py-2 border border-white/10 rounded-lg text-white/50 hover:text-white transition-all text-[10px] font-mono uppercase tracking-widest"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        Atualizar Taxas
                    </button>
                </div>

                {/* CALCULATOR CONTROLS */}
                <div className="bg-[#0c0c0c] p-6 md:p-8 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Calculator size={120} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end relative z-10 w-full mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign size={12} className="text-red-500" />
                                Custo do Produto (R$)
                            </label>
                            <input 
                                type="number" 
                                value={costPrice} 
                                onChange={e => setCostPrice(e.target.value)} 
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600 outline-none text-xl font-bold" 
                                placeholder="0.00" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={12} className="text-green-500" />
                                Preço de Venda (R$)
                            </label>
                            <input 
                                type="number" 
                                value={sellPrice} 
                                onChange={e => setSellPrice(e.target.value)} 
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-4 text-green-400 focus:border-green-500 outline-none text-xl font-bold" 
                                placeholder="0.00" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                Categoria do Produto / Niche
                            </label>
                            <input 
                                type="text" 
                                value={category} 
                                onChange={e => setCategory(e.target.value)} 
                                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 outline-none text-xl font-bold" 
                                placeholder="Ex: Eletrônicos" 
                            />
                        </div>
                    </div>

                    <div className="mb-8 relative z-10">
                        <button 
                            onClick={() => analyzeWithAI()}
                            disabled={isAiLoading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all text-xs ${isAiLoading ? 'bg-purple-500/50 text-white/50' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'}`}
                        >
                            <RefreshCw size={16} className={isAiLoading ? "animate-spin" : ""} />
                            {isAiLoading ? "Analisando com IA..." : "Aplicar Taxas de Categoria com IA"}
                        </button>
                        {aiError && (
                            <p className="text-red-500 text-sm mt-2">{aiError}</p>
                        )}
                    </div>

                    <div className="relative z-10">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block">Marketplaces</label>
                        <div className="flex flex-wrap gap-3">
                            {marketplaces.map((mkp) => (
                                <button
                                    key={mkp.id}
                                    onClick={() => toggleMarketplace(mkp.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                                        selectedMarketplaces.includes(mkp.id)
                                            ? `${mkp.borderColor} ${mkp.bgColor} ${mkp.brandColor}`
                                            : 'border-white/10 text-white/40 bg-[#151515] hover:border-white/30'
                                    }`}
                                >
                                    {mkp.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RESULTS GRID */}
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <SpinnerIcon className="text-red-600 w-8 h-8" />
                    </div>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-bottom-10">
                        <h3 className="text-xs font-black text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Percent size={14} /> 
                            Simulação de Lucratividade por Plataforma
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeMarketplaces.map((mkp) => {
                                // Lógica de cálculo de taxas
                                let isFixedFeeApplied = false;
                                
                                if (mkp.threshold > 0) {
                                    isFixedFeeApplied = price < mkp.threshold;
                                } else if (mkp.fixedFee > 0) {
                                    isFixedFeeApplied = true; // Aplicado em todas as vendas
                                }

                                const percentageFeeAmount = price * (mkp.feePercent / 100);
                                const fixedFeeAmount = isFixedFeeApplied ? mkp.fixedFee : 0;
                                const totalFees = percentageFeeAmount + fixedFeeAmount;
                                
                                const netProfit = price - cost - totalFees;
                                const roi = cost > 0 ? (netProfit / cost) * 100 : 0;
                                const margin = price > 0 ? (netProfit / price) * 100 : 0;

                                const isProfitable = netProfit > 0;

                                return (
                                    <div key={mkp.id} className={`${mkp.bgColor} ${mkp.borderColor} border p-5 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.02]`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className={`text-lg font-black uppercase italic tracking-tight ${mkp.brandColor}`}>{mkp.name}</h4>
                                                <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-1">
                                                    Taxa: {mkp.feePercent}% {mkp.fixedFee > 0 && `+ R$ ${mkp.fixedFee.toFixed(2)}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white/50 font-medium">Tarifa (%)</span>
                                                <span className="text-red-400 font-mono">- R$ {percentageFeeAmount.toFixed(2)}</span>
                                            </div>
                                            {isFixedFeeApplied && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-white/50 font-medium">Tarifa Fixa</span>
                                                    <span className="text-red-400 font-mono">- R$ {fixedFeeAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                                                <span className="text-white/70 font-bold">Desconto Total</span>
                                                <span className="text-red-500 font-bold font-mono">R$ {totalFees.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {price > 0 && cost > 0 ? (
                                            <div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Lucro Líquido</p>
                                                <div className="flex items-end gap-3">
                                                    <span className={`text-3xl font-black tracking-tighter ${isProfitable ? 'text-green-400' : 'text-red-500'}`}>
                                                        R$ {netProfit.toFixed(2)}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                                    <div className="flex-1 bg-black/30 rounded-lg p-2 text-center">
                                                        <span className="block text-[9px] text-white/40 uppercase tracking-widest mb-1">Margem</span>
                                                        <span className={`text-xs font-bold ${margin > 0 ? 'text-green-400' : 'text-red-400'}`}>{margin.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="flex-1 bg-black/30 rounded-lg p-2 text-center">
                                                        <span className="block text-[9px] text-white/40 uppercase tracking-widest mb-1">ROI</span>
                                                        <span className={`text-xs font-bold ${roi > 0 ? 'text-green-400' : 'text-red-400'}`}>{roi.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center py-6 bg-black/20 rounded-xl border border-white/5">
                                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
                                                    Insira valores para simular
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EcommercePanel;
