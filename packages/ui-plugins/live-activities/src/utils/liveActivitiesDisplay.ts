/**
 * Pure utility functions for formatting Live Activities data for display.
 * No React dependencies - can be used anywhere.
 */

import {
  LiveActivityTypeData,
  LiveActivityDisplayData,
  LiveActivityDisplayRow,
  LiveActivitiesValidationStatus
} from '../types/liveActivities';
import { VALIDATION_STATUS } from '../constants';

/**
 * Creates horizontal table data for Live Activities display.
 * Returns data formatted for a table with columns: Activity Type, PushToStart Token, Update Token
 * @param activityTypes - Map of activity type data
 * @param validationStatus - Current validation status
 * @param notAvailableText - Localized text for "Not available" (optional, defaults to "Not available")
 * @returns Array of table rows with activity data
 */
export function createLiveActivitiesTableData(
  activityTypes: Map<string, LiveActivityTypeData>,
  validationStatus: LiveActivitiesValidationStatus,
  notAvailableText: string = 'Not available'
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
    pushToStartToken:
      validationStatus === VALIDATION_STATUS.FULL_SUPPORT && activity.pushToStartToken
        ? activity.pushToStartToken
        : notAvailableText,
    updateToken: activity.updateToken || notAvailableText,
    hasSchema: activity.hasSchema
  }));
}
