import React from "react";

function UnknownBadge({ message }: { message: string }) {
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

export default UnknownBadge;