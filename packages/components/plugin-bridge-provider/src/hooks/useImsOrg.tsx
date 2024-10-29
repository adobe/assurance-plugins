import { useContext } from "react";
import { SettingsContext } from "../Contexts";
import type { Maybe } from "../types";
import { checkContext } from "./checkContext";

/**
 * A hook that returns the UUID of the currently selected IMS Org
 */
export const useImsOrg = (): Maybe<string> => {
  const context = checkContext(useContext(SettingsContext));
  return context?.imsOrg;
};
