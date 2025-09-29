import { EnvironmentMap, useEnvironmentValue } from "./useEnvironmentValue";
import { useImsAccessToken } from "./useImsAccessToken";
import { useImsOrg } from "./useImsOrg";

const URLs: EnvironmentMap = {
  local: "https://edge.adobe.io/",
  dev: "https://edge-stage.adobe.io/",
  qa: "https://edge-stage.adobe.io/",
  stage: "https://edge-stage.adobe.io/",
  prod: "https://edge.adobe.io/",
};

/**
 * A utility hook that can be used to retrieve information about a data stream
 * @param dataStream The ID of the data stream to fetch
 * @param sandboxName The sandbox name the data stream belongs to
 * @returns
 */
export const useFetchDataStream = async (
  dataStream: string,
  sandboxName: string,
) => {
  const baseUrl = useEnvironmentValue(URLs);
  const imsToken = useImsAccessToken();
  const org = useImsOrg();

  const response = await fetch(
    `${baseUrl}metadata/namespaces/edge/datasets/datastreams/records/${dataStream}?LIMIT=10`,
    {
      headers: {
        "x-api-key": "Activation-DTM",
        Authorization: `Bearer ${imsToken}`,
        "x-sandbox-name": sandboxName,
        "x-gw-ims-org-id": org,
      } as Record<string, string>,
      method: "GET",
    },
  );
  return await response.json();
};
