/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/
import { clientInfo } from "@adobe/griffon-toolkit-common";
import { useContext, useMemo } from "react";
import { ValidationContext } from "../Contexts";
import extractClientEvents from "../utils/extract.client.events";
import extractSelectedClients from "../utils/extract.selected.clients";
import { useEvents } from "./useEvents";
import { useNavigationFilters } from "./useNavigationFilters";

export const useValidationMap = () => {
  const context = useContext(ValidationContext);
  return context?.validation;
};

/**
 * A hook that returns a list of clients that have connected to a given Assurance session
 * @returns
 */
export const useClients = () => {
  const events = useEvents({
    sorted: "asc",
    filtered: true,
    matchers: [clientInfo.matcher],
    ignoreFilters: ["clients"],
  });

  return useMemo(() => extractClientEvents(events), [events]);
};

export const useSelectedClients = () => {
  const clients = useClients();
  const filters = useNavigationFilters();

  return extractSelectedClients(clients, filters);
};
