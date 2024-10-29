import { propositionsRequest } from "@adobe/griffon-toolkit-aep-mobile";
import { useEvents } from "@assurance/plugin-bridge-provider";

function usePropositions() {
  const events = useEvents({
    matchers: [propositionsRequest.matcher],
  });

  console.log(events);
  return events;
}

export default usePropositions;
