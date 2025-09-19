// Re-export hooks from the hooks directory
export { useActivityEvents, useEventStatistics, useEventTimeRange } from '../hooks/useActivityEvents';

// Re-export utilities from the utils directory
export {
  processActivityEvents,
  calculateEventStatistics,
  calculateTimeRange,
  filterEventsByType,
  filterEventsBySearch,
  getLatestContentState,
  getEventTypeDisplayName,
  eventBelongsToActivity,
  sortEventsByTimestamp,
  type EventStatistics,
  type TimeRange
} from './eventProcessingUtils';