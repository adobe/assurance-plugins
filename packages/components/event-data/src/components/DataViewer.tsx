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

import React, { useMemo } from 'react';
import { EventData } from '../types';
import DataViewerTable from './DataViewerTable';
import { flattenObject } from '@adobe/assurance-nested-table-toolkit';

type DataViewerProps = {
  autoExpand?: boolean;
  data: EventData[];
};

const DataViewer = ({ data, autoExpand }: DataViewerProps) => {
  const records = useMemo(() => {
    return (data || []).map(record => {
      return {
        ...record,
        values: flattenObject(record.values)
      };
    });
  }, [data]);

  return <DataViewerTable data={records?.[0]?.values} autoExpand={autoExpand} />;
};

export default DataViewer;
