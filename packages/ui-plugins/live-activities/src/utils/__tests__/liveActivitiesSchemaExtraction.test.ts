/**
 * Test suite for Live Activities schema extraction utilities.
 */
import { extractSchemaDataFromEvents } from '../liveActivitiesExtraction';

describe('Live Activities Schema Extraction', () => {
  const mockSchemaEvent = {
    payload: {
      ACPExtensionEventName: 'Live Activity Schema (AirplaneTrackingAttributes)',
      ACPExtensionEventData: {
        jsonSchema: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          'attributes-type': 'AirplaneTrackingAttributes',
          'content-state': {
            required: ['journeyProgress'],
            type: 'object',
            properties: {
              journeyProgress: {
                type: 'integer'
              }
            }
          },
          attributes: {
            properties: {
              arrivalTerminal: {
                type: 'string'
              },
              arrivalAirport: {
                type: 'string'
              },
              liveActivityData: {
                type: 'object',
                required: ['origin'],
                properties: {
                  liveActivityID: {
                    type: ['string', 'null']
                  },
                  origin: {
                    type: ['string', 'null']
                  },
                  channelID: {
                    type: ['string', 'null']
                  }
                }
              },
              departureAirport: 'string'
            },
            type: 'object',
            required: ['liveActivityData', 'arrivalAirport', 'departureAirport', 'arrivalTerminal']
          },
          title: 'Live Activity – AirplaneTrackingAttributes'
        },
        examplePayload: {
          'content-state': {
            journeyProgress: 0
          },
          'attributes-type': 'AirplaneTrackingAttributes',
          attributes: {
            liveActivityData: {
              channelID: 'channelXYZ',
              origin: {}
            },
            departureAirport: 'MIA',
            arrivalTerminal: 'Terminal 3',
            arrivalAirport: 'SFO'
          }
        }
      }
    }
  };

  it('should extract schema data from events correctly', () => {
    const result = extractSchemaDataFromEvents([mockSchemaEvent]);

    expect(result.size).toBe(1);

    const schemaData = result.get('AirplaneTrackingAttributes');
    expect(schemaData).toBeDefined();
    expect(schemaData?.schema).toBeDefined();
    expect(schemaData?.examplePayload).toBeDefined();

    // Check schema structure
    expect(schemaData?.schema['attributes-type']).toBe('AirplaneTrackingAttributes');
    expect(schemaData?.schema.title).toBe('Live Activity – AirplaneTrackingAttributes');
    expect(schemaData?.schema['content-state']).toEqual({
      required: ['journeyProgress'],
      type: 'object',
      properties: {
        journeyProgress: {
          type: 'integer'
        }
      }
    });

    // Check example payload structure
    expect(schemaData?.examplePayload['attributes-type']).toBe('AirplaneTrackingAttributes');
    expect(schemaData?.examplePayload.attributes.departureAirport).toBe('MIA');
    expect(schemaData?.examplePayload.attributes.arrivalAirport).toBe('SFO');
  });

  it('should handle multiple schema events', () => {
    const mockFoodDeliveryEvent = {
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

    const result = extractSchemaDataFromEvents([mockSchemaEvent, mockFoodDeliveryEvent]);

    expect(result.size).toBe(2);
    expect(result.has('AirplaneTrackingAttributes')).toBe(true);
    expect(result.has('FoodDeliveryLiveActivityAttributes')).toBe(true);

    const foodDeliveryData = result.get('FoodDeliveryLiveActivityAttributes');
    expect(foodDeliveryData?.schema['attributes-type']).toBe('FoodDeliveryLiveActivityAttributes');
    expect(foodDeliveryData?.examplePayload.attributes.orderId).toBe('12345');
  });

  it('should handle events without schema data gracefully', () => {
    const invalidEvent = {
      payload: {
        ACPExtensionEventName: 'Some Other Event',
        ACPExtensionEventData: {}
      }
    };

    const result = extractSchemaDataFromEvents([invalidEvent]);
    expect(result.size).toBe(0);
  });

  it('should handle empty events array', () => {
    const result = extractSchemaDataFromEvents([]);
    expect(result.size).toBe(0);
  });

  it('should handle events with missing schema data', () => {
    const incompleteEvent = {
      payload: {
        ACPExtensionEventName: 'Live Activity Schema (IncompleteAttributes)',
        ACPExtensionEventData: {
          jsonSchema: {
            // Missing 'attributes-type'
            title: 'Incomplete Schema'
          }
        }
      }
    };

    const result = extractSchemaDataFromEvents([incompleteEvent]);
    expect(result.size).toBe(0);
  });
});
