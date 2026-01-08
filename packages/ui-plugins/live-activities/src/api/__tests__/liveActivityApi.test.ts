/**
 * Tests for Live Activity API functions with broadcast support
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildCompleteApsPayload,
  generateUpdateTemplate,
  generateLiveActivityPayload,
  getCurrentTimestamp
} from '../liveActivityApi';

describe('LiveActivityApi - Broadcast Support', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildCompleteApsPayload', () => {
    it('should build payload without broadcast fields for unitary activities', () => {
      const result = buildCompleteApsPayload({
        userPayload: { 'content-state': { value: 10 } },
        eventType: 'start',
        attributesType: 'TestActivity'
      });

      expect(result).toMatchObject({
        'content-available': 1,
        event: 'start',
        'attributes-type': 'TestActivity',
        'content-state': { value: 10 }
      });
      expect(result['input-push-channel']).toBeUndefined();
    });

    it('should add broadcast fields when broadcastChannelId is provided', () => {
      const result = buildCompleteApsPayload({
        userPayload: { 'content-state': { value: 20 } },
        eventType: 'start',
        attributesType: 'BroadcastActivity',
        broadcastChannelId: 'channel-123'
      });

      expect(result['input-push-channel']).toBe('channel-123');
      expect(result.attributes.liveActivityData).toMatchObject({
        channelID: 'channel-123',
        origin: 'remote',
        type: 'broadcast'
      });
    });

    it('should preserve user custom fields in liveActivityData', () => {
      const result = buildCompleteApsPayload({
        userPayload: {
          'content-state': { value: 30 },
          attributes: {
            liveActivityData: {
              customField: 'customValue',
              userMetadata: { key: 'value' }
            }
          }
        },
        eventType: 'update',
        attributesType: 'BroadcastActivity',
        broadcastChannelId: 'channel-456'
      });

      expect(result.attributes.liveActivityData).toMatchObject({
        channelID: 'channel-456',
        origin: 'remote',
        type: 'broadcast',
        customField: 'customValue',
        userMetadata: { key: 'value' }
      });
    });

    it('should handle update and end event types for broadcast', () => {
      const updateResult = buildCompleteApsPayload({
        userPayload: {},
        eventType: 'update',
        attributesType: 'Activity',
        broadcastChannelId: 'channel-789'
      });

      const endResult = buildCompleteApsPayload({
        userPayload: {},
        eventType: 'end',
        attributesType: 'Activity',
        broadcastChannelId: 'channel-789'
      });

      expect(updateResult.event).toBe('update');
      expect(updateResult['input-push-channel']).toBe('channel-789');
      expect(endResult.event).toBe('end');
      expect(endResult['input-push-channel']).toBe('channel-789');
    });
  });

  describe('generateUpdateTemplate', () => {
    it('should include liveActivityID for unitary activities', () => {
      const activity = {
        id: 'unitary-123',
        name: 'TestActivity',
        currentContentState: { value: 100 }
      };

      const result = generateUpdateTemplate(activity);

      expect(result['content-state']).toEqual({ value: 100 });
      expect(result.attributes.liveActivityData.liveActivityID).toBe('unitary-123');
      expect(result.attributes.liveActivityData.channelID).toBeUndefined();
    });

    it('should include channelID for broadcast activities', () => {
      const activity = {
        broadcastChannelId: 'channel-abc',
        name: 'BroadcastActivity',
        currentContentState: { value: 200 }
      };

      const result = generateUpdateTemplate(activity);

      expect(result['content-state']).toEqual({ value: 200 });
      expect(result.attributes.liveActivityData.channelID).toBe('channel-abc');
      expect(result.attributes.liveActivityData.liveActivityID).toBeUndefined();
    });

    it('should include both IDs if both exist', () => {
      const activity = {
        id: 'activity-123',
        broadcastChannelId: 'channel-xyz',
        name: 'MixedActivity',
        currentContentState: {}
      };

      const result = generateUpdateTemplate(activity);

      expect(result.attributes.liveActivityData.liveActivityID).toBe('activity-123');
      expect(result.attributes.liveActivityData.channelID).toBe('channel-xyz');
    });

    it('should handle missing IDs gracefully', () => {
      const activity = {
        name: 'ActivityWithNoIds',
        currentContentState: { value: 300 }
      };

      const result = generateUpdateTemplate(activity);

      expect(result['content-state']).toEqual({ value: 300 });
      expect(result.attributes.liveActivityData).toBeDefined();
      // Should have neither ID
      expect(result.attributes.liveActivityData.liveActivityID).toBeUndefined();
      expect(result.attributes.liveActivityData.channelID).toBeUndefined();
    });
  });

  describe('generateLiveActivityPayload', () => {
    it('should generate payload with type and channelID for broadcast', () => {
      const params = {
        apsContent: {
          'content-state': { value: 50 },
          'attributes-type': 'BroadcastTest',
          event: 'start'
        },
        imsOrg: 'org-123',
        sandboxName: 'prod',
        sessionId: 'session-123',
        appId: 'com.test.app',
        platform: 'ios',
        token: 'push-token-123',
        ecid: 'ecid-123',
        environment: 'prod',
        type: 'broadcast' as const,
        broadcastChannelId: 'channel-test'
      };

      const result = generateLiveActivityPayload(params);

      const liveActivity = result.messages[0].value.notification.liveActivity;
      expect(liveActivity.type).toBe('broadcast');
      expect(liveActivity.channelID).toBe('channel-test');
    });

    it('should generate payload without channelID for unitary', () => {
      const params = {
        apsContent: {
          'content-state': { value: 60 },
          'attributes-type': 'UnitaryTest',
          event: 'start'
        },
        imsOrg: 'org-456',
        sandboxName: 'prod',
        sessionId: 'session-456',
        appId: 'com.test.app',
        platform: 'ios',
        token: 'push-token-456',
        ecid: 'ecid-456',
        environment: 'prod',
        type: 'unitary' as const
      };

      const result = generateLiveActivityPayload(params);

      const liveActivity = result.messages[0].value.notification.liveActivity;
      expect(liveActivity.type).toBe('unitary');
      expect(liveActivity.channelID).toBeUndefined();
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should return a valid unix timestamp', () => {
      const timestamp = getCurrentTimestamp();
      
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(1600000000); // After Sep 2020
      expect(timestamp).toBeLessThan(2000000000); // Before May 2033
    });
  });
});

