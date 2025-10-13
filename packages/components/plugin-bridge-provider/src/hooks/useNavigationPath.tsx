import { useContext } from "react";
import { NavigationContext } from "../Contexts";
import { Maybe } from "../types";
import { checkContext } from "./checkContext";

/**
 * A hook to grab the current path inside Assurance
 * @returns {string?} The current URL path
 */
export const useNavigationPath = (): Maybe<string> => {
  const context = checkContext(useContext(NavigationContext));
  return context?.path;
};
