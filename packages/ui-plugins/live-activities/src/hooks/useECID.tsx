import { useEvents } from "@assurance/plugin-bridge-provider";

function useECID() {
  const events = useEvents({
    matchers: ['payload.body.identity.id']
  });
  const ecid = events[0]?.payload?.body?.identity?.id;
  return ecid;
}

export default useECID;