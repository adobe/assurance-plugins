import {
  Flex,
  Item,
  TabList,
  TabPanels,
  Tabs,
  View,
} from "@adobe/react-spectrum";
import React from "react";
import { useSelectedCard } from "../../hooks/useCards";
import CardDetails from "./components/card-details/card-details";
import CardInteractions from "./components/card-interactions/card-interactions";
import CardPreview from "./components/card-preview/card-preview";
import CardRules from "./components/card-rules/card-rules";
import CardSelect from "./components/card-select/card-select";

function CardsView() {
  const card = useSelectedCard();
  return (
    <View>
      <CardSelect />
      {card ? (
        <Flex gap="size-200">
          <View flexBasis="65%">
            <Tabs>
              <TabList>
                <Item key="info">Info</Item>
                <Item key="rules">Rules</Item>
                {/* <Item key="analyze">Analyze</Item> */}
                <Item key="interactions">Interactions</Item>
              </TabList>
              <TabPanels>
                <Item key="info">
                  <CardDetails />
                </Item>
                <Item key="rules">
                  <CardRules />
                </Item>
                {/* <Item key="analyze"><AnalyzeCard /></Item> */}
                <Item key="interactions">
                  <CardInteractions />
                </Item>
              </TabPanels>
            </Tabs>
          </View>
          <View flexBasis="35%">
            <CardPreview content={card.data.content} />
          </View>
        </Flex>
      ) : (
        <Flex alignItems="center" justifyContent="center" marginY="size-200">
          Select a card to get started
        </Flex>
      )}
    </View>
  );
}

export default CardsView;
