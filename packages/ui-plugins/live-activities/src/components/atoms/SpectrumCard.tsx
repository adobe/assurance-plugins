import React from 'react';
import { useHover } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';

interface SpectrumCardProps {
  children: React.ReactNode;
  isSelected?: boolean;
  isQuiet?: boolean;
  onPress?: () => void;
  UNSAFE_style?: React.CSSProperties;
  marginBottom?: string;
  marginTop?: string;
  marginStart?: string;
  marginEnd?: string;
  margin?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingStart?: string;
  paddingEnd?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  flex?: string | number;
  'data-testid'?: string;
}

function SpectrumCard({
  children,
  isSelected = false,
  isQuiet = false,
  onPress,
  UNSAFE_style,
  marginBottom,
  marginTop,
  marginStart,
  marginEnd,
  margin,
  padding = 'size-200',
  paddingTop,
  paddingBottom,
  paddingStart,
  paddingEnd,
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  flex,
  'data-testid': testId,
  ...otherProps
}: SpectrumCardProps) {
  const { hoverProps, isHovered } = useHover({});
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  
  const isInteractive = !!onPress;
  
  // Base card styles following Spectrum guidelines
  const baseStyles: React.CSSProperties = {
    border: '1px solid #d1d5db', // gray-300 equivalent
    borderRadius: '6px',
    backgroundColor: '#f9fafb', // gray-50 equivalent
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    cursor: isInteractive ? 'pointer' : 'default',
    outline: 'none',
    padding: '12px',
    marginBottom: '8px',
    position: 'relative',
    zIndex: 1,
    pointerEvents: 'auto',
    ...UNSAFE_style
  };

  // Selection state styles
  if (isSelected) {
    baseStyles.borderColor = '#3b82f6'; // blue-500
    baseStyles.backgroundColor = '#dbeafe'; // blue-100
    baseStyles.boxShadow = '0 0 0 2px #3b82f6, 0 2px 6px rgba(0, 0, 0, 0.15)';
  }

  // Hover state styles
  if (isHovered && isInteractive && !isSelected) {
    baseStyles.borderColor = '#6b7280'; // gray-500
    baseStyles.backgroundColor = '#f3f4f6'; // gray-100
    baseStyles.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
  }

  // Focus state styles
  if (isFocusVisible) {
    baseStyles.boxShadow = '0 0 0 2px #3b82f6';
  }

  // Quiet variant styles
  if (isQuiet) {
    baseStyles.border = 'none';
    baseStyles.backgroundColor = 'transparent';
    baseStyles.boxShadow = 'none';
  }

  const cardProps = mergeProps(
    hoverProps,
    focusProps,
    {
      role: isInteractive ? 'button' : undefined,
      tabIndex: isInteractive ? 0 : undefined,
      onClick: (e: React.MouseEvent) => {
        if (onPress) {
          onPress();
        }
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onPress?.();
        }
      },
      'data-testid': testId,
      ...otherProps
    }
  );

  return (
    <div
      {...cardProps}
      style={baseStyles}
    >
      {children}
    </div>
  );
}

export default SpectrumCard;
