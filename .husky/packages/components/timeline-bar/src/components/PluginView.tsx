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

import React from "react";
import { Flex, View } from "@adobe/react-spectrum";

const PluginView = ({ children }) => (
  <Flex direction="column" position="absolute" width="100%" height="100%" left={0} top={0}>
    <View width="100%" height={10} flexGrow={5} overflow="auto">{children[0]}</View>
    <View width="100%" flexGrow={0} flexShrink={0}>{children[1]}</View>
  </Flex>
);

export default PluginView;
