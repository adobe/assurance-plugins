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

const PluginView = ({ children }) => (
  <Flex direction="column" position="absolute" width="100%" height="100%" left={0} top={0}>
    <View width="100%" height={10} flexGrow={5} overflow="auto">
      {children[0]}
    </View>
    <View width="100%" flexGrow={0} flexShrink={0}>
      {children[1]}
    </View>
  </Flex>
);

export default PluginView;
