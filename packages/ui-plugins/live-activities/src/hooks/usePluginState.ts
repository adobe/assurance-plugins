import { create } from 'zustand';

interface PluginState {
  activities: any[];
  selectedActivityId: string | null;
  selectedTab: 'activities' | 'settings';
  selectedClient?: string;
  setActivities: (activities: any[]) => void;
  setSelectedActivityId: (activityId: string | null) => void;
  setSelectedTab: (tab: 'activities' | 'settings') => void;
  setSelectedClient: (client: any) => void;
}

const usePluginState = create<PluginState>()(set => ({
  activities: [],
  selectedActivityId: null,
  selectedTab: 'activities',
  selectedClient: undefined,
  setActivities: activities => set({ activities }),
  setSelectedActivityId: activityId => set({ selectedActivityId: activityId }),
  setSelectedTab: tab => set({ selectedTab: tab }),
  setSelectedClient: client => set({ selectedClient: client })
}));

export default usePluginState;
