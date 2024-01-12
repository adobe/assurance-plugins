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

import { pluck } from 'ramda';
import React, { useEffect, useMemo } from 'react';
import {
  ActionButton,
  View,
  Flex,
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell
} from '@adobe/react-spectrum';
import TreeCollapse from '@spectrum-icons/workflow/TreeCollapse';
import TreeExpand from '@spectrum-icons/workflow/TreeExpand';
import { FlatDataRecord, filterUnexpanded } from '@adobe/assurance-nested-table-toolkit';

type DataViewerProps = {
  autoExpand?: boolean;
  data: FlatDataRecord[];
};

type SelectedDataRecord = {
  selected: boolean;
} & FlatDataRecord;

const DataViewerColumnHeader = ({ column, allSelected, onToggleAll }) => {
  if (column.uid === 'recordKey') {
    const Icon = allSelected ? TreeCollapse : TreeExpand;

    return (
      <Flex alignItems="center" gap="size-100">
        <ActionButton
          onPress={onToggleAll}
          isQuiet
          minWidth={20}
          width={20}
          minHeight={20}
          height={20}
        >
          <Icon size="S" />
        </ActionButton>
        {column.name}
      </Flex>
    );
  }
  return <>{column.name}</>;
};

const DataViewerCell = ({ columnKey, item }) => {
  if (columnKey === 'recordKey') {
    const Icon = item.selected ? TreeCollapse : TreeExpand;

    return (
      <Flex alignItems="center" gap="size-100" marginStart={24 * item.parents.length}>
        {item.hasChildren ? <Icon size="S" /> : <View width={18} />}
        {item[columnKey]}
      </Flex>
    );
  }
  return <>{item[columnKey]}</>;
};

const DataViewerTable = ({ data, autoExpand }: DataViewerProps) => {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [hasAutoExpanded, setHasAutoExpanded] = React.useState<boolean>(false);
  const [rows, setRows] = React.useState<SelectedDataRecord[]>([]);
  const columns = [
    { name: 'Key', uid: 'recordKey', width: 300 },
    { name: 'Value', uid: 'value' }
  ];

  const expandAll = () => {
    setExpanded(pluck('id', data || []) as string[]);
  };
  const collapseAll = () => {
    setExpanded([]);
  };

  useEffect(() => {
    if (autoExpand && !hasAutoExpanded) {
      expandAll();
      setHasAutoExpanded(true);
    }
  }, [autoExpand, data]);

  useEffect(() => {
    // add a selected flag. Mostly to cause table to redraw
    const selectedData: SelectedDataRecord[] = (data || []).map(
      item =>
        ({
          ...item,
          selected: expanded && expanded.indexOf(item.id) >= 0
        } as SelectedDataRecord)
    );
    setRows(selectedData);
  }, [data, expanded]);

  const filtered = useMemo(() => {
    return filterUnexpanded(expanded, rows || []);
  }, [rows, expanded]);

  return (
    <TableView
      aria-label="Table with controlled selection"
      selectionMode="single"
      selectionStyle="highlight"
      density="spacious"
      selectedKeys={[]}
      onSelectionChange={ids => {
        const id = Array.from(ids)[0] as string;
        const index = expanded.indexOf(id);
        const newExpanded = [...expanded];
        if (index >= 0) {
          newExpanded.splice(index, 1);
        } else {
          newExpanded.push(id);
        }

        setExpanded(newExpanded);
      }}
    >
      <TableHeader columns={columns}>
        {column => (
          <Column key={column.uid} align={column.uid === 'level' ? 'end' : 'start'}>
            <DataViewerColumnHeader
              column={column}
              allSelected={expanded.length === data?.length}
              onToggleAll={() => {
                if (expanded.length === data?.length) {
                  collapseAll();
                } else {
                  expandAll();
                }
              }}
            />
          </Column>
        )}
      </TableHeader>
      <TableBody items={filtered}>
        {item => (
          <Row>
            {columnKey => (
              <Cell>
                <DataViewerCell columnKey={columnKey} item={item} />
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </TableView>
  );
};

export default DataViewerTable;
