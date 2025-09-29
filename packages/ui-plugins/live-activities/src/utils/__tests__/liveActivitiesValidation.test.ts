/**
 * Test suite for Live Activities validation utilities.
 * These pure functions are easy to test without React dependencies.
 */

import {
  parseIOSVersion,
  getLiveActivitiesSupport,
  validateIOSVersionForLiveActivities,
  isDeviceVersionBelowAppMinimum,
  getStatusDisplayConfig
} from '../liveActivitiesValidation';

describe('Live Activities Validation Utils', () => {
  describe('parseIOSVersion', () => {
    it('should parse standard iOS versions correctly', () => {
      expect(parseIOSVersion('16.1.2')).toEqual([16, 1]);
      expect(parseIOSVersion('18.0')).toEqual([18, 0]);
      expect(parseIOSVersion('15.7.3')).toEqual([15, 7]);
    });

    it('should handle versions with missing minor version', () => {
      expect(parseIOSVersion('16')).toEqual([16, 0]);
    });

    it('should handle invalid versions gracefully', () => {
      expect(parseIOSVersion('invalid')).toEqual([NaN, 0]);
    });
  });

  describe('getLiveActivitiesSupport', () => {
    it('should return not-supported for iOS < 16.1', () => {
      expect(getLiveActivitiesSupport(15, 7)).toBe('not-supported');
      expect(getLiveActivitiesSupport(16, 0)).toBe('not-supported');
      expect(getLiveActivitiesSupport(14, 5)).toBe('not-supported');
    });

    it('should return basic-support for iOS 16.1 - 17.0', () => {
      expect(getLiveActivitiesSupport(16, 1)).toBe('basic-support');
      expect(getLiveActivitiesSupport(16, 5)).toBe('basic-support');
      expect(getLiveActivitiesSupport(17, 0)).toBe('basic-support');
    });

    it('should return full-support for iOS >= 17.1', () => {
      expect(getLiveActivitiesSupport(17, 1)).toBe('full-support');
      expect(getLiveActivitiesSupport(17, 2)).toBe('full-support');
      expect(getLiveActivitiesSupport(18, 0)).toBe('full-support');
      expect(getLiveActivitiesSupport(19, 0)).toBe('full-support');
    });
  });

  describe('validateIOSVersionForLiveActivities', () => {
    it('should correctly validate real iOS versions', () => {
      expect(validateIOSVersionForLiveActivities('15.7')).toBe('not-supported');
      expect(validateIOSVersionForLiveActivities('16.1')).toBe('basic-support');
      expect(validateIOSVersionForLiveActivities('17.1')).toBe('full-support');
      expect(validateIOSVersionForLiveActivities('18.0')).toBe('full-support');
    });

    it('should handle invalid versions', () => {
      expect(validateIOSVersionForLiveActivities('invalid')).toBe('unknown');
      expect(validateIOSVersionForLiveActivities('')).toBe('unknown');
    });
  });

  describe('isDeviceVersionBelowAppMinimum', () => {
    it('should correctly compare versions', () => {
      expect(isDeviceVersionBelowAppMinimum('15.7', '16.0')).toBe(true);
      expect(isDeviceVersionBelowAppMinimum('16.0', '15.7')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('16.1', '16.1')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('18.0', '16.0')).toBe(false);
    });

    it('should handle invalid versions gracefully', () => {
      expect(isDeviceVersionBelowAppMinimum('invalid', '16.0')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('16.0', 'invalid')).toBe(false);
    });
  });

  describe('getStatusDisplayConfig', () => {
    it('should return correct config for each status', () => {
      expect(getStatusDisplayConfig('not-supported')).toEqual({
        title: 'Live Activities Not Supported',
        icon: 'invalid',
        variant: 'negative'
      });

      expect(getStatusDisplayConfig('full-support')).toEqual({
        title: 'Full Live Activities Support',
        icon: 'valid',
        variant: 'positive'
      });
    });
  });
});
