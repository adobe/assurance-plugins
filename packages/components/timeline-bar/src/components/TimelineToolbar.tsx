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
import { Flex, View } from '@adobe/react-spectrum';
import FilterBar from './FilterBar';
import Timeline from './Timeline';
import { Highlights } from '../types';

export type TimelineToolbarProps = {
  highlights?: Highlights;
}

const TimelineToolbar = ({ 
  highlights
}: TimelineToolbarProps) => {
  return (
    <View borderTopWidth="thin" borderTopColor="mid">
      <Flex direction="column" gap="size-100" marginTop="size-100">
        <FilterBar />
        <Timeline highlights={highlights} />
      </Flex>
    </View>
  );
};

export default TimelineToolbar;
