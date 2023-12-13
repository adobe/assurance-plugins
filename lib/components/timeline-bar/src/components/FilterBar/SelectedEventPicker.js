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
import { Flex, Text } from "@adobe/react-spectrum";
import { useSelectedEvents } from "@adobe/assurance-plugin-bridge-provider";
import { chooseEventLabel } from "@adobe/assurance-common-utils";
const SelectedEventPicker = () => {
    const selected = useSelectedEvents();
    if (!selected || !selected[0]) {
        return null;
    }
    // TODO: Hightlights
    return (React.createElement(Flex, { gap: "size-200" }, selected.length > 1 ? (React.createElement(Text, null, "Multiple selected events")) : (React.createElement(Text, null, chooseEventLabel(selected[0])))));
};
export default SelectedEventPicker;
