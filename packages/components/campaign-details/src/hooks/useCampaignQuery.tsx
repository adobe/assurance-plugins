import {
  useImsAccessToken,
  useImsOrg,
} from "@assurance/plugin-bridge-provider";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

export interface CampaignData {
  name: string;
  description?: string;
  campaignId: string;
  audience: {
    audienceType: string;
    audienceId: string;
  };
  status: string;
  schedule: {
    startDate: string;
    startDateEnabled: boolean;
    endDate: string;
    endDateEnabled: boolean;
  };
  labelObjects: {
    labelId: string;
    labelName: string;
    labelCategory: string;
  };
  identityNamespace: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  modifiedBy: string;
  modifiedByName: string;
  modifiedAt: string;
  publishedAt: string;
  publishedBy: string;
  publishedByName: string;
  campaignType: string;
  category: string;
}

const document = gql`
  query getCampaign($id: String!) {
    campaign(id: $id) {
      name
      description
      campaignId
      audience {
        audienceType
        audienceId
        __typename
      }
      status
      schedule {
        startDate
        startDateEnabled
        endDate
        endDateEnabled
        __typename
      }
      labelObjects {
        labelId
        labelName
        labelCategory
        __typename
      }
      identityNamespace
      createdBy
      createdByName
      createdAt
      modifiedBy
      modifiedByName
      modifiedAt
      publishedAt
      publishedBy
      publishedByName
      campaignType
      category
    }
  }
`;

const useCampaignQuery = (id: string) => {
  const org = useImsOrg();
  const token = useImsAccessToken();
  return useQuery<{ campaign: CampaignData } | null>({
    queryKey: ["campaign", id],
    initialData: null,
    queryFn: async () =>
      request(
        "https://exc-unifiedcontent.experience.adobe.net/api/gql/profile/graphql/graphql?appId=ajoCampaignsApp",
        document,
        { id },
        {
          "x-api-key": "ajo-campaign-app",
          Authorization: `Bearer ${token}`,
          "x-gw-ims-org-id": org,
        } as Record<string, string>,
      ),
  });
};

export default useCampaignQuery;
