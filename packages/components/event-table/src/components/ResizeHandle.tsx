/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

import React from 'react';

import { useGripPosition } from '../hooks/useDynamicGripPosition';

interface ResizeHandleProps {
  /** Whether currently resizing */
  isResizing: boolean;
  /** Mouse down handler */
  onMouseDown: (e: React.MouseEvent) => void;
  /** Additional CSS class */
  className?: string;
  /** Whether the handle is disabled */
  disabled?: boolean;
  /** Whether the resize handle is visible */
  isVisible?: boolean;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  isResizing,
  onMouseDown,
  className = '',
  disabled = false,
  isVisible = true
}) => {
  // Use simple grip positioning based on click
  const { gripTop, gripVisible, containerRef, handleClick } = useGripPosition({
    isVisible
  });

  // Handle both click positioning and resize start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Position grip where user clicks
    handleClick(e);
    // Start resizing
    onMouseDown(e);
  };
  return (
    <div
      ref={containerRef}
      className={`resize-handle ${isResizing ? 'resizing' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onMouseDown={disabled ? undefined : handleMouseDown}
      style={{
        width: '4px',
        backgroundColor: isResizing ? 'var(--spectrum-accent-color-500)' : 'var(--spectrum-global-color-gray-200)',
        cursor: disabled ? 'default' : 'col-resize',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        zIndex: 10
      }}
    >
      {/* Visual grip indicators with rounded background */}
      {gripVisible && (
        <div
          style={{
            position: 'absolute',
            top: `${gripTop}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            opacity: disabled ? 0.3 : 1,
            padding: '8px 4px',
            backgroundColor: isResizing 
              ? 'var(--spectrum-global-color-blue-400)' 
              : 'var(--spectrum-global-color-gray-300)',
            borderRadius: '12px',
            minWidth: '16px',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            boxShadow: isResizing 
              ? '0 2px 8px rgba(0, 123, 255, 0.3)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                height: '3px',
                backgroundColor: isResizing 
                  ? 'var(--spectrum-global-color-static-white)' 
                  : 'var(--spectrum-global-color-gray-600)',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Hover effect overlay */}
      <div
        className="resize-handle-hover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--spectrum-global-color-blue-200)',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
          borderRadius: '2px'
        }}
      />
    </div>
  );
};

export default ResizeHandle;
