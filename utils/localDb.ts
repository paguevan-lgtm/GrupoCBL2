
export interface Task {
  id: string;
  content: string;
  status: 'backlog' | 'doing' | 'done';
  priority: 'high' | 'medium' | 'low';
}

export interface WarRoomData {
  notes: string;
  tasks: Task[];
}

export interface MarketingData {
  currentPlan: any | null;
  lastInputs: any | null;
}

const STORAGE_KEYS = {
  WAR_ROOM: 'cbl_war_room_data',
  MARKETING: 'cbl_marketing_data',
  CONTACTED_LEADS: 'cbl_contacted_leads'
};

export const LocalDB = {
  getWarRoomData: (): WarRoomData => {
    if (typeof window === 'undefined') return { notes: '', tasks: [] };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WAR_ROOM);
      return data ? JSON.parse(data) : { notes: '', tasks: [] };
    } catch (e) {
      console.error('Error reading War Room data', e);
      return { notes: '', tasks: [] };
    }
  },

  saveWarRoomData: (data: WarRoomData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.WAR_ROOM, JSON.stringify(data));
  },

  getMarketingData: (): MarketingData => {
    if (typeof window === 'undefined') return { currentPlan: null, lastInputs: null };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MARKETING);
      return data ? JSON.parse(data) : { currentPlan: null, lastInputs: null };
    } catch (e) {
      console.error('Error reading Marketing data', e);
      return { currentPlan: null, lastInputs: null };
    }
  },

  saveMarketingData: (data: MarketingData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MARKETING, JSON.stringify(data));
  },

  getContactedLeads: (): any[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTED_LEADS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading Contacted Leads data', e);
      return [];
    }
  },
  
  saveContactedLeads: (data: any[]) => {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEYS.CONTACTED_LEADS, JSON.stringify(data));
  }
};
