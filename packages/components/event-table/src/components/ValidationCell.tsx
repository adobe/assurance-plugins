import { ActionButton, Tooltip, TooltipTrigger } from "@adobe/react-spectrum";
import { useValidation } from "@assurance/plugin-bridge-provider";
import Alert from "@spectrum-icons/workflow/Alert";
import React from "react";

/**
 * Props for ValidationCell component
 */
interface ValidationCellProps {
  /** The UUID of the event to check if there is any validation error for */
  uuid: string;
}

function ValidationCell({ uuid }: ValidationCellProps) {
  const validation = useValidation();
  const hasValidation = validation
    .flatMap((validation) => validation.results.events)
    .includes(uuid);

  if (!hasValidation) {
    return null;
  }

  return (
    <TooltipTrigger>
      <ActionButton aria-label="Validation Error" isQuiet>
        <Alert color="negative" />
      </ActionButton>
      <Tooltip variant="negative" showIcon>
        Assurance Validation has detected an error with this event
      </Tooltip>
    </TooltipTrigger>
  );
}

export default ValidationCell;
