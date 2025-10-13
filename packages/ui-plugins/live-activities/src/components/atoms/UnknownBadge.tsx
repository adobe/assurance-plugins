import React from 'react';

export function UnknownBadge({ message = 'Unknown' }: { message?: string }) {
  return (
    <span
      style={{
        background: '#e34850',
        color: 'white',
        borderRadius: 4,
        padding: '2px 12px',
        fontWeight: 500
      }}
    >
      {message}
    </span>
  );
}