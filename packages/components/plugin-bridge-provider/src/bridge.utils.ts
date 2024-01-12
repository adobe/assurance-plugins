/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
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
