import { useIntl, MessageDescriptor } from 'react-intl';
import { FormattedMessages, Messages } from './types';

/**
 * Custom hook to format all messages in a messages object
 * Returns an object with the same keys but formatted strings as values
 * 
 * @example
 * const msgs = useMessages(actionMessages);
 * return <Button>{msgs.cancel}</Button>;
 */
export function useMessages<T extends Messages>(
  messages: T
): FormattedMessages<T> {
  const { formatMessage } = useIntl();
  
  return Object.keys(messages).reduce((acc, key) => {
    acc[key as keyof T] = formatMessage(messages[key]);
    return acc;
  }, {} as FormattedMessages<T>);
}

/**
 * Custom hook to format a single message with optional values
 * 
 * @example
 * const msg = useMessage(liveActivityMessages.updateHeading, { activityName: 'Food' });
 */
export function useMessage(
  descriptor: MessageDescriptor,
  values?: Record<string, string | number>
): string {
  const { formatMessage } = useIntl();
  return formatMessage(descriptor, values);
}

