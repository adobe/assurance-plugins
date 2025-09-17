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

import { View, Flex } from '@adobe/react-spectrum';

import { Event } from '@assurance/common-utils';
import { useResizeObserver, useResizePanel } from '@assurance/common-utils';

import type { Key } from '@react-types/shared';

import { ColumnDef } from '@tanstack/react-table';

import React, { useState, useCallback, useRef, useEffect } from 'react';

import EventDetailsPanel from './EventDetailsPanel';
import EventTable from './EventTable';
import './EventTableWithDetails.scss';
import ResizeHandle from './ResizeHandle';

interface EventTableWithDetailsProps<T = Event> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (event: T) => void;
  selectedEvent?: T;
  onEventSelect?: (event: T | undefined) => void;
  detailsPanelOpen?: boolean;
  onDetailsPanelToggle?: (open: boolean) => void;
  /** Default width of the details panel */
  defaultPanelWidth?: number;
  /** Minimum width of the details panel */
  minPanelWidth?: number;
  /** Maximum width of the details panel (as percentage of container width) */
  maxPanelWidthPercentage?: number;
}

function EventTableWithDetails<T = Event>({
  columns,
  data,
  onRowClick,
  selectedEvent,
  onEventSelect,
  detailsPanelOpen = false,
  onDetailsPanelToggle,
  defaultPanelWidth = 500,
  minPanelWidth = 400,
  maxPanelWidthPercentage = 0.7
}: EventTableWithDetailsProps<T>) {
  // Use resize observer hook for container width
  const { ref: containerRef, width: containerWidth } = useResizeObserver({
    onResize: (width) => {
      // Container width changed
    },
    observeHeight: false,
    debounceDelay: 50
  });

  // Cast the ref to the correct type for the div element
  const containerDivRef = containerRef as React.RefObject<HTMLDivElement>;

  // Use the resize panel hook
  const {
    panelWidth,
    isResizing,
    handleMouseDown,
    updateContainerWidth
  } = useResizePanel({
    initialWidth: defaultPanelWidth,
    minWidth: minPanelWidth,
    maxWidthPercentage: maxPanelWidthPercentage,
    containerWidth: containerWidth,
    isOpen: detailsPanelOpen && !!selectedEvent,
    panelPosition: 'right', // This is a right panel, so dragging right should decrease width
    onWidthChange: (width) => {
      // Panel width changed
    }
  });

  // Update panel width when container width changes
  useEffect(() => {
    updateContainerWidth(containerWidth);
  }, [containerWidth, updateContainerWidth]);

  const handleSelectionChange = useCallback((keys: 'all' | Set<Key>) => {
    if (keys === 'all' || (keys instanceof Set && keys.size === 0)) {
      onEventSelect?.(undefined);
      onDetailsPanelToggle?.(false);
      return;
    }

    if (keys instanceof Set && keys.size > 0) {
      const selectedKey = Array.from(keys)[0];
      const selectedEvent = data.find((event: any) => event.uuid === selectedKey);
      
      if (selectedEvent) {
        onEventSelect?.(selectedEvent);
        onDetailsPanelToggle?.(true);
      }
    }
  }, [data, onEventSelect, onDetailsPanelToggle]);

  const currentPanelOpen = detailsPanelOpen && selectedEvent;
  const currentSelectedEvent = selectedEvent;

  return (
    <div 
      ref={containerDivRef} 
      className={`event-table-with-details ${isResizing ? 'resizing' : ''}`}
      style={{ height: '100%' }}
    >
      {/* Event Table */}
      <div 
        className="event-table-container"
        style={{ 
          width: currentPanelOpen ? `calc(100% - ${panelWidth}px - 8px)` : '100%',
          transition: isResizing ? 'none' : 'width 0.2s ease'
        }}
      >
        <EventTable
          columns={columns}
          data={data as Event[]}
          selectedKeys={currentSelectedEvent ? new Set([(currentSelectedEvent as any).uuid]) : new Set()}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Resize Handle */}
      {currentPanelOpen && (
        <ResizeHandle
          isResizing={isResizing}
          onMouseDown={handleMouseDown}
          isVisible={!!currentPanelOpen}
        />
      )}

      {/* Details Panel */}
      {currentPanelOpen && (
        <div
          className="details-panel-container"
          style={{
            width: `${panelWidth}px`,
            transition: isResizing ? 'none' : 'width 0.2s ease'
          }}
        >
          <EventDetailsPanel
            event={currentSelectedEvent as Event}
            isOpen={!!currentPanelOpen}
            onClose={() => {
              onEventSelect?.(undefined);
              onDetailsPanelToggle?.(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EventTableWithDetails;