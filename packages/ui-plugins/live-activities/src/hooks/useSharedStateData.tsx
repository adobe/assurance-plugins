import { useEvents } from '@assurance/plugin-bridge-provider';
import usePluginState from './usePluginState';
import { SharedState, sharedState } from '@adobe/griffon-toolkit-aep-mobile';

function useSharedStateData() {
  const selectedClient = usePluginState(state => state.selectedClient);

  if (!selectedClient) {
    return null;
  }

  const sharedStateEvents = useEvents<SharedState[]>({
    sorted: 'desc',
    matchers: [sharedState.matcher]
  });

  const xdmData = sharedStateEvents?.[0] ? sharedState.getXdm(sharedStateEvents[0]) : null;
  const ecid = xdmData?.identityMap?.['ECID']?.[0]?.id;

  return {
    ecid
  };
}

export default useSharedStateData;
