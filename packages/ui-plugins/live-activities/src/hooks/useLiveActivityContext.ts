/**
 * Unified context hook for Live Activity operations
 * Used by both launch and update live activity components
 */

import {
  useImsAccessToken,
  useImsOrg,
  useSandbox,
  useEnvironmentValue,
  useEvents,
  useSession
} from '@assurance/plugin-bridge-provider';
import { useECID, useSelectedClientPushToken } from './useClientInfo';
import { ENVIRONMENT_MAPPING } from '../utils/utils';
import usePushCredentialsData from './usePushCredentialsData';
import { useAppstoreCredentialsValidation } from './useAppstoreCredentialsValidation';
import { LIVE_ACTIVITY_DEFAULTS } from '../constants/liveActivitiesConfig';

interface UseLiveActivityContextOptions {
  /**
   * Whether to require push token for isReady validation
   * Set to true for launch operations, false for update operations
   * @default true
   */
  requirePushToken?: boolean;
}

/**
 * Hook to gather all required context for Live Activity operations
 * 
 * This hook consolidates authentication, environment, and client information
 * needed for both launching and updating Live Activities.
 * 
 * @param options - Configuration options
 * @param options.requirePushToken - Whether pushToken is required for isReady validation (default: true)
 * @returns Context object with authentication, environment, and client info
 * 
 * @example
 * // For launch operations (requires push token)
 * const context = useLiveActivityContext({ requirePushToken: true });
 * 
 * @example
 * // For update operations (doesn't require push token)
 * const context = useLiveActivityContext({ requirePushToken: false });
 */
export function useLiveActivityContext(options?: UseLiveActivityContextOptions) {
  const requirePushToken = options?.requirePushToken ?? true;

  // Authentication & Environment
  const token = useImsAccessToken();
  const imsOrg = useImsOrg();
  const sandbox = useSandbox();
  const environment = useEnvironmentValue(ENVIRONMENT_MAPPING);
  const { uuid: sessionId } = useSession();

  // Client Information
  const ecid = useECID();
  const pushToken = useSelectedClientPushToken();
  
  // Push Credentials & Validation
  const pushCredentials = usePushCredentialsData();
  const selectedClientEvents = useEvents();
  const { clientAppIDFromEvent } = useAppstoreCredentialsValidation({ 
    pushCredentials, 
    selectedClientEvents, 
    sandbox, 
    imsOrg 
  });

  const platform = LIVE_ACTIVITY_DEFAULTS.PLATFORM;
  
  // Conditional isReady validation
  // For launch: requires pushToken
  // For update: doesn't require pushToken
  const isReady = Boolean(
    token && 
    imsOrg && 
    ecid && 
    sessionId && 
    clientAppIDFromEvent &&
    (requirePushToken ? pushToken : true)
  );

  return {
    token,
    imsOrg,
    sessionId,
    sandbox,
    environment,
    ecid,
    pushToken,
    appId: clientAppIDFromEvent,
    platform,
    isReady
  };
}

