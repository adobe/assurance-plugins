import { useMemo } from 'react';
import useActivities from './useActivities';
import { useSelectedActivity } from './useSelectedActivity';
import { useSelectedClientId, useECID } from './useClientInfo';
import { useLiveActivitiesValidationStatus } from './useLiveActivitiesValidationStatus';
import { useEvents } from '@assurance/plugin-bridge-provider';
import { combineAny } from '@adobe/griffon-toolkit';
import { LiveActivity } from './useActivities';
import { LiveActivityEvent } from '../types/liveActivityEvent';

interface UseLiveActivitiesMasterReturn {
  // Data
  activities: LiveActivity[];
  selectedActivity?: LiveActivity;
  clientInfo: {
    selectedClientId: string | undefined;
    ecid: string | undefined;
  };
  validationStatus: ReturnType<typeof useLiveActivitiesValidationStatus>;

  // Computed values
  hasActivities: boolean;
  selectedActivityEvents: LiveActivityEvent[];
  selectedActivityEventStats: {
    total: number;
    start: number;
    contentUpdate: number;
    tokenUpdate: number;
    ended: number;
    dismissed: number;
    other: number;
  };

  // Actions
  selectActivity: (id: string) => void;
  refreshActivities: () => void;

  // Loading states
  isLoading: boolean;
  error?: Error;
}

export function useLiveActivitiesMaster(): UseLiveActivitiesMasterReturn {
  // Core data hooks
  const activities = useActivities();
  const selectedActivity = useSelectedActivity();
  const selectedClientId = useSelectedClientId();
  const ecid = useECID();
  const validationStatus = useLiveActivitiesValidationStatus();

  const clientInfo = {
    selectedClientId,
    ecid
  };

  // Events for selected activity
  const allEvents = useEvents<LiveActivityEvent[]>({
    matchers: [
      combineAny([
        'payload.ACPExtensionEventData.liveActivityID',
        'payload.ACPExtensionEventData.data.liveActivityID',
        'payload.ACPExtensionEventData.activityId'
      ])
    ],
    sorted: 'desc'
  });

  // Computed values
  const hasActivities = activities.length > 0;

  const selectedActivityEvents = useMemo(() => {
    if (!selectedActivity) return [];

    return allEvents.filter(event => {
      const eventLiveActivityID =
        event.payload?.ACPExtensionEventData?.liveActivityID ||
        event.payload?.ACPExtensionEventData?.data?.liveActivityID ||
        event.payload?.ACPExtensionEventData?.activityId;

      return eventLiveActivityID === selectedActivity.id;
    });
  }, [allEvents, selectedActivity]);

  const selectedActivityEventStats = useMemo(() => {
    const stats = {
      total: selectedActivityEvents.length,
      start: 0,
      contentUpdate: 0,
      tokenUpdate: 0,
      ended: 0,
      dismissed: 0,
      other: 0
    };

    selectedActivityEvents.forEach(event => {
      const eventName = event.payload?.ACPExtensionEventName || '';
      if (eventName === 'Live Activity start event') stats.start++;
      else if (eventName === 'Live Activity updated') stats.contentUpdate++;
      else if (eventName === 'Live Activity update token') stats.tokenUpdate++;
      else if (eventName === 'Live Activity ended') stats.ended++;
      else if (eventName === 'Live Activity dismissed') stats.dismissed++;
      else stats.other++;
    });

    return stats;
  }, [selectedActivityEvents]);

  // Actions (these would need to be implemented in the respective hooks)
  const selectActivity = (id: string) => {
    // This would need to be implemented in useSelectedActivity
    console.log('Selecting activity:', id);
  };

  const refreshActivities = () => {
    // This would need to be implemented in useActivities
    console.log('Refreshing activities');
  };

  return {
    activities,
    selectedActivity,
    clientInfo,
    validationStatus,
    hasActivities,
    selectedActivityEvents,
    selectedActivityEventStats,
    selectActivity,
    refreshActivities,
    isLoading: false, // This would need to be implemented
    error: undefined // This would need to be implemented
  };
}
