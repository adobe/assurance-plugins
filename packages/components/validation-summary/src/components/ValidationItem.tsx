/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/
import {
  ValidationRecord,
  useValidation,
} from "@assurance/plugin-bridge-provider";
import React, { useEffect, useState } from "react";
import ValidationWell from "./ValidationWell";

interface ValidationItemProps {
  /** The namespace of the validator to be rendered */
  namespace: string;
}

const ValidationItem = ({ namespace }: ValidationItemProps) => {
  const [validation, setValidation] = useState<ValidationRecord | undefined>(
    undefined,
  );
  const validations = useValidation();

  useEffect(() => {
    setValidation(validations?.find((x) => x.namespace === namespace));
  }, [validations]);

  if (!validation) {
    console.log(validations, namespace);
    return null;
  }

  const {
    description,
    displayName,
    level,
    results: { message, result },
  } = validation;

  return (
    <ValidationWell
      key={namespace}
      description={description}
      level={level}
      message={message}
      name={displayName}
      result={result}
    />
  );
};

export default ValidationItem;
