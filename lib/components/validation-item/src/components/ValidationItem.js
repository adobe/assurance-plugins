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
import React, { useState, useEffect } from 'react';
import { ActionButton, Flex, Heading, Text, Tooltip, TooltipTrigger, View, Well } from '@adobe/react-spectrum';
import { useValidation, } from '@adobe/assurance-plugin-bridge-provider';
import Alert from '@spectrum-icons/workflow/Alert';
import Checkmark from '@spectrum-icons/workflow/CheckmarkCircle';
import Info from '@spectrum-icons/workflow/InfoOutline';
const ValidationItem = ({ namespace }) => {
    const validation = useValidation();
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState('');
    useEffect(() => {
        Object.entries(validation || {}).forEach(([key, value]) => {
            if (key === namespace && typeof value === 'object' && value !== null && 'displayName' in value && 'description' in value && 'results' in value && 'message' in value.results && 'result' in value.results) {
                const kValue = value;
                setDisplayName(kValue.displayName);
                setDescription(kValue.description);
                setMessage(kValue.results.message);
                setResult(kValue.results.result);
            }
        });
    }, [validation, namespace]);
    return (React.createElement(Well, { key: namespace, "data-testid": namespace },
        React.createElement(Flex, { alignItems: "center" },
            result === 'matched' ? (React.createElement(Checkmark, { "data-testid": "validationSuccess", size: "M", color: "positive" })) : (React.createElement(Alert, { "data-testid": "validationError", size: "M", color: namespace.level === 'warn' ? 'notice' : 'negative' })),
            React.createElement(View, { marginX: "size-200", flex: 1 },
                React.createElement(Flex, { alignItems: "center" },
                    React.createElement(Heading, { marginY: "size-100" }, displayName),
                    React.createElement(TooltipTrigger, { delay: 200 },
                        React.createElement(ActionButton, { isQuiet: true },
                            React.createElement(Info, { size: "S" })),
                        React.createElement(Tooltip, null, description))),
                React.createElement(Text, null, message)))));
};
export default ValidationItem;
