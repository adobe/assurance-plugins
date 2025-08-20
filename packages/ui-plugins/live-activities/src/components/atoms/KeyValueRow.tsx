import React from 'react';

export const tableStyles = {
    table: { width: '100%', borderCollapse: 'collapse' as const },
    row: { borderBottom: '1px solid #e1e1e1' },
    labelCell: { fontWeight: 500, padding: '12px 16px' },
    valueCell: { padding: '12px 16px' },
    wrapValueCell: { padding: '12px 16px', maxWidth: '300px', wordBreak: 'break-all' as const }
  };
  
export function KeyValueRow({ label, children, wrap = false }: { label: string; children: React.ReactNode; wrap?: boolean }) {
    return (
      <tr style={tableStyles.row}>
        <td style={tableStyles.labelCell}>{label}</td>
        <td style={wrap ? tableStyles.wrapValueCell : tableStyles.valueCell}>{children}</td>
      </tr>
    );
  }