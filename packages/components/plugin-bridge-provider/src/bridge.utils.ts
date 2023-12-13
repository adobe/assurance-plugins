/*
 * ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *   Copyright 2023 Adobe Systems Incorporated
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

export const annotateEvent = (event) => {
  window.pluginBridge.annotateEvent(event).then(() => {
    // console.log(...args);
  });
};

export const annotateSession = (session) => {
  window.pluginBridge.annotateSession(session).then(() => {
    // console.log(...args);
  });
};

export const deletePlugin = uuid =>
  window.pluginBridge.deletePlugin(uuid);

export const flushConnection = (namespace, context) =>
  window.pluginBridge.flushConnection(namespace, context);

export const navigateTo = (path) => {
  window.pluginBridge.navigateTo(path).then(() => {
    // console.log(...args);
  });
};

export const selectEvents = (events) => {
  window.pluginBridge.selectEvents(events).then(() => {
    // console.log(...args);
  });
};

export const sendCommand = command =>
  window.pluginBridge.sendCommand(command);

export const uploadPlugin = contents =>
  window.pluginBridge.uploadPlugin(contents);
