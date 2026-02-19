
// Este arquivo atua como uma camada de persistência local ("Banco de Dados")
// Ele salva automaticamente as alterações no LocalStorage do navegador.

export interface Task {
    id: string;
    content: string;
    status: 'backlog' | 'doing' | 'done';
    priority: 'high' | 'medium' | 'low';
    owner?: string; // Quem assumiu a tarefa
}

export interface WarRoomData {
    notes: string;
    tasks: Task[];
}

export interface MarketingData {
    budget: number;
    cacTarget: number;
    campaigns: {
        id: string;
        name: string;
        channel: 'google' | 'meta' | 'linkedin';
        status: 'active' | 'draft' | 'paused';
    }[];
}

const DB_KEYS = {
    WAR_ROOM: 'cbl_db_war_room',
    MARKETING: 'cbl_db_marketing',
    CONTACTS: 'cbl_contacted_leads'
};

export const LocalDB = {
    // --- WAR ROOM ---
    getWarRoomData: (): WarRoomData => {
        if (typeof window === 'undefined') return { notes: '', tasks: [] };
        const data = localStorage.getItem(DB_KEYS.WAR_ROOM);
        return data ? JSON.parse(data) : { notes: '', tasks: [] };
    },

    saveWarRoomData: (data: WarRoomData) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(DB_KEYS.WAR_ROOM, JSON.stringify(data));
    },

    // --- MARKETING ---
    getMarketingData: (): MarketingData => {
        if (typeof window === 'undefined') return { budget: 1000, cacTarget: 50, campaigns: [] };
        const data = localStorage.getItem(DB_KEYS.MARKETING);
        return data ? JSON.parse(data) : { budget: 1000, cacTarget: 50, campaigns: [] };
    },

    saveMarketingData: (data: MarketingData) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(DB_KEYS.MARKETING, JSON.stringify(data));
    },

    // --- LEADS ---
    getContactedLeads: () => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(DB_KEYS.CONTACTS);
        return data ? JSON.parse(data) : [];
    }
};
