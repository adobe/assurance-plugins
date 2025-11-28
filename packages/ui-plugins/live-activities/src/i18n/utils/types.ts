import { MessageDescriptor } from 'react-intl';

/**
 * Type definitions for i18n utilities
 */

export type MessageKey = string;
export type Messages = Record<MessageKey, MessageDescriptor>;

/**
 * Helper type to extract formatted message keys from a messages object
 */
export type FormattedMessages<T extends Messages> = {
  [K in keyof T]: string;
};
