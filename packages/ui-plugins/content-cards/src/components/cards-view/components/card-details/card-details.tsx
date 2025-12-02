import React from 'react';

import { CampaignDetails } from '@assurance/campaign-details';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useSelectedCard } from '../../../../hooks/useCards';

dayjs.extend(relativeTime);

function CardDetails() {
  const card = useSelectedCard();

  return <CampaignDetails campaignId={card!.activity!.id!} />;
}

export default CardDetails;
