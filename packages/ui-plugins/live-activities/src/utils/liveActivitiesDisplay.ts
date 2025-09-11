/**
 * Pure utility functions for formatting Live Activities data for display.
 * No React dependencies - can be used anywhere.
 */

import { VALIDATION_STATUS } from '../constants';
import {
  LiveActivityTypeData,
  LiveActivityDisplayData,
  LiveActivityDisplayRow,
  LiveActivitiesValidationStatus
} from '../types/liveActivities';

/**
 * Creates horizontal table data for Live Activities display.
 * Returns data formatted for a table with columns: Activity Type
 * @param activityTypes - Map of activity type data
 * @param validationStatus - Current validation status
 * @param notAvailableText - Localized text for "Not available" (optional, defaults to "Not available")
 * @returns Array of table rows with activity data
 */
export function createLiveActivitiesTableData(
  activityTypes: Map<string, LiveActivityTypeData>,
  validationStatus: LiveActivitiesValidationStatus
): LiveActivityDisplayRow[] {
  if (
    validationStatus !== VALIDATION_STATUS.BASIC_SUPPORT &&
    validationStatus !== VALIDATION_STATUS.FULL_SUPPORT
  ) {
    return [];
  }

  const activityTypesArray = Array.from(activityTypes.values());

  return activityTypesArray.map(activity => ({
    activityType: activity.attributeType,
    hasSchema: activity.hasSchema
  }));
}
