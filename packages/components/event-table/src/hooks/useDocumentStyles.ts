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

import { useEffect, useRef } from 'react';

interface UseDocumentStylesOptions {
  /** Whether to apply resizing styles */
  isResizing: boolean;
  /** Custom cursor style during resize */
  cursor?: string;
  /** Whether to disable text selection during resize */
  disableTextSelection?: boolean;
  /** Whether to disable pointer events during resize */
  disablePointerEvents?: boolean;
}

interface UseDocumentStylesReturn {
  /** Apply styles to document */
  applyStyles: () => void;
  /** Remove styles from document */
  removeStyles: () => void;
}

export const useDocumentStyles = ({
  isResizing,
  cursor = 'col-resize',
  disableTextSelection = true,
  disablePointerEvents = false
}: UseDocumentStylesOptions): UseDocumentStylesReturn => {
  const originalStyles = useRef<{
    cursor: string;
    userSelect: string;
    pointerEvents: string;
  }>({
    cursor: '',
    userSelect: '',
    pointerEvents: ''
  });

  const applyStyles = () => {
    // Store original styles
    originalStyles.current = {
      cursor: document.body.style.cursor,
      userSelect: document.body.style.userSelect,
      pointerEvents: document.body.style.pointerEvents
    };

    // Apply resizing styles
    document.body.style.cursor = cursor;
    if (disableTextSelection) {
      document.body.style.userSelect = 'none';
    }
    if (disablePointerEvents) {
      document.body.style.pointerEvents = 'none';
    }
  };

  const removeStyles = () => {
    // Restore original styles
    document.body.style.cursor = originalStyles.current.cursor;
    document.body.style.userSelect = originalStyles.current.userSelect;
    document.body.style.pointerEvents = originalStyles.current.pointerEvents;
  };

  useEffect(() => {
    if (isResizing) {
      applyStyles();
    } else {
      removeStyles();
    }

    // Cleanup on unmount
    return () => {
      removeStyles();
    };
  }, [isResizing]);

  return {
    applyStyles,
    removeStyles
  };
};
