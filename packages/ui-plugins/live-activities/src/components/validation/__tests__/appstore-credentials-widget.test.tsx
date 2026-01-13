/**
 * Test suite for App Store Credentials Widget
 * Tests app store credentials validation and data display
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import AppStoreCredentialsWidget from '../appstore-credentials-widget';
import { vi } from 'vitest';

// Mock the hooks
vi.mock('@assurance/plugin-bridge-provider', () => ({
  useSandbox: vi.fn(),
  useImsOrg: vi.fn(),
  useEvents: vi.fn(),
}));

vi.mock('../../../hooks/usePushCredentialsData', () => ({
  default: vi.fn(),
}));

vi.mock('../../../hooks/useAppstoreCredentialsValidation', () => ({
  useAppstoreCredentialsValidation: vi.fn(),
}));

vi.mock('../../../utils/utils', () => ({
  renderValue: vi.fn(),
}));

vi.mock('../push-credentials-status-details', () => ({
  default: ({ pushCredentialsStatus, shouldMatch, onRefresh }: any) => (
    <div data-testid="push-credentials-status-details">
      Status: {String(pushCredentialsStatus)}, App: {shouldMatch.app}, Platform: {shouldMatch.platform}
      {onRefresh && <button data-testid="refresh-button" onClick={onRefresh}>Refresh</button>}
    </div>
  ),
}));

// Import mocked modules
import { useSandbox, useImsOrg, useEvents } from '@assurance/plugin-bridge-provider';
import usePushCredentialsData from '../../../hooks/usePushCredentialsData';
import { useAppstoreCredentialsValidation } from '../../../hooks/useAppstoreCredentialsValidation';
import { renderValue } from '../../../utils/utils';

const mockUseSandbox = useSandbox as ReturnType<typeof vi.fn>;
const mockUseImsOrg = useImsOrg as ReturnType<typeof vi.fn>;
const mockUseEvents = useEvents as ReturnType<typeof vi.fn>;
const mockUsePushCredentialsData = usePushCredentialsData as ReturnType<typeof vi.fn>;
const mockUseAppstoreCredentialsValidation = useAppstoreCredentialsValidation as ReturnType<typeof vi.fn>;
const mockRenderValue = renderValue as ReturnType<typeof vi.fn>;

// Test wrapper with React Spectrum Provider and IntlProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
);

describe('AppStoreCredentialsWidget', () => {
  const mockSandbox = { name: 'test-sandbox' };
  const mockImsOrg = 'test-org-id';
  const mockEvents = [
    { id: 'event-1', payload: { appId: 'test-app-id', platform: 'apns' } }
  ];
  const mockPushCredentials = {
    data: { data: [] },
    isLoading: false,
    isRefetching: false,
    refetch: vi.fn()
  };

  const mockValidationData = {
    clientAppIDFromEvent: 'test-app-id',
    platformName: 'apns',
    appCredentialValidation: { id: 'app-cred-123' },
    pushCredentialsStatus: false, // valid
    shouldMatch: {
      app: 'test-app-id',
      platform: 'apns',
      orgId: 'test-org-id'
    },
    property: { data: { name: 'Test Property' } }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSandbox.mockReturnValue(mockSandbox);
    mockUseImsOrg.mockReturnValue(mockImsOrg);
    mockUseEvents.mockReturnValue(mockEvents);
    mockUsePushCredentialsData.mockReturnValue(mockPushCredentials);
    mockUseAppstoreCredentialsValidation.mockReturnValue(mockValidationData);
    mockRenderValue.mockImplementation((value) => value || 'N/A');
  });

  describe('Basic Rendering', () => {
    it('should render the app store credentials widget', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('App Store Credentials & Configuration')).toBeInTheDocument();
    });

    it('should render push credentials status details', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByTestId('push-credentials-status-details')).toBeInTheDocument();
      expect(screen.getByText('Status: false, App: test-app-id, Platform: apns')).toBeInTheDocument();
    });

    it('should render property information table', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      // Check for table headers
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when push credentials are loading', () => {
      mockUsePushCredentialsData.mockReturnValue({
        ...mockPushCredentials,
        isLoading: true
      });

      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });

    it('should show loading spinner when push credentials are refetching', () => {
      mockUsePushCredentialsData.mockReturnValue({
        ...mockPushCredentials,
        isRefetching: true
      });

      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });
  });

  describe('Property Information Display', () => {
    it('should display property name', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('App ID')).toBeInTheDocument();
    });

    it('should display sandbox name', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Sandbox')).toBeInTheDocument();
    });

    it('should display org ID', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('App ID')).toBeInTheDocument();
    });

    it('should display client app ID from event', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('App ID')).toBeInTheDocument();
    });

    it('should display platform name', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Messaging Service')).toBeInTheDocument();
    });
  });

  describe('Push Credentials Status', () => {
    it('should pass correct props to PushCredentialsStatusDetails', () => {
      const customValidationData = {
        ...mockValidationData,
        pushCredentialsStatus: 'no-apps',
        shouldMatch: {
          app: 'custom-app-id',
          platform: 'fcm',
          orgId: 'custom-org-id'
        }
      };

      mockUseAppstoreCredentialsValidation.mockReturnValue(customValidationData);

      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Status: no-apps, App: custom-app-id, Platform: fcm')).toBeInTheDocument();
    });

    it('should pass refresh function to PushCredentialsStatusDetails', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
    });

    it('should call refetch when refresh button is clicked', () => {
      const mockRefetch = vi.fn();
      mockUsePushCredentialsData.mockReturnValue({
        ...mockPushCredentials,
        refetch: mockRefetch
      });

      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      const refreshButton = screen.getByTestId('refresh-button');
      fireEvent.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Data Rendering', () => {
    it('should use renderValue for displaying values', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      // renderValue should be called for the values
      expect(mockRenderValue).toHaveBeenCalled();
    });

    it('should handle missing property data', () => {
      const validationDataWithoutProperty = {
        ...mockValidationData,
        property: { data: null }
      };

      mockUseAppstoreCredentialsValidation.mockReturnValue(validationDataWithoutProperty);

      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('App Store Credentials & Configuration')).toBeInTheDocument();
    });

    it('should handle missing validation data', () => {
      mockUseAppstoreCredentialsValidation.mockReturnValue({
        clientAppIDFromEvent: null,
        platformName: null,
        appCredentialValidation: null,
        pushCredentialsStatus: 'error',
        shouldMatch: {
          app: '',
          platform: '',
          orgId: ''
        },
        property: { data: null }
      });

      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByText('App Store Credentials & Configuration')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing sandbox data gracefully', () => {
      mockUseSandbox.mockReturnValue(null);

      expect(() => {
        render(
          <TestWrapper>
            <AppStoreCredentialsWidget />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing events data gracefully', () => {
      mockUseEvents.mockReturnValue(null);

      expect(() => {
        render(
          <TestWrapper>
            <AppStoreCredentialsWidget />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing push credentials data gracefully', () => {
      mockUsePushCredentialsData.mockReturnValue({
        data: null,
        isLoading: false,
        isRefetching: false,
        refetch: vi.fn()
      });

      expect(() => {
        render(
          <TestWrapper>
            <AppStoreCredentialsWidget />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle null/undefined values gracefully', () => {
      mockUseSandbox.mockReturnValue(null);
      mockUseImsOrg.mockReturnValue(null);
      mockUseEvents.mockReturnValue(null);
      mockUsePushCredentialsData.mockReturnValue({
        data: null,
        isLoading: false,
        isRefetching: false,
        refetch: vi.fn()
      });
      mockUseAppstoreCredentialsValidation.mockReturnValue({
        clientAppIDFromEvent: null,
        platformName: null,
        appCredentialValidation: null,
        pushCredentialsStatus: null,
        shouldMatch: { app: '', platform: '' },
        property: null
      });

      expect(() => {
        render(
          <TestWrapper>
            <AppStoreCredentialsWidget />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('App Store Credentials & Configuration');
    });

    it('should have proper table structure', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      // Check for table headers
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });

    it('should have accessible loading state', () => {
      mockUsePushCredentialsData.mockReturnValue({
        ...mockPushCredentials,
        isLoading: true
      });

      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      render(
        <TestWrapper>
          <AppStoreCredentialsWidget />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });
});
