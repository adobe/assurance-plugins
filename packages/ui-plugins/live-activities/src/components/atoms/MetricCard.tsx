import React from 'react';
import { View, Text, Flex, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import Card from './card';

interface MetricCardProps {
  label: string;
  value: string | number;
  size?: 'S' | 'M' | 'L';
  tooltip?: string;
}

function MetricCard({ label, value, size = 'M', tooltip }: MetricCardProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'S':
        return {
          labelSize: 'size-100',
          valueSize: 'size-200'
        };
      case 'M':
        return {
          labelSize: 'size-200',
          valueSize: 'size-300'
        };
      case 'L':
        return {
          labelSize: 'size-300',
          valueSize: 'size-400'
        };
      default:
        return {
          labelSize: 'size-200',
          valueSize: 'size-300'
        };
    }
  };

  const { labelSize, valueSize } = getSizeStyles();

  const cardContent = (
    <Card>
      <View padding="size-200">
        <Flex direction="column" gap="size-100">
          <Text 
            UNSAFE_style={{ 
              fontSize: `var(--spectrum-global-dimension-${labelSize})`, 
              color: 'var(--spectrum-global-color-gray-700)' 
            }}
          >
            {label}
          </Text>
          <Text 
            UNSAFE_style={{ 
              fontSize: `var(--spectrum-global-dimension-${valueSize})`, 
              fontWeight: 'bold' 
            }}
          >
            {value}
          </Text>
        </Flex>
      </View>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipTrigger>
        {cardContent}
        <Tooltip>
          <Text>{tooltip}</Text>
        </Tooltip>
      </TooltipTrigger>
    );
  }

  return cardContent;
}

export default MetricCard;
