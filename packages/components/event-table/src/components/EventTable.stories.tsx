import { Provider, defaultTheme } from "@adobe/react-spectrum";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { defaultColumns } from "../data/columns";
import EventTable from "./EventTable";

const meta: Meta<typeof EventTable> = {
  component: EventTable,
  decorators: [
    (Story) => (
      <Provider theme={defaultTheme} colorScheme="light">
        <Story />
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventTable>;

export const Primary: Story = {
  args: {
    data: [
      {
        timestamp: new Date().getTime(),
        type: "Test",
        uuid: "1",
        vendor: "com.adobe.edge",
      },
    ],
    columns: defaultColumns,
  },
};
