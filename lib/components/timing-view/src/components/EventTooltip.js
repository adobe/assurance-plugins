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
import { Tooltip, TooltipTrigger, ActionButton } from "@adobe/react-spectrum";
import { chooseEventLabel, getTimestampText } from "@adobe/assurance-common-utils";
const EventTooltip = ({ onPress, event, children, width, height, id }) => (React.createElement(TooltipTrigger, { delay: 50 },
    React.createElement(ActionButton, { id: id, onPress: onPress, isQuiet: true, minWidth: width, maxWidth: width, width: width, height: height, UNSAFE_style: { border: 'none' } }, children),
    React.createElement(Tooltip, null,
        React.createElement("div", null, chooseEventLabel(event)),
        React.createElement("div", { style: { fontSize: 11 } }, getTimestampText(event.timestamp)))));
export default EventTooltip;
