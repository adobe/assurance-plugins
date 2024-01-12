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

import * as kit from '@adobe/griffon-toolkit';
import * as R from 'ramda';
import { logEvent } from '@adobe/griffon-toolkit-common';
import sortEvents from './event.sort';
import { Events, EventFilterConfig, ValidationRecords } from '../types';

export const parseFilters = (shouldFilter, filters, ignoreFilters) => {
  if (!shouldFilter) {
    return {};
  }
  let useFilters = filters;
  if (ignoreFilters && ignoreFilters.length) {
    R.forEach(without => {
      useFilters = R.dissoc(without, useFilters);
    }, ignoreFilters);
  }
  return useFilters;
};

export const parseCustomMatchers = matchers => {
  let useFilters = {};
  let customCount = 0;

  R.forEach(matcher => {
    useFilters = R.assoc(`custom${++customCount}`, matcher, useFilters);
  }, matchers || []);
  return useFilters;
};

export const parseHideLogs = hideLogs => {
  if (!hideLogs) {
    return {};
  }
  return { hideLogs: kit.not(logEvent.matcher) };
};

export default (
  config: EventFilterConfig,
  events: Events,
  filters,
  validation?: ValidationRecords
) => {
  let results = events || [];

  const filtersData = {
    ...parseFilters(config.filtered, filters, config.ignoreFilters),
    ...parseCustomMatchers(config.matchers),
    ...parseHideLogs(config.hideLogs)
  };

  if (Object.keys(filtersData).length) {
    results = kit.filterData(filtersData, results);
  }
  if (config.sorted) {
    results = sortEvents(results);
  }
  if (config.validations) {
    results = R.map(event => R.assoc('validation', validation?.[event.uuid], event), results);
  }
  return results;
};
