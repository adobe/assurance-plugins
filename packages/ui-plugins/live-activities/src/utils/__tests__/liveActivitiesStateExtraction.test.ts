/**
 * Test suite for Live Activities state-based extraction utilities.
 */

import { extractLiveActivitiesDataFromState } from '../liveActivitiesExtraction';

describe('Live Activities State Extraction', () => {
  const mockLiveActivityState = {
    updateTokens: {
      'Adobe-dhaba': {
        firstIssued: 1756878593790.709,
        attributeType: 'FoodDeliveryLiveActivityAttributes',
        token:
          '80edd3b88c4228a0d42c9ff48229856c9b8e1f07783b03ad4d3a5b2325d32f1bbd9a4821081aa16bcad2c7f7322e8133642b22c117b8f2da0380b26a0b37b43bb7c4cbcae3767ac5a330b9ef375c57f3637dcfc41f0e966badc3ff3c60dc7e1d0d1d123ee5d1efcb53eef0d0b2893267fdd9c2ee423b569c76ea23891d5d9388'
      }
    },
    pushToStartTokens: {
      AirplaneTrackingAttributes: {
        firstIssued: 1756878527755.687,
        token:
          '80c60e51bb190d16399fa9f7430a6edff98187195e7b33a5efeeda739884b4f6bb9be73cde54b17c196498083f191c19a39440042fecc48a44166dc73f0d2c1b6563e8f7e21505d6b16266d8e01def1ee847a22e5f7bbbd6c5aa60e7d0072cb60bd475b49ba6cc5acadafe275553359c744aa66a2eb66adbb3b00ccbb1ff081c'
      },
      FoodDeliveryLiveActivityAttributes: {
        firstIssued: 1756878527755.6929,
        token:
          '80c60e51bb190d16399fa9f7430a6edff98187195e7b33a5efeeda739884b4f6bb9be73cde54b17c196498083f191c19a39440042fecc48a44166dc73f0d2c1b6563e8f7e21505d6b16266d8e01def1ee847a22e5f7bbbd6c5aa60e7d0072cb60bd475b49ba6cc5acadafe275553359c744aa66a2eb66adbb3b00ccbb1ff081c'
      },
      GameScoreLiveActivityAttributes: {
        token:
          '80c60e51bb190d16399fa9f7430a6edff98187195e7b33a5efeeda739884b4f6bb9be73cde54b17c196498083f191c19a39440042fecc48a44166dc73f0d2c1b6563e8f7e21505d6b16266d8e01def1ee847a22e5f7bbbd6c5aa60e7d0072cb60bd475b49ba6cc5acadafe275553359c744aa66a2eb66adbb3b00ccbb1ff081c',
        firstIssued: 1756878527755.7312
      }
    }
  };

  it('should extract push-to-start tokens correctly', () => {
    const result = extractLiveActivitiesDataFromState(mockLiveActivityState);

    expect(result.totalCount).toBe(3);
    expect(result.hasAnyPushToStartToken).toBe(true);

    // Check AirplaneTrackingAttributes
    const airplaneActivity = result.activityTypes.get('AirplaneTrackingAttributes');
    expect(airplaneActivity).toBeDefined();
    expect(airplaneActivity?.pushToStartToken).toBe(
      mockLiveActivityState.pushToStartTokens.AirplaneTrackingAttributes.token
    );
    expect(airplaneActivity?.hasPushToStartToken).toBe(true);
    expect(airplaneActivity?.hasUpdateToken).toBe(false);

    // Check FoodDeliveryLiveActivityAttributes (has both push-to-start and update tokens)
    const foodActivity = result.activityTypes.get('FoodDeliveryLiveActivityAttributes');
    expect(foodActivity).toBeDefined();
    expect(foodActivity?.pushToStartToken).toBe(
      mockLiveActivityState.pushToStartTokens.FoodDeliveryLiveActivityAttributes.token
    );
    expect(foodActivity?.hasPushToStartToken).toBe(true);
    expect(foodActivity?.hasUpdateToken).toBe(true); // This activity has both tokens

    // Check GameScoreLiveActivityAttributes
    const gameActivity = result.activityTypes.get('GameScoreLiveActivityAttributes');
    expect(gameActivity).toBeDefined();
    expect(gameActivity?.pushToStartToken).toBe(
      mockLiveActivityState.pushToStartTokens.GameScoreLiveActivityAttributes.token
    );
    expect(gameActivity?.hasPushToStartToken).toBe(true);
    expect(gameActivity?.hasUpdateToken).toBe(false);
  });

  it('should extract update tokens and merge with push-to-start data', () => {
    const result = extractLiveActivitiesDataFromState(mockLiveActivityState);

    // Check FoodDeliveryLiveActivityAttributes has both tokens
    const foodActivity = result.activityTypes.get('FoodDeliveryLiveActivityAttributes');
    expect(foodActivity).toBeDefined();
    expect(foodActivity?.pushToStartToken).toBe(
      mockLiveActivityState.pushToStartTokens.FoodDeliveryLiveActivityAttributes.token
    );
    expect(foodActivity?.updateToken).toBe(mockLiveActivityState.updateTokens['Adobe-dhaba'].token);
    expect(foodActivity?.hasPushToStartToken).toBe(true);
    expect(foodActivity?.hasUpdateToken).toBe(true);
  });

  it('should handle empty state gracefully', () => {
    const result = extractLiveActivitiesDataFromState(null);

    expect(result.totalCount).toBe(0);
    expect(result.hasAnyPushToStartToken).toBe(false);
    expect(result.activityTypes.size).toBe(0);
  });

  it('should handle state with no tokens', () => {
    const result = extractLiveActivitiesDataFromState({});

    expect(result.totalCount).toBe(0);
    expect(result.hasAnyPushToStartToken).toBe(false);
    expect(result.activityTypes.size).toBe(0);
  });

  it('should handle state with only push-to-start tokens', () => {
    const stateWithOnlyPushToStart = {
      pushToStartTokens: mockLiveActivityState.pushToStartTokens
    };

    const result = extractLiveActivitiesDataFromState(stateWithOnlyPushToStart);

    expect(result.totalCount).toBe(3);
    expect(result.hasAnyPushToStartToken).toBe(true);

    const foodActivity = result.activityTypes.get('FoodDeliveryLiveActivityAttributes');
    expect(foodActivity?.hasPushToStartToken).toBe(true);
    expect(foodActivity?.hasUpdateToken).toBe(false);
  });

  it('should handle state with only update tokens', () => {
    const stateWithOnlyUpdate = {
      updateTokens: mockLiveActivityState.updateTokens
    };

    const result = extractLiveActivitiesDataFromState(stateWithOnlyUpdate);

    expect(result.totalCount).toBe(1);
    expect(result.hasAnyPushToStartToken).toBe(false);

    const foodActivity = result.activityTypes.get('FoodDeliveryLiveActivityAttributes');
    expect(foodActivity?.hasPushToStartToken).toBe(false);
    expect(foodActivity?.hasUpdateToken).toBe(true);
    expect(foodActivity?.updateToken).toBe(mockLiveActivityState.updateTokens['Adobe-dhaba'].token);
  });

  it('should include schema data when schema events are provided', () => {
    const mockSchemaEvent = {
      payload: {
        ACPExtensionEventName: 'Live Activity Schema (FoodDeliveryLiveActivityAttributes)',
        ACPExtensionEventData: {
          jsonSchema: {
            'attributes-type': 'FoodDeliveryLiveActivityAttributes',
            title: 'Live Activity – FoodDeliveryLiveActivityAttributes',
            'content-state': { type: 'object' },
            attributes: { type: 'object' }
          },
          examplePayload: {
            'attributes-type': 'FoodDeliveryLiveActivityAttributes',
            attributes: { orderId: '12345' }
          }
        }
      }
    };

    const result = extractLiveActivitiesDataFromState(mockLiveActivityState, [mockSchemaEvent]);

    const foodActivity = result.activityTypes.get('FoodDeliveryLiveActivityAttributes');
    expect(foodActivity?.hasSchema).toBe(true);
    expect(foodActivity?.schema).toBeDefined();
    expect(foodActivity?.schema?.['attributes-type']).toBe('FoodDeliveryLiveActivityAttributes');
    expect(result.hasAnySchema).toBe(true);
  });

  it('should work without schema events (backward compatibility)', () => {
    const result = extractLiveActivitiesDataFromState(mockLiveActivityState);

    const foodActivity = result.activityTypes.get('FoodDeliveryLiveActivityAttributes');
    expect(foodActivity?.hasSchema).toBe(false);
    expect(foodActivity?.schema).toBeUndefined();
    expect(result.hasAnySchema).toBe(false);
  });
});
