/**
 * Central i18n export point
 * Import all messages from this file to ensure consistency
 * 
 * @example
 * import { actionMessages, activitiesMessages } from '@/i18n';
 * import { useMessages } from '@/i18n/utils';
 */

// Shared messages
export {
  actionMessages,
  copyMessages,
  stateMessages,
  formMessages,
  contentStateMessages,
  errorMessages
} from './shared';

// Feature messages
export {
  activitiesMessages,
  liveActivityMessages,
  eventsMessages,
  validationMessages,
  navigationMessages
} from './features';

// Utilities
export { useMessages, useMessage } from './utils';
export type { Messages, MessageKey, FormattedMessages } from './utils';

// Combined messages object (for backwards compatibility or centralized access)
import {
  actionMessages,
  copyMessages,
  stateMessages,
  formMessages,
  contentStateMessages,
  errorMessages
} from './shared';

import {
  activitiesMessages,
  liveActivityMessages,
  eventsMessages,
  validationMessages,
  navigationMessages
} from './features';

/**
 * All messages grouped by category
 * Useful for extracting all messages for translation tools
 */
export const allMessages = {
  // Shared
  actions: actionMessages,
  copy: copyMessages,
  states: stateMessages,
  forms: formMessages,
  contentState: contentStateMessages,
  errors: errorMessages,
  
  // Features
  activities: activitiesMessages,
  liveActivity: liveActivityMessages,
  events: eventsMessages,
  validation: validationMessages,
  navigation: navigationMessages
} as const;

