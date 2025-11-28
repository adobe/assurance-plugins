/**
 * Test suite for test IDs constants
 * Ensures all test IDs are properly defined and follow naming conventions
 */
import { TEST_IDS } from '../testIds';

describe('TEST_IDS', () => {
  describe('Main sections', () => {
    it('should have main section test IDs', () => {
      expect(TEST_IDS.LIVE_ACTIVITIES_VALIDATION_SECTION).toBe(
        'live-activities-validation-section'
      );
      expect(TEST_IDS.LIVE_ACTIVITIES_STATUS).toBe('live-activities-status');
      expect(TEST_IDS.LIVE_ACTIVITIES_SUMMARY).toBe('live-activities-summary');
    });
  });

  describe('Status indicators', () => {
    it('should have status indicator test IDs', () => {
      expect(TEST_IDS.STATUS_LIGHT).toBe('live-activities-status-light');
      expect(TEST_IDS.STATUS_TOOLTIP).toBe('live-activities-status-tooltip');
    });
  });

  describe('Tables', () => {
    it('should have table test IDs', () => {
      expect(TEST_IDS.REGISTERED_ACTIVITIES_TABLE).toBe('registered-activities-table');
      expect(TEST_IDS.ACTIVE_ACTIVITIES_TABLE).toBe('active-activities-table');
    });

    it('should have table header test IDs', () => {
      expect(TEST_IDS.REGISTERED_ACTIVITIES_HEADER).toBe('registered-activities-header');
      expect(TEST_IDS.ACTIVE_ACTIVITIES_HEADER).toBe('active-activities-header');
    });
  });

  describe('Table columns', () => {
    it('should have column test IDs', () => {
      expect(TEST_IDS.ACTIVITY_TYPE_COLUMN).toBe('activity-type-column');
      expect(TEST_IDS.PUSH_TO_START_TOKEN_COLUMN).toBe('push-to-start-token-column');
      expect(TEST_IDS.LIVE_ACTIVITY_ID_COLUMN).toBe('live-activity-id-column');
      expect(TEST_IDS.ACTIVITY_ATTRIBUTE_TYPE_COLUMN).toBe('activity-attribute-type-column');
      expect(TEST_IDS.UPDATE_TOKEN_COLUMN).toBe('update-token-column');
    });
  });

  describe('Table rows', () => {
    it('should generate row test IDs with index', () => {
      expect(TEST_IDS.REGISTERED_ACTIVITY_ROW(0)).toBe('registered-activity-row-0');
      expect(TEST_IDS.REGISTERED_ACTIVITY_ROW(5)).toBe('registered-activity-row-5');
      expect(TEST_IDS.ACTIVE_ACTIVITY_ROW(0)).toBe('active-activity-row-0');
      expect(TEST_IDS.ACTIVE_ACTIVITY_ROW(10)).toBe('active-activity-row-10');
    });
  });

  describe('Table cells', () => {
    it('should generate cell test IDs with index', () => {
      expect(TEST_IDS.REGISTERED_ACTIVITY_TYPE_CELL(0)).toBe('registered-activity-type-cell-0');
      expect(TEST_IDS.REGISTERED_ACTIVITY_TYPE_CELL(3)).toBe('registered-activity-type-cell-3');
      expect(TEST_IDS.REGISTERED_PUSH_TO_START_TOKEN_CELL(0)).toBe(
        'registered-push-to-start-token-cell-0'
      );
      expect(TEST_IDS.REGISTERED_PUSH_TO_START_TOKEN_CELL(7)).toBe(
        'registered-push-to-start-token-cell-7'
      );
      expect(TEST_IDS.ACTIVE_ACTIVITY_ID_CELL(0)).toBe('active-activity-id-cell-0');
      expect(TEST_IDS.ACTIVE_ACTIVITY_ID_CELL(2)).toBe('active-activity-id-cell-2');
      expect(TEST_IDS.ACTIVE_ACTIVITY_ATTRIBUTE_TYPE_CELL(0)).toBe(
        'active-activity-attribute-type-cell-0'
      );
      expect(TEST_IDS.ACTIVE_ACTIVITY_ATTRIBUTE_TYPE_CELL(4)).toBe(
        'active-activity-attribute-type-cell-4'
      );
      expect(TEST_IDS.ACTIVE_UPDATE_TOKEN_CELL(0)).toBe('active-update-token-cell-0');
      expect(TEST_IDS.ACTIVE_UPDATE_TOKEN_CELL(6)).toBe('active-update-token-cell-6');
    });
  });

  describe('Copy buttons', () => {
    it('should generate copy button test IDs with type and index', () => {
      expect(TEST_IDS.COPY_BUTTON('push-to-start', 0)).toBe('copy-button-push-to-start-0');
      expect(TEST_IDS.COPY_BUTTON('update-token', 5)).toBe('copy-button-update-token-5');
      expect(TEST_IDS.COPY_BUTTON('test', 10)).toBe('copy-button-test-10');
    });

    it('should generate copy tooltip test IDs with type and index', () => {
      expect(TEST_IDS.COPY_TOOLTIP('push-to-start', 0)).toBe('copy-tooltip-push-to-start-0');
      expect(TEST_IDS.COPY_TOOLTIP('update-token', 3)).toBe('copy-tooltip-update-token-3');
    });
  });

  describe('Empty states', () => {
    it('should have empty state test IDs', () => {
      expect(TEST_IDS.NO_REGISTERED_ACTIVITIES_MESSAGE).toBe('no-registered-activities-message');
      expect(TEST_IDS.NO_ACTIVE_ACTIVITIES_MESSAGE).toBe('no-active-activities-message');
    });
  });

  describe('Links', () => {
    it('should have link test IDs', () => {
      expect(TEST_IDS.APPLE_DOCUMENTATION_LINK).toBe('apple-documentation-link');
    });
  });

  describe('Tooltips', () => {
    it('should have tooltip test IDs', () => {
      expect(TEST_IDS.IOS_VERSION_TOOLTIP).toBe('ios-version-tooltip');
      expect(TEST_IDS.DEVICE_TYPE_TOOLTIP).toBe('device-type-tooltip');
      expect(TEST_IDS.APP_MINIMUM_VERSION_TOOLTIP).toBe('app-minimum-version-tooltip');
      expect(TEST_IDS.LIVE_ACTIVITIES_SUPPORT_TOOLTIP).toBe('live-activities-support-tooltip');
      expect(TEST_IDS.NSSUPPORTS_LIVE_ACTIVITIES_TOOLTIP).toBe(
        'nssupports-live-activities-tooltip'
      );
    });
  });

  describe('Naming conventions', () => {
    it('should follow kebab-case naming convention', () => {
      const testIdValues = Object.values(TEST_IDS).filter(value => typeof value === 'string');

      testIdValues.forEach(testId => {
        expect(testId).toMatch(/^[a-z0-9-]+$/);
        expect(testId).not.toMatch(/[A-Z]/);
        expect(testId).not.toMatch(/_/);
      });
    });

    it('should have descriptive names', () => {
      expect(TEST_IDS.LIVE_ACTIVITIES_VALIDATION_SECTION).toContain('live-activities');
      expect(TEST_IDS.REGISTERED_ACTIVITIES_TABLE).toContain('registered-activities');
      expect(TEST_IDS.ACTIVE_ACTIVITIES_TABLE).toContain('active-activities');
      expect(TEST_IDS.COPY_BUTTON('test', 0)).toContain('copy-button');
    });

    it('should be consistent with component hierarchy', () => {
      // Main section should be the root
      expect(TEST_IDS.LIVE_ACTIVITIES_VALIDATION_SECTION).toBe(
        'live-activities-validation-section'
      );

      // Tables should be children of main section
      expect(TEST_IDS.REGISTERED_ACTIVITIES_TABLE).toBe('registered-activities-table');
      expect(TEST_IDS.ACTIVE_ACTIVITIES_TABLE).toBe('active-activities-table');

      // Headers should be children of tables
      expect(TEST_IDS.REGISTERED_ACTIVITIES_HEADER).toBe('registered-activities-header');
      expect(TEST_IDS.ACTIVE_ACTIVITIES_HEADER).toBe('active-activities-header');
    });
  });

  describe('Function test IDs', () => {
    it('should handle edge cases for function test IDs', () => {
      // Test with 0 index
      expect(TEST_IDS.REGISTERED_ACTIVITY_ROW(0)).toBe('registered-activity-row-0');
      expect(TEST_IDS.COPY_BUTTON('test', 0)).toBe('copy-button-test-0');

      // Test with large index
      expect(TEST_IDS.ACTIVE_ACTIVITY_ROW(999)).toBe('active-activity-row-999');
      expect(TEST_IDS.COPY_BUTTON('test', 999)).toBe('copy-button-test-999');

      // Test with special characters in type
      expect(TEST_IDS.COPY_BUTTON('push-to-start', 0)).toBe('copy-button-push-to-start-0');
      expect(TEST_IDS.COPY_BUTTON('update_token', 0)).toBe('copy-button-update_token-0');
    });
  });

  describe('Type safety', () => {
    it('should have proper TypeScript types', () => {
      // These should compile without errors
      const mainSection: string = TEST_IDS.LIVE_ACTIVITIES_VALIDATION_SECTION;
      const table: string = TEST_IDS.REGISTERED_ACTIVITIES_TABLE;
      const row: string = TEST_IDS.REGISTERED_ACTIVITY_ROW(0);
      const cell: string = TEST_IDS.REGISTERED_ACTIVITY_TYPE_CELL(0);
      const copyButton: string = TEST_IDS.COPY_BUTTON('test', 0);

      expect(typeof mainSection).toBe('string');
      expect(typeof table).toBe('string');
      expect(typeof row).toBe('string');
      expect(typeof cell).toBe('string');
      expect(typeof copyButton).toBe('string');
    });
  });
});
