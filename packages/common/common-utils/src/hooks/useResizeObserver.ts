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

import { useEffect, useRef, useState } from 'react';

interface UseResizeObserverOptions {
  /** Callback when container size changes */
  onResize?: (width: number, height: number) => void;
  /** Whether to observe width only */
  observeWidth?: boolean;
  /** Whether to observe height only */
  observeHeight?: boolean;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
}

interface UseResizeObserverReturn<T extends HTMLElement = HTMLElement> {
  /** Ref to attach to the element to observe */
  ref: React.RefObject<T>;
  /** Current width of the observed element */
  width: number;
  /** Current height of the observed element */
  height: number;
  /** Whether the observer is currently active */
  isObserving: boolean;
}

export const useResizeObserver = <T extends HTMLElement = HTMLElement>({
  onResize,
  observeWidth = true,
  observeHeight = true,
  debounceDelay = 0
}: UseResizeObserverOptions = {}): UseResizeObserverReturn<T> => {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isObserving, setIsObserving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;

        // Debounce the resize callback
        if (debounceDelay > 0) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            if (observeWidth) setWidth(newWidth);
            if (observeHeight) setHeight(newHeight);
            onResize?.(newWidth, newHeight);
          }, debounceDelay);
        } else {
          if (observeWidth) setWidth(newWidth);
          if (observeHeight) setHeight(newHeight);
          onResize?.(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(element);
    setIsObserving(true);

    // Set initial dimensions
    const rect = element.getBoundingClientRect();
    if (observeWidth) setWidth(rect.width);
    if (observeHeight) setHeight(rect.height);

    return () => {
      resizeObserver.disconnect();
      setIsObserving(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onResize, observeWidth, observeHeight, debounceDelay]);

  return {
    ref,
    width,
    height,
    isObserving
  };
};
