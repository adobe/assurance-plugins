/**
 * Test suite for Data Stream Status Details
 * Tests data stream validation status rendering and user interactions
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import DataStreamStatusDetails from '../data-stream-status-details';
import { vi } from 'vitest';

// Mock the hooks
vi.mock('@assurance/plugin-bridge-provider', () => ({
  useSandbox: vi.fn(),
  useEnvironmentValue: vi.fn(),
}));

vi.mock('../../../hooks/useOpenExperienceUrl', () => ({
  useOpenExperienceUrl: vi.fn(),
}));

vi.mock('../../../hooks/useDataStreamValidationStatus', () => ({
  extractProfileDatasetId: vi.fn(),
  extractSchemaFromDataset: vi.fn(),
  useDataset: vi.fn(),
  useDatastream: vi.fn(),
  useDatastreamId: vi.fn(),
  useEventDataset: vi.fn(),
}));

vi.mock('../../../utils/utils', () => ({
  openProfileUrl: vi.fn(),
  onOpenTrackingSchema: vi.fn(),
  onOpenSchema: vi.fn(),
  ENVIRONMENT_MAPPING: {
    local: 'local',
    dev: 'dev',
    qa: 'qa',
    stage: 'stage',
    prod: 'prod'
  }
}));

// Import mocked modules
import { useSandbox, useEnvironmentValue } from '@assurance/plugin-bridge-provider';
import { useOpenExperienceUrl } from '../../../hooks/useOpenExperienceUrl';
import { 
  extractProfileDatasetId, 
  extractSchemaFromDataset, 
  useDataset, 
  useDatastream, 
  useDatastreamId, 
  useEventDataset 
} from '../../../hooks/useDataStreamValidationStatus';
import { openProfileUrl, onOpenTrackingSchema, onOpenSchema } from '../../../utils/utils';

const mockUseSandbox = useSandbox as ReturnType<typeof vi.fn>;
const mockUseEnvironmentValue = useEnvironmentValue as ReturnType<typeof vi.fn>;
const mockUseOpenExperienceUrl = useOpenExperienceUrl as ReturnType<typeof vi.fn>;
const mockExtractProfileDatasetId = extractProfileDatasetId as ReturnType<typeof vi.fn>;
const mockExtractSchemaFromDataset = extractSchemaFromDataset as ReturnType<typeof vi.fn>;
const mockUseDataset = useDataset as ReturnType<typeof vi.fn>;
const mockUseDatastream = useDatastream as ReturnType<typeof vi.fn>;
const mockUseDatastreamId = useDatastreamId as ReturnType<typeof vi.fn>;
const mockUseEventDataset = useEventDataset as ReturnType<typeof vi.fn>;
const mockOpenProfileUrl = openProfileUrl as ReturnType<typeof vi.fn>;
const mockOnOpenTrackingSchema = onOpenTrackingSchema as ReturnType<typeof vi.fn>;
const mockOnOpenSchema = onOpenSchema as ReturnType<typeof vi.fn>;

// Test wrapper with React Spectrum Provider and IntlProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
);

describe('DataStreamStatusDetails', () => {
  const mockOpenExpUrl = vi.fn();
  const mockSandbox = { name: 'test-sandbox' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSandbox.mockReturnValue(mockSandbox);
    mockUseEnvironmentValue.mockReturnValue('prod');
    mockUseOpenExperienceUrl.mockReturnValue({ openExpUrl: mockOpenExpUrl });
    mockExtractProfileDatasetId.mockReturnValue('profile-dataset-id');
    mockExtractSchemaFromDataset.mockReturnValue('schema-id');
    mockUseDataset.mockReturnValue({ data: {} });
    mockUseDatastream.mockReturnValue({ data: { data: {} } });
    mockUseDatastreamId.mockReturnValue('datastream-id');
    mockUseEventDataset.mockReturnValue('event-dataset-id');
  });

  describe('Basic Rendering', () => {
    it('should render with valid status (false)', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status={false} profileId="test-profile-123" />
        </TestWrapper>
      );

      expect(screen.getByText('Push Data Received By Platform')).toBeInTheDocument();
      expect(screen.getByTestId('inspectProfile')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="loading" />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });
  });

  describe('Status Messages', () => {
    it('should display correct message for device-not-configured', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="device-not-configured" />
        </TestWrapper>
      );

      expect(screen.getByText('Client Must Be Configured Correctly')).toBeInTheDocument();
    });

    it('should display correct message for no-sandbox', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="no-sandbox" />
        </TestWrapper>
      );

      expect(screen.getByText('Couldn\'t Detect Sandbox')).toBeInTheDocument();
    });

    it('should display correct message for not-in-platform', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="not-in-platform" />
        </TestWrapper>
      );

      expect(screen.getByText('Credentials Not Found')).toBeInTheDocument();
    });

    it('should display correct message for no-dataset-access', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="no-dataset-access" />
        </TestWrapper>
      );

      expect(screen.getByText('Permissions Error')).toBeInTheDocument();
    });

    it('should display correct message for token-mismatch', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="token-mismatch" />
        </TestWrapper>
      );

      expect(screen.getByText('Push Token Mismatch')).toBeInTheDocument();
    });

    it('should display correct message for deny-listed', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="deny-listed" />
        </TestWrapper>
      );

      expect(screen.getByText('Push Credentials on Deny List')).toBeInTheDocument();
    });

    it('should display correct message for invalid-dataset', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('Invalid Dataset')).toBeInTheDocument();
    });

    it('should display correct message for sandbox-error', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="sandbox-error" />
        </TestWrapper>
      );

      expect(screen.getByText('Invalid Edge Configuration')).toBeInTheDocument();
    });

    it('should display correct message for invalid-schema', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-schema" />
        </TestWrapper>
      );

      expect(screen.getByText('Invalid Dataset Schema')).toBeInTheDocument();
    });

    it('should display correct message for invalid-messaging-dataset', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-messaging-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('Invalid Message Tracking Dataset')).toBeInTheDocument();
    });

    it('should display correct message for missing-messaging-dataset', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="missing-messaging-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('Missing Message Tracking Dataset')).toBeInTheDocument();
    });

    it('should display correct message for no-profile-dataset', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="no-profile-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('Missing Profile Dataset')).toBeInTheDocument();
    });
  });

  describe('Status Details Rendering', () => {
    it('should render no-profile-dataset details with edge config button', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="no-profile-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('The Edge Configuration chosen for this property does not have a profile dataset selected. Sending a test push message with AJO requires a profile dataset.')).toBeInTheDocument();
      expect(screen.getByTestId('viewEdgeConfig')).toBeInTheDocument();
      expect(screen.getByText('View Edge Configuration')).toBeInTheDocument();
    });

    it('should render sandbox-error details with installed extensions button', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="sandbox-error" />
        </TestWrapper>
      );

      expect(screen.getByText('It appears the Edge Configuration for this extension is invalid. Make sure that the datastreams are valid.')).toBeInTheDocument();
      expect(screen.getByTestId('viewInstalled')).toBeInTheDocument();
      expect(screen.getByText('View Installed Extensions')).toBeInTheDocument();
    });

    it('should render invalid-dataset details with edge config button', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('It appears the Profile Dataset for this extension is invalid. Make sure that the dataset you\'ve chosen in the Edge Configuration is still valid:')).toBeInTheDocument();
      expect(screen.getByTestId('viewEdgeConfig')).toBeInTheDocument();
      expect(screen.getByText('View Edge Configuration')).toBeInTheDocument();
    });

    it('should render missing-messaging-dataset details with installed extensions button', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="missing-messaging-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('The dataset you are using for event tracking appears to not exist. Check your configuration and make sure the Dataset selected still exists.')).toBeInTheDocument();
      expect(screen.getByTestId('viewInstalled')).toBeInTheDocument();
      expect(screen.getByText('View Installed Extensions')).toBeInTheDocument();
    });

    it('should render invalid-messaging-dataset details with tracking schema button', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-messaging-dataset" />
        </TestWrapper>
      );

      expect(screen.getByText('The dataset used for message tracking requires the following mixins:')).toBeInTheDocument();
      expect(screen.getByTestId('viewTrackingSchema')).toBeInTheDocument();
      expect(screen.getByText('View Tracking Schema')).toBeInTheDocument();
    });

    it('should render invalid-schema details with profile schema button', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-schema" />
        </TestWrapper>
      );

      expect(screen.getByText('For messaging, the "pushNotificationDetails" and "identityMap" mixins are required for the profile dataset. Please make sure the profile you\'ve configured has these mixins.')).toBeInTheDocument();
      expect(screen.getByTestId('viewSchema')).toBeInTheDocument();
      expect(screen.getByText('View Profile Schema')).toBeInTheDocument();
    });

    it('should render deny-listed details with explanation', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="deny-listed" />
        </TestWrapper>
      );

      expect(screen.getByText('The push token for this profile has been added to the Deny List. You cannot send messages to it. This could be because:')).toBeInTheDocument();
      expect(screen.getByText('The user uninstalled the app after this token was sent')).toBeInTheDocument();
      expect(screen.getByText('The user disabled push notifications for the app')).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call openExpUrl when viewEdgeConfig button is clicked', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="no-profile-dataset" />
        </TestWrapper>
      );

      const button = screen.getByTestId('viewEdgeConfig');
      fireEvent.click(button);

      expect(mockOpenExpUrl).toHaveBeenCalledWith({ mode: 'edgeConfig' });
    });

    it('should call openExpUrl when viewInstalled button is clicked', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="sandbox-error" />
        </TestWrapper>
      );

      const button = screen.getByTestId('viewInstalled');
      fireEvent.click(button);

      expect(mockOpenExpUrl).toHaveBeenCalledWith({ mode: 'installed' });
    });

    it('should call onOpenTrackingSchema when viewTrackingSchema button is clicked', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-messaging-dataset" />
        </TestWrapper>
      );

      const button = screen.getByTestId('viewTrackingSchema');
      fireEvent.click(button);

      expect(mockOnOpenTrackingSchema).toHaveBeenCalledWith({
        env: 'prod',
        sandbox: mockSandbox,
        messagingSchemaId: 'schema-id'
      });
    });

    it('should call onOpenSchema when viewSchema button is clicked', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-schema" />
        </TestWrapper>
      );

      const button = screen.getByTestId('viewSchema');
      fireEvent.click(button);

      expect(mockOnOpenSchema).toHaveBeenCalledWith({
        env: 'prod',
        sandbox: mockSandbox,
        profileSchemaId: 'schema-id'
      });
    });

    it('should call openProfileUrl when inspectProfile button is clicked for valid status', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status={false} profileId="test-profile-123" />
        </TestWrapper>
      );

      const button = screen.getByTestId('inspectProfile');
      fireEvent.click(button);

      expect(mockOpenProfileUrl).toHaveBeenCalledWith({
        env: 'prod',
        sandbox: mockSandbox,
        profileId: 'test-profile-123'
      });
    });
  });

  describe('Valid Status (false)', () => {
    it('should show inspect profile button for valid status', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status={false} profileId="test-profile-123" />
        </TestWrapper>
      );

      expect(screen.getByTestId('inspectProfile')).toBeInTheDocument();
      expect(screen.getByText('Inspect Profile')).toBeInTheDocument();
    });

    it('should not show inspect profile button for invalid status', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-dataset" />
        </TestWrapper>
      );

      expect(screen.queryByTestId('inspectProfile')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown status gracefully', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="unknown-status" as any />
        </TestWrapper>
      );

      // Should render without errors - unknown status returns empty message
      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    });

    it('should handle missing profileId gracefully', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status={false} />
        </TestWrapper>
      );

      expect(screen.getByTestId('inspectProfile')).toBeInTheDocument();
    });

    it('should handle null/undefined values gracefully', () => {
      mockUseSandbox.mockReturnValue(null);
      mockUseEnvironmentValue.mockReturnValue(null);

      expect(() => {
        render(
          <TestWrapper>
            <DataStreamStatusDetails status="invalid-dataset" />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-dataset" />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Invalid Dataset');
    });

    it('should have accessible buttons', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="invalid-dataset" />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should have proper loading state accessibility', () => {
      render(
        <TestWrapper>
          <DataStreamStatusDetails status="loading" />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });
  });
});
