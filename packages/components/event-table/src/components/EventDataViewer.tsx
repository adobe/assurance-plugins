import { EventDataViewer } from '@assurance/event-data-viewer';
import { Event, CopyableValue } from '@assurance/common-utils';

import React from 'react';

interface EventDataViewerProps {
  event: Event;
  title?: string;
  className?: string;
}

const EventDataViewerComponent: React.FC<EventDataViewerProps> = ({
  event,
  title = 'Event Data',
  className = ''
}) => {
  // Prepare event data exactly like the reference SampleApp.tsx
  // The DataViewer component will handle flattening internally
  const eventData = {
    eventId: event.uuid,
    values: event.payload || {}
  };

  return (
    <div className={`event-data-viewer-section ${className}`}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: 'var(--spectrum-global-dimension-size-250)',
          fontWeight: 600,
          color: 'var(--spectrum-global-color-gray-800)'
        }}>
          {title}
        </h4>
        <CopyableValue 
          value={JSON.stringify(event.payload, null, 2)} 
          copyButtonSize="S"
          standalone={true}
          tooltipText="Copy Payload JSON"
          label="Copy Payload"
        />
      </div>
      <div style={{ 
        border: '1px solid var(--spectrum-global-color-gray-300)',
        borderRadius: 'var(--spectrum-global-dimension-size-50)',
        overflow: 'hidden'
      }}>
        <EventDataViewer 
          data={[eventData] as any} 
          autoExpand={true}
          showTooltips={true}
          tooltipThreshold={50}
        />
      </div>
    </div>
  );
};

export default EventDataViewerComponent;
