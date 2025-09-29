/**
 * Test suite for schema-based Live Activities extraction
 * Tests the new approach of using Live Activity Schema events as source of truth
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  extractRegisteredActivitiesFromSchemaEvents,
  extractLiveActivitiesDataFromState
} from '../liveActivitiesExtraction';
import { isLiveActivityAssuranceDebugEvent } from '../../types/events';

// Mock the event type guard
vi.mock('../../types/events', () => ({
  isLiveActivityAssuranceDebugEvent: vi.fn()
}));

const mockIsLiveActivityAssuranceDebugEvent = isLiveActivityAssuranceDebugEvent as ReturnType<typeof vi.fn>;

describe('Schema-based Live Activities Extraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('extractRegisteredActivitiesFromSchemaEvents', () => {
    it('should extract registered activities from schema events', () => {
      const mockSchemaEvents = [
        {
          uuid: 'event-1',
          timestamp: 1234567890,
          payload: {
            ACPExtensionEventData: {
              jsonSchema: {
                'attributes-type': 'FoodDeliveryLiveActivityAttributes',
                'content-state': { status: 'preparing' },
                attributes: { restaurantName: 'Test Restaurant' },
                $schema: 'https://schema.org',
                title: 'Food Delivery'
              },
              examplePayload: {
                status: 'preparing',
                restaurantName: 'Test Restaurant'
              }
            }
          }
        },
        {
          uuid: 'event-2',
          timestamp: 1234567891,
          payload: {
            ACPExtensionEventData: {
              jsonSchema: {
                'attributes-type': 'RideShareLiveActivityAttributes',
                'content-state': { status: 'en-route' },
                attributes: { driverName: 'John Doe' },
                $schema: 'https://schema.org',
                title: 'Ride Share'
              },
              examplePayload: {
                status: 'en-route',
                driverName: 'John Doe'
              }
            }
          }
        }
      ];

      mockIsLiveActivityAssuranceDebugEvent.mockReturnValue(true);

      const result = extractRegisteredActivitiesFromSchemaEvents(mockSchemaEvents);

      expect(result.size).toBe(2);
      expect(result.has('FoodDeliveryLiveActivityAttributes')).toBe(true);
      expect(result.has('RideShareLiveActivityAttributes')).toBe(true);

      const foodDelivery = result.get('FoodDeliveryLiveActivityAttributes');
      expect(foodDelivery).toEqual({
        attributeType: 'FoodDeliveryLiveActivityAttributes',
        schema: {
          'attributes-type': 'FoodDeliveryLiveActivityAttributes',
          'content-state': { status: 'preparing' },
          attributes: { restaurantName: 'Test Restaurant' },
          $schema: 'https://schema.org',
          title: 'Food Delivery'
        },
        pushToStartToken: undefined,
        updateToken: undefined,
        hasSchema: true,
        hasPushToStartToken: false,
        hasUpdateToken: false,
        lastUpdated: 1234567890
      });

      const rideShare = result.get('RideShareLiveActivityAttributes');
      expect(rideShare).toEqual({
        attributeType: 'RideShareLiveActivityAttributes',
        schema: {
          'attributes-type': 'RideShareLiveActivityAttributes',
          'content-state': { status: 'en-route' },
          attributes: { driverName: 'John Doe' },
          $schema: 'https://schema.org',
          title: 'Ride Share'
        },
        pushToStartToken: undefined,
        updateToken: undefined,
        hasSchema: true,
        hasPushToStartToken: false,
        hasUpdateToken: false,
        lastUpdated: 1234567891
      });
    });

    it('should handle events without schema data', () => {
      const mockEvents = [
        {
          uuid: 'event-1',
          timestamp: 1234567890,
          payload: {
            ACPExtensionEventData: {
              // No jsonSchema
              someOtherData: 'value'
            }
          }
        }
      ];

      mockIsLiveActivityAssuranceDebugEvent.mockReturnValue(false);

      const result = extractRegisteredActivitiesFromSchemaEvents(mockEvents);

      expect(result.size).toBe(0);
    });

    it('should handle empty events array', () => {
      const result = extractRegisteredActivitiesFromSchemaEvents([]);

      expect(result.size).toBe(0);
    });

    it('should handle malformed schema events gracefully', () => {
      const mockEvents = [
        {
          uuid: 'event-1',
          timestamp: 1234567890,
          payload: {
            ACPExtensionEventData: {
              jsonSchema: {
                // Missing required 'attributes-type'
                'content-state': { status: 'preparing' }
              }
            }
          }
        }
      ];

      mockIsLiveActivityAssuranceDebugEvent.mockReturnValue(true);

      const result = extractRegisteredActivitiesFromSchemaEvents(mockEvents);

      expect(result.size).toBe(0);
    });
  });

  describe('extractLiveActivitiesDataFromState with schema events', () => {
    it('should prioritize schema events over shared state for registered activities', () => {
      const mockSchemaEvents = [
        {
          uuid: 'event-1',
          timestamp: 1234567890,
          payload: {
            ACPExtensionEventData: {
              jsonSchema: {
                'attributes-type': 'FoodDeliveryLiveActivityAttributes',
                'content-state': { status: 'preparing' },
                attributes: { restaurantName: 'Test Restaurant' },
                $schema: 'https://schema.org',
                title: 'Food Delivery'
              }
            }
          }
        }
      ];

      const mockLiveActivityState = {
        pushToStartTokens: {
          'RideShareLiveActivityAttributes': {
            token: 'push-token-123',
            firstIssued: 1234567890
          }
        },
        updateTokens: {
          'activity-1': {
            token: 'update-token-123',
            attributeType: 'RideShareLiveActivityAttributes',
            firstIssued: 1234567890
          }
        }
      };

      mockIsLiveActivityAssuranceDebugEvent.mockReturnValue(true);

      const result = extractLiveActivitiesDataFromState(mockLiveActivityState, mockSchemaEvents);

      // Should have the schema-based activity
      expect(result.activityTypes.has('FoodDeliveryLiveActivityAttributes')).toBe(true);
      expect(result.activityTypes.get('FoodDeliveryLiveActivityAttributes')?.hasSchema).toBe(true);
      expect(result.activityTypes.get('FoodDeliveryLiveActivityAttributes')?.schema).toBeDefined();

      // Should not have the state-based activity since schema events take priority
      expect(result.activityTypes.has('RideShareLiveActivityAttributes')).toBe(false);
    });

    it('should enhance schema-based activities with token data from state', () => {
      const mockSchemaEvents = [
        {
          uuid: 'event-1',
          timestamp: 1234567890,
          payload: {
            ACPExtensionEventData: {
              jsonSchema: {
                'attributes-type': 'FoodDeliveryLiveActivityAttributes',
                'content-state': { status: 'preparing' },
                attributes: { restaurantName: 'Test Restaurant' },
                $schema: 'https://schema.org',
                title: 'Food Delivery'
              }
            }
          }
        }
      ];

      const mockLiveActivityState = {
        pushToStartTokens: {
          'FoodDeliveryLiveActivityAttributes': {
            token: 'push-token-123',
            firstIssued: 1234567890
          }
        },
        updateTokens: {
          'activity-1': {
            token: 'update-token-123',
            attributeType: 'FoodDeliveryLiveActivityAttributes',
            firstIssued: 1234567890
          }
        }
      };

      mockIsLiveActivityAssuranceDebugEvent.mockReturnValue(true);

      const result = extractLiveActivitiesDataFromState(mockLiveActivityState, mockSchemaEvents);

      const foodDelivery = result.activityTypes.get('FoodDeliveryLiveActivityAttributes');
      expect(foodDelivery).toEqual({
        attributeType: 'FoodDeliveryLiveActivityAttributes',
        schema: {
          'attributes-type': 'FoodDeliveryLiveActivityAttributes',
          'content-state': { status: 'preparing' },
          attributes: { restaurantName: 'Test Restaurant' },
          $schema: 'https://schema.org',
          title: 'Food Delivery'
        },
        pushToStartToken: 'push-token-123',
        updateToken: 'update-token-123',
        hasSchema: true,
        hasPushToStartToken: true,
        hasUpdateToken: true,
        lastUpdated: 1234567890
      });
    });

    it('should fall back to shared state when no schema events available', () => {
      const mockLiveActivityState = {
        pushToStartTokens: {
          'RideShareLiveActivityAttributes': {
            token: 'push-token-123',
            firstIssued: 1234567890
          }
        },
        updateTokens: {
          'activity-1': {
            token: 'update-token-123',
            attributeType: 'RideShareLiveActivityAttributes',
            firstIssued: 1234567890
          }
        }
      };

      const result = extractLiveActivitiesDataFromState(mockLiveActivityState, []);

      expect(result.activityTypes.has('RideShareLiveActivityAttributes')).toBe(true);
      expect(result.activityTypes.get('RideShareLiveActivityAttributes')?.hasPushToStartToken).toBe(true);
      expect(result.activityTypes.get('RideShareLiveActivityAttributes')?.hasUpdateToken).toBe(true);
    });

    it('should handle null/undefined state gracefully', () => {
      const result = extractLiveActivitiesDataFromState(null, []);

      expect(result.activityTypes.size).toBe(0);
      expect(result.totalCount).toBe(0);
      expect(result.hasAnySchema).toBe(false);
      expect(result.hasAnyPushToStartToken).toBe(false);
    });
  });
});
