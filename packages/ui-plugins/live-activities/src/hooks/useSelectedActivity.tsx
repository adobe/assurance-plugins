import useActivities from './useActivities';
import usePluginState from './usePluginState';

/**
 * Hook that returns the currently selected activity based on the selectedActivityId
 * stored in the plugin state. Returns the full activity object from useActivities
 * that matches the selected ID, or null if no activity is selected or found.
 */
export const useSelectedActivity = () => {
  const selectedActivityId = usePluginState(state => state.selectedActivityId);
  const activities = useActivities();

  if (!selectedActivityId) {
    return null;
  }

  return activities.find(activity => activity.id === selectedActivityId) || null;
};

export default useSelectedActivity;
