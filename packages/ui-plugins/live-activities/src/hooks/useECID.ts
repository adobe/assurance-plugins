// Hook to extract the latest ECID (Experience Cloud ID) from shared state update events for the currently selected client.
//
// - Filters events to only include shared state updates where the stateowner is 'com.adobe.edge.identity'.
// - Extracts the ECID from the most recent matching event's metadata.
// - Returns the ECID as a string, or undefined if not available.
//
// Usage:
//   const ecid = useECID();
//   // ecid will be a string (the ECID) or undefined if not found or no matching event is present.

import { useEvents } from '@assurance/plugin-bridge-provider';

function useECID() {
  // Fetch events containing ECID, automatically filtered by selected client via navigation filters
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner == 'com.adobe.edge.identity'"]
  });
  const ecid = events[0]?.payload?.metadata?.['xdm.state.data']?.identityMap?.ECID?.[0]?.id;
  return ecid;
}

export default useECID;
