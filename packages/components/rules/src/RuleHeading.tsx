import { Divider, Heading, type HeadingProps } from "@adobe/react-spectrum";
import React from "react";

export function RuleHeading({ children, ...rest }: HeadingProps) {
  return (
    <>
      <Heading level={3} marginTop="size-85" marginBottom="size-85" {...rest}>
        {children}
      </Heading>
      <Divider size="L" />
    </>
  );
}

export { HeadingProps };
