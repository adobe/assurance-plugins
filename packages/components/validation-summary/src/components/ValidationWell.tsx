import {
  ActionButton,
  Flex,
  Heading,
  SpectrumWellProps,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
  Well,
} from "@adobe/react-spectrum";
import Alert from "@spectrum-icons/workflow/Alert";
import Checkmark from "@spectrum-icons/workflow/CheckmarkCircle";
import Info from "@spectrum-icons/workflow/InfoOutline";
import React from "react";

export interface ValidationWellProps extends SpectrumWellProps {
  /** The description of the validator and how it works. This will be rendered in a tooltip */
  description: string;
  /** The name of the validator */
  name: string;
  level: "error" | "warn" | "none";
  /** The message displayed to the user to give feedback on the result of the validation */
  message: string;
  /** The result of the validator */
  result: "matched" | "unknown" | "not matched";
}

function ValidationWell({
  description,
  level,
  name,
  message,
  result,
  ...props
}) {
  return (
    <Well {...props}>
      <Flex alignItems="center">
        {result === "matched" ? (
          <Checkmark
            data-testid="validationSuccess"
            size="M"
            color="positive"
          />
        ) : (
          <Alert
            data-testid="validationError"
            size="M"
            color={level === "warn" ? "notice" : "negative"}
          />
        )}
        <View marginX="size-200" flex={1}>
          <Flex alignItems="center">
            <Heading marginY="size-100">{name}</Heading>
            <TooltipTrigger delay={200}>
              <ActionButton isQuiet>
                <Info size="S" />
              </ActionButton>
              <Tooltip>{description}</Tooltip>
            </TooltipTrigger>
          </Flex>
          <Text>{message}</Text>
        </View>
      </Flex>
    </Well>
  );
}

export default ValidationWell;
