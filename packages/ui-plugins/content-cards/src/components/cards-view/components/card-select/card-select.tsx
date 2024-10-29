import { Item, Picker } from "@adobe/react-spectrum";
import React from "react";
import { useCards, useCardsBySurface } from "../../../../hooks/useCards";
import { usePluginState } from "../../../../hooks/usePluginState";

function CardSelect() {
  const cards = useCards();
  const { selectedCard, setSelectedCard } = usePluginState();

  return (
    <Picker
      label="Select a card"
      defaultSelectedKey={selectedCard}
      onSelectionChange={setSelectedCard}
      placeholder="Select a Card"
    >
      {cards?.length ? (
        cards.map((card, index) => (
          <Item key={card?.id}>{`Content Card ${index + 1}`}</Item>
        ))
      ) : (
        <Item>No Cards</Item>
      )}
    </Picker>
  );
}

export default CardSelect;
