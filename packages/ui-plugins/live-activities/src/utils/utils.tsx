import React from 'react';
import { UnknownBadge } from '../components/atoms/UnknownBadge';

/**
 * Utility function to render values with proper fallback handling.
 * @param value - The value to render
 * @returns Rendered value or UnknownBadge for null/undefined values
 */
export function renderValue(value: any): React.ReactNode {
  if (value == null || value === 'N/A') {
    return <UnknownBadge />;
  }
  return String(value);
}