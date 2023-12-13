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
import { MenuTrigger, ActionButton, Menu, Flex, Item, Text } from "@adobe/react-spectrum";
import { useSelectedEvents } from "@adobe/assurance-plugin-bridge-provider";
import React from "react";
import Filter from "@spectrum-icons/workflow/Filter";
import DataRefresh from "@spectrum-icons/workflow/DataRefresh";
import DataRemove from "@spectrum-icons/workflow/DataRemove";
const FilterButtons = () => {
    const selected = useSelectedEvents();
    const moreActions = [
        { label: 'Clear session', action: 'clearSession', icon: DataRemove },
        { label: 'Restore session', action: 'restoreSession', icon: DataRefresh },
    ];
    if (selected?.length) {
        moreActions.push({ label: 'Toggle hidden', action: 'hide' });
        moreActions.push({ label: 'Toggle flag', action: 'flag' });
    }
    return (React.createElement(Flex, { gap: "size-100", alignItems: "center" },
        React.createElement(MenuTrigger, null,
            React.createElement(ActionButton, { isQuiet: true, "aria-label": "Filter menu" },
                React.createElement(Filter, null)),
            React.createElement(Menu, { items: moreActions }, item => {
                const renderedIcon = item.icon ? React.createElement(item.icon, null) : null;
                return (React.createElement(Item, { key: item.action },
                    renderedIcon,
                    React.createElement(Text, null, item.label)));
            }))));
    /*
            <span className={styles.actionButtons}>
            {hasSelected && annotateWidget}
            <FilterEventsButton
              onFilterChange={onFilterChange}
              selectedFilters={selectedFilters}
            />
            <MoreAcionsButton
              onClearSession={onClearSession}
              onRestoreSession={onRestoreSession}
            />
            <CloseToolbarButton
              closed={closed}
              onToggleClose={onToggleClose}
            />
          </span>
        */
    return React.createElement("div", null, "FilterButtons");
};
export default FilterButtons;
