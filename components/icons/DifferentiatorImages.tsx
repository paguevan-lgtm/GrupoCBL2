
import React from 'react';

// Diferencial 1: Pensamento Fora da Caixa (Metáfora de Desconstrução e Expansão)
export const DifferentiatorImage1: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative group">
            {/* Background Grid Dinâmico */}
            <svg className="absolute inset-0 w-full h-full text-red-600/5" fill="none" viewBox="0 0 200 200">
                <defs>
                    <pattern id="grid-dots" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="0.5" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="200" height="200" fill="url(#grid-dots)" />
            </svg>

            {/* Círculos de Energia Concêntricos */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-red-600/10 rounded-full animate-[ping_10s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-red-600/20 rounded-full animate-[ping_7s_linear_infinite]"></div>
            
            {/* O "Cubo" sendo desafiado */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 lg:w-40 lg:h-40">
                {/* Moldura Externa Rotativa */}
                <div className="absolute inset-0 border-2 border-red-600/30 rounded-xl animate-[spin_15s_linear_infinite] opacity-50"></div>
                
                {/* Geometria Central Complexa */}
                <div className="absolute inset-4 border-t-4 border-l-4 border-red-600 rounded-lg animate-[pulse_3s_ease-in-out_infinite]"></div>
                <div className="absolute inset-8 border-b-4 border-r-4 border-white/20 rounded-lg animate-[pulse_4s_ease-in-out_infinite]"></div>
                
                {/* Núcleo de "Luz" */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10"></div>
            </div>

            {/* Partículas de "Pensamento" */}
            <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-red-500 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-[70%] left-[80%] w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-[40%] left-[10%] w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        </div>
    </div>
);

// Diferencial 2: Tecnologia + Estratégia (Metáfora de Conexão e Fluxo de Dados)
export const DifferentiatorImage2: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative">
            {/* Linhas de Fluxo Tecnológico */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <path d="M20,150 Q50,150 70,100 T130,50 Q160,50 180,50" stroke="rgba(229,62,62,0.1)" strokeWidth="0.5" fill="none" />
                <path d="M20,160 Q50,160 80,110 T140,60 Q170,60 190,60" stroke="rgba(229,62,62,0.15)" strokeWidth="0.5" fill="none" />
                
                {/* A "Estratégia" - Linha de Sucesso Ganhando Vida */}
                <path 
                    d="M30,170 C60,170 100,120 120,100 S160,30 180,30" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    fill="none"
                    className="animate-[stroke-draw_3s_ease-out_forwards]"
                />
                <circle cx="180" cy="30" r="4" fill="#ef4444" className="animate-pulse shadow-[0_0_15px_#ef4444]">
                     <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                </circle>
            </svg>

            {/* Painéis "Tech" Flutuantes */}
            <div className="absolute top-[25%] right-[15%] w-24 h-16 bg-black/40 backdrop-blur-md border border-white/5 rounded p-2 flex flex-col justify-between">
                <div className="h-1 w-full bg-red-600/30 rounded"></div>
                <div className="flex gap-1">
                    <div className="h-4 w-1 bg-red-600 rounded"></div>
                    <div className="h-6 w-1 bg-red-600 rounded"></div>
                    <div className="h-3 w-1 bg-red-600 rounded"></div>
                </div>
                <div className="text-[6px] font-mono text-white/20 uppercase tracking-tighter">Algorithm_Active</div>
            </div>

            <div className="absolute bottom-[20%] left-[10%] w-20 h-20 bg-red-600/5 rounded-full border border-red-600/10 flex items-center justify-center">
                <div className="w-12 h-12 border border-red-600/20 rounded-full animate-spin"></div>
                <svg className="absolute w-6 h-6 text-red-500/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                </svg>
            </div>
        </div>
        <style>{`
            @keyframes stroke-draw {
                to { stroke-dashoffset: 0; }
            }
        `}</style>
    </div>
);

// Diferencial 3: Foco no Resultado (Metáfora de Alvo e Performance de Elite)
export const DifferentiatorImage3: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 lg:w-80 lg:h-80 relative flex items-center justify-center">
            {/* Radar Circular Externo */}
            <div className="absolute inset-0 border border-white/5 rounded-full"></div>
            <div className="absolute inset-8 border border-white/10 rounded-full"></div>
            
            {/* Varredura de Radar */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-red-600/5 to-transparent animate-[spin_4s_linear_infinite]"></div>

            {/* Elementos de Interface de Mira */}
            <svg className="absolute inset-0 w-full h-full text-red-600/20" viewBox="0 0 100 100">
                <line x1="50" y1="0" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="90" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="10" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="90" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
                
                {/* Colchetes de Mira */}
                <path d="M30,30 L30,25 L35,25" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.5" />
                <path d="M70,30 L70,25 L65,25" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.5" />
                <path d="M30,70 L30,75 L35,75" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.5" />
                <path d="M70,70 L70,75 L65,75" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.5" />
            </svg>

            {/* Núcleo do Resultado (Indicador de Performance) */}
            <div className="relative group">
                {/* Glow de Fundo */}
                <div className="absolute -inset-4 bg-red-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Círculo Principal */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(229,62,62,0.5)] border border-white/20 transform hover:scale-110 transition-transform cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-[8px] font-black text-white/90 uppercase tracking-[0.2em] mt-1">ROI Optimized</span>
                </div>

                {/* Dados de Telemetria Flutuantes */}
                <div className="absolute -top-12 -right-16 bg-black/60 border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-white/60 backdrop-blur-sm">
                    TARGET: ESCALA_GLOBAL
                </div>
                <div className="absolute -bottom-8 -left-12 bg-black/60 border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-red-500/80 backdrop-blur-sm">
                    STATUS: CONVERTING...
                </div>
            </div>
        </div>
    </div>
);
