// Combined messages object (for backwards compatibility or centralized access)
import {
  activitiesMessages,
  eventsMessages,
  liveActivityMessages,
  navigationMessages,
  validationMessages
} from './features';
import {
  actionMessages,
  contentStateMessages,
  copyMessages,
  errorMessages,
  formMessages,
  stateMessages
} from './shared';

/**
 * Central i18n export point
 * Import all messages from this file to ensure consistency
 *
 * @example
 * import { actionMessages, activitiesMessages } from '@/i18n';
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
export type { Messages, MessageKey, FormattedMessages } from './utils';

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
