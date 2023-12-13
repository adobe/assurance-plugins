/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
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
import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import ClientPicker from "./ClientPicker";
import SelectedEventPicker from "./SelectedEventPicker";
import FilterButtons from "./FilterButtons";
const FilterBar = () => (React.createElement(Flex, { direction: "row", marginStart: "size-200", marginEnd: 9 },
    React.createElement(View, { width: 200, flexGrow: 3 },
        React.createElement(ClientPicker, null)),
    React.createElement(SelectedEventPicker, null),
    React.createElement(Flex, { width: 200, flexGrow: 3, justifyContent: "right" },
        React.createElement(FilterButtons, null))));
export default FilterBar;
