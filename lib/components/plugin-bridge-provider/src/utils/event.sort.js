/*
 * ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *   Copyright 2020 Adobe Systems Incorporated
 *   All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 * ************************************************************************
 */
import * as R from 'ramda';
const eventNumberSorter = (a, b) => (a.timestamp < b.timestamp ? -1
    : (a.timestamp > b.timestamp ? 1
        : (a.eventNumber < b.eventNumber ? -1
            : (a.eventNumber > b.eventNumber ? 1 : 0))));
export default R.sort(eventNumberSorter);
