import { combineAll, combineMatchers } from '@adobe/griffon-toolkit';
import { clientInfo } from '@adobe/griffon-toolkit-common';
import { streamingValidation } from '@adobe/griffon-toolkit-edge';
import type { Maybe } from '../types';
import { useEvents } from './useEvents';

/**
 * Contains the ID and name of a data stream configured inside Adobe Experience Platform
 */
export interface DataStream {
  id: string;
  name: string;
}
/**
 * Returns the name and ID of data stream in use for the current client. If
 * multiple data streams are detected, it will return the most recent one.
 * @returns {DataStream?} An object containing the ID and name of the data
 * stream
 */

const dataStreamMatcher = combineAll([
  'vendor==`com.adobe.edge.konductor`',
  'type==`service`',
  'payload.name==`datastream`',
  'payload.context.datastreamId'
]);

export const useDataStream = (): Maybe<DataStream> => {
  const events = useEvents({
    matchers: [dataStreamMatcher]
  });
  const match = events.find(e => e.payload?.context?.datastreamId);
  const messages = match?.payload?.messages;
  return {
    id: match?.payload?.context?.datastreamId,
    ...(messages?.[1] && JSON.parse(messages[1]))
  };
};

const test = {
  access_type: 'mixed',
  com_adobe_experience_platform: {
    datasets: {
      event: [
        {
          datasetId: '600ab4dd2c6dbf194ada59de',
          flowId: '133b3251-2bca-4bea-8328-73b84da4c9d7',
          primary: true,
          xdmSchema:
            'https://ns.adobe.com/aemonacpprodcampaign/schemas/48c8159b4c29d86c40338816487a55758bcce812ad33c4e8'
        }
      ],
      profile: [
        {
          datasetId: '5f9074a12bff7a194af58c9e',
          flowId: '828e6dda-74bb-45ab-87a4-da4898d6681f',
          primary: true,
          xdmSchema:
            'https://ns.adobe.com/aemonacpprodcampaign/schemas/ddd6f50383c98d688823df18e3434da9c08bc49af5782e9b'
        }
      ]
    },
    enabled: true
  },
  com_adobe_experience_platform_ajo: { containerId: 'not-used', enabled: true },
  com_adobe_experience_platform_edge_segmentation: { enabled: true },
  com_adobe_experience_platform_ode: { containerId: 'not-used', enabled: true },
  com_adobe_identity: {
    idSyncContainerId__additional: [],
    idSyncEnabled: false
  },
  default_consent: 'in',
  device_lookup: {
    additionalProperties: {},
    enabled: false,
    info: {
      additionalProperties: {},
      browser: false,
      device: false,
      hardware: false,
      operating_system: false
    }
  },
  geo_lookup: {
    fields: {
      carrier: false,
      city: false,
      connection_type: false,
      country: false,
      dma: false,
      domain: false,
      isp: false,
      latitude: false,
      longitude: false,
      postal_code: false,
      state_province: false,
      timezone: false
    }
  },
  geo_resolution: 'none',
  input: {
    additionalProperties: {},
    schemaId:
      'https://ns.adobe.com/aemonacpprodcampaign/schemas/48c8159b4c29d86c40338816487a55758bcce812ad33c4e8'
  },
  ip_obfuscation: 'none',
  state: { first_party_id: { cookie: { enabled: false, name: 'FPID' } } },
  type: 'devices',
  user_agent_collection: { additionalProperties: {}, enabled: true }
};
