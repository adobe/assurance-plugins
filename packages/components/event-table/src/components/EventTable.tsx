/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2025 Adobe
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
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@adobe/react-spectrum";
import type { Key } from "@react-types/shared";
import { Event } from "@assurance/common-utils";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

/**
 * Props that can be supplied to the event table
 */
export interface EventTableProps {
  /** A list of columns to be used in the table */
  columns: ColumnDef<any, any>[];
  /** Events to be displayed in the table */
  data: Event[];
  /** Enables debug events emitted by React Table */
  enableDebug?: boolean;
  /** Callback when selection changes */
  onSelectionChange?: (selectedKeys: 'all' | Set<Key>) => void;
  /** Currently selected rows */
  selectedKeys?: 'all' | Set<Key>;
}

const EventTable = ({ columns, data, enableDebug = true, onSelectionChange, selectedKeys }: EventTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    debugTable: enableDebug,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleSelectionChange = (keys: 'all' | Set<Key>) => {
    if (onSelectionChange) {
      onSelectionChange(keys);
    }
  };

  return (
    <TableView
      selectionMode="single"
      selectionStyle="highlight"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      height="100%"
      sortDescriptor={{
        column: sorting[0]?.id,
        direction: sorting[0]?.desc ? "descending" : "ascending",
      }}
    >
      <TableHeader>
        {table.getFlatHeaders().map((header) => (
          <Column key={header.id} isRowHeader allowsResizing>
            <div onClick={header.column.getToggleSortingHandler()}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          </Column>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row, index) => {
          const event = row.original as any;
          const rowKey = event?.uuid || row.id;
          return (
            <Row key={rowKey}>
              {row.getVisibleCells().map((cell) => (
                <Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              ))}
            </Row>
          );
        })}
      </TableBody>
    </TableView>
  );
};

export default EventTable;
