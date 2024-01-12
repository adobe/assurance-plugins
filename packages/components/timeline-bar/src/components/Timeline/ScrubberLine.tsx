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

import { Flex, View, TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';
import { chooseEventLabel, getTimestampText } from "@adobe/assurance-common-utils";
import React from 'react';

const BOX_HEIGHT = 16;
const SCRUBBER_LINE_HEIGHT = 24;

const ScrubberLine = ({
  highlightColor,
  onPress,
  event,
  isSelected,
  eventSize,
  index
}) => (
  <View
    data-testid="scrubber-line"
    position="absolute"
    left={eventSize * index}
    width={eventSize}
    height={SCRUBBER_LINE_HEIGHT + 4}
    top={0}
  >
    {!((index + 1) % 5) && (
      <View 
        data-testid="scrubber-tick"
        backgroundColor="gray-400"
        position="absolute"
        height={SCRUBBER_LINE_HEIGHT}
        top={12}
        width={2}
        left="calc(50% - 1px)"
      />
    )}
    {!((index + 1) % 25) && (
      <View 
        position="absolute"
        top={0}
        left="50%"
        UNSAFE_style={{ fontSize: '8px', transform: 'translateX(-50%)' }}
      >
        {index + 1}
      </View>
    )}
    <View marginTop={16}>
      <TooltipTrigger delay={50}>
        <ActionButton
          onPress={onPress}
          isQuiet
          width="100%"
          minWidth="100%"
          height={BOX_HEIGHT}
          UNSAFE_style={{ border: 'none' }}
        >
          <View
            data-testid={`scrubber-highlight-${isSelected ? 'blue-400' : highlightColor || 'gray-200'}`}
            backgroundColor={isSelected ? 'blue-400' : highlightColor || 'gray-200'}
            position="absolute"
            height={BOX_HEIGHT}
            width="100%"
          >
            <View
              height={BOX_HEIGHT}
              width="100%"
              backgroundColor="gray-50"
              borderColor={'gray-400'}
              borderWidth="thin"
              UNSAFE_style={{
                opacity: .2,
                fontWeight: 'bold',
                fontSize: 11,
                userSelect: 'none',
              }}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
              >
                {event.hidden ? 'X' : event.important ? '!' : ''}
              </Flex>
            </View>
          </View>
        </ActionButton>
        <Tooltip>
          <div>{chooseEventLabel(event)}</div>
          <div style={{ fontSize: 11 }}>{getTimestampText(event.timestamp)}</div>
        </Tooltip>
      </TooltipTrigger>
    </View>
  </View>
);

export default ScrubberLine;
