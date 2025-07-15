import { Flex, Heading, Text, View } from "@adobe/react-spectrum";
import { PropositionCard } from "@assurance/proposition-card";
import dayjs from "dayjs";
import React from "react";
import { usePropositionRequests } from "../../hooks/useCards";

function Requests() {
  const requests = usePropositionRequests();
  return (
    <View>
      {requests.map((request, index) => (
        <View>
          <Flex alignItems="center" gap="size-100">
            <Heading level={4}>Request {index + 1}</Heading>
            <Text>
              {dayjs(request.timestamp).format("YYYY-MM-DD HH:mm:ss.SSS")}
            </Text>
          </Flex>

          <Flex>
            {request.cards.map((card, i) => (
              <PropositionCard
                key={card.id}
                badgeLabel={card.data.meta.adobe.template}
                body={card.data.meta.surface}
                label={`#${i}`}
              />
            ))}
            {!request.cards.length && (
              <Text>No Propositions were retrieved</Text>
            )}
          </Flex>
        </View>
      ))}
    </View>
  );
}

export default Requests;
