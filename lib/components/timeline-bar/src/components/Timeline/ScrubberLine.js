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
import { Flex, View, TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';
import { chooseEventLabel, getTimestampText } from "@adobe/assurance-common-utils";
import React from 'react';
const BOX_HEIGHT = 16;
const SCRUBBER_LINE_HEIGHT = 24;
const ScrubberLine = ({ highlightColor, onPress, event, isSelected, eventSize, index }) => (React.createElement(View, { position: "absolute", left: eventSize * index, width: eventSize, height: SCRUBBER_LINE_HEIGHT + 4, top: 0 },
    !((index + 1) % 5) && (React.createElement(View, { "data-testid": "scrubber-tick", backgroundColor: "gray-400", position: "absolute", height: SCRUBBER_LINE_HEIGHT, top: 12, width: 2, left: "calc(50% - 1px)" })),
    !((index + 1) % 25) && (React.createElement(View, { position: "absolute", top: 0, left: "50%", UNSAFE_style: { fontSize: '8px', transform: 'translateX(-50%)' } }, index + 1)),
    React.createElement(View, { marginTop: 16 },
        React.createElement(TooltipTrigger, { delay: 50 },
            React.createElement(ActionButton, { onPress: onPress, isQuiet: true, width: "100%", minWidth: "100%", height: BOX_HEIGHT, UNSAFE_style: { border: 'none' } },
                React.createElement(View, { backgroundColor: isSelected ? 'blue-400' : highlightColor || 'gray-300', position: "absolute", height: BOX_HEIGHT, width: "100%" },
                    React.createElement(View, { height: BOX_HEIGHT, width: "100%", backgroundColor: "gray-50", borderColor: 'gray-400', borderWidth: "thin", UNSAFE_style: {
                            opacity: .2,
                            fontWeight: 'bold',
                            fontSize: 11,
                            userSelect: 'none',
                        } },
                        React.createElement(Flex, { alignItems: "center", justifyContent: "center" }, event.hidden ? 'X' : event.important ? '!' : '')))),
            React.createElement(Tooltip, null,
                React.createElement("div", null, chooseEventLabel(event)),
                React.createElement("div", { style: { fontSize: 11 } }, getTimestampText(event.timestamp)))))));
export default ScrubberLine;
