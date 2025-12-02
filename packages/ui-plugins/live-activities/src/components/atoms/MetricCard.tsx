import React from 'react';

import { Flex, Text, Tooltip, TooltipTrigger, View } from '@adobe/react-spectrum';
import classNames from 'classnames';

import './MetricCard.css';
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
            UNSAFE_className={classNames(
              'labelText',
              `size${labelSize.charAt(0).toUpperCase() + labelSize.slice(1)}`
            )}
          >
            {label}
          </Text>
          <Text
            UNSAFE_className={classNames(
              'valueText',
              `size${valueSize.charAt(0).toUpperCase() + valueSize.slice(1)}`
            )}
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
