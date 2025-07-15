import { Button, ProgressCircle, View } from "@adobe/react-spectrum";
import React from "react";
import useCampaignQuery from "../hooks/useCampaignQuery";
import Campaign from "./campaign";

/** Props for the CampaignDetails component */
export interface CampaignDetailsProps {
  /** The ID of the campaign to display details for */
  campaignId: string;
}

/** A Component that will call the Campaign API for a given campaign, and
 * display it's details */
function CampaignDetails({ campaignId }: CampaignDetailsProps) {
  const { data, error, isLoading, refetch } = useCampaignQuery(campaignId);

  if (error) {
    return (
      <View marginTop="size-200">
        Error fetching data, please try again
        <Button onPress={() => refetch()} variant="primary">
          Retry
        </Button>
      </View>
    );
  }

  if (isLoading || !data?.campaign) {
    return <ProgressCircle isIndeterminate marginTop="size-200" />;
  }

  return <Campaign campaign={data.campaign} onOpen={() => {}} />;
}

export default CampaignDetails;
