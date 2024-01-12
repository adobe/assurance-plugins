/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

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
