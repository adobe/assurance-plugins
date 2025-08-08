import { View } from '@adobe/react-spectrum';
import React from 'react';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      UNSAFE_style={{
        border: '1px solid var(--spectrum-global-color-gray-400)',
        borderRadius: '8px',
        padding: '8px',
        backgroundColor: 'white'
      }}
    >
      {children}
    </View>
  );
}

export default Card;
