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
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@adobe/react-spectrum";
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
}

const EventTable = ({ columns, data, enableDebug = true }: EventTableProps) => {
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

  return (
    <TableView
      selectionMode="multiple"
      selectionStyle="highlight"
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
        {table.getRowModel().rows.map((row) => (
          <Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </TableView>
  );
};

export default EventTable;
