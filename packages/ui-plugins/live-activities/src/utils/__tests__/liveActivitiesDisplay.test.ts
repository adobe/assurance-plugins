/**
 * Test suite for Live Activities display utilities.
 */

import { createLiveActivitiesTableData } from '../liveActivitiesDisplay';
import {
  type LiveActivityTypeData,
  type LiveActivitiesValidationStatus
} from '../../types/liveActivities';
import { VALIDATION_STATUS } from '../../constants';

describe('Live Activities Display Utils', () => {
  const mockActivityMap = new Map<string, LiveActivityTypeData>([
    [
      'com.example.testactivity',
      {
        attributeType: 'com.example.testactivity',
        schema: {
          $schema: 'test',
          'attributes-type': 'test',
          'content-state': {},
          attributes: {},
          title: 'test'
        },
        pushToStartToken: 'push-token-123',
        updateToken: 'update-token-456',
        hasSchema: true,
        hasPushToStartToken: true,
        hasUpdateToken: true,
        lastUpdated: 1234567890
      }
    ]
  ]);

  const mockCompletedActivityMap = new Map<string, LiveActivityTypeData>([
    [
      'com.example.completed',
      {
        attributeType: 'com.example.completed',
        schema: undefined,
        pushToStartToken: undefined,
        updateToken: undefined,
        hasSchema: false,
        hasPushToStartToken: false,
        hasUpdateToken: false,
        lastUpdated: 1234567890
      }
    ]
  ]);

  const mockMultipleActivitiesMap = new Map<string, LiveActivityTypeData>([
    [
      'com.example.testactivity',
      {
        attributeType: 'com.example.testactivity',
        schema: {
          $schema: 'test',
          'attributes-type': 'test',
          'content-state': {},
          attributes: {},
          title: 'test'
        },
        pushToStartToken: 'push-token-123',
        updateToken: 'update-token-456',
        hasSchema: true,
        hasPushToStartToken: true,
        hasUpdateToken: true,
        lastUpdated: 1234567890
      }
    ],
    [
      'com.example.completed',
      {
        attributeType: 'com.example.completed',
        schema: undefined,
        pushToStartToken: undefined,
        updateToken: undefined,
        hasSchema: false,
        hasPushToStartToken: false,
        hasUpdateToken: false,
        lastUpdated: 1234567890
      }
    ]
  ]);

  describe('createLiveActivitiesTableData', () => {
    it('should return empty array for unsupported devices', () => {
      const result = createLiveActivitiesTableData(mockActivityMap, VALIDATION_STATUS.NOT_SUPPORTED);
      expect(result).toEqual([]);
    });

    it('should return empty array when no activities are present', () => {
      const result = createLiveActivitiesTableData(new Map(), VALIDATION_STATUS.BASIC_SUPPORT);
      expect(result).toEqual([]);
    });

    it('should format single activity correctly for basic support', () => {
      const result = createLiveActivitiesTableData(mockActivityMap, VALIDATION_STATUS.BASIC_SUPPORT);

      expect(result).toHaveLength(1);
      expect(result[0].activityType).toBe('com.example.testactivity');
      expect(result[0].pushToStartToken).toBe('Not available'); // Only available in full support
      expect(result[0].updateToken).toBe('update-token-456');
    });

    it('should include PushToStart token for full support', () => {
      const result = createLiveActivitiesTableData(mockActivityMap, VALIDATION_STATUS.FULL_SUPPORT);

      expect(result).toHaveLength(1);
      expect(result[0].pushToStartToken).toBe('push-token-123');
      expect(result[0].updateToken).toBe('update-token-456');
    });

    it('should handle multiple activities', () => {
      const result = createLiveActivitiesTableData(mockMultipleActivitiesMap, VALIDATION_STATUS.FULL_SUPPORT);

      expect(result).toHaveLength(2);
      expect(result[0].activityType).toBe('com.example.testactivity');
      expect(result[1].activityType).toBe('com.example.completed');
    });

    it('should handle activities without tokens gracefully', () => {
      const result = createLiveActivitiesTableData(mockCompletedActivityMap, VALIDATION_STATUS.FULL_SUPPORT);

      expect(result).toHaveLength(1);
      expect(result[0].pushToStartToken).toBe('Not available');
      expect(result[0].updateToken).toBe('Not available');
    });
  });
});
