/**
 * Live Activity API Utilities
 * 
 * Common utilities for launching and updating Live Activities via Griffon API
 */

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// CONSTANTS
// ============================================================================

export const API_ENDPOINTS = {
  local: 'https://local.griffon.adobe.com',
  dev: 'https://plugin-support-dev.griffon.adobe.com',
  qa: 'https://plugin-support-qa.griffon.adobe.com',
  stage: 'https://plugin-support-stage.griffon.adobe.com',
  prod: 'https://plugin-support.griffon.adobe.com'
} as const;

export const PIPELINE_ENDPOINTS = {
  local: 'https://producer-pipeline-int-va7-a3.adobe.net',
  dev: 'https://producer-pipeline-int-va7-a3.adobe.net',
  qa: 'https://producer-pipeline-int-va7-a3.adobe.net',
  stage: 'https://producer-pipeline-va7-a1.adobe.net',
  prod: 'https://producer-pipeline-va7-a1.adobe.net'
} as const;

export const PIPELINE_TOPICS = {
  local: 'dx_mob_push_messages_qa',
  dev: 'dx_mob_push_messages_dev',
  qa: 'dx_mob_push_messages_qa',
  stage: 'dx_mob_push_messages_assurance',
  prod: 'dx_mob_push_messages_assurance'
} as const;

