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
import { pluck } from 'ramda';
import React, { useEffect, useMemo } from 'react';
import { ActionButton, View, Flex, TableView, TableHeader, Column, TableBody, Row, Cell } from '@adobe/react-spectrum';
import TreeCollapse from '@spectrum-icons/workflow/TreeCollapse';
import TreeExpand from '@spectrum-icons/workflow/TreeExpand';
import { filterUnexpanded } from '@adobe/assurance-nested-table-toolkit';
const DataViewerColumnHeader = ({ column, allSelected, onToggleAll }) => {
    if (column.uid === 'recordKey') {
        const Icon = allSelected ? TreeCollapse : TreeExpand;
        return (React.createElement(Flex, { alignItems: "center", gap: "size-100" },
            React.createElement(ActionButton, { onPress: onToggleAll, isQuiet: true, minWidth: 20, width: 20, minHeight: 20, height: 20 },
                React.createElement(Icon, { size: "S" })),
            column.name));
    }
    return React.createElement(React.Fragment, null, column.name);
};
const DataViewerCell = ({ columnKey, item }) => {
    if (columnKey === 'recordKey') {
        const Icon = item.selected ? TreeCollapse : TreeExpand;
        return (React.createElement(Flex, { alignItems: "center", gap: "size-100", marginStart: 24 * item.parents.length },
            item.hasChildren ? React.createElement(Icon, { size: "S" }) : React.createElement(View, { width: 18 }),
            item[columnKey]));
    }
    return React.createElement(React.Fragment, null, item[columnKey]);
};
const DataViewerTable = ({ data, autoExpand }) => {
    const [expanded, setExpanded] = React.useState([]);
    const [hasAutoExpanded, setHasAutoExpanded] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    let columns = [
        { name: 'Key', uid: 'recordKey', width: 300 },
        { name: 'Value', uid: 'value' }
    ];
    const expandAll = () => { setExpanded(pluck('id', data || [])); };
    const collapseAll = () => { setExpanded([]); };
    useEffect(() => {
        if (autoExpand && !hasAutoExpanded) {
            expandAll();
            setHasAutoExpanded(true);
        }
    }, [autoExpand, data]);
    useEffect(() => {
        // add a selected flag. Mostly to cause table to redraw
        const selectedData = (data || []).map(item => ({
            ...item,
            selected: (expanded && expanded.indexOf(item.id) >= 0)
        }));
        setRows(selectedData);
    }, [data, expanded]);
    if (!rows) {
        return null;
    }
    const filtered = useMemo(() => {
        return filterUnexpanded(expanded, rows);
    }, [rows, expanded]);
    console.log(filtered);
    return (React.createElement(TableView, { "aria-label": "Table with controlled selection", selectionMode: "single", selectionStyle: "highlight", density: "spacious", selectedKeys: [], onSelectionChange: (ids) => {
            const id = Array.from(ids)[0];
            const index = expanded.indexOf(id);
            console.log(id, index, expanded);
            let newExpanded = [...expanded];
            if (index >= 0) {
                newExpanded.splice(index, 1);
            }
            else {
                newExpanded.push(id);
            }
            setExpanded(newExpanded);
        } },
        React.createElement(TableHeader, { columns: columns }, (column) => (React.createElement(Column, { key: column.uid, align: column.uid === 'level' ? 'end' : 'start' },
            React.createElement(DataViewerColumnHeader, { column: column, allSelected: expanded.length === data?.length, onToggleAll: () => {
                    if (expanded.length === data?.length) {
                        collapseAll();
                    }
                    else {
                        console.log("Expand All");
                        expandAll();
                    }
                } })))),
        React.createElement(TableBody, { items: filtered }, (item) => (React.createElement(Row, null, (columnKey) => (React.createElement(Cell, null,
            React.createElement(DataViewerCell, { columnKey: columnKey, item: item }))))))));
};
export default DataViewerTable;
