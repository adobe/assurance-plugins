import { useContext } from "react";
import { SettingsContext } from "../Contexts";
import { checkContext } from "./checkContext";

/**
 * A hook that returns the name of the currently selected IMS Org
 */
export const useTenant = () => {
  const context = checkContext(useContext(SettingsContext));
  return context?.tenant;
};
