import { NAVIGATION_CONFIG } from '../constants/liveActivitiesConfig';

export interface NavigationState {
  selectedActivityId: string | null;
  activeTab: string;
  selectedEventId: string | null;
}

/**
 * Navigation utility functions for cleaner Zustand store
 */
export const navigationUtils = {
  /**
   * Navigate to event details
   */
  navigateToEventDetails: (eventId: string) => ({
    selectedEventId: eventId,
    activeTab: NAVIGATION_CONFIG.ACTIVITY_TABS.EVENT_DETAILS
  }),

  /**
   * Navigate to activity flow
   */
  navigateToActivityFlow: (eventId: string) => ({
    selectedEventId: eventId,
    activeTab: NAVIGATION_CONFIG.ACTIVITY_TABS.ACTIVITY_FLOW
  }),

  /**
   * Navigate to specific event and tab
   */
  navigateToEvent: (eventId: string, tab: string = NAVIGATION_CONFIG.ACTIVITY_TABS.EVENT_DETAILS) => ({
    selectedEventId: eventId,
    activeTab: tab
  }),

  /**
   * Set selected activity (resets event selection)
   */
  setSelectedActivity: (activityId: string | null) => ({
    selectedActivityId: activityId,
    selectedEventId: null // Reset event selection when activity changes
  }),

  /**
   * Set active tab
   */
  setActiveTab: (tab: string) => ({
    activeTab: tab
  }),

  /**
   * Set selected event
   */
  setSelectedEvent: (eventId: string | null) => ({
    selectedEventId: eventId
  })
};
