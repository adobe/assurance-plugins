import { ReactNode } from 'react';
import { LiveActivity } from '../hooks/useActivities';

// Base component props that most components should extend
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  children?: ReactNode;
}

// Activity-related component props
export interface BaseActivityComponentProps extends BaseComponentProps {
  activity: LiveActivity;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

// Event-related component props
export interface BaseEventComponentProps extends BaseComponentProps {
  event: any; // This would be LiveActivityEvent when we have the proper type
  isSelected?: boolean;
  onSelect?: (event: any) => void;
}

// Card component props
export interface BaseCardProps extends BaseComponentProps {
  isSelected?: boolean;
  isQuiet?: boolean;
  onPress?: () => void;
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
}

// Metric card props
export interface MetricCardProps extends BaseComponentProps {
  label: string;
  value: string | number;
  size?: 'S' | 'M' | 'L';
  tooltip?: string;
}

// Copyable value props
export interface CopyableValueProps extends BaseComponentProps {
  value: string | number | null | undefined;
  maxLength?: number;
  showFullValue?: boolean;
  copyTooltip?: string;
  copyFullValueTooltip?: string;
  copiedMessage?: string;
}

// Info field props
export interface InfoFieldProps extends BaseComponentProps {
  label: string;
  value: ReactNode;
  wrap?: boolean;
}

// Content state card props
export interface ContentStateCardProps extends BaseComponentProps {
  contentState: any;
  noContentStateMessage: string;
  lastUpdatedTimestamp?: number;
}

// Activity list props
export interface ActivityListProps extends BaseComponentProps {
  activities: LiveActivity[];
  selectedActivityId?: string;
  onActivitySelect: (id: string) => void;
  isLoading?: boolean;
}

// Activity details props
export interface ActivityDetailsProps extends BaseComponentProps {
  selectedActivity?: LiveActivity;
}

// Activity overview props
export interface ActivityOverviewProps extends BaseComponentProps {
  activity?: LiveActivity;
}

// Activity flow props
export interface ActivityFlowProps extends BaseComponentProps {
  activity?: LiveActivity;
}

// Event table props
export interface EventTableProps extends BaseComponentProps {
  events: any[];
  selectedEvent?: any;
  onEventSelect?: (event: any) => void;
  isLoading?: boolean;
}

// Search and filter props
export interface SearchFilterProps extends BaseComponentProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  filterOptions: Array<{
    key: string;
    label: string;
    count?: number;
  }>;
}

// Loading state props
export interface LoadingStateProps extends BaseComponentProps {
  message?: string;
  size?: 'S' | 'M' | 'L';
}

// Empty state props
export interface EmptyStateProps extends BaseComponentProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

// Error state props
export interface ErrorStateProps extends BaseComponentProps {
  error: Error;
  onRetry?: () => void;
  fallback?: ReactNode;
}
