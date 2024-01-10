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
