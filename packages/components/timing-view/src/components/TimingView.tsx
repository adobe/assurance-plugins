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

import * as R from 'ramda';
import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import type { Event, Events } from '@adobe/assurance-types';
import type { Branch, Branches } from '../types';

import TimingTree from './TimingTree';
import TimingViz from './TimingViz';

type TimingViewProps = {
  events: Events;
};

const TimingView = ({ events }: TimingViewProps) => {
  const eventMap = R.indexBy(R.path(['payload', 'ACPExtensionEventUniqueIdentifier']), events);
  const branches: Branches = R.reduce(
    (acc, event) => {
      let eventPointer: Event = event;

      // first, lets find all the chains that end with this event
      const chain: Event[] = [];

      do {
        chain.push(eventPointer);
        eventPointer = eventPointer.payload?.ACPExtensionEventParentIdentifier
          ? eventMap[eventPointer.payload.ACPExtensionEventParentIdentifier]
          : null;
      } while (eventPointer);

      chain.reverse();

      if (chain.length <= 1) {
        return acc;
      }

      // now we'll merge these events into the tree
      const newAcc = { ...acc };
      let accPointer = newAcc;

      for (let i = 0; i < chain.length; i++) {
        const putEvent: Event = chain[i];
        const eventId: string = putEvent.payload?.ACPExtensionEventUniqueIdentifier as string;
        accPointer[eventId] = accPointer[eventId] || { event: putEvent, children: {} };
        accPointer = accPointer[eventId].children;
      }

      return newAcc;
    },
    {},
    events
  );

  const detectLatestTS = (branch: Branch): number => {
    if (!branch.children || Object.values(branch.children).length === 0) {
      return (branch?.event?.timestamp as number) || 0;
    }

    return R.reduce(
      (acc, child) => {
        return Math.max(acc, detectLatestTS(child));
      },
      0,
      Object.values(branch.children)
    );
  };

  // now we need to detect the longest time in our branches for scaling the vizualization
  const longestTime = R.reduce(
    (acc, branch) => {
      const branchTime = detectLatestTS(branch) - branch.event.timestamp;
      return Math.max(acc, branchTime);
    },
    0,
    Object.values(branches)
  );

  const SIZE = 300;
  const scale = Math.min((SIZE - 5) / longestTime, 0.3);

  return (
    <Flex direction="column" position="relative" data-testid="timing-view">
      {Object.values(branches).map((branch, index) => {
        return (
          <View backgroundColor={index % 2 ? undefined : 'gray-50'} key={`TimingView${index}`}>
            <Flex gap="size-200">
              <View
                borderEndColor="gray-300"
                borderEndWidth="thin"
                width={SIZE + 70}
                flexShrink={0}
              >
                <TimingViz branch={branch} scale={scale} />
              </View>
              <View marginY="size-200">
                <TimingTree branch={branch} path={[index]} />
              </View>
            </Flex>
          </View>
        );
      })}
    </Flex>
  );
};

export default TimingView;
