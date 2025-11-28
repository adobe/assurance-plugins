/**
 * Test suite for Push Credentials Status Details
 * Tests push credentials validation status rendering and user interactions
 */
import React from 'react';

import { Provider, defaultTheme } from '@adobe/react-spectrum';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { vi } from 'vitest';

// Import mocked modules
import { useOpenExperienceUrl } from '../../../hooks/useOpenExperienceUrl';
import PushCredentialsStatusDetails from '../push-credentials-status-details';

// Mock the hooks
vi.mock('../../../hooks/useOpenExperienceUrl', () => ({
  useOpenExperienceUrl: vi.fn()
}));

const mockUseOpenExperienceUrl = useOpenExperienceUrl as ReturnType<typeof vi.fn>;

// Test wrapper with React Spectrum Provider and IntlProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
);

describe('PushCredentialsStatusDetails', () => {
  const mockOpenExpUrl = vi.fn();
  const mockOnRefresh = vi.fn();

  const defaultShouldMatch = {
    app: 'test-app-id',
    platform: 'apns',
    propertyId: 'test-property-id',
    orgId: 'test-org-id'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOpenExperienceUrl.mockReturnValue({ openExpUrl: mockOpenExpUrl });
  });

  describe('Basic Rendering', () => {
    it('should render with valid status (false)', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus={false}
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Matching App Successfully Detected')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="loading"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Status Messages', () => {
    it('should display correct message for device-not-configured', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="device-not-configured"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Client Must Be Configured Correctly')).toBeInTheDocument();
    });

    it('should display correct message for error', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="error"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('App Configuration Error')).toBeInTheDocument();
    });

    it('should display correct message for no-apps', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('No App Configurations')).toBeInTheDocument();
    });

    it('should display correct message for no-matching-app', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-matching-app"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('No Matching App Detected')).toBeInTheDocument();
    });

    it('should display correct message for property-not-loaded', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="property-not-loaded"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Property Not Found')).toBeInTheDocument();
    });
  });

  describe('Status Details Rendering', () => {
    it('should render no-apps details with manage button', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText("You haven't created any App Configurations yet.")
      ).toBeInTheDocument();
      expect(
        screen.getByText('Use the following link to manage your App Configurations:')
      ).toBeInTheDocument();
      expect(screen.getByTestId('manage')).toBeInTheDocument();
      expect(screen.getByText('Manage App Configurations')).toBeInTheDocument();
      expect(
        screen.getByText('Make sure to create an App Configuration with the following details:')
      ).toBeInTheDocument();
    });

    it('should render no-matching-app details with manage button', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-matching-app"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText(
          'There is not an App Configurations that matches the stored App ID and Platform for this App.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('Use the following link to manage your App Configurations:')
      ).toBeInTheDocument();
      expect(screen.getByTestId('manage')).toBeInTheDocument();
      expect(screen.getByText('Manage App Configurations')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Make sure there is an App Configuration that matches the following details:'
        )
      ).toBeInTheDocument();
    });

    it('should render property-not-loaded details with property info', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="property-not-loaded"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText(
          'Could not load this property in Launch. Make sure that you are provisioned for Launch, that the property exists, and that it exists for the specified Org'
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId('app-info-property')).toBeInTheDocument();
      expect(screen.getByTestId('app-info-orgId')).toBeInTheDocument();
      expect(screen.getByText('Property ID: test-property-id')).toBeInTheDocument();
      expect(screen.getByText('Org ID: test-org-id')).toBeInTheDocument();
    });

    it('should render error details', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="error"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText(
          'There was a problem fetching the apps. This could be a temporary network issue or potentially a provisioning issue.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('App Information Display', () => {
    it('should display app information for no-apps status', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('App ID: test-app-id')).toBeInTheDocument();
      expect(
        screen.getByText('Messaging Service: Apple Push Notification Service')
      ).toBeInTheDocument();
    });

    it('should display app information for no-matching-app status', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-matching-app"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('App ID: test-app-id')).toBeInTheDocument();
      expect(
        screen.getByText('Messaging Service: Apple Push Notification Service')
      ).toBeInTheDocument();
    });

    it('should display Firebase service for Android platform', () => {
      const androidShouldMatch = {
        ...defaultShouldMatch,
        platform: 'fcm'
      };

      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={androidShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText('Messaging Service: Firebase Cloud Messaging V1')
      ).toBeInTheDocument();
    });

    it('should display Firebase service for FCM platform', () => {
      const fcmShouldMatch = {
        ...defaultShouldMatch,
        platform: 'fcm'
      };

      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={fcmShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText('Messaging Service: Firebase Cloud Messaging V1')
      ).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call openExpUrl when manage button is clicked', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      const button = screen.getByTestId('manage');
      fireEvent.click(button);

      expect(mockOpenExpUrl).toHaveBeenCalledWith({ mode: 'manage' });
    });

    it('should call onRefresh when refresh button is clicked', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="error"
            shouldMatch={defaultShouldMatch}
            onRefresh={mockOnRefresh}
          />
        </TestWrapper>
      );

      const button = screen.getByTestId('refresh-push-credentials');
      fireEvent.click(button);

      expect(mockOnRefresh).toHaveBeenCalled();
    });

    it('should not show refresh button when onRefresh is not provided', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="error"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('refresh-push-credentials')).not.toBeInTheDocument();
    });
  });

  describe('Platform Detection', () => {
    it('should detect APNS platform correctly', () => {
      const apnsShouldMatch = {
        ...defaultShouldMatch,
        platform: 'apns'
      };

      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={apnsShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText('Messaging Service: Apple Push Notification Service')
      ).toBeInTheDocument();
    });

    it('should detect APNS sandbox platform correctly', () => {
      const apnsSandboxShouldMatch = {
        ...defaultShouldMatch,
        platform: 'apnsSandbox'
      };

      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={apnsSandboxShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText('Messaging Service: Apple Push Notification Service')
      ).toBeInTheDocument();
    });

    it('should detect FCM platform correctly', () => {
      const fcmShouldMatch = {
        ...defaultShouldMatch,
        platform: 'fcm'
      };

      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={fcmShouldMatch}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText('Messaging Service: Firebase Cloud Messaging V1')
      ).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown status gracefully', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="unknown-status"
            as
            any
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      // Should render without errors
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    it('should handle missing shouldMatch data gracefully', () => {
      const incompleteShouldMatch = {
        app: '',
        platform: '',
        propertyId: undefined,
        orgId: undefined
      };

      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={incompleteShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByText('App ID:')).toBeInTheDocument();
      expect(
        screen.getByText('Messaging Service: Firebase Cloud Messaging V1')
      ).toBeInTheDocument();
    });

    it('should handle null/undefined values gracefully', () => {
      const nullShouldMatch = {
        app: null as any,
        platform: null as any,
        propertyId: null as any,
        orgId: null as any
      };

      expect(() => {
        render(
          <TestWrapper>
            <PushCredentialsStatusDetails
              pushCredentialsStatus="no-apps"
              shouldMatch={nullShouldMatch}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="error"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'App Configuration Error'
      );
    });

    it('should have accessible buttons', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="no-apps"
            shouldMatch={defaultShouldMatch}
            onRefresh={mockOnRefresh}
          />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should have proper test IDs for data elements', () => {
      render(
        <TestWrapper>
          <PushCredentialsStatusDetails
            pushCredentialsStatus="property-not-loaded"
            shouldMatch={defaultShouldMatch}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('app-info-property')).toBeInTheDocument();
      expect(screen.getByTestId('app-info-orgId')).toBeInTheDocument();
    });
  });
});
