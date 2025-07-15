import {
  ActionButton,
  Divider,
  Flex,
  Heading,
  LabeledValue,
  StatusLight,
  Text,
  View,
} from "@adobe/react-spectrum";
import Checkmark from "@spectrum-icons/workflow/CheckmarkCircle";
import OpenIn from "@spectrum-icons/workflow/OpenIn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useCallback } from "react";
import { CampaignData } from "../hooks/useCampaignQuery";

dayjs.extend(relativeTime);

//** Props for the Campaign component */
export interface CampaignProps {
  /** The campaign's data to be displayed */
  campaign: CampaignData;
  /** Called when Open Campaign button is clicked */
  onOpen: () => void;
}

function Campaign({ campaign }: CampaignProps) {
  const openCampaign = useCallback(
    () =>
      window.open(
        `https://experience.adobe.com/journey-optimizer/campaigns/summary/${campaign.campaignId}`,
        "_blank",
      ),
    [campaign?.campaignId],
  );

  return (
    <View marginTop="size-200">
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap="size-125" height="size-225">
          <StatusLight
            UNSAFE_style={{ textTransform: "capitalize" }}
            variant={campaign.status === "LIVE" ? "info" : "negative"}
          >
            {campaign.status}
          </StatusLight>
          <Divider orientation="vertical" height="size-225" size="S" />
          <Checkmark size="S" color="positive" />
          <Text data-testid="info-timeago">
            Saved {dayjs(campaign.modifiedAt).fromNow()}
          </Text>
        </Flex>

        <ActionButton onPress={() => openCampaign()}>
          <Text>View Campaign</Text>
          <OpenIn marginStart="size-50" size="S" />
        </ActionButton>
      </Flex>

      <Flex data-testid="Properties" direction="column" gap="size-100">
        <Heading level={3} marginTop="size-300" marginBottom="size-100">
          Properties
        </Heading>
        <LabeledValue label="Name" value={campaign.name} />
        <LabeledValue
          label="Description"
          value={campaign.description || "None"}
        />
        <LabeledValue label="Category" value={campaign.category} />
        <LabeledValue label="Campaign Type" value={campaign.campaignType} />
      </Flex>

      <Flex direction="column" gap="size-100">
        <Heading level={3} marginTop="size-300" marginBottom="size-100">
          Schedule
        </Heading>
        <LabeledValue
          label="Campaign Start"
          value={campaign.schedule?.startDate || "When activated manually"}
        />
        <LabeledValue
          label="Campaign End"
          value={campaign.schedule?.endDate || "When stopped manually"}
        />
      </Flex>
    </View>
  );
}

export default Campaign;
