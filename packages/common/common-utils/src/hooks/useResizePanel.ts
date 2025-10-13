/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2025 Adobe
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

import { useCallback, useEffect, useRef, useState } from 'react';

import { useDocumentStyles } from './useDocumentStyles';

export interface UseResizePanelOptions {
  /** Initial panel width in pixels */
  initialWidth?: number;
  /** Minimum panel width in pixels */
  minWidth?: number;
  /** Maximum panel width as percentage of container (0-1) */
  maxWidthPercentage?: number;
  /** Container width for percentage calculations */
  containerWidth?: number;
  /** Whether the panel is currently open */
  isOpen?: boolean;
  /** Callback when panel width changes */
  onWidthChange?: (width: number) => void;
  /** Panel position - 'left' or 'right' - affects resize direction */
  panelPosition?: 'left' | 'right';
}

export interface UseResizePanelReturn {
  /** Current panel width */
  panelWidth: number;
  /** Whether currently resizing */
  isResizing: boolean;
  /** Mouse down handler for resize handle */
  handleMouseDown: (e: React.MouseEvent) => void;
  /** Ref to attach to the resize handle */
  resizeHandleRef: React.RefObject<HTMLDivElement>;
  /** Ref to attach to the container for width calculations */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Update container width (call when container resizes) */
  updateContainerWidth: (width: number) => void;
  /** Set panel width programmatically */
  setPanelWidth: (width: number) => void;
}

export const useResizePanel = ({
  initialWidth = 400,
  minWidth = 200,
  maxWidthPercentage = 0.7,
  containerWidth = 0,
  isOpen = false,
  onWidthChange,
  panelPosition = 'left'
}: UseResizePanelOptions = {}): UseResizePanelReturn => {
  const [panelWidth, setPanelWidthState] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle document styles during resizing
  useDocumentStyles({
    isResizing,
    cursor: 'col-resize',
    disableTextSelection: true,
    disablePointerEvents: false
  });

  // Calculate constrained panel width based on container width and max percentage
  const constrainedPanelWidth = useCallback(() => {
    if (containerWidth === 0) return panelWidth;

    const maxAllowedWidth = Math.max(containerWidth * maxWidthPercentage, minWidth);
    return Math.min(panelWidth, maxAllowedWidth);
  }, [panelWidth, containerWidth, maxWidthPercentage, minWidth]);

  // Update panel width with constraints
  const setPanelWidth = useCallback(
    (width: number) => {
      const constrainedWidth = Math.max(
        minWidth,
        Math.min(width, containerWidth * maxWidthPercentage)
      );
      setPanelWidthState(constrainedWidth);
      onWidthChange?.(constrainedWidth);
    },
    [minWidth, containerWidth, maxWidthPercentage, onWidthChange]
  );

  // Handle mouse move during resize - using useRef to avoid stale closures
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>();
  const handleMouseUpRef = useRef<() => void>();

  // Update the refs when dependencies change
  useEffect(() => {
    handleMouseMoveRef.current = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;

      // Apply constraints
      const constrainedWidth = Math.max(
        minWidth,
        Math.min(newWidth, containerWidth * maxWidthPercentage)
      );
      setPanelWidthState(constrainedWidth);
      onWidthChange?.(constrainedWidth);
    };

    handleMouseUpRef.current = () => {
      setIsResizing(false);
    };
  }, [isResizing, startX, startWidth, minWidth, containerWidth, maxWidthPercentage, onWidthChange]);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = panelWidth;

      setIsResizing(true);
      setStartX(startX);
      setStartWidth(startWidth);

      // Add global mouse event listeners
      const handleMouseMove = (e: MouseEvent) => {
        // Calculate delta from the resize handle position
        const deltaX = e.clientX - startX;

        // Apply direction logic based on panel position:
        // - 'left' panel: dragging right should increase width (deltaX is positive)
        // - 'right' panel: dragging right should decrease width (deltaX is positive, but we subtract)
        const newWidth = panelPosition === 'left' ? startWidth + deltaX : startWidth - deltaX;

        // Apply constraints
        const constrainedWidth = Math.max(
          minWidth,
          Math.min(newWidth, containerWidth * maxWidthPercentage)
        );

        setPanelWidthState(constrainedWidth);
        onWidthChange?.(constrainedWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);

        // Remove global mouse event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [
      panelWidth,
      startX,
      startWidth,
      minWidth,
      containerWidth,
      maxWidthPercentage,
      onWidthChange,
      isResizing,
      panelPosition
    ]
  );

  // Update container width
  const updateContainerWidth = useCallback(
    (width: number) => {
      // Recalculate panel width if it exceeds new container constraints
      const maxAllowedWidth = Math.max(width * maxWidthPercentage, minWidth);
      if (panelWidth > maxAllowedWidth) {
        setPanelWidth(maxAllowedWidth);
      }
    },
    [panelWidth, maxWidthPercentage, minWidth, setPanelWidth]
  );

  // Reset panel width when closed
  useEffect(() => {
    if (!isOpen) {
      setPanelWidthState(initialWidth);
    }
  }, [isOpen, initialWidth]);

  return {
    panelWidth: constrainedPanelWidth(),
    isResizing,
    handleMouseDown,
    resizeHandleRef,
    containerRef,
    updateContainerWidth,
    setPanelWidth
  };
};
