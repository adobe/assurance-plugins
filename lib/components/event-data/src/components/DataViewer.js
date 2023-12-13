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
import React, { useMemo } from 'react';
import DataViewerTable from './DataViewerTable';
import { flattenObject } from '@adobe/assurance-nested-table-toolkit';
const DataViewer = ({ data, autoExpand }) => {
    const records = useMemo(() => {
        return (data || []).map((record) => {
            return {
                ...record,
                values: flattenObject(record.values)
            };
        });
    }, [data]);
    return (React.createElement(DataViewerTable, { data: records?.[0]?.values, autoExpand: autoExpand }));
};
export default DataViewer;
