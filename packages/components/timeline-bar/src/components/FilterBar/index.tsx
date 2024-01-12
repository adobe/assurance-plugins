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

import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import ClientPicker from "./ClientPicker";
import SelectedEventLabel from "./SelectedEventLabel";
import FilterButtons from "./FilterButtons";

const FilterBar = () => (
  <Flex direction="row" marginStart="size-200" marginEnd={9}>
    <View width={200} flexGrow={3}><ClientPicker /></View>
    <SelectedEventLabel />
    <Flex width={200} flexGrow={3} justifyContent="right"><FilterButtons /></Flex>
  </Flex>
);

export default FilterBar;
