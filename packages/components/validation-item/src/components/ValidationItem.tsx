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

import React, { useState, useEffect } from 'react';
import {
  ActionButton,
  Flex,
  Heading,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
  Well
} from '@adobe/react-spectrum';

import { useValidation } from '@adobe/assurance-plugin-bridge-provider';

import Alert from '@spectrum-icons/workflow/Alert';
import Checkmark from '@spectrum-icons/workflow/CheckmarkCircle';
import Info from '@spectrum-icons/workflow/InfoOutline';

const ValidationItem = ({ namespace }) => {
  const validation = useValidation();

  const thisValidation = validation?.[namespace] || {};
  const displayName = thisValidation?.displayName;
  const description = thisValidation?.description;
  const message = thisValidation?.results?.message;
  const result = thisValidation?.results?.result;

  return (
    <Well key={namespace} data-testid={namespace}>
      <Flex alignItems="center">
        {result === 'matched' ? (
          <Checkmark data-testid="val-success" size="M" color="positive" />
        ) : (
          <Alert
            data-testid="val-error"
            size="M"
            color={namespace.level === 'warn' ? 'notice' : 'negative'}
          />
        )}
        <View marginX="size-200" flex={1}>
          <Flex alignItems="center">
            <Heading marginY="size-100" data-testid="val-heading">
              {displayName}
            </Heading>
            <TooltipTrigger delay={200}>
              <ActionButton isQuiet>
                <Info size="S" />
              </ActionButton>
              <Tooltip data-testid="val-description">{description}</Tooltip>
            </TooltipTrigger>
          </Flex>
          <Text data-testid="val-message">{message}</Text>
        </View>
      </Flex>
    </Well>
  );
};

export default ValidationItem;
