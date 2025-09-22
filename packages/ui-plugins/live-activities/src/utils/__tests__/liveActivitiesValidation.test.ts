import { parseIOSVersion, getLiveActivitiesSupport, validateIOSVersionForLiveActivities, isDeviceVersionBelowAppMinimum } from '../liveActivitiesValidation';
import { VALIDATION_STATUS } from '../../constants';

describe('liveActivitiesValidation', () => {
  describe('parseIOSVersion', () => {
    describe('valid inputs', () => {
      it('should parse standard version strings correctly', () => {
        expect(parseIOSVersion('16.1.2')).toEqual([16, 1]);
        expect(parseIOSVersion('18.0')).toEqual([18, 0]);
        expect(parseIOSVersion('17.5')).toEqual([17, 5]);
        expect(parseIOSVersion('15.7.1')).toEqual([15, 7]);
      });

      it('should handle single major version (missing minor)', () => {
        expect(parseIOSVersion('16')).toEqual([16, 0]);
        expect(parseIOSVersion('18')).toEqual([18, 0]);
        expect(parseIOSVersion('17')).toEqual([17, 0]);
      });

      it('should handle versions with whitespace', () => {
        expect(parseIOSVersion(' 16.1 ')).toEqual([16, 1]);
        expect(parseIOSVersion('\t18.0\n')).toEqual([18, 0]);
        expect(parseIOSVersion('  17  ')).toEqual([17, 0]);
      });

      it('should handle zero versions', () => {
        expect(parseIOSVersion('0.0')).toEqual([0, 0]);
        expect(parseIOSVersion('0')).toEqual([0, 0]);
      });
    });

    describe('invalid inputs', () => {
      it('should return null for empty or falsy inputs', () => {
        expect(parseIOSVersion('')).toBeNull();
        expect(parseIOSVersion('   ')).toBeNull();
        expect(parseIOSVersion(null as any)).toBeNull();
        expect(parseIOSVersion(undefined as any)).toBeNull();
      });

      it('should return null for non-string inputs', () => {
        expect(parseIOSVersion(123 as any)).toBeNull();
        expect(parseIOSVersion({} as any)).toBeNull();
        expect(parseIOSVersion([] as any)).toBeNull();
        expect(parseIOSVersion(true as any)).toBeNull();
      });

      it('should return null for non-numeric versions', () => {
        expect(parseIOSVersion('invalid')).toBeNull();
        expect(parseIOSVersion('abc.def')).toBeNull();
        expect(parseIOSVersion('16.abc')).toBeNull();
        expect(parseIOSVersion('abc.1')).toBeNull();
      });

      it('should return null for negative versions', () => {
        expect(parseIOSVersion('-1.0')).toBeNull();
        expect(parseIOSVersion('16.-1')).toBeNull();
        expect(parseIOSVersion('-5')).toBeNull();
      });

      it('should handle versions with special characters in third part (ignores them)', () => {
        expect(parseIOSVersion('16.1.2-beta')).toEqual([16, 1]); // Third part ignored
        expect(parseIOSVersion('16.1.2+123')).toEqual([16, 1]); // Third part ignored
        expect(parseIOSVersion('16.1.2_1')).toEqual([16, 1]); // Third part ignored
      });

      it('should handle versions with extra parts (ignores them)', () => {
        expect(parseIOSVersion('16.1.2.3')).toEqual([16, 1]); // Third part ignored
        expect(parseIOSVersion('16.1.2.3.4')).toEqual([16, 1]); // Extra parts ignored
      });
    });

    describe('edge cases', () => {
      it('should handle very large version numbers', () => {
        expect(parseIOSVersion('999.999')).toEqual([999, 999]);
        expect(parseIOSVersion('1000.0')).toEqual([1000, 0]);
      });

      it('should handle single dot', () => {
        expect(parseIOSVersion('.')).toBeNull();
        expect(parseIOSVersion('16.')).toBeNull();
        expect(parseIOSVersion('.1')).toBeNull();
      });

      it('should handle multiple consecutive dots', () => {
        expect(parseIOSVersion('16..1')).toBeNull();
        expect(parseIOSVersion('16...1')).toBeNull();
      });
    });
  });

  describe('getLiveActivitiesSupport', () => {
    it('should return NOT_SUPPORTED for versions below 16.1', () => {
      expect(getLiveActivitiesSupport(15, 7)).toBe(VALIDATION_STATUS.NOT_SUPPORTED);
      expect(getLiveActivitiesSupport(16, 0)).toBe(VALIDATION_STATUS.NOT_SUPPORTED);
      expect(getLiveActivitiesSupport(15, 0)).toBe(VALIDATION_STATUS.NOT_SUPPORTED);
    });

    it('should return BASIC_SUPPORT for versions 16.1 to 17.0', () => {
      expect(getLiveActivitiesSupport(16, 1)).toBe(VALIDATION_STATUS.BASIC_SUPPORT);
      expect(getLiveActivitiesSupport(16, 2)).toBe(VALIDATION_STATUS.BASIC_SUPPORT);
      expect(getLiveActivitiesSupport(17, 0)).toBe(VALIDATION_STATUS.BASIC_SUPPORT);
    });

    it('should return FULL_SUPPORT for versions 17.1 and above', () => {
      expect(getLiveActivitiesSupport(17, 1)).toBe(VALIDATION_STATUS.FULL_SUPPORT);
      expect(getLiveActivitiesSupport(17, 2)).toBe(VALIDATION_STATUS.FULL_SUPPORT);
      expect(getLiveActivitiesSupport(18, 0)).toBe(VALIDATION_STATUS.FULL_SUPPORT);
      expect(getLiveActivitiesSupport(19, 0)).toBe(VALIDATION_STATUS.FULL_SUPPORT);
    });
  });

  describe('validateIOSVersionForLiveActivities', () => {
    it('should return correct status for valid versions', () => {
      expect(validateIOSVersionForLiveActivities('15.7')).toBe(VALIDATION_STATUS.NOT_SUPPORTED);
      expect(validateIOSVersionForLiveActivities('16.0')).toBe(VALIDATION_STATUS.NOT_SUPPORTED);
      expect(validateIOSVersionForLiveActivities('16.1')).toBe(VALIDATION_STATUS.BASIC_SUPPORT);
      expect(validateIOSVersionForLiveActivities('17.0')).toBe(VALIDATION_STATUS.BASIC_SUPPORT);
      expect(validateIOSVersionForLiveActivities('17.1')).toBe(VALIDATION_STATUS.FULL_SUPPORT);
      expect(validateIOSVersionForLiveActivities('18.0')).toBe(VALIDATION_STATUS.FULL_SUPPORT);
    });

    it('should return UNKNOWN for invalid versions', () => {
      expect(validateIOSVersionForLiveActivities('')).toBe(VALIDATION_STATUS.UNKNOWN);
      expect(validateIOSVersionForLiveActivities('invalid')).toBe(VALIDATION_STATUS.UNKNOWN);
      expect(validateIOSVersionForLiveActivities('16.-1')).toBe(VALIDATION_STATUS.UNKNOWN);
    });

    it('should handle single major versions', () => {
      expect(validateIOSVersionForLiveActivities('16')).toBe(VALIDATION_STATUS.NOT_SUPPORTED); // 16.0 < 16.1
      expect(validateIOSVersionForLiveActivities('17')).toBe(VALIDATION_STATUS.BASIC_SUPPORT); // 17.0 >= 16.1
    });
  });

  describe('isDeviceVersionBelowAppMinimum', () => {
    it('should return true when device version is below app minimum', () => {
      expect(isDeviceVersionBelowAppMinimum('15.7', '16.0')).toBe(true);
      expect(isDeviceVersionBelowAppMinimum('16.0', '16.1')).toBe(true);
      expect(isDeviceVersionBelowAppMinimum('16.1', '17.0')).toBe(true);
    });

    it('should return false when device version is above or equal to app minimum', () => {
      expect(isDeviceVersionBelowAppMinimum('16.1', '16.0')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('16.1', '16.1')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('17.0', '16.1')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('18.0', '17.1')).toBe(false);
    });

    it('should return false for invalid versions', () => {
      expect(isDeviceVersionBelowAppMinimum('invalid', '16.0')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('16.0', 'invalid')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('', '16.0')).toBe(false);
      expect(isDeviceVersionBelowAppMinimum('16.0', '')).toBe(false);
    });

    it('should handle single major versions', () => {
      expect(isDeviceVersionBelowAppMinimum('16', '16.1')).toBe(true);
      expect(isDeviceVersionBelowAppMinimum('17', '16.1')).toBe(false);
    });
  });
});