/*
 * ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *   Copyright 2025 Adobe Systems Incorporated
 *   All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 * ************************************************************************
 */
import { Session } from "@adobe/griffon-toolkit-common";
import { Event } from "@assurance/common-utils";

/**
 * Use to write an annotation to an event, which will add to the `annotations`
 * property on the event it with the data supplied
 * @param event - The event you'd like to annotate
 */
export const annotateEvent = async (event: Event): Promise<void> => {
  return window.pluginBridge.annotateEvent(event);
};

/**
 * Use to write an annotation to a session
 * @param session {Session} - The session to be annotated
 */
export const annotateSession = (session: Session): Promise<void> => {
  return window.pluginBridge.annotateSession(session);
};

/**
 * Deletes a plugin from the Assurance context, removing it from the options available
 * @param uuid The UUID of the plugin to delete
 * @returns
 */
export const deletePlugin = (uuid) => window.pluginBridge.deletePlugin(uuid);

export const flushConnection = (namespace, context) =>
  window.pluginBridge.flushConnection(namespace, context);

/**
 * Used to route between pages inside Assurance
 * @param path The path to navigate to within Assurance
 */
export const navigateTo = async (path: string) => {
  return window.pluginBridge.navigateTo(path);
};

/**
 *  Allows you to select events globally across all Assurance views
 * @param events The events to select globally across Assurance
 */
export const selectEvents = async (events: Event[]) => {
  return window.pluginBridge.selectEvents(events);
};

export const sendCommand = async (command) =>
  window.pluginBridge.sendCommand(command);

export const uploadPlugin = async (contents) =>
  window.pluginBridge.uploadPlugin(contents);
