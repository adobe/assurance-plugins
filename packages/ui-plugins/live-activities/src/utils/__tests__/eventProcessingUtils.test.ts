/**
 * Tests for event processing utils - broadcast support
 */

import { describe, it, expect } from 'vitest';
import { processActivityEvents } from '../eventProcessingUtils';
import { 
  isBroadcastActivityKey, 
  isUnitaryActivityKey, 
  parseActivityKey 
} from '../../hooks/useActivities';
import { ACTIVITY_TYPE } from '../../constants/liveActivitiesConfig';

describe('Event Processing Utils - Broadcast Support', () => {
  let eventCounter = 0;
  const createMockEvent = (id: string, channelId?: string, attributeType?: string): any => ({
    uuid: `event-${id}-${eventCounter++}`, // Ensure unique UUIDs
    timestamp: Date.now() + eventCounter, // Unique timestamps
    type: 'com.adobe.eventType.messaging',
    payload: {
      ACPExtensionEventData: {
        liveActivityID: channelId ? undefined : id,
        channelID: channelId,
        attributeType: attributeType || 'TestActivity',
        data: {}
      }
    }
  });

  describe('processActivityEvents', () => {
    it('should filter events by liveActivityID for unitary activities', () => {
      const events = [
        createMockEvent('activity-1'),
        createMockEvent('activity-2'),
        createMockEvent('activity-1'),
        createMockEvent('activity-3')
      ];

      const activityKey = 'unitary:activity-1';
      const result = processActivityEvents(events, activityKey);

      expect(result).toHaveLength(2);
      result.forEach(event => {
        expect(event.payload?.ACPExtensionEventData?.liveActivityID).toBe('activity-1');
      });
    });

    it('should filter events by channelID and attributeType for broadcast activities', () => {
      const events = [
        createMockEvent('1', 'channel-A', 'FoodActivity'),
        createMockEvent('2', 'channel-A', 'FlightActivity'),
        createMockEvent('3', 'channel-A', 'FoodActivity'),
        createMockEvent('4', 'channel-B', 'FoodActivity')
      ];

      const activityKey = 'broadcast:channel-A:FoodActivity';
      const result = processActivityEvents(events, activityKey);

      expect(result).toHaveLength(2);
      result.forEach(event => {
        expect(event.payload?.ACPExtensionEventData?.channelID).toBe('channel-A');
        expect(event.payload?.ACPExtensionEventData?.attributeType).toBe('FoodActivity');
      });
    });

    it('should differentiate between same channel different activity types', () => {
      const events = [
        createMockEvent('1', 'shared-channel', 'Food'),
        createMockEvent('2', 'shared-channel', 'Flight'),
        createMockEvent('3', 'shared-channel', 'Food'),
        createMockEvent('4', 'shared-channel', 'Flight')
      ];

      const foodKey = 'broadcast:shared-channel:Food';
      const flightKey = 'broadcast:shared-channel:Flight';

      const foodEvents = processActivityEvents(events, foodKey);
      const flightEvents = processActivityEvents(events, flightKey);

      expect(foodEvents).toHaveLength(2);
      expect(flightEvents).toHaveLength(2);

      foodEvents.forEach(event => {
        expect(event.payload?.ACPExtensionEventData?.attributeType).toBe('Food');
      });

      flightEvents.forEach(event => {
        expect(event.payload?.ACPExtensionEventData?.attributeType).toBe('Flight');
      });
    });

    it('should deduplicate events by uuid', () => {
      const duplicateEvent = createMockEvent('1', 'channel-X', 'TestActivity');
      const events = [
        duplicateEvent,
        duplicateEvent,
        duplicateEvent,
        createMockEvent('2', 'channel-X', 'TestActivity')
      ];

      const activityKey = 'broadcast:channel-X:TestActivity';
      const result = processActivityEvents(events, activityKey);

      expect(result).toHaveLength(2);
      const uuids = result.map(e => e.uuid);
      expect(new Set(uuids).size).toBe(2);
    });

    it('should handle empty event array', () => {
      const activityKey = 'unitary:activity-123';
      const result = processActivityEvents([], activityKey);

      expect(result).toHaveLength(0);
    });

    it('should handle events without matching criteria', () => {
      const events = [
        createMockEvent('activity-1'),
        createMockEvent('activity-2'),
        createMockEvent('activity-3')
      ];

      const activityKey = 'unitary:activity-999';
      const result = processActivityEvents(events, activityKey);

      expect(result).toHaveLength(0);
    });

    it('should handle fallback format (backward compatibility)', () => {
      const events = [
        createMockEvent('old-activity-id'),
        createMockEvent('old-activity-id'),
        createMockEvent('other-id')
      ];

      // Old format without prefix
      const activityKey = 'old-activity-id';
      const result = processActivityEvents(events, activityKey);

      expect(result).toHaveLength(2);
    });

    it('should handle events with missing ACPExtensionEventData', () => {
      const events = [
        createMockEvent('activity-1'),
        {
          uuid: 'invalid-event',
          timestamp: Date.now(),
          type: 'com.adobe.eventType.messaging',
          payload: {}
        },
        createMockEvent('activity-1')
      ];

      const activityKey = 'unitary:activity-1';
      const result = processActivityEvents(events, activityKey);

      // Should only return valid events
      expect(result).toHaveLength(2);
    });

    it('should handle broadcast events with data nested in data field', () => {
      const events: any[] = [
        {
          uuid: 'event-nested-1',
          timestamp: Date.now(),
          type: 'com.adobe.eventType.messaging',
          payload: {
            ACPExtensionEventData: {
              data: {
                channelID: 'nested-channel',
                attributeType: 'NestedActivity'
              }
            }
          }
        },
        {
          uuid: 'event-nested-2',
          timestamp: Date.now(),
          type: 'com.adobe.eventType.messaging',
          payload: {
            ACPExtensionEventData: {
              data: {
                channelID: 'nested-channel',
                attributeType: 'NestedActivity'
              }
            }
          }
        }
      ];

      const activityKey = 'broadcast:nested-channel:NestedActivity';
      const result = processActivityEvents(events, activityKey);

      expect(result).toHaveLength(2);
    });
  });

  describe('Activity Key Utility Functions', () => {
    describe('isBroadcastActivityKey', () => {
      it('should return true for broadcast activity keys', () => {
        expect(isBroadcastActivityKey('broadcast:channel-123:FlightActivity')).toBe(true);
        expect(isBroadcastActivityKey('broadcast:abc:xyz')).toBe(true);
      });

      it('should return false for non-broadcast activity keys', () => {
        expect(isBroadcastActivityKey('unitary:activity-123')).toBe(false);
        expect(isBroadcastActivityKey('unknown:something')).toBe(false);
        expect(isBroadcastActivityKey('activity-123')).toBe(false);
      });
    });

    describe('isUnitaryActivityKey', () => {
      it('should return true for unitary activity keys', () => {
        expect(isUnitaryActivityKey('unitary:activity-123')).toBe(true);
        expect(isUnitaryActivityKey('unitary:abc-def-ghi')).toBe(true);
      });

      it('should return false for non-unitary activity keys', () => {
        expect(isUnitaryActivityKey('broadcast:channel-123:FlightActivity')).toBe(false);
        expect(isUnitaryActivityKey('unknown:something')).toBe(false);
        expect(isUnitaryActivityKey('activity-123')).toBe(false);
      });
    });

    describe('parseActivityKey', () => {
      it('should parse broadcast activity keys correctly', () => {
        const result = parseActivityKey('broadcast:channel-123:FlightActivity');
        
        expect(result.type).toBe(ACTIVITY_TYPE.BROADCAST);
        expect(result.channelId).toBe('channel-123');
        expect(result.attributeType).toBe('FlightActivity');
        expect(result.liveActivityId).toBeUndefined();
      });

      it('should parse unitary activity keys correctly', () => {
        const result = parseActivityKey('unitary:activity-456');
        
        expect(result.type).toBe(ACTIVITY_TYPE.UNITARY);
        expect(result.liveActivityId).toBe('activity-456');
        expect(result.channelId).toBeUndefined();
        expect(result.attributeType).toBeUndefined();
      });

      it('should handle unknown/fallback keys', () => {
        const result = parseActivityKey('some-random-id');
        
        expect(result.type).toBe(ACTIVITY_TYPE.UNKNOWN);
        expect(result.liveActivityId).toBe('some-random-id');
        expect(result.channelId).toBeUndefined();
        expect(result.attributeType).toBeUndefined();
      });

      it('should handle keys with colons in unknown format', () => {
        const result = parseActivityKey('unknown:test:value');
        
        expect(result.type).toBe(ACTIVITY_TYPE.UNKNOWN);
        expect(result.liveActivityId).toBe('unknown:test:value');
      });
    });
  });
});

