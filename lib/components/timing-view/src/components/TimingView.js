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
import * as R from 'ramda';
import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import TimingTree from './TimingTree';
import TimingViz from './TimingViz';
const PluginView = ({ events }) => {
    const eventMap = R.indexBy(R.path(['payload', 'ACPExtensionEventUniqueIdentifier']), events);
    const branches = R.reduce((acc, event) => {
        let eventPointer = event;
        // first, lets find all the chains that end with this event
        const chain = [];
        do {
            chain.push(eventPointer);
            eventPointer = eventPointer.payload?.ACPExtensionEventParentIdentifier ?
                eventMap[eventPointer.payload.ACPExtensionEventParentIdentifier] : null;
        } while (eventPointer);
        chain.reverse();
        if (chain.length <= 1) {
            return acc;
        }
        // now we'll merge these events into the tree
        const newAcc = { ...acc };
        let accPointer = newAcc;
        for (let i = 0; i < chain.length; i++) {
            const putEvent = chain[i];
            const eventId = putEvent.payload?.ACPExtensionEventUniqueIdentifier;
            accPointer[eventId] = accPointer[eventId] || { event: putEvent, children: {} };
            accPointer = accPointer[eventId].children;
        }
        return newAcc;
    }, {}, events);
    const detectLatestTS = (branch) => {
        if (!branch.children || Object.values(branch.children).length === 0) {
            return branch?.event?.timestamp || 0;
        }
        return R.reduce((acc, child) => {
            return Math.max(acc, detectLatestTS(child));
        }, 0, Object.values(branch.children));
    };
    // now we need to detect the longest time in our branches for scaling the vizualization
    const longestTime = R.reduce((acc, branch) => {
        const branchTime = detectLatestTS(branch) - branch.event.timestamp;
        return Math.max(acc, branchTime);
    }, 0, Object.values(branches));
    const SIZE = 300;
    const scale = Math.min((SIZE - 5) / longestTime, .3);
    return (React.createElement(Flex, { direction: "column", position: "relative" }, Object.values(branches).map((branch, index) => {
        return (React.createElement(View, { backgroundColor: index % 2 ? undefined : 'gray-50' },
            React.createElement(Flex, { gap: "size-200" },
                React.createElement(View, { borderEndColor: "gray-300", borderEndWidth: "thin", width: SIZE + 70, flexShrink: 0 },
                    React.createElement(TimingViz, { branch: branch, scale: scale })),
                React.createElement(View, { marginY: "size-200" },
                    React.createElement(TimingTree, { branch: branch, path: [index] })))));
    })));
};
export default PluginView;
