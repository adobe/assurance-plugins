import { Provider, defaultTheme } from "@adobe/react-spectrum";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { defaultColumns } from "../data/columns";
import EventTableWithDetails from "./EventTableWithDetails";

const meta: Meta<typeof EventTableWithDetails> = {
  component: EventTableWithDetails,
  decorators: [
    (Story) => (
      <Provider theme={defaultTheme} colorScheme="light">
        <div style={{ height: '600px', width: '100%' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof EventTableWithDetails>;

export const Primary: Story = {
  args: {
    data: [
      {
        timestamp: new Date().getTime(),
        type: "Test Event",
        uuid: "1",
        vendor: "com.adobe.edge",
        clientId: "client-123",
        payload: {
          testData: "This is a test payload",
          nested: {
            value: 42,
            array: [1, 2, 3]
          }
        },
        annotations: [
          {
            type: "test",
            payload: { message: "Test annotation" }
          }
        ]
      },
      {
        timestamp: new Date().getTime() - 1000,
        type: "Another Event",
        uuid: "2",
        vendor: "com.adobe.analytics",
        clientId: "client-456",
        payload: {
          analyticsData: "Analytics payload",
          metrics: {
            views: 100,
            clicks: 25
          }
        }
      },
      {
        timestamp: new Date().getTime() - 2000,
        type: "Third Event",
        uuid: "3",
        vendor: "com.adobe.target",
        clientId: "client-789",
        payload: {
          targetData: "Target payload"
        }
      }
    ],
    columns: defaultColumns as any,
    defaultPanelWidth: 500,
    minPanelWidth: 300,
    maxPanelWidthPercentage: 0.7
  },
};

export const WithCustomPanelWidth: Story = {
  args: {
    ...Primary.args,
    defaultPanelWidth: 600,
    minPanelWidth: 400,
    maxPanelWidthPercentage: 0.8
  },
};

export const NarrowPanel: Story = {
  args: {
    ...Primary.args,
    defaultPanelWidth: 300,
    minPanelWidth: 250,
    maxPanelWidthPercentage: 0.5
  },
};
