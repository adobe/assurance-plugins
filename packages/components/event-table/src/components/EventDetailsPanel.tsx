import { View, Text, Heading, Flex, Button, Divider, Well, Accordion, Disclosure, DisclosureTitle, DisclosurePanel } from '@adobe/react-spectrum';

import { Event } from '@assurance/common-utils';

import MonacoEditor from '@monaco-editor/react';

import Close from '@spectrum-icons/workflow/Close';

import React, { useState } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import dayjs from 'dayjs';

import CopyableMonacoEditor from './CopyableMonacoEditor';
import CopyableValue from './CopyableValue';
import EventDataViewer from './EventDataViewer';

interface EventDetailsPanelProps {
  event?: Event;
  isOpen: boolean;
  onClose: () => void;
}

const messages = defineMessages({
  eventDetails: {
    id: 'eventDetails.title',
    defaultMessage: 'Event Details'
  },
  noEventSelected: {
    id: 'eventDetails.noEventSelected',
    defaultMessage: 'No event selected'
  },
  selectEventMessage: {
    id: 'eventDetails.selectEventMessage',
    defaultMessage: 'Click on an event in the table to view its details'
  },
  copyEvent: {
    id: 'eventDetails.copyEvent',
    defaultMessage: 'Copy Event'
  },
  eventCopied: {
    id: 'eventDetails.eventCopied',
    defaultMessage: 'Event copied to clipboard'
  },
  timestamp: {
    id: 'eventDetails.timestamp',
    defaultMessage: 'Timestamp'
  },
  eventType: {
    id: 'eventDetails.eventType',
    defaultMessage: 'Event Type'
  },
  vendor: {
    id: 'eventDetails.vendor',
    defaultMessage: 'Vendor'
  },
  clientId: {
    id: 'eventDetails.clientId',
    defaultMessage: 'Client ID'
  },
  payload: {
    id: 'eventDetails.payload',
    defaultMessage: 'Payload'
  },
  annotations: {
    id: 'eventDetails.annotations',
    defaultMessage: 'Annotations'
  },
  rawEventData: {
    id: 'eventDetails.rawEventData',
    defaultMessage: 'Raw Event Data'
  }
});

function EventDetailsPanel({ event, isOpen, onClose }: EventDetailsPanelProps) {
  const { formatMessage } = useIntl();

  return (
    <div className="details-panel">
      <div className="details-panel-header">
        <h3 className="header-title">
          {formatMessage(messages.eventDetails)}
        </h3>
        <div className="header-actions">
          <Button
            variant="secondary"
            isQuiet
            onPress={onClose}
          >
            <Close size="S" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="details-panel-content">
        {event ? (
          <div>
            {/* Basic Event Information */}
            <div className="event-info-section">
              <h4 className="section-title">Basic Information</h4>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="info-label">
                      {formatMessage(messages.timestamp)}
                    </td>
                    <td className="info-value">
                      <CopyableValue value={dayjs(event.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')}>
                        {dayjs(event.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')}
                      </CopyableValue>
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">
                      Event Name
                    </td>
                    <td className="info-value">
                      <CopyableValue value={event._internal_adb_props?.label || 'N/A'}>
                        {event._internal_adb_props?.label || 'N/A'}
                      </CopyableValue>
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">
                      {formatMessage(messages.eventType)}
                    </td>
                    <td className="info-value">
                      <CopyableValue value={event.type || 'N/A'}>
                        {event.type || 'N/A'}
                      </CopyableValue>
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">
                      {formatMessage(messages.vendor)}
                    </td>
                    <td className="info-value">
                      <CopyableValue value={event.vendor || 'N/A'}>
                        {event.vendor || 'N/A'}
                      </CopyableValue>
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">
                      {formatMessage(messages.clientId)}
                    </td>
                    <td className="info-value">
                      <CopyableValue value={event.clientId || 'N/A'}>
                        {event.clientId || 'N/A'}
                      </CopyableValue>
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">
                      UUID
                    </td>
                    <td className="info-value">
                      <CopyableValue value={event.uuid || 'N/A'}>
                        {event.uuid || 'N/A'}
                      </CopyableValue>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Accordion for Payload and Raw Event Data */}
            <div className="event-info-section">
              <Accordion defaultExpandedKeys={['payload']}>
                {/* Payload Section */}
                {event.payload && (
                  <Disclosure id="payload">
                    <DisclosureTitle>{formatMessage(messages.payload)}</DisclosureTitle>
                    <DisclosurePanel>
                      <EventDataViewer
                        event={event}
                        title=""
                      />
                    </DisclosurePanel>
                  </Disclosure>
                )}

                {/* Annotations Section */}
                {event.annotations && event.annotations.length > 0 && (
                  <Disclosure id="annotations">
                    <DisclosureTitle>{formatMessage(messages.annotations)}</DisclosureTitle>
                    <DisclosurePanel>
                      <CopyableMonacoEditor
                        value={JSON.stringify(event.annotations, null, 2)}
                        title=""
                        height="200px"
                      />
                    </DisclosurePanel>
                  </Disclosure>
                )}

                {/* Raw Event Data Section */}
                <Disclosure id="rawEventData">
                  <DisclosureTitle>{formatMessage(messages.rawEventData)}</DisclosureTitle>
                  <DisclosurePanel>
                    <CopyableMonacoEditor
                      value={JSON.stringify(event, null, 2)}
                      title=""
                      height="400px"
                    />
                  </DisclosurePanel>
                </Disclosure>
              </Accordion>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="empty-title">
              {formatMessage(messages.noEventSelected)}
            </h3>
            <p className="empty-message">
              {formatMessage(messages.selectEventMessage)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailsPanel;
