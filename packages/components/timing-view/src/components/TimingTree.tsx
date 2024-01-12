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
import { selectEvents, useSelectedEvents } from '@adobe/assurance-plugin-bridge-provider';
import Xarrow from 'react-xarrows';
import EventTooltip from './EventTooltip';
import { chooseEventLabel } from '@adobe/assurance-common-utils';
import type { Event } from '@adobe/assurance-common-utils';
import { COLORS } from './const';
import { Branch } from '../types';

type TimingTreeProps = {
  column?: number;
  branch: Branch;
  path: number[];
  parentEvent?: Event;
};

const pathToId = path => `TimingTree-${path.join('-')}`;

const TimingTree = ({ branch, path, parentEvent }: TimingTreeProps) => {
  const timing = parentEvent && branch.event.timestamp - parentEvent?.timestamp;
  const selectedEvents = useSelectedEvents();
  const isSelected =
    (selectedEvents || []).findIndex(check => check.uuid === branch.event.uuid) >= 0;

  return (
    <Flex gap="size-800" alignItems="center" data-testid="timing-tree">
      <EventTooltip
        event={branch.event}
        width={150}
        height={60}
        id={pathToId(path)}
        onPress={() => {
          console.log('doselect');
          selectEvents([branch.event.uuid]);
        }}
      >
        <View
          data-testid={isSelected ? 'timing-button-selected' : 'timing-button-contents'}
          borderColor="blue-400"
          borderWidth={isSelected ? 'thicker' : undefined}
          backgroundColor={COLORS[path.length - 1] as Responsive<BackgroundColorValue>}
          borderRadius="medium"
          paddingY="size-50"
          paddingX="size-150"
          overflow="hidden"
          maxWidth={150}
          width={150}
          height={50}
        >
          <Flex direction="column" justifyContent="center" height="100%" gap="size-50">
            <div
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              {chooseEventLabel(branch.event)}
            </div>
            <Flex justifyContent="end" width="100%">
              <div style={{ fontSize: 10 }}>{timing || timing === 0 ? `${timing} ms` : null}</div>
            </Flex>
          </Flex>
        </View>
      </EventTooltip>
      {path.length > 1 && (
        <Xarrow
          start={pathToId(path.slice(0, -1))}
          end={pathToId(path)}
          headSize={6}
          strokeWidth={2}
          lineColor="#666666"
          headColor="#666666"
        />
      )}
      <Flex direction={'column'} gap="size-100">
        {Object.values(branch.children).map((child, index) => (
          <TimingTree
            key={`TimingTree${index}`}
            branch={child}
            path={[...path, index]}
            parentEvent={branch.event}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default TimingTree;
