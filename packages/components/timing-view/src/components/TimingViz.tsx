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

import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import type { Responsive, BackgroundColorValue } from '@react-types/shared';
import { selectEvents } from '@adobe/assurance-plugin-bridge-provider';
import type { Event } from '@adobe/assurance-common-utils';
import EventTooltip from './EventTooltip';
import { COLORS } from './const';
import { Branch } from '../types';

type Chain = Event[];

const TimingVizRow = ({ size, chain, scale }) => {
  const start = chain[0].timestamp;
  const total = chain[chain.length - 1].timestamp - start;

  return (
    <Flex gap="size-150" alignItems="center" data-testid="timingVizRow">
      <Flex width={size} gap={1} height={50} alignItems="center">
        {chain.map((event: Event, index) => {
          const width =
            index === 0 ? 6 : Math.max((event.timestamp - chain[index - 1].timestamp) * scale, 6);
          return (
            <EventTooltip
              key={event.uuid}
              event={event}
              width={width}
              height={30}
              onPress={() => {
                selectEvents([event.uuid]);
              }}
            >
              <View
                backgroundColor={COLORS[index] as Responsive<BackgroundColorValue>}
                height={30}
                minWidth={width}
                width={width}
                borderRadius="small"
              />
            </EventTooltip>
          );
        })}
      </Flex>
      <div style={{ fontSize: 10 }}>{total} ms</div>
    </Flex>
  );
};

const TimingViz = ({ branch, scale }) => {
  // flatten the tree into a list of chains
  const chains: Event[][] = [];
  let longestTime = 0;

  const flatten = (branch: Branch, chain?: Chain) => {
    const newChain = chain ? [...chain] : [];
    newChain.push(branch.event);

    if (Object.keys(branch.children).length) {
      Object.values(branch.children).forEach(child => flatten(child, newChain));
    } else {
      chains.push(newChain);
      longestTime = Math.max(
        longestTime,
        newChain[newChain.length - 1].timestamp - newChain[0].timestamp
      );
    }
  };
  flatten(branch);

  return (
    <Flex direction="column" gap="size-100" marginY="size-200">
      {chains.map((chain, index) => (
        <TimingVizRow chain={chain} size={300} scale={scale} key={`VizRow${index}`} />
      ))}
    </Flex>
  );
};

export default TimingViz;
