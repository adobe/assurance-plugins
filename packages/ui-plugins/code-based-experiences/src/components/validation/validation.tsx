import { View } from "@adobe/react-spectrum";
import { ValidationItem } from "@assurance/validation-summary";
import React from "react";

function Validation() {
  return (
    <View>
      <ValidationItem namespace="aep-iam-consent" />
      <ValidationItem namespace="aep-iam-dependencies" />
      <ValidationItem namespace="adobe-iam-request" />
      <ValidationItem namespace="adobe-iam-response-events" />
      <ValidationItem namespace="aep-messaging-configured" />
      <ValidationItem namespace="aep-messaging-installed" />
    </View>
  );
}

export default Validation;
