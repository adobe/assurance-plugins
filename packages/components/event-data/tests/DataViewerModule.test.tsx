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
import { render, screen, within, act } from "@testing-library/react";
import { MOCK_DATA } from './mockData';
import { EventDataViewer } from '../src';
import { defaultTheme, Provider } from '@adobe/react-spectrum';

describe('DataViewerModule', () => {
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
    act(() => {jest.runAllTimers();});
  });


  const start = (data, props = {}) => {
    render(
      <Provider theme={defaultTheme} colorScheme="light">
        <EventDataViewer data={data}  {...props} />
      </Provider>
    );
  };

  it('should render', () => {
    start(MOCK_DATA);
    // screen.debug(null, 100000);
    
    const rows = screen.getAllByRole('row');

    expect(rows.length).toBe(9);
    expect(rows[1]).toHaveTextContent('access_typemixed');
    expect(rows[6]).toHaveTextContent('input');
    expect(rows[8]).toHaveTextContent('typedevices');
  });

  it('should expand rows', () => {
    start(MOCK_DATA);
    let rows = screen.getAllByRole('row');
    
    act(() => { rows[6].click(); });
    act(() => {jest.runAllTimers();});

    rows = screen.getAllByRole('row');
    expect(rows.length).toBe(11);
    expect(rows[8]).toHaveTextContent('schemaIdhttps://ns.adobe.com/obumobile5/schemas/a22421fab52f780afac88d01a00e62b2461c068e1282640d');

    // hide the row
    act(() => { rows[6].click(); });
    act(() => {jest.runAllTimers();});
    rows = screen.getAllByRole('row');
    expect(rows.length).toBe(9);
  });

  it('should expand all', () => {
    start(MOCK_DATA);
    let rows = screen.getAllByRole('row');

    act(() => { within(rows[0]).getByRole('button').click(); });
    act(() => {jest.runAllTimers();});
    rows = screen.getAllByRole('row');
    expect(rows.length).toBe(21);

    // collapse
    act(() => { within(rows[0]).getByRole('button').click(); });
    act(() => {jest.runAllTimers();});
    rows = screen.getAllByRole('row');
    expect(rows.length).toBe(9);

  });

  it('allows autoexpand', () => {
    start(MOCK_DATA, { autoExpand: true });
    act(() => {jest.runAllTimers();});
    let rows = screen.getAllByRole('row');
    expect(rows.length).toBe(18);
  });
});

