import { View } from '@adobe/react-spectrum';
import React from 'react';
import styles from './card.css';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      UNSAFE_className={styles.card}
    >
      {children}
    </View>
  );
}

export default Card;
