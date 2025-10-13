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
import { flattenObject } from "@assurance/nested-table-toolkit";
import { pluck } from "ramda";
import React, { useEffect, useMemo } from "react";
import { EventData } from "../types";
import DataViewerTable from "./DataViewerTable";

type DataViewerProps = {
  autoExpand?: boolean;
  data: EventData[];
  showTooltips?: boolean;
  tooltipThreshold?: number;
};

const DataViewer = ({ data, autoExpand, showTooltips = false, tooltipThreshold = 50 }: DataViewerProps) => {
  const records = useMemo(() => {
    return (data || []).map((record) => {
      return {
        ...record,
        values: flattenObject(record.values),
      };
    });
  }, [data]);

  return (
    <DataViewerTable 
      data={records?.[0]?.values} 
      autoExpand={autoExpand}
      showTooltips={showTooltips}
      tooltipThreshold={tooltipThreshold}
    />
  );
};

export default DataViewer;
