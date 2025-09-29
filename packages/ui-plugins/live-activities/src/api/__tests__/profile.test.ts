/**
 * Tests for profile API types and interfaces
 */

import {
  LiveActivityPushNotificationDetail,
  ProfileEntity,
  ProfileApiResponse,
  PushNotificationDetail,
  Identity
} from '../profile';

describe('Profile API Types', () => {
  describe('LiveActivityPushNotificationDetail', () => {
    it('should have all required properties', () => {
      const mockDetail: LiveActivityPushNotificationDetail = {
        token: 'test-token-123',
        identity: {
          id: 'test-identity',
          namespace: { code: 'ECID' }
        },
        platform: 'iOS',
        appID: 'com.test.app',
        attributeType: 'TestActivityAttributes',
        denylisted: false
      };

      expect(mockDetail.token).toBe('test-token-123');
      expect(mockDetail.identity.id).toBe('test-identity');
      expect(mockDetail.platform).toBe('iOS');
      expect(mockDetail.appID).toBe('com.test.app');
      expect(mockDetail.attributeType).toBe('TestActivityAttributes');
      expect(mockDetail.denylisted).toBe(false);
    });

    it('should handle denylisted as true', () => {
      const mockDetail: LiveActivityPushNotificationDetail = {
        token: 'test-token-456',
        identity: {
          id: 'test-identity-2',
          namespace: { code: 'ECID' }
        },
        platform: 'iOS',
        appID: 'com.test.app',
        attributeType: 'AnotherActivityAttributes',
        denylisted: true
      };

      expect(mockDetail.denylisted).toBe(true);
    });
  });

  describe('ProfileEntity', () => {
    it('should include liveActivityPushNotificationDetails as optional', () => {
      const mockEntity: ProfileEntity = {
        pushNotificationDetails: [],
        extSourceSystemAudit: {
          lastUpdatedDate: '2023-01-01T00:00:00Z'
        },
        consents: {
          metadata: { time: '2023-01-01T00:00:00Z' },
          idSpecific: {
            ECID: {
              'test-ecid': {
                marketing: {
                  preferred: 'in',
                  push: { val: 'y' }
                }
              }
            }
          }
        },
        identityMap: {
          ecid: [{ id: 'test-ecid' }]
        },
        userActivityRegions: {},
        consentPoliciesIDMap: {}
      };

      // Should work without liveActivityPushNotificationDetails
      expect(mockEntity.pushNotificationDetails).toEqual([]);
      expect(mockEntity.liveActivityPushNotificationDetails).toBeUndefined();
    });

    it('should include liveActivityPushNotificationDetails when provided', () => {
      const mockLiveActivityDetails: LiveActivityPushNotificationDetail[] = [
        {
          token: 'test-live-activity-token',
          identity: {
            id: 'test-identity',
            namespace: { code: 'ECID' }
          },
          platform: 'iOS',
          appID: 'com.test.app',
          attributeType: 'TestActivityAttributes',
          denylisted: false
        }
      ];

      const mockEntity: ProfileEntity = {
        pushNotificationDetails: [],
        liveActivityPushNotificationDetails: mockLiveActivityDetails,
        extSourceSystemAudit: {
          lastUpdatedDate: '2023-01-01T00:00:00Z'
        },
        consents: {
          metadata: { time: '2023-01-01T00:00:00Z' },
          idSpecific: {
            ECID: {
              'test-ecid': {
                marketing: {
                  preferred: 'in',
                  push: { val: 'y' }
                }
              }
            }
          }
        },
        identityMap: {
          ecid: [{ id: 'test-ecid' }]
        },
        userActivityRegions: {},
        consentPoliciesIDMap: {}
      };

      expect(mockEntity.liveActivityPushNotificationDetails).toEqual(mockLiveActivityDetails);
      expect(mockEntity.liveActivityPushNotificationDetails?.[0].token).toBe(
        'test-live-activity-token'
      );
    });
  });

  describe('ProfileApiResponse', () => {
    it('should have correct structure', () => {
      const mockResponse: ProfileApiResponse = {
        entityId: 'test-entity-id',
        mergePolicy: { id: 'test-merge-policy' },
        sources: ['test-source'],
        tags: ['test-tag'],
        identityGraph: ['test-graph'],
        entity: {
          pushNotificationDetails: [],
          extSourceSystemAudit: {
            lastUpdatedDate: '2023-01-01T00:00:00Z'
          },
          consents: {
            metadata: { time: '2023-01-01T00:00:00Z' },
            idSpecific: {
              ECID: {
                'test-ecid': {
                  marketing: {
                    preferred: 'in',
                    push: { val: 'y' }
                  }
                }
              }
            }
          },
          identityMap: {
            ecid: [{ id: 'test-ecid' }]
          },
          userActivityRegions: {},
          consentPoliciesIDMap: {}
        },
        lastModifiedAt: '2023-01-01T00:00:00Z'
      };

      expect(mockResponse.entityId).toBe('test-entity-id');
      expect(mockResponse.entity).toBeDefined();
      expect(mockResponse.entity.pushNotificationDetails).toEqual([]);
    });
  });

  describe('Type Compatibility', () => {
    it('should be compatible with existing PushNotificationDetail structure', () => {
      const pushDetail: PushNotificationDetail = {
        denylisted: false,
        token: 'test-push-token',
        identity: {
          id: 'test-identity',
          namespace: { code: 'ECID' }
        },
        platform: 'iOS',
        appID: 'com.test.app'
      };

      // LiveActivityPushNotificationDetail should have similar structure
      const liveActivityDetail: LiveActivityPushNotificationDetail = {
        token: 'test-live-activity-token',
        identity: {
          id: 'test-identity',
          namespace: { code: 'ECID' }
        },
        platform: 'iOS',
        appID: 'com.test.app',
        attributeType: 'TestActivityAttributes',
        denylisted: false
      };

      // Both should have common properties
      expect(pushDetail.token).toBeDefined();
      expect(liveActivityDetail.token).toBeDefined();
      expect(pushDetail.identity).toBeDefined();
      expect(liveActivityDetail.identity).toBeDefined();
      expect(pushDetail.platform).toBeDefined();
      expect(liveActivityDetail.platform).toBeDefined();
      expect(pushDetail.appID).toBeDefined();
      expect(liveActivityDetail.appID).toBeDefined();
    });

    it('should handle array of LiveActivityPushNotificationDetail', () => {
      const details: LiveActivityPushNotificationDetail[] = [
        {
          token: 'token-1',
          identity: { id: 'id-1', namespace: { code: 'ECID' } },
          platform: 'iOS',
          appID: 'com.test.app',
          attributeType: 'Activity1',
          denylisted: false
        },
        {
          token: 'token-2',
          identity: { id: 'id-2', namespace: { code: 'ECID' } },
          platform: 'iOS',
          appID: 'com.test.app',
          attributeType: 'Activity2',
          denylisted: true
        }
      ];

      expect(details).toHaveLength(2);
      expect(details[0].attributeType).toBe('Activity1');
      expect(details[1].denylisted).toBe(true);
    });
  });
});
