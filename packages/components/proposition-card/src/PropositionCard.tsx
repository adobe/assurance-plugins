import {
  Badge,
  Flex,
  Heading,
  HeadingProps,
  SpectrumBadgeProps,
  Text,
  View,
  ViewProps,
} from "@adobe/react-spectrum";
import React, { ReactNode } from "react";

/** Props that can be applied to a PropositionCard component */
interface PropositionCardProps extends ViewProps<any> {
  badgeLabel: string;
  body: string | ReactNode | ReactNode[];
  label: string;
  badgeColor?: SpectrumBadgeProps["variant"];
  BadgeProps?: SpectrumBadgeProps;
  LabelProps?: HeadingProps;
}

/** Renders a card component that will display information about a proposition */
function PropositionCard({
  badgeLabel,
  body,
  label,
  badgeColor = "info",
  BadgeProps,
  LabelProps,
  ...props
}: PropositionCardProps) {
  return (
    <View
      backgroundColor="white"
      borderColor="#4B4B4B"
      borderRadius="medium"
      borderWidth="thin"
      paddingX="size-150"
      paddingY="size-250"
      maxWidth={300}
      {...props}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Heading level={4} margin="size-0" {...LabelProps}>
          {label}
        </Heading>
        <Badge variant={badgeColor} {...BadgeProps}>
          {badgeLabel}
        </Badge>
      </Flex>
      <View
        marginTop="size-100"
        UNSAFE_style={{ textAlign: "center", wordBreak: "break-word" }}
      >
        {body}
      </View>
    </View>
  );
}

export default PropositionCard;
