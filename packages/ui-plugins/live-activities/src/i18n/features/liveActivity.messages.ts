import { defineMessages } from 'react-intl';

/**
 * Live Activity feature messages
 * Used for launching and updating live activities
 */
export const liveActivityMessages = defineMessages({
  // Launch
  launchLiveActivity: {
    id: 'liveActivity.launch.title',
    defaultMessage: 'Start Live Activity'
  },
  selectActivity: {
    id: 'liveActivity.launch.select',
    defaultMessage: 'Select Live Activity'
  },
  noActivitiesAvailable: {
    id: 'liveActivity.launch.empty',
    defaultMessage: 'No registered live activities available'
  },
  launchDescription: {
    id: 'liveActivity.launch.description',
    defaultMessage: 'Select a live activity and fill in the required fields below'
  },
  
  // Update
  updateLiveActivity: {
    id: 'liveActivity.update.title',
    defaultMessage: 'Send Update'
  },
  updateLiveActivityHeading: {
    id: 'liveActivity.update.heading',
    defaultMessage: 'Update Live Activity {activityId}'
  },
  updateDescription: {
    id: 'liveActivity.update.description',
    defaultMessage: 'Edit the payload content below to update the activity'
  },
  
  // Common form fields
  apsPayload: {
    id: 'liveActivity.form.apsPayload',
    defaultMessage: 'APS Payload'
  },
  apsPayloadDescription: {
    id: 'liveActivity.form.apsDescription',
    defaultMessage: 'Edit the payload content below'
  },
  eventType: {
    id: 'liveActivity.form.eventType',
    defaultMessage: 'Event Type'
  },
  
  // Event types
  eventTypeUpdate: {
    id: 'liveActivity.eventType.update',
    defaultMessage: 'Update'
  },
  eventTypeEnd: {
    id: 'liveActivity.eventType.end',
    defaultMessage: 'End'
  }
});

