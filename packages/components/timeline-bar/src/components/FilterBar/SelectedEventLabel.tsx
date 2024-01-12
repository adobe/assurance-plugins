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

import React from "react";
import { Flex, Text } from "@adobe/react-spectrum";
import { useSelectedEvents } from "@adobe/assurance-plugin-bridge-provider";
import { chooseEventLabel } from "@adobe/assurance-common-utils";

const SelectedEventLabel = () => {
  const selected = useSelectedEvents();

  if (!selected || !selected[0]) { return null; }
  
  // TODO: Hightlights

  return (
    <Flex gap="size-200" data-testid="event-label">
      {selected.length > 1 ? (
        <Text>Multiple selected events</Text>
      ) : (
        <Text>{chooseEventLabel(selected[0])}</Text>
      )}
    </Flex>
  );
};

export default SelectedEventLabel;
