import React from 'react';

import { KeyValueRow } from './KeyValueRow';

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  wrap?: boolean;
}

function InfoField({ label, value, wrap = false }: InfoFieldProps) {
  return (
    <KeyValueRow label={label} wrap={wrap}>
      {value}
    </KeyValueRow>
  );
}

export default InfoField;
