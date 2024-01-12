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
import { Tooltip, TooltipTrigger, ActionButton } from '@adobe/react-spectrum';
import { Event, chooseEventLabel, getTimestampText } from '@adobe/assurance-common-utils';

type EventTooltipProps = {
  onPress: () => void;
  event: Event;
  children: React.ReactNode;
  width: number;
  height: number;
  id?: string;
};

const EventTooltip = ({ onPress, event, children, width, height, id }: EventTooltipProps) => (
  <TooltipTrigger delay={50}>
    <ActionButton
      id={id}
      data-testid="event-tooltip"
      onPress={onPress}
      isQuiet
      minWidth={width}
      maxWidth={width}
      width={width}
      height={height}
      UNSAFE_style={{ border: 'none' }}
    >
      {children}
    </ActionButton>
    <Tooltip>
      <div>{chooseEventLabel(event)}</div>
      <div style={{ fontSize: 11 }}>{getTimestampText(event.timestamp)}</div>
    </Tooltip>
  </TooltipTrigger>
);

export default EventTooltip;
