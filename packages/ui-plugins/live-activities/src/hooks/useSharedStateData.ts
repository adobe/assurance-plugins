import { SharedState, sharedState } from '@adobe/griffon-toolkit-aep-mobile';
import { useEvents } from '@assurance/plugin-bridge-provider';

import usePluginState from './usePluginState';

function useSharedStateData() {
  const selectedClient = usePluginState(state => state.selectedClient);

  const sharedStateEvents = useEvents<SharedState[]>({
    sorted: 'desc',
    matchers: [sharedState.matcher]
  });

  const xdmData = sharedStateEvents?.[0] ? sharedState.getXdm(sharedStateEvents[0]) : null;
  const ecid = xdmData?.identityMap?.['ECID']?.[0]?.id;

  return {
    ecid: ecid ?? null
  };
}

export default useSharedStateData;
