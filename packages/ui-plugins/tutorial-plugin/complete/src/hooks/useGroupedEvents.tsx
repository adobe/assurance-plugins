import { useEvents } from '@assurance/plugin-bridge-provider';

function useGroupedEvents() {
  const events = useEvents();
  const types = Array.from(new Set(events.map(event => event.type))); // Grabs all unique event types
  const grouped = types.map(type => {
    const typeEvents = events.filter(event => event.type === type); // Filters events for given type
    return { type, events: typeEvents };
  });

  return grouped; // Returns an array of objects with the shape {type: string; events: Event[]}
}

export default useGroupedEvents;
