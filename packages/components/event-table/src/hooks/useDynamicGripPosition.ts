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

import React, { useState, useCallback, useEffect } from 'react';

interface UseGripPositionOptions {
  /** Whether the resize handle is currently visible */
  isVisible: boolean;
}

interface UseGripPositionReturn {
  /** The calculated top position for the grip */
  gripTop: number;
  /** Whether the grip should be visible */
  gripVisible: boolean;
  /** Ref to attach to the resize handle container */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Handle click to position grip */
  handleClick: (e: React.MouseEvent) => void;
}

export const useGripPosition = ({ isVisible }: UseGripPositionOptions): UseGripPositionReturn => {
  const [gripTop, setGripTop] = useState(0);
  const [gripVisible, setGripVisible] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Calculate initial position within middle 60%
  const getInitialPosition = useCallback((containerHeight: number) => {
    const marginPercent = 0.2;
    const availableHeight = containerHeight * (1 - 2 * marginPercent);
    const availableTop = containerHeight * marginPercent;
    const centerPosition = availableTop + availableHeight / 2 - 20; // 20px is half grip height
    return Math.max(availableTop, centerPosition);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerHeight = containerRect.height;

    // Get click position relative to container
    const clickY = e.clientY - containerRect.top;

    // Constrain within the middle 60% of the container (20% margin top and bottom)
    const marginPercent = 0.2;
    const availableHeight = containerHeight * (1 - 2 * marginPercent);
    const availableTop = containerHeight * marginPercent;
    const availableBottom = availableTop + availableHeight;

    // Grip height is approximately 40px (8px padding + 3 dots * 3px + gaps)
    const gripHeight = 40;

    // Constrain click position within available area
    // Ensure grip doesn't go beyond the middle 60% area
    const constrainedY = Math.max(availableTop, Math.min(clickY, availableBottom - gripHeight));

    setGripTop(constrainedY);
    setGripVisible(true);
  }, []);

  // Show/hide grip based on visibility
  React.useEffect(() => {
    setGripVisible(isVisible);
    if (!isVisible) {
      setGripTop(0);
    } else {
      // Set initial position to center of the middle 60% area
      if (containerRef.current) {
        const container = containerRef.current;
        const containerHeight = container.getBoundingClientRect().height;
        const initialPosition = getInitialPosition(containerHeight);
        setGripTop(initialPosition);
      }
    }
  }, [isVisible, getInitialPosition]);

  // Watch for container height changes (e.g., accordion collapse/expand)
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const container = containerRef.current;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        const currentGripTop = gripTop;

        // Check if current grip position is still within bounds
        const marginPercent = 0.2;
        const availableHeight = newHeight * (1 - 2 * marginPercent);
        const availableTop = newHeight * marginPercent;
        const availableBottom = availableTop + availableHeight;

        // If grip is outside the new bounds, reposition it
        if (currentGripTop < availableTop || currentGripTop > availableBottom - 40) {
          const newPosition = getInitialPosition(newHeight);
          setGripTop(newPosition);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isVisible, gripTop, getInitialPosition]);

  return {
    gripTop,
    gripVisible,
    containerRef,
    handleClick
  };
};
