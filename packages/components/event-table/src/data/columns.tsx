import { Event } from "@assurance/common-utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import React from "react";
import FlaggedCell from "../components/FlaggedCell";
import ValidationCell from "../components/ValidationCell";

export { type ColumnDef };

/** A utility function to generate ColumnDefs for events */
export const columnHelper = createColumnHelper<Event>();

/**
 * A column that will render a warning icon if an event has been detected to have a validation error
 */
export const validationColumn: ColumnDef<Event, any> = {
  accessorKey: "uuid",
  cell: (props) => <ValidationCell uuid={props.getValue()} />,
  header: "Validation",
  size: 24,
};

/**
 * Allows users to mark an event as flagged, and will also display a flag icon that will be filled when event is flagged
 */
export const flaggedColumn: ColumnDef<Event, any> = {
  cell: ({ row }) => <FlaggedCell annotations={row.original.annotations} />,
  header: "Flagged",
  size: 24,
};

/**
 * A column that displays the timestamp of the event in the format 'YYYY-MM-DD HH:mm:ss.SSS'
 */
export const timestampColumn = columnHelper.accessor("timestamp", {
  cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss.SSS"),
  enableResizing: true,
  enableSorting: true,
  header: "Timestamp",
  size: 250,
});

/**
 * A column that displays the vendor property of the event
 */
export const vendorColumn = columnHelper.accessor("vendor", {
  cell: (info) => info.getValue(),
  enableResizing: true,
  enableSorting: true,
  header: "Vendor",
  size: 200,
});

/**
 * Contains timestamp and vendor column definitions for easy use
 */
export const defaultColumns: ColumnDef<Event, number>[] = [
  timestampColumn,
  vendorColumn,
  // columnHelper.accessor('type', {
  //   cell: info => info.getValue(),
  // }),
];
