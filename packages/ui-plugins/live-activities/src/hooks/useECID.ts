import { useEvents } from "@assurance/plugin-bridge-provider";

function useECID() {
  const events = useEvents({
    matchers: ['payload.body.xdmEntity.identityMap.ECID']
  });
  console.log(events, 'events 444444');
  const ecid = events[0]?.payload?.body?.xdmEntity?.identityMap?.ECID[0]?.id;
  console.log(ecid, 'ecid 555555');
  return ecid;
}

export default useECID;