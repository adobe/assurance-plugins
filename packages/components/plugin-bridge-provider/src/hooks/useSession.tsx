import { useContext } from "react";
import { SessionContext } from "../Contexts";
import { checkContext } from "./checkContext";

/**
 * A hook that returns the current assurance session object from the SessionContext.
 */
export const useSession = () => {
  const context = checkContext(useContext(SessionContext));
  return context;
};
