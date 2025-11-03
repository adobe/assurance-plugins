import { useContext } from "react";
import { SessionContext } from "../Contexts";
import { checkContext } from "./checkContext";

/**
 * A hook that returns the name of the currently selected IMS Org
 */
export const useSession = () => {
  const context = checkContext(useContext(SessionContext));
  return context;
};
