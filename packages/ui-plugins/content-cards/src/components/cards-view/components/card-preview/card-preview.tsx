import {
  ActionButton,
  Button,
  Flex,
  Heading,
  Provider,
  View,
  useProvider,
} from "@adobe/react-spectrum";
import Light from "@spectrum-icons/workflow/Light";
import Moon from "@spectrum-icons/workflow/Moon";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelectedCard } from "../../../../hooks/useCards";

interface CardButton {
  id: string;
  actionUrl: string;
  interactId: string;
  text: CardText;
}

interface CardImage {
  alt: string;
  url: string;
  darkUrl?: string;
}

interface CardText {
  content: string;
}

interface CardPreviewProps {
  content: {
    actionUrl: string;
    body: CardText;
    buttons: CardButton[];
    image: CardImage;
    dismissBtn: {
      style: "none" | "simple" | "circle";
    };
    title: CardText;
  };
}

function CardPreview() {
  const { colorScheme } = useProvider();
  const [theme, setTheme] = useState(colorScheme);
  const { formatMessage } = useIntl();
  const card = useSelectedCard();

  if (!card) {
    return <View>Select a card</View>;
  }

  return (
    <Provider colorScheme={theme} height="100%">
      <Flex direction="column" height="100%">
        <View alignSelf="end" padding="size-150">
          <ActionButton
            onPress={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
          >
            {theme === "dark" ? <Moon /> : <Light />}
          </ActionButton>
        </View>
        <Flex alignItems="center" justifyContent="center" flex={1}>
          <View maxWidth={400} width={400} padding="size-150">
            <View
              UNSAFE_style={{
                alignItems: "center",
                backgroundColor: "var(--spectrum-global-color-gray-50)",
                borderRadius: 5,
                color: "var(--spectrum-global-color-gray-900)",
                display: "grid",
                gap: 12,
                gridTemplateColumns: "60px 1fr",
                padding: 24,
                position: "relative",
              }}
            >
              <img
                alt={card.data.content.image.alt}
                src={
                  card.data.content.image.darkUrl && theme === "dark"
                    ? card.data.content.image.darkUrl
                    : card.data.content.image.url
                }
                style={{
                  marginRight: 16,
                  objectFit: "contain",
                  width: 60,
                }}
              />
              <View>
                <div
                  style={{
                    margin: "0.25rem 0",
                  }}
                >
                  {card.data.content.title.content}
                </div>
                <div
                  style={{
                    wordBreak: "break-word",
                  }}
                >
                  {card.data.content.body.content}
                </div>
                <Flex wrap gap="size-50" marginTop="size-50">
                  {card.data.content.buttons.map((button) => (
                    <Button
                      UNSAFE_style={{ borderRadius: 8 }}
                      key={button.interactId}
                      marginTop="size-50"
                      variant="accent"
                    >
                      {button.text.content}
                    </Button>
                  ))}
                </Flex>
              </View>
              {/* {content.dismissBtn.style !== 'none' && (
                <CloseButton style={content.dismissBtn.style} />
              )} */}
            </View>
          </View>
        </Flex>
      </Flex>
    </Provider>
  );
}

export default CardPreview;
