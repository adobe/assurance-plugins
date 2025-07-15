/**
 * A utility function to ensure a hook has been called inside a PluginBridgeProvider
 * @param context Context to check exists
 * @returns The context if the check passes, otherwise an error
 */

export function checkContext<T>(context: T): T {
  if (context && Object.keys(context).length === 0) {
    throw new Error(
      "Plugin bridge hooks must be used within a PluginBridgeProvider",
    );
  }
  return context;
}
