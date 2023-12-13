import { ActionButton, Button, ButtonGroup, Cell, Column, Content, Dialog, DialogTrigger, Heading, Row, TableBody, TableHeader, TableView, View } from "@adobe/react-spectrum";
import React from "react";
import { attemptObjectPrettyPrint, rotateTable } from "../shared/utils";
const ValueDialog = ({ close, heading, value }) => {
    const prettyPrintedValue = attemptObjectPrettyPrint(value);
    return (React.createElement(Dialog, null,
        React.createElement(Heading, null, heading),
        React.createElement(Content, null,
            React.createElement(View, null,
                React.createElement("pre", null,
                    React.createElement("code", null, prettyPrintedValue)))),
        React.createElement(ButtonGroup, null,
            React.createElement(Button, { variant: "primary", onPress: close }, "Close"))));
};
const PropertyValue = ({ children }) => {
    return (React.createElement("pre", null,
        React.createElement("code", null, children)));
};
const CellContents = ({ propertyName, propertyValue }) => {
    // empty value or row header
    if (propertyValue === "" || propertyName === propertyValue) {
        return React.createElement(React.Fragment, null, propertyValue);
    }
    return (React.createElement(DialogTrigger, null,
        React.createElement(ActionButton, { isQuiet: true },
            React.createElement(PropertyValue, null, propertyValue)),
        close => (React.createElement(ValueDialog, { close: close, heading: propertyName, value: propertyValue }))));
};
const EventsTable = ({ events, ...props }) => {
    const { rowNames, columnNames, data } = rotateTable(events);
    return (React.createElement(TableView, { ...props },
        React.createElement(TableHeader, null, [" ", ...columnNames].map((columnName, columnIndex) => (React.createElement(Column, { minWidth: columnIndex === 0 ? 150 : 300, isRowHeader: columnIndex === 0, allowsResizing: true, key: `column-${columnIndex}` }, columnName)))),
        React.createElement(TableBody, null, data.map((row, rowIndex) => (React.createElement(Row, { key: `row-${rowIndex}` }, [rowNames[rowIndex], ...row].map((cellValue, cellIndex) => (React.createElement(Cell, { key: `row-${rowNames[rowIndex]}-cell-${cellIndex}`, textValue: cellValue },
            React.createElement(CellContents, { propertyName: rowNames[rowIndex], propertyValue: cellValue }))))))))));
};
export default EventsTable;
