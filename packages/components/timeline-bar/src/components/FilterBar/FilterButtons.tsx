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

import { MenuTrigger, ActionButton, Menu, Flex, Item, Text } from "@adobe/react-spectrum";
import { annotateSession, useSelectedEvents, useSession } from "@adobe/assurance-plugin-bridge-provider";
import React from "react";

import Filter from "@spectrum-icons/workflow/Filter";
import DataRefresh from "@spectrum-icons/workflow/DataRefresh";
import DataRemove from "@spectrum-icons/workflow/DataRemove";

import * as kit from '@adobe/griffon-toolkit';
import { sessionAnnotation } from "@adobe/griffon-toolkit-common";

const KEY_CLEAR_TS = sessionAnnotation.publicKey.clearSessionTS;
const VISIBILITY = sessionAnnotation.publicNamespace.visibility;

type Actions = {
  label: string;
  action: string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any; 
}

const applyClearTimestamp = async (session, timestamp) => {
  const oldAnnotation = kit.search(
    sessionAnnotation.makeNamespacePath(VISIBILITY),
    session
  ) || {};

  await annotateSession({
    annotations: {
      ...oldAnnotation,
      [KEY_CLEAR_TS]: timestamp
    },
    namespace: VISIBILITY
  });  
};

const clearSession = async (session) => {
  const timestamp = Date.now();
  await applyClearTimestamp(session, timestamp);
};

const restoreSession = async (session) => {
  await applyClearTimestamp(session, 0);
};


const FilterButtons = () => {
  const selected = useSelectedEvents();
  const session = useSession();
  
  const moreActions: Actions[] = [
    { label: 'Clear session', action: 'clearSession', icon: DataRemove },
    { label: 'Restore session', action: 'restoreSession', icon: DataRefresh },
  ];

  return (
    <Flex gap="size-100" alignItems="center">
      <MenuTrigger>
        <ActionButton isQuiet aria-label="Filter menu">
          <Filter />
        </ActionButton>
        <Menu 
          items={moreActions} 
          onAction={(action) => {
            if (action === 'clearSession') {
              return clearSession(session);
            }
            if (action === 'restoreSession') {
              return restoreSession(session);
            }
          }}>
          {item => {
            const renderedIcon = item.icon ? <item.icon /> : null;
            return (
              <Item key={item.action} textValue={item.label}>
                {renderedIcon}
                <Text>{item.label}</Text>
              </Item>
            );
          }}
        </Menu>
      </MenuTrigger>
    </Flex>
  );
};

export default FilterButtons;
