import {
  getClientDataStream,
  getClientMessagingEventDataset,
  useClientMessagingVersion,
  useECID,
  useSelectedClientPushToken,
  useSelectedClientType
} from './useClientInfo';

function useClientValidationStatus() {
  const ecid = useECID();
  const pushToken = useSelectedClientPushToken();
  const messagingVersion = useClientMessagingVersion();
  const dataStream = getClientDataStream();
  const messagingEventDataset = getClientMessagingEventDataset();
  const clientType = useSelectedClientType();

  if (!ecid) {
    return 'no-ecid';
  }
  if (!messagingVersion) {
    return `messaging-not-installed-${clientType}`;
  }
  if (!pushToken) {
    return `no-token-${clientType}`;
  }
  if (!dataStream) {
    return 'edge-not-configured';
  }
  if (!messagingEventDataset) {
    return 'messaging-not-configured';
  }
  return false;
}

export default useClientValidationStatus;
