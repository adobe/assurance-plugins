import "@testing-library/jest-dom";
import "../packages/components/plugin-bridge-provider";
import { vitest } from "vitest";
window.pluginBridge = {
    annotateEvent: vitest.fn(),
    annotateSession: vitest.fn(),
    deletePlugin: vitest.fn(),
    flushConnection: vitest.fn(),
    navigateTo: vitest.fn(),
    register: (options) => {
        options.init({
            env: "prod",
            imsAccessToken: "my-token",
            imsOrg: "adobe",
            showColumnSettings: true,
            showReleaseNotes: true,
            showTimeline: true,
            tenant: "",
        });
    },
    selectEvents: vitest.fn(),
    sendCommand: vitest.fn(),
    uploadPlugin: vitest.fn(),
};
