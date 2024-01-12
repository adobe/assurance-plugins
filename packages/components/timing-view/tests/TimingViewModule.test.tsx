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
import { render, screen, within } from '@testing-library/react';
import { TimingView } from '../src';
import { Event } from '@adobe/assurance-types';
import { initBridge, setupBridge, receiveSelectedEvents } from '@adobe/assurance-testing-library';
import { PluginBridgeProvider } from '@adobe/assurance-plugin-bridge-provider';

jest.mock('react-xarrows', () => props => {
  return (
    <div data-testid="xarrow">
      <span>from: {`${props.start}`}</span>
      <span>to: {`${props.end}`}</span>
    </div>
  );
});

const TestEvent1: Event = {
  uuid: 'TestEvent1',
  type: 'generic',
  eventNumber: 1,
  _internal_adb_props: {
    label: 'TestEvent1'
  },
  payload: {
    ACPExtensionEventUniqueIdentifier: 'TestEvent1'
  },
  timestamp: 1703188726000
};

const TestEvent2: Event = {
  uuid: 'TestEvent2',
  type: 'generic',
  eventNumber: 2,
  _internal_adb_props: {
    label: 'TestEvent2 chains to one'
  },
  payload: {
    ACPExtensionEventUniqueIdentifier: 'TestEvent2',
    ACPExtensionEventParentIdentifier: 'TestEvent1'
  },
  timestamp: 1703188727000
};

const TestEvent3: Event = {
  uuid: 'TestEvent3',
  type: 'generic',
  eventNumber: 3,
  _internal_adb_props: {
    label: 'TestEvent3 chains to one'
  },
  payload: {
    ACPExtensionEventUniqueIdentifier: 'TestEvent3',
    ACPExtensionEventParentIdentifier: 'TestEvent1'
  },
  timestamp: 1703188728000
};

describe('TimingView', () => {
  const start = async events => {
    setupBridge();
    render(
      <PluginBridgeProvider>
        <TimingView events={events} />
      </PluginBridgeProvider>
    );
    await initBridge();
  };

  it('handles single chains', async () => {
    await start([TestEvent1, TestEvent2]);

    // validate the left bar
    const vizRows = screen.getAllByTestId('timingVizRow');
    expect(vizRows.length).toEqual(1);
    expect(vizRows[0]).toHaveTextContent('1000 ms');

    const buttons = within(vizRows[0]).getAllByTestId('event-tooltip');
    expect(buttons.length).toEqual(2);
    expect(buttons[0]).toHaveStyle('width: 6px');
    expect(buttons[1]).toHaveStyle('width: 295px');

    // validate the right viz
    const xarrow = screen.getByTestId('xarrow');
    expect(xarrow).toHaveTextContent('from: TimingTree-0to: TimingTree-0-0');
  });

  it('handles branching chains', async () => {
    await start([TestEvent1, TestEvent2, TestEvent3]);

    const vizRows = screen.getAllByTestId('timingVizRow');
    expect(vizRows.length).toEqual(2);
    expect(vizRows[0]).toHaveTextContent('1000 ms');
    expect(vizRows[1]).toHaveTextContent('2000 ms');

    let buttons = within(vizRows[0]).getAllByTestId('event-tooltip');
    expect(buttons.length).toEqual(2);
    expect(buttons[0]).toHaveStyle('width: 6px');
    expect(buttons[1]).toHaveStyle('width: 147.5px');

    buttons = within(vizRows[1]).getAllByTestId('event-tooltip');
    expect(buttons.length).toEqual(2);
    expect(buttons[0]).toHaveStyle('width: 6px');
    expect(buttons[1]).toHaveStyle('width: 295px');

    // validate the right viz
    const xarrow = screen.getAllByTestId('xarrow');
    expect(xarrow[0]).toHaveTextContent('from: TimingTree-0to: TimingTree-0-0');
    expect(xarrow[1]).toHaveTextContent('from: TimingTree-0to: TimingTree-0-1');
  });

  it('selects events', async () => {
    await start([TestEvent1, TestEvent2]);
    const vizRows = screen.getAllByTestId('timingVizRow');
    const buttons = within(vizRows[0]).getAllByTestId('event-tooltip');
    buttons[1].click();

    expect(window.pluginBridge.selectEvents).toHaveBeenCalledTimes(1);
    expect(window.pluginBridge.selectEvents).toHaveBeenCalledWith(['TestEvent2']);

    const timingTrees = screen.getAllByTestId('timing-tree');
    const treeButton = within(timingTrees[0]).getAllByTestId('event-tooltip');
    treeButton[0].click();

    expect(window.pluginBridge.selectEvents).toHaveBeenCalledTimes(2);
    expect(window.pluginBridge.selectEvents).toHaveBeenCalledWith(['TestEvent1']);
  });

  it('highlights selected events', async () => {
    await start([TestEvent1, TestEvent2]);

    expect(screen.queryByTestId('timing-button-selected')).not.toBeInTheDocument();
    await receiveSelectedEvents([TestEvent2]);

    expect(screen.queryByTestId('timing-button-selected')).toBeInTheDocument();
  });
});
