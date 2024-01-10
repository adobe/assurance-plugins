/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2024 Adobe
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

import React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import { TimelineToolbar, PluginView } from '../src';
import { PluginBridgeProvider } from '@adobe/assurance-plugin-bridge-provider';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { initBridge, setupBridge, receiveSelectedEvents, receiveEvents, navigateTo as receiveNavigation, receiveSession } from '@adobe/assurance-testing-library';
import { EVENTS, SINGLE_CLIENT_EVENTS } from './mocks';
import { lifecycleStart, trackAction } from '@adobe/griffon-toolkit-aep-mobile';
import { AssuranceSession } from '@adobe/assurance-types';

describe('TimelineToolbar', () => {
  let offsetWidth, offsetHeight;

  beforeAll(function () {
    // browser size so the table rows and columns render
    offsetWidth = jest.spyOn(window.HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => 1000);
    offsetHeight = jest.spyOn(window.HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => 1000);
    jest.useFakeTimers();
  });

  afterAll(function () {
    offsetWidth.mockReset();
    offsetHeight.mockReset();
  });

  afterEach(() => {
    act(() => jest.runAllTimers());
  });

  const start = async (props = {}) => {
    setupBridge();
    render(
      <Provider theme={defaultTheme} colorScheme="light">
        <PluginBridgeProvider>
          <PluginView>
            <div>Plugin Goes Here</div>
            <TimelineToolbar {...props} />
          </PluginView>
        </PluginBridgeProvider>
      </Provider>
    );
    await initBridge();
    act(() => {jest.runAllTimers();});
  };

  it('renders the toolbar', async () => {
    await start();
    receiveEvents(EVENTS);

    expect(screen.getAllByTestId('scrubber-line').length).toBe(10);

    // one tick for every 5 events
    expect(screen.getAllByTestId('scrubber-tick').length).toBe(2); 
  });

  it('renders zero state', async () => {
    await start();
    receiveEvents([]);

    
    expect(screen.queryAllByTestId('scrubber-line').length).toBe(0);
    expect(screen.getByText('No events')).toBeInTheDocument();
    
  });

  it('can select events', async () => {
    await start();
    receiveEvents(EVENTS);
    const lines = screen.getAllByTestId('scrubber-line');
    within(lines[4]).getByRole('button').click();

    expect(window.pluginBridge.selectEvents).toHaveBeenCalledWith(['EVENT_#23']);
  });

  it('can display selected events', async () => {
    await start();
    receiveEvents(EVENTS);
    await receiveSelectedEvents([EVENTS[4]]);
    expect(screen.getByTestId('event-label')).toHaveTextContent('Lifecyle Start');

    const lines = screen.getAllByTestId('scrubber-line');
    expect(within(lines[2]).getByTestId('scrubber-highlight-blue-400')).toBeInTheDocument();
  });

  it('can clear selected events', async () => {
    await start();
    receiveEvents(EVENTS);
    await receiveSelectedEvents([EVENTS[4]]);
    screen.getAllByLabelText('Clear selected events')[0].click();
    expect(window.pluginBridge.selectEvents).toHaveBeenCalledWith([]);
  });

  it('can handle multiple selected events', async () => {
    await start();
    receiveEvents(EVENTS);
    await receiveSelectedEvents([EVENTS[4], EVENTS[5]]);
    expect(screen.getByTestId('event-label')).toHaveTextContent('Multiple selected events');
  
    const lines = screen.getAllByTestId('scrubber-line');
    expect(within(lines[2]).getByTestId('scrubber-highlight-blue-400')).toBeInTheDocument();
    expect(within(lines[3]).getByTestId('scrubber-highlight-blue-400')).toBeInTheDocument();
  });

  it('supports JMESPath highlights', async () => {
    await start({
      highlights: [
        { matcher: lifecycleStart.matcher },
        { matcher: trackAction.matcher, color: 'red-400' },
      ]
    });
    receiveEvents(EVENTS);
    
    const lines = screen.getAllByTestId('scrubber-line');
    
    expect(within(lines[1]).getByTestId('scrubber-highlight-gray-200')).toBeInTheDocument();
    expect(within(lines[2]).getByTestId('scrubber-highlight-gray-300')).toBeInTheDocument();
    expect(within(lines[3]).getByTestId('scrubber-highlight-red-400')).toBeInTheDocument();
    expect(within(lines[4]).getByTestId('scrubber-highlight-red-400')).toBeInTheDocument();
  });
  
  it('it can clear a session', async () => {
    await start();
    receiveEvents(EVENTS);

    screen.getByLabelText('Filter menu').click();
    act(() => {jest.runAllTimers();});

    const menu = screen.getByRole('menu');    
    const items = within(menu).getAllByRole('menuitem');
    expect(items[0]).toHaveTextContent('Clear session');
    items[0].click();

    const call = window.pluginBridge.annotateSession.mock.calls[0][0];
    expect(call.annotations.clearSessionTS).toBeTruthy();
  });

  it('it can restore a session', async () => {
    await start();
    receiveEvents(EVENTS);

    screen.getByLabelText('Filter menu').click();
    act(() => {jest.runAllTimers();});

    const menu = screen.getByRole('menu');    
    const items = within(menu).getAllByRole('menuitem');
    expect(items[1]).toHaveTextContent('Restore session');
    items[1].click();
    const call = window.pluginBridge.annotateSession.mock.calls[0][0];
    console
    expect(call.annotations.clearSessionTS).toBe(0);
  });

  it('shows client when single', async () => {
    await start();
    receiveEvents(SINGLE_CLIENT_EVENTS);

    expect(screen.getByTestId('client-text')).toHaveTextContent('iPhone X2');

  });

  it('can filter when multiple', async () => {
    await start();
    receiveEvents(EVENTS);
    receiveNavigation('event-list#');    

    const picker = screen.getByTestId('client-picker');
    expect(picker).toHaveTextContent('All clients');
    picker.click();
    act(() => jest.runAllTimers());

    const listbox = screen.getByRole('listbox');    
    const items = within(listbox).getAllByRole('option');
    expect(items[0]).toHaveTextContent('All clients');
    expect(items[1]).toHaveTextContent('Test Device');
    expect(items[2]).toHaveTextContent('iPhone X2');
    items[2].click();

    expect(window.pluginBridge.navigateTo).toHaveBeenCalledWith('event-list#filters=eyJjbGllbnRzIjoiY2xpZW50SWQgPT0gYGVmZ2AifQ==');
  });

  it('filters events from client filter', async () => {
    await start();
    receiveEvents(EVENTS);
    receiveNavigation('event-list#filters=eyJjbGllbnRzIjoiY2xpZW50SWQgPT0gYGVmZ2AifQ==');
    expect(screen.getAllByTestId('scrubber-line').length).toBe(2);

    const picker = screen.getByTestId('client-picker');
    expect(picker).toHaveTextContent('iPhone X2');
  });
});


