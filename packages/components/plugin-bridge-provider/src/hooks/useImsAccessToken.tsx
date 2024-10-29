import { useContext } from "react";
import { SettingsContext } from "../Contexts";
import type { Maybe } from "../types";
import { checkContext } from "./checkContext";

/**
 * A hook to grab the bearer token of the current IMS user
 * @returns {string} The bearer token of the current IMS user
 */

export const useImsAccessToken = (): Maybe<string> => {
  const context = checkContext(useContext(SettingsContext));
  console;
  return context?.imsAccessToken;
};
