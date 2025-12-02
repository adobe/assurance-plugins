import React from 'react';

import { combineAll } from '@adobe/griffon-toolkit';
import { edgeRequest } from '@adobe/griffon-toolkit-aep-mobile';
import { EventTable, timestampColumn, validationColumn } from '@assurance/event-table';
import { useEvents } from '@assurance/plugin-bridge-provider';

const trackingRequestMatcher = combineAll([
  edgeRequest.matcher,
  'payload.ACPExtensionEventData.xdm._experience.decisioning.propositionEventType'
]);

function CardInteractions() {
  const events = useEvents({
    matchers: [trackingRequestMatcher]
  });

  return (
    <EventTable
      columns={[
        timestampColumn,
        {
          header: 'Interaction',
          accessorFn: row => {
            const eventType =
              row?.payload?.ACPExtensionEventData?.xdm?._experience?.decisioning
                ?.propositionEventType;
            return eventType ? Object.keys(eventType)?.[0] : null;
          }
        },
        {
          header: 'Action'
        },
        validationColumn
      ]}
      data={events}
    />
  );
}

export default CardInteractions;
