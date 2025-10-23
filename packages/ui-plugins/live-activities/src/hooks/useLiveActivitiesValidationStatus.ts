import { useMemo } from 'react';

import {
  useClientIOSVersion,
  useSelectedClientType,
  useClientLiveActivitiesSupport
} from './useClientInfo';
import { validateIOSVersionForLiveActivities } from '../utils/liveActivitiesValidation';
import { type LiveActivitiesValidationStatus } from '../types/liveActivities';

/**
 * Hook to determine Live Activities validation status based on iOS version.
 *
 * iOS <16.1 → Show "Live Activities Not Supported" → Stop validation.
 * iOS 16.1 – 17.0 → Validate: Successful registration, Update tokens, Per-activity schema.
 * iOS ≥17.1 → Validate everything above plus PushToStart tokens.
 *
 * This hook handles React-specific concerns (context, state, memoization) while
 * delegating the pure validation logic to utility functions.
 *
 * @returns LiveActivitiesValidationStatus indicating current support level
 */
export function useLiveActivitiesValidationStatus(): LiveActivitiesValidationStatus {
  const iosVersion = useClientIOSVersion();
  const clientType = useSelectedClientType();
  const liveActivitiesSupport = useClientLiveActivitiesSupport();

  return useMemo(() => {
    // If not iOS device, return not-ios
    if (clientType !== 'iOS') {
      return 'not-ios';
    }

    // If iOS version cannot be determined, return unknown
    if (!iosVersion) {
      return 'unknown';
    }

    // Use pure utility function for version validation logic
    return validateIOSVersionForLiveActivities(iosVersion);
  }, [iosVersion, clientType, liveActivitiesSupport]);
}