const FEEDBACK_CONFIG = {
  imsOrgId: '745F37C35E4B776E0A49421B@AdobeOrg',
  sandboxName: 'cjm-team',
  sandboxId: '70f58060-5d47-11ea-bdff-a5384333ff34',
  datasetId: '5f55e8a921c72e194f3a56ec',
  schemaRef: {
    id: 'https://ns.adobe.com/cjmstage/schemas/26b258bd0ee2f8074b0e1cb4506487028ca46d82e31a3a6c',
    contentType: 'application/vnd.adobe.xed-full+json;version=1'
  }
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface LiveActivityPayloadParams {
  apsContent: any;
  appId: string;
  platform: string;
  token: string; // This will be either pushToStartToken or updateToken
  ecid: string;
  imsOrg: string;
  sessionId: string;
  sandboxName: string;
  environment: string;
}

export interface ApiCallConfig {
  url: string;
  token: string;
  payload: any;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets current Unix timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Generates minimal APS template for launching a Live Activity
 * Only includes fields user needs to fill/edit
 */
export function generateLaunchTemplate(): any {
  return {
    "content-state": {},
    "attributes": {
      "liveActivityData": {
        "liveActivityID": ""
      }
    },
    "alert": {
      "title": "",
      "body": ""
    }
  };
}

/**
 * Generates minimal APS template for updating a Live Activity
 * Pre-fills known data from the activity, user only updates dynamic fields
 */
export function generateUpdateTemplate(activity: any): any {
  return {
    "content-state": activity.examplePayload?.['content-state'] || {},
    "attributes": {
      "liveActivityData": {
        "liveActivityID": activity.id || ""
      }
    }
  };
}

/**
 * Builds complete APS payload by merging user input with auto-generated fields
 */
export function buildCompleteApsPayload(params: {
  userPayload: any;
  eventType: 'start' | 'update' | 'end';
  attributesType: string;
}): any {
  return {
    "content-available": 1,
    "timestamp": getCurrentTimestamp(),
    "event": params.eventType,
    "attributes-type": params.attributesType,
    "alert": {
      "title": "",
      "body": ""
    },
    ...params.userPayload
  };
}

/**
 * Normalizes APS payload to ensure numeric fields are numbers, not strings
 */
export function normalizeApsPayload(apsContent: any): any {
  const normalized = { ...apsContent };
  const numericFields = ['content-available', 'timestamp', 'dismissal-date'];
  
  for (const field of numericFields) {
    if (field in normalized && typeof normalized[field] === 'string') {
      const parsed = Number.parseInt(normalized[field], 10);
      if (!Number.isNaN(parsed)) {
        normalized[field] = parsed;
      }
    }
  }

  return normalized;
}

/**
 * Constructs the API URL for sending Live Activity notifications
 */
export function buildApiUrl(environment: string): string {
  const env = environment as keyof typeof API_ENDPOINTS;
  return `${API_ENDPOINTS[env]}/pipeline/topics/${PIPELINE_TOPICS[env]}/messages`;
}

/**
 * Creates AEP feedback routing configuration
 */
function createAepFeedbackRouting(params: LiveActivityPayloadParams) {
  return {
    pipeline: PIPELINE_ENDPOINTS[params.environment as keyof typeof PIPELINE_ENDPOINTS],
    topic: 'dx_mob_push_messages_feedback',
    payload: {
      header: {
        imsOrgId: FEEDBACK_CONFIG.imsOrgId,
        sandboxName: FEEDBACK_CONFIG.sandboxName,
        sandboxId: FEEDBACK_CONFIG.sandboxId,
        datasetId: FEEDBACK_CONFIG.datasetId,
        schemaRef: FEEDBACK_CONFIG.schemaRef
      },
      body: {
        xdmEntity: {
          _experience: {
            customerJourneyManagement: {
              messageExecution: {
                messageExecutionID: '16-Sept-postman',
                messageID: '567',
                journeyVersionID: '',
                journeyVersionInstanceId: ''
              },
              messageProfile: {
                channel: {
                  _id: 'https://ns.adobe.com/xdm/channels/push'
                },
                pushChannelContext: {
                  platform: params.platform
                }
              }
            }
          },
          identityMap: {
            ECID: [{ id: params.ecid }],
            email: [{ id: 'assurance@adobe.com' }]
          },
          eventType: 'message.feedback'
        }
      }
    }
  };
}

/**
 * Creates profile feedback routing configuration
 */
function createProfileFeedbackRouting(params: LiveActivityPayloadParams) {
  return {
    pipeline: PIPELINE_ENDPOINTS[params.environment as keyof typeof PIPELINE_ENDPOINTS],
    topic: 'some-siphon-enabled-topic',
    payload: {
      header: {
        imsOrgId: FEEDBACK_CONFIG.imsOrgId,
        sandboxName: FEEDBACK_CONFIG.sandboxName,
        sandboxId: FEEDBACK_CONFIG.sandboxId,
        datasetId: FEEDBACK_CONFIG.datasetId,
        schemaRef: FEEDBACK_CONFIG.schemaRef
      }
    }
  };
}

/**
 * Generates the complete payload for Live Activity API request
 * This can be used for both launch (with pushToStartToken) and update (with updateToken)
 */
export function generateLiveActivityPayload(params: LiveActivityPayloadParams) {
  const groupId = `test-live-activity-${uuidv4()}`;
  const normalizedAps = normalizeApsPayload(params.apsContent);

  // Determine event type - if 'start', map to 'remotestart'
  const eventType = normalizedAps.event === 'start' ? 'remotestart' : normalizedAps.event;

  return {
    messages: [
      {
        imsOrg: params.imsOrg,
        value: {
          notification: {
            griffonInfo: { 
              validationToken: params.sessionId 
            },
            groupID: groupId,
            sandboxName: params.sandboxName,
            liveActivity: {
              type: 'unitary',
              event: eventType,
              liveActivityID: normalizedAps.attributes?.liveActivityData?.liveActivityID
            },
            pushTokenDetail: {
              appID: params.appId,
              platform: params.platform,
              token: params.token, // This is either pushToStartToken or updateToken
              blocklisted: false,
              identity: {
                namespace: { code: 'ECID' },
                id: params.ecid
              }
            },
            platform: params.platform,
            pushProviderPayload: {
              aps: normalizedAps,
              adb_a_type: 'OPENAPP',
              adb_uri: ''
            },
            aepFeedbackRouting: createAepFeedbackRouting(params),
            profilefeedbackrouting: createProfileFeedbackRouting(params)
          }
        }
      }
    ]
  };
}

/**
 * Makes the API call to send Live Activity notification
 */
export async function sendLiveActivityNotification(config: ApiCallConfig): Promise<void> {
  const response = await axios.request({
    method: 'post',
    url: config.url,
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Authorization-Replace': 'Bearer %~t.serviceToken%',
      'Content-Type': 'application/vnd.pipe.json.v1+json'
    },
    data: config.payload
  });

  return response.data;
}

