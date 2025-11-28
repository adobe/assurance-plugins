/**
 * Dialog Actions Component
 * Reusable button group for dialogs
 */
import React from 'react';

import { Button, ButtonGroup } from '@adobe/react-spectrum';

interface DialogActionsProps {
  /**
   * Whether the action is currently loading
   */
  isLoading: boolean;

  /**
   * Whether the action button should be disabled
   */
  isDisabled: boolean;

  /**
   * Handler for cancel button
   */
  onCancel: () => void;

  /**
   * Handler for action button
   */
  onAction: () => void | Promise<void>;

  /**
   * Label for cancel button
   */
  cancelLabel: string;

  /**
   * Label for action button (when not loading)
   */
  actionLabel: string;

  /**
   * Label for action button (when loading)
   */
  loadingLabel: string;
}

/**
 * Standard dialog action buttons (Cancel + Action)
 * Used in Live Activity dialogs to provide consistent button patterns
 *
 * Features:
 * - Secondary cancel button
 * - Accent action button
 * - Loading state with custom label
 * - Disabled state support
 *
 * @example
 * <DialogActions
 *   isLoading={isSubmitting}
 *   isDisabled={!isValid}
 *   onCancel={handleCancel}
 *   onAction={handleSubmit}
 *   cancelLabel="Cancel"
 *   actionLabel="Submit"
 *   loadingLabel="Submitting..."
 * />
 */
export function DialogActions({
  isLoading,
  isDisabled,
  onCancel,
  onAction,
  cancelLabel,
  actionLabel,
  loadingLabel
}: Readonly<DialogActionsProps>) {
  return (
    <ButtonGroup>
      <Button variant="secondary" onPress={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant="accent" onPress={onAction} isDisabled={isDisabled}>
        {isLoading ? loadingLabel : actionLabel}
      </Button>
    </ButtonGroup>
  );
}
