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
import type { Event } from '@adobe/assurance-common-utils';

const eventNumberSorter = (a: Event, b: Event): number =>
  a.timestamp < b.timestamp
    ? -1
    : a.timestamp > b.timestamp
    ? 1
    : a.eventNumber < b.eventNumber
    ? -1
    : a.eventNumber > b.eventNumber
    ? 1
    : 0;

export default R.sort(eventNumberSorter);
