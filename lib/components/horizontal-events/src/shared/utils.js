import get from "lodash.get";
export const attemptObjectPrettyPrint = (value) => {
    try {
        return JSON.stringify(JSON.parse(value), null, 2);
    }
    catch (e) {
        return value;
    }
};
export const timestampToDateString = (timestamp) => `${Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    fractionalSecondDigits: 3,
    hour12: false
}).format(timestamp)}`;
export const rotateTable = (events) => {
    if (!events || events.length === 0) {
        return { columnNames: [], rowNames: [], data: [] };
    }
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
    const createSimpleGetter = (prop) => (event) => {
        const value = get(event, prop);
        if (value === null || value === undefined) {
            return "";
        }
        if (typeof value === "object") {
            return JSON.stringify(value);
        }
        return value;
    };
    const payloadRowsSet = new Set();
    sortedEvents.forEach(event => {
        Object.keys(event.payload).forEach(key => payloadRowsSet.add(key));
    });
    const rowDefinitions = [
        {
            name: "timestamp",
            getter: event => timestampToDateString(event.timestamp)
        },
        { name: "vendor", getter: createSimpleGetter("vendor") },
        ...Array.from(payloadRowsSet).map(payloadKey => ({
            name: payloadKey,
            getter: createSimpleGetter(`payload.${payloadKey}`)
        }))
    ];
    const columnNames = sortedEvents.map(event => event.uuid);
    const rowNames = rowDefinitions.map(rowDef => rowDef.name);
    const data = rowDefinitions.map(({ getter }) => sortedEvents.map(e => getter(e)));
    return { columnNames, rowNames, data };
};
