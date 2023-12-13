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
import { selectEvents } from '@adobe/assurance-plugin-bridge-provider';
import EventTooltip from './EventTooltip';
import { COLORS } from './const';
const TimingVizRow = ({ size, chain, scale }) => {
    const start = chain[0].timestamp;
    const total = chain[chain.length - 1].timestamp - start;
    return (React.createElement(Flex, { gap: "size-150", alignItems: 'center' },
        React.createElement(Flex, { width: size, gap: 1, height: 50, alignItems: 'center' }, chain.map((event, index) => {
            const width = index === 0 ? 6 : Math.max((event.timestamp - chain[index - 1].timestamp) * scale, 6);
            return (React.createElement(EventTooltip, { event: event, width: width, height: 30, onPress: () => {
                    selectEvents([event.uuid]);
                } },
                React.createElement(View, { backgroundColor: COLORS[index], height: 30, minWidth: width, width: width, borderRadius: "small" })));
        })),
        React.createElement("div", { style: { fontSize: 10 } },
            total,
            " ms")));
};
const TimingViz = ({ branch, scale }) => {
    // flatten the tree into a list of chains
    const chains = [];
    let longestTime = 0;
    const flatten = (branch, chain) => {
        let newChain = chain ? [...chain] : [];
        newChain.push(branch.event);
        if (Object.keys(branch.children).length) {
            Object.values(branch.children).forEach((child) => flatten(child, newChain));
        }
        else {
            chains.push(newChain);
            longestTime = Math.max(longestTime, newChain[newChain.length - 1].timestamp - newChain[0].timestamp);
        }
    };
    flatten(branch);
    return (React.createElement(Flex, { direction: "column", gap: "size-100", marginY: "size-200" }, chains.map((chain) => React.createElement(TimingVizRow, { chain: chain, size: 300, scale: scale }))));
};
export default TimingViz;
