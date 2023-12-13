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

import React from 'react';
import { ValidationItem } from '@adobe/assurance-validation-item';
import { Flex } from '@adobe/react-spectrum';

const Validation = () => {
  return (
    <Flex direction="column" gap="size-150" marginTop="size-100">
      <ValidationItem namespace={'aep-consent-registered'} />
      <ValidationItem namespace={'aep-consent-configuration'} />
      <ValidationItem namespace={'aep-edge-configured'} />
    </Flex>
  );
};

export default Validation;
