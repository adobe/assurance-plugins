/**
 * Pure utility functions for Live Activities validation logic.
 * These functions contain no React dependencies and can be used anywhere.
 */

import { LIVE_ACTIVITIES_MIN_VERSION } from '../constants';

export type LiveActivitiesValidationStatus =
  | 'not-supported'
  | 'basic-support'
  | 'full-support'
  | 'unknown'
  | 'not-ios';

/**
 * Parses an iOS version string into major and minor version numbers.
 * @param version - Version string like "16.1.2" or "18.0"
 * @returns Array of [majorVersion, minorVersion] as numbers
 *
 * @example
 * parseIOSVersion("16.1.2") // [16, 1]
 * parseIOSVersion("18.0") // [18, 0]
 */
export function parseIOSVersion(version: string): [number, number] {
  const versionParts = version.split('.').map(part => parseInt(part, 10));
  const majorVersion = versionParts[0] || 0;
  const minorVersion = versionParts[1] || 0;
  return [majorVersion, minorVersion];
}

/**
 * Determines Live Activities support level based on iOS version.
 * @param majorVersion - iOS major version (e.g., 16, 17, 18)
 * @param minorVersion - iOS minor version (e.g., 0, 1, 2)
 * @returns Support level string
 *
 * @example
 * getLiveActivitiesSupport(15, 7) // 'not-supported'
 * getLiveActivitiesSupport(16, 1) // 'basic-support'
 * getLiveActivitiesSupport(17, 1) // 'full-support'
 * getLiveActivitiesSupport(18, 0) // 'full-support'
 */
export function getLiveActivitiesSupport(
  majorVersion: number,
  minorVersion: number
): LiveActivitiesValidationStatus {
  // iOS < 16.1: Live Activities not supported
  if (majorVersion < 16 || (majorVersion === 16 && minorVersion < 1)) {
    return 'not-supported';
  }

  // iOS 16.1 - 17.0: Basic Live Activities support
  if (majorVersion === 16 || (majorVersion === 17 && minorVersion === 0)) {
    return 'basic-support';
  }

  // iOS ≥ 17.1: Full Live Activities support including PushToStart
  if (majorVersion > 17 || (majorVersion === 17 && minorVersion >= 1)) {
    return 'full-support';
  }

  // Fallback for any other cases
  return 'unknown';
}

/**
 * Validates iOS version string and determines Live Activities support.
 * @param iosVersion - iOS version string (e.g., "16.1.2")
 * @returns Support level or 'unknown' if version is invalid
 *
 * @example
 * validateIOSVersionForLiveActivities("16.1.2") // 'basic-support'
 * validateIOSVersionForLiveActivities("18.0") // 'full-support'
 * validateIOSVersionForLiveActivities("invalid") // 'unknown'
 */
export function validateIOSVersionForLiveActivities(
  iosVersion: string
): LiveActivitiesValidationStatus {
  try {
    const [major, minor] = parseIOSVersion(iosVersion);

    // Check for invalid version numbers
    if (isNaN(major) || isNaN(minor)) {
      return 'unknown';
    }

    return getLiveActivitiesSupport(major, minor);
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Compares two iOS version strings.
 * @param deviceVersion - Device iOS version (e.g., "15.7")
 * @param appMinVersion - App minimum version (e.g., "16.0")
 * @returns true if device version is below app minimum version
 *
 * @example
 * isDeviceVersionBelowAppMinimum("15.7", "16.0") // true
 * isDeviceVersionBelowAppMinimum("18.0", "16.0") // false
 */
export function isDeviceVersionBelowAppMinimum(
  deviceVersion: string,
  appMinVersion: string
): boolean {
  try {
    const [deviceMajor, deviceMinor] = parseIOSVersion(deviceVersion);
    const [appMinMajor, appMinMinor] = parseIOSVersion(appMinVersion);

    return deviceMajor < appMinMajor || (deviceMajor === appMinMajor && deviceMinor < appMinMinor);
  } catch (error) {
    return false;
  }
}

/**
 * Gets user-friendly status configuration for display.
 * @param status - Validation status
 * @returns Configuration object with title and icon type
 */
export function getStatusDisplayConfig(status: LiveActivitiesValidationStatus) {
  switch (status) {
    case 'not-supported':
      return {
        title: 'Live Activities Not Supported',
        icon: 'invalid' as const,
        variant: 'negative' as const
      };
    case 'basic-support':
      return {
        title: 'Basic Live Activities Support',
        icon: 'warning' as const,
        variant: 'notice' as const
      };
    case 'full-support':
      return {
        title: 'Full Live Activities Support',
        icon: 'valid' as const,
        variant: 'positive' as const
      };
    case 'unknown':
      return {
        title: 'iOS Version Unknown',
        icon: 'info' as const,
        variant: 'neutral' as const
      };
    case 'not-ios':
      return {
        title: 'Not an iOS Device',
        icon: 'info' as const,
        variant: 'neutral' as const
      };
    default:
      return {
        title: 'Unknown Status',
        icon: 'info' as const,
        variant: 'neutral' as const
      };
  }
}
