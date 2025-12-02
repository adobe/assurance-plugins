import {
  PersonalizationEdgeResponse,
  PropositionsResponse,
  personalizationEdgeResponse,
  propositionsRequest,
  propositionsResponse
} from '@adobe/griffon-toolkit-aep-mobile';
import { useEvents } from '@assurance/plugin-bridge-provider';
import uniqBy from 'lodash/uniqBy';

import { usePluginState } from './usePluginState';

const CONTENT_CARD_SCHEMA = 'https://ns.adobe.com/personalization/message/content-card';

export const useCards = () => {
  const propositionEvents = useEvents<PropositionsResponse[]>({
    matchers: [propositionsResponse.matcher]
  });
  const personalizationEvents = useEvents<PersonalizationEdgeResponse[]>({
    matchers: [personalizationEdgeResponse.matcher]
  });

  const propositions = propositionEvents.flatMap(
    x => x.payload?.ACPExtensionEventData.propositions
  ) as any[];
  const personalizations = personalizationEvents.flatMap(
    event => event.payload?.ACPExtensionEventData.payload
  );
  console.log('here', propositions, personalizations);

  const cards = propositions.flatMap(proposition =>
    proposition?.items
      .filter(item => item.schema === CONTENT_CARD_SCHEMA)
      .map(card => {
        const personalization = personalizations.find(event => event.id === proposition.id);
        const [rules] = personalization?.items?.[0]?.data?.rules || [];
        return { ...card, activity: proposition.scopeDetails.activity, rules };
      })
  );
  return uniqBy(cards, x => x?.id);
};

export const useSelectedCard = () => {
  const selectedCard = usePluginState(state => state.selectedCard);
  const cards = useCards();
  return cards.find(card => card?.id === selectedCard);
};

export const usePropositionRequests = () => {
  const requests = useEvents({
    matchers: [propositionsRequest.matcher],
    sorted: 'desc'
  });
  const responses = useEvents({
    matchers: [propositionsResponse.matcher]
  });

  return requests.map(({ payload, timestamp, uuid }) => {
    const response = responses.find(
      event =>
        event.payload?.ACPExtensionEventParentIdentifier ===
        payload?.ACPExtensionEventUniqueIdentifier
    );

    const cards =
      response?.payload?.ACPExtensionEventData?.propositions?.flatMap(proposition =>
        proposition?.items.filter(item => item.schema === CONTENT_CARD_SCHEMA)
      ) || [];

    return {
      cards,
      timestamp,
      uuid
    };
  });
};
