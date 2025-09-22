import { create } from 'zustand';

import { NAVIGATION_CONFIG } from '../constants/liveActivitiesConfig';
import { navigationUtils } from '../utils/navigationUtils';

// Type definitions for better type safety
type TopLevelTab =
  (typeof NAVIGATION_CONFIG.TOP_LEVEL_TABS)[keyof typeof NAVIGATION_CONFIG.TOP_LEVEL_TABS];
type ActivityTab =
  (typeof NAVIGATION_CONFIG.ACTIVITY_TABS)[keyof typeof NAVIGATION_CONFIG.ACTIVITY_TABS];

interface PluginState {
  // Data state
  activities: any[];
  selectedClient?: string;

  // Top-level navigation (main plugin tabs)
  topLevelNavigation: {
    activeTab: TopLevelTab;
    setActiveTab: (tab: TopLevelTab) => void;
  };

  // Activity-level navigation (within activities view)
  activityNavigation: {
    selectedActivityId: string | null;
    activeTab: ActivityTab;
    selectedEventId: string | null;
    setSelectedActivityId: (activityId: string | null) => void;
    setActiveTab: (tab: ActivityTab) => void;
    setSelectedEventId: (eventId: string | null) => void;
    navigateToEvent: (eventId: string, tab?: ActivityTab) => void;
    navigateToEventDetails: (eventId: string) => void;
    navigateToActivityFlow: (eventId: string) => void;
  };

  // Data actions
  setActivities: (activities: any[]) => void;
  setSelectedClient: (client: any) => void;
}

const usePluginState = create<PluginState>()(set => ({
  // Data state
  activities: [],
  selectedClient: undefined,

  // Top-level navigation
  topLevelNavigation: {
    activeTab: NAVIGATION_CONFIG.DEFAULTS.TOP_LEVEL_TAB,
    setActiveTab: tab =>
      set(state => ({
        topLevelNavigation: { ...state.topLevelNavigation, activeTab: tab }
      }))
  },

  // Activity-level navigation
  activityNavigation: {
    selectedActivityId: NAVIGATION_CONFIG.DEFAULTS.SELECTED_ACTIVITY,
    activeTab: NAVIGATION_CONFIG.DEFAULTS.ACTIVITY_TAB,
    selectedEventId: NAVIGATION_CONFIG.DEFAULTS.SELECTED_EVENT,

    setSelectedActivityId: activityId =>
      set(state => ({
        activityNavigation: {
          ...state.activityNavigation,
          ...navigationUtils.setSelectedActivity(activityId)
        }
      })),

    setActiveTab: tab =>
      set(state => ({
        activityNavigation: {
          ...state.activityNavigation,
          activeTab: tab
        }
      })),

    setSelectedEventId: eventId =>
      set(state => ({
        activityNavigation: {
          ...state.activityNavigation,
          ...navigationUtils.setSelectedEvent(eventId)
        }
      })),

    navigateToEvent: (
      eventId: string,
      tab: ActivityTab = NAVIGATION_CONFIG.ACTIVITY_TABS.EVENT_DETAILS
    ) =>
      set(
        state =>
          ({
            activityNavigation: {
              ...state.activityNavigation,
              ...navigationUtils.navigateToEvent(eventId, tab)
            }
          }) as Partial<PluginState>
      ),

    navigateToEventDetails: (eventId: string) =>
      set(state => ({
        activityNavigation: {
          ...state.activityNavigation,
          ...navigationUtils.navigateToEventDetails(eventId)
        }
      })),

    navigateToActivityFlow: eventId =>
      set(state => ({
        activityNavigation: {
          ...state.activityNavigation,
          ...navigationUtils.navigateToActivityFlow(eventId)
        }
      }))
  },

  // Data actions
  setActivities: activities => set({ activities }),
  setSelectedClient: client => set({ selectedClient: client })
}));

export default usePluginState;
export type { ActivityTab, TopLevelTab };
