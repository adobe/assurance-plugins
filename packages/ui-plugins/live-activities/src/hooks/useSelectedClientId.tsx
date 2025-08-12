import { useSelectedClients, useClients } from '@assurance/plugin-bridge-provider';

/**
 * Returns the clientId of the currently selected client, or undefined if "All Clients" is selected.
 *
 * This hook is designed to work with the ClientPicker component, which manages selection via navigation filters.
 * - If exactly one client is selected, returns that client's clientId.
 * - If "All Clients" is selected (or none are selected), returns undefined.
 *
 * This is useful for filtering events or data by the currently selected client.
 */
function useSelectedClientId(): string | undefined {
  // selectedClients: array of clientIds currently selected in the navigation filter
  const selectedClients = useSelectedClients();
  // clients: all available client objects
  const clients = useClients();

  // If "All Clients" is selected (selectedClients is empty or contains all clientIds), return undefined
  if (!selectedClients || selectedClients.length !== 1) {
    return undefined;
  }

  // Find the client object for the selected clientId
  const selectedClientObj = clients.find(client => client.clientId === selectedClients[0]);
  // Return the clientId if found, otherwise undefined
  return selectedClientObj?.clientId;
}

export default useSelectedClientId;