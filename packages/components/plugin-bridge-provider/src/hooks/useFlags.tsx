import { useContext, useMemo } from "react";
import { SettingsContext } from "../Contexts";
import { checkContext } from "./checkContext";

/**
 * Assurance flags that have been set under the PluginBridge settings
 */
export interface Flags {
  showColumnSettings: boolean;
  showReleaseNotes: boolean;
  showTimeline: boolean;
}
/**
 * Returns a list of flags that have been enabled by the user
 * @returns {Flags} - An object with boolean values of flags have been enabled
 * by the user
 */

export const useFlags = (): Flags => {
  const context = checkContext(useContext(SettingsContext));

  return useMemo(
    () => ({
      showColumnSettings: !!context?.showColumnSettings,
      showReleaseNotes: !!context?.showReleaseNotes,
      showTimeline: !!context?.showTimeline,
    }),
    [
      context?.showColumnSettings,
      context?.showReleaseNotes,
      context?.showTimeline,
    ],
  );
};
