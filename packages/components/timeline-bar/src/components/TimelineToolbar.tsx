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
import FilterBar from './FilterBar';
import Timeline from './Timeline';
import { Highlights } from '../types';

export type TimelineToolbarProps = {
  highlights?: Highlights;
}

const TimelineToolbar = ({ 
  highlights
}: TimelineToolbarProps) => {
  return (
    <View borderTopWidth="thin" borderTopColor="mid">
      <Flex direction="column" gap="size-100" marginTop="size-100">
        <FilterBar />
        <Timeline highlights={highlights} />
      </Flex>
    </View>
  );
};

export default TimelineToolbar;
