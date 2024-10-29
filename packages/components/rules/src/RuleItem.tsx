import { Flex, View, ViewProps } from "@adobe/react-spectrum";
import React, { ReactNode } from "react";

export interface RuleItemProps extends ViewProps<any> {
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
  ComponentRight?: ReactNode | ReactNode[];
}

export function RuleItem({
  children,
  showTopBorder = true,
  showBottomBorder = true,
  ComponentRight,
}: RuleItemProps) {
  return (
    <View
      borderTopWidth={showTopBorder ? "thin" : undefined}
      borderBottomWidth="thin"
      borderEndWidth="thin"
      borderStartWidth="thin"
      borderColor="dark"
      borderRadius="medium"
      borderTopEndRadius={showTopBorder ? "medium" : undefined}
      borderTopStartRadius={showTopBorder ? "medium" : undefined}
      borderBottomEndRadius={showBottomBorder ? "medium" : undefined}
      borderBottomStartRadius={showBottomBorder ? "medium" : undefined}
      backgroundColor="gray-50"
      height="size-500"
      paddingStart="size-200"
      paddingEnd="size-200"
    >
      <Flex alignItems="center" justifyContent="space-between" height="100%">
        {children}
        {ComponentRight}
      </Flex>
    </View>
  );
}
