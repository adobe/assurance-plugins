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
import { View, Flex, ActionButton } from "@adobe/react-spectrum";
import { selectEvents, useFilteredEvents, useSelectedEvents } from '@adobe/assurance-plugin-bridge-provider';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as kit from '@adobe/griffon-toolkit';
import { useScrollPosition, useScrollToCentered, useWindowSize } from './hooks';
import ScrubberLine from './ScrubberLine';
import CloseCircle from "@spectrum-icons/workflow/CloseCircle";
import Info from "@spectrum-icons/workflow/InfoOutline";
import { Highlights } from '../../types';

const EVENT_SIZE = 10;
const EXTRA_LINES = 50;
const BAR_HEIGHT = 56;

export const DEFAULT_HIGHLIGHT_COLOR = 'gray-300';

const getSelectedIndex = (selected, events) =>
  R.findIndex(
    check => check && check.uuid === (selected || {}).uuid,
    events || []
  ) || 0;

  export type TimelineProps = {
    highlights?: Highlights;
  }

const Timeline = ({
  highlights
}: TimelineProps) => {
  const [width, setWidth] = useState(0);
  const [barPosition, setBarPosition] = useState(0);

  const outer = useRef(null);
  const bar = useRef(null);

  const events = useFilteredEvents({ filtered: true });
  const selected = useSelectedEvents();

  useWindowSize();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setWidth((outer.current as any)?.clientWidth);
  }, [outer.current]);
  useScrollPosition(({ currPos }) => {
    setBarPosition(currPos);
  }, bar);
  const eventSize = EVENT_SIZE;

  const autoScrollPos = useMemo(() => {
    let pos = 0;
    if (selected && selected[0]) {
      const firstIndex = getSelectedIndex(selected[0], events);
      pos = firstIndex * eventSize;

      // with two events or more, center between first and second event
      if (selected.length > 1) {
        const secondIndex = getSelectedIndex(selected[1], events);
        const secondPos = secondIndex * eventSize;
        pos = (
          pos < secondPos ? secondPos - pos : pos - secondPos
        ) / 2 + pos;
      }
      return pos;
    }
    return eventSize * events.length;
  }, [events, selected]);

  useScrollToCentered(autoScrollPos, bar, outer);

  const isSelected = e => e && e.uuid && R.findIndex(
    row => row && row.uuid === e.uuid, selected || []
  ) >= 0;

  const isVisible = (index) => {
    const pos = index * eventSize;
    const padding = EXTRA_LINES * eventSize;

    return barPosition + width + padding > pos && barPosition - padding < pos;
  };

  const scrubberLines = useMemo(() => events.map(
    (e, index) => {
      if (isVisible(index)) {
        let highlight = '';
        
        highlights?.forEach(({ color, matcher }) => {
          if (kit.isMatch(matcher, e)) {
            highlight = color || DEFAULT_HIGHLIGHT_COLOR;
          }
        });

        return (
          <ScrubberLine
            key={e.uuid}
            index={index}
            highlightColor={highlight}
            event={e}
            onPress={() => {
              selectEvents([e.uuid]);
            }}
            isSelected={isSelected(e)}
            eventSize={eventSize}
          />
        );
      }
      return null;
    }
  ), [events, barPosition, width, selected]);

  return (
    <Flex gap="size-50" marginEnd={10}>
      <div 
        data-testid="timeline-outer"
        ref={outer}
        style={{
          height: BAR_HEIGHT,
          pointerEvents: 'none',
          width: 30,
          flexGrow: 5,
          position: 'relative',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: BAR_HEIGHT - 2,
            overflowX: 'scroll',
            overflowY: 'hidden',
            pointerEvents: 'auto'
          }} 
          ref={bar}
        >
          {events?.length ? (
            <View
              width={events.length * eventSize}
            >
              {scrubberLines}
            </View>
          ) : (
            <Flex width="100%" justifyContent="center" gap="size-100" alignItems="center">
              <Info size="S" />
              <span>No events</span>
            </Flex>
          )}
        </div>
      </div>
      {selected?.length ? (
        <View marginTop={8}>
          <ActionButton 
            isQuiet
            onPress={() => {
              selectEvents([]);
            }}
            aria-label='Clear selected events'
          >
            <CloseCircle size='S' />
          </ActionButton>
        </View>
      ) : null}       
    </Flex>
  )
};

export default Timeline;
