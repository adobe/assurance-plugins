/**
 * Pure utility functions for formatting Live Activities data for display.
 * No React dependencies - can be used anywhere.
 */
import { VALIDATION_STATUS } from '../constants';
import {
  LiveActivitiesValidationStatus,
  LiveActivityDisplayRow,
  LiveActivityTypeData
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

  return activityTypesArray.map(activity => {
    // For basic support, pushToStartToken is not available (iOS 16.1 - 16.3)
    // For full support, include pushToStartToken if available
    const pushToStartToken =
      validationStatus === VALIDATION_STATUS.FULL_SUPPORT ? activity.pushToStartToken : undefined;

    // Handle cases where tokens are undefined
    const displayPushToStartToken =
      validationStatus === VALIDATION_STATUS.BASIC_SUPPORT
        ? 'Not available'
        : pushToStartToken || 'Not available';

    const displayUpdateToken = activity.updateToken || 'Not available';

    return {
      activityType: activity.attributeType,
      hasSchema: activity.hasSchema,
      pushToStartToken: displayPushToStartToken,
      updateToken: displayUpdateToken
    };
  });
}
