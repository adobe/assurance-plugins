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
import { Button, ComboBox, defaultTheme, Provider, Item } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import { Flex } from '@adobe/react-spectrum';
import { useValidation } from '@adobe/assurance-plugin-bridge-provider';

//add validation items to the validation view by selecting from a dropdown
const ValidationBuilder = () => {
  const [selected, setSelected] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const fullSetValidation = useValidation();
  const [namespaces, setNamespaces] = useState<string[]>([]);

  useEffect(() => {
    if (fullSetValidation) {
      setNamespaces(Object.keys(fullSetValidation));
    }
  }, [fullSetValidation]);

  const handleAddValidation = () => {
    if (selected && !selectedItems.includes(selected)) {
      setSelectedItems([...selectedItems, selected]);
    }
  };

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <Flex direction="row" gap="size-500" alignItems="end" marginTop="size-100">
        <ComboBox
          label="Choose a validation"
          selectedKey={selected}
          onSelectionChange={key => setSelected(key.toString())}
        >
          {namespaces.map(namespace => (
            <Item key={namespace}>{namespace}</Item>
          ))}
        </ComboBox>
        <Button variant="cta" onPress={handleAddValidation}>
          Add Validation
        </Button>
      </Flex>
      {selectedItems.map(item => (
        <ValidationItem key={item} namespace={item} />
      ))}
    </Provider>
  );
};

export default ValidationBuilder;
