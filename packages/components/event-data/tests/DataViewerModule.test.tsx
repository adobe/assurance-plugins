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

