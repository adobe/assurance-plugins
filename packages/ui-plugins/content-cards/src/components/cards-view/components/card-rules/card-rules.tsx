import React from 'react';

import { View } from '@adobe/react-spectrum';
import { RuleHeading, RuleItem } from '@assurance/component-rules';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircleOutline';

import { useSelectedCard } from '../../../../hooks/useCards';

// function Condition({ definition, matcherResults, type }) {
//   return type === 'matcher' ? (
//     <Matcher definition={definition} matcherResults={matcherResults} />
//   ) : type === 'group' ? (
//     <Group definition={definition} matcherResults={matcherResults} />
//   ) : (
//     <View>{`Unsupported Condition Type ${type}`}</View>
//   );
// }

function CardRules() {
  const card = useSelectedCard();
  console.log(card);

  return (
    <View marginY="size-250">
      <RuleHeading>If</RuleHeading>
      <View marginTop="size-300">{/* <Condition {...condition} /> */}</View>

      <RuleHeading>Then</RuleHeading>
      <View marginTop="size-300">
        <RuleItem ComponentRight={<CheckmarkCircle color="positive" />}>
          Display Content Card
        </RuleItem>
      </View>
    </View>
  );
}

export default CardRules;
