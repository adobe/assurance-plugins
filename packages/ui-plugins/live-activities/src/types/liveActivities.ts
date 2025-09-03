/**
 * Type definitions for Live Activities data structures.
 * Designed to be extensible and type-safe.
 */

export interface LiveActivitySchema {
  $schema: string;
  'attributes-type': string;
  'content-state': Record<string, any>;
  attributes: Record<string, any>;
  title: string;
}

export interface LiveActivityTypeData {
  attributeType: string;
  schema?: LiveActivitySchema;
  pushToStartToken?: string;
  updateToken?: string;
  hasSchema: boolean;
  hasPushToStartToken: boolean;
  hasUpdateToken: boolean;
  lastUpdated: number;
}

export interface LiveActivitiesExtractionResult {
  activityTypes: Map<string, LiveActivityTypeData>;
  totalCount: number;
  hasAnySchema: boolean;
  hasAnyPushToStartToken: boolean;
}

export interface LiveActivityDisplayData {
  label: string;
  value: string | number;
  showCopy: boolean;
  tooltip?: string;
  isLongData?: boolean;
}

export interface LiveActivityDisplayRow {
  activityType: string;
  pushToStartToken: string | 'Not available';
  updateToken: string | 'Not available';
  hasSchema: boolean;
}

// Validation status for display logic
export type LiveActivitiesValidationStatus =
  | 'not-supported'
  | 'basic-support'
  | 'full-support'
  | 'unknown'
  | 'not-ios';
