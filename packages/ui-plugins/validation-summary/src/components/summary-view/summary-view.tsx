import {
  Item,
  TabList,
  TabPanels,
  Tabs,
  Text,
  View,
} from "@adobe/react-spectrum";
import { useValidation } from "@assurance/plugin-bridge-provider";
import { ValidationRecord } from "@assurance/plugin-bridge-provider/src/types";
import { ValidationItem } from "@assurance/validation-summary";
import React from "react";

function SummaryView() {
  const validations: ValidationRecord[] = useValidation();

  const categories = validations
    ? ["All Validations"].concat(
        Array.from(new Set(validations.map((x) => x.category).sort())),
      )
    : [];

  const groupedValidators = validations?.reduce(
    (acc, validation) => {
      if (acc[validation.category]) {
        acc[validation.category].push(validation);
      } else {
        acc[validation.category] = [validation];
      }
      return acc;
    },
    {
      "All Validations": validations,
    },
  );

  return (
    <Tabs orientation="vertical">
      <TabList>
        {categories.map((category) => (
          <Item key={category}>
            <View overflow="hidden">{category}</View>
          </Item>
        ))}
      </TabList>
      <TabPanels>
        {categories.map((category) => (
          <Item key={category}>
            {groupedValidators[category]?.map((x) => (
              <ValidationItem namespace={x.namespace} />
            ))}
          </Item>
        ))}
      </TabPanels>
    </Tabs>
  );
}

export default SummaryView;
