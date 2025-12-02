import React from 'react';

import { View } from '@adobe/react-spectrum';

import './card.css';

function Card({ children }: { children: React.ReactNode }) {
  return <View UNSAFE_className="card">{children}</View>;
}

export default Card;
