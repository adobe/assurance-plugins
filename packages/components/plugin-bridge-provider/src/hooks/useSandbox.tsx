import { combineAll, combineMatchers } from '@adobe/griffon-toolkit';
import { useEvents } from './useEvents';
import { clientInfo } from '@adobe/griffon-toolkit-common';
import { streamingValidation } from '@adobe/griffon-toolkit-edge';

/**
 * An app sandbox that has been configured inside the Adobe Experience Platform
 */
export interface Sandbox {
  id: string;
  name: string;
}

const ajoRequestMatcher = combineAll([
  'vendor==`com.adobe.experience_platform.ajo`',
  'type==`service`',
  'payload.name==`com.adobe.experience_platform.ajo/request`'
]);

/**
 * Reads client events and tries to identity the ID and name of the current sandbox
 */
export const useSandbox = (): Sandbox => {
  const events = useEvents({
    matchers: [ajoRequestMatcher]
  });

  let id, name;

  for (const event of events) {
    const { sandboxId, sandboxName } = (event.payload?.context as any)?.event?.header || {};
    if (sandboxId && sandboxName) {
      id = sandboxId;
      name = sandboxName;
      break;
    }
  }

  return {
    id,
    name
  };
};
