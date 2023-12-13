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
import { useEnvironment, useFlags, useImsAccessToken, useImsOrg, useNavigationPath, useFilteredEvents, useTenant, useValidation, } from '@adobe/assurance-plugin-bridge-provider';
const ProviderTable = () => {
    const env = useEnvironment();
    const flags = useFlags();
    const imsAccsessToken = useImsAccessToken();
    const imsOrg = useImsOrg();
    const tenant = useTenant();
    const navigation = useNavigationPath();
    const events = useFilteredEvents();
    const validation = useValidation();
    return (React.createElement("dl", { style: { width: '100%', overflow: 'hidden' } },
        React.createElement("dt", null, "Environment"),
        React.createElement("dd", null, env),
        React.createElement("dt", null, "Flags"),
        React.createElement("dd", null, JSON.stringify(flags)),
        React.createElement("dt", null, "IMS Access Token"),
        React.createElement("dd", { style: { textOverflow: 'ellipsis' } }, imsAccsessToken),
        React.createElement("dt", null, "IMS Org"),
        React.createElement("dd", null, imsOrg),
        React.createElement("dt", null, "Tenant"),
        React.createElement("dd", null, tenant),
        React.createElement("dt", null, "Navigation"),
        React.createElement("dd", null, navigation),
        React.createElement("dt", null, "Events"),
        React.createElement("dd", null, events?.length || 0),
        React.createElement("dt", null, "Validation"),
        React.createElement("dd", null, Object.keys(validation || {}).length)));
};
export default ProviderTable;
