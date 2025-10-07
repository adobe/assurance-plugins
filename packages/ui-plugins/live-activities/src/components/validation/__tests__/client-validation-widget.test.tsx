/**
 * Test suite for Client Validation Widget
 * Tests client validation status rendering and user interactions
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import ClientValidationWidget from '../client-validation-widget';
import { vi } from 'vitest';

// Mock the hooks
vi.mock('../../../hooks/useClientInfo', () => ({
  useECID: vi.fn(),
  useSelectedClientPushToken: vi.fn(),
}));

vi.mock('../../../hooks/useClientValidationStatus', () => ({
  default: vi.fn(),
}));

vi.mock('../../../hooks/useOpenExperienceUrl', () => ({
  useOpenExperienceUrl: vi.fn(),
}));

vi.mock('../../../utils/utils', () => ({
  openHelpUrl: vi.fn(),
  renderValue: vi.fn(),
}));

vi.mock('../live-activities-validation-section', () => ({
  default: () => <div data-testid="live-activities-validation-section">Live Activities Section</div>,
}));

// Import mocked modules
import { useECID, useSelectedClientPushToken } from '../../../hooks/useClientInfo';
import useClientValidationStatus from '../../../hooks/useClientValidationStatus';
import { useOpenExperienceUrl } from '../../../hooks/useOpenExperienceUrl';
import { openHelpUrl, renderValue } from '../../../utils/utils';

const mockUseECID = useECID as ReturnType<typeof vi.fn>;
const mockUseSelectedClientPushToken = useSelectedClientPushToken as ReturnType<typeof vi.fn>;
const mockUseClientValidationStatus = useClientValidationStatus as ReturnType<typeof vi.fn>;
const mockUseOpenExperienceUrl = useOpenExperienceUrl as ReturnType<typeof vi.fn>;
const mockOpenHelpUrl = openHelpUrl as ReturnType<typeof vi.fn>;
const mockRenderValue = renderValue as ReturnType<typeof vi.fn>;

// Test wrapper with React Spectrum Provider and IntlProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
);

describe('ClientValidationWidget', () => {
  const mockOpenExpUrl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseECID.mockReturnValue('test-ecid-123');
    mockUseSelectedClientPushToken.mockReturnValue('test-push-token-456');
    mockUseClientValidationStatus.mockReturnValue(false); // valid state
    mockUseOpenExperienceUrl.mockReturnValue({ openExpUrl: mockOpenExpUrl });
    mockRenderValue.mockImplementation((value) => value || 'N/A');
  });

  describe('Basic Rendering', () => {
    it('should render the component with valid status', () => {
      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Client')).toBeInTheDocument();
      expect(screen.getByText('This is the messaging details found in the client at the time of the connection to this Assurance session.')).toBeInTheDocument();
      expect(screen.getByText('Device Configured and Push Token Detected')).toBeInTheDocument();
    });

    it('should render ECID and Push Token data', () => {
      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Ecid')).toBeInTheDocument();
      expect(screen.getByText('Push Token')).toBeInTheDocument();
    });

    it('should render Live Activities section', () => {
      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByTestId('live-activities-validation-section')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when status is loading', () => {
      mockUseClientValidationStatus.mockReturnValue('loading');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
      expect(screen.queryByText('Device Configured and Push Token Detected')).not.toBeInTheDocument();
    });
  });

  describe('Status Messages', () => {
    it('should display correct message for edge-not-configured status', () => {
      mockUseClientValidationStatus.mockReturnValue('edge-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Edge Not Configured')).toBeInTheDocument();
    });

    it('should display correct message for messaging-not-configured status', () => {
      mockUseClientValidationStatus.mockReturnValue('messaging-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Messaging Not Configured')).toBeInTheDocument();
    });

    it('should display correct message for messaging-not-installed status', () => {
      mockUseClientValidationStatus.mockReturnValue('messaging-not-installed');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Messaging Extension Not Initialized')).toBeInTheDocument();
    });

    it('should display correct message for no-ecid status', () => {
      mockUseClientValidationStatus.mockReturnValue('no-ecid');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('No ECID Detected')).toBeInTheDocument();
    });

    it('should display correct message for no-token status', () => {
      mockUseClientValidationStatus.mockReturnValue('no-token');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Push Token Not Captured')).toBeInTheDocument();
    });
  });

  describe('Status Details Rendering', () => {
    it('should render edge-not-configured details with buttons', () => {
      mockUseClientValidationStatus.mockReturnValue('edge-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('It appears you haven\'t configured your Edge extension in Launch. First, make sure you have installed and configured the extension.')).toBeInTheDocument();
      expect(screen.getByTestId('viewInstalled')).toBeInTheDocument();
      expect(screen.getByTestId('viewCatalog')).toBeInTheDocument();
      expect(screen.getByTestId('viewPublishing')).toBeInTheDocument();
    });

    it('should render messaging-not-configured details with buttons', () => {
      mockUseClientValidationStatus.mockReturnValue('messaging-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('It appears you haven\'t configured your Messaging extension in Launch. First, make sure you have installed and configured the extension.')).toBeInTheDocument();
      expect(screen.getByTestId('viewInstalled')).toBeInTheDocument();
      expect(screen.getByTestId('viewCatalog')).toBeInTheDocument();
      expect(screen.getByTestId('viewPublishing')).toBeInTheDocument();
    });

    it('should render messaging-not-installed-android details', () => {
      mockUseClientValidationStatus.mockReturnValue('messaging-not-installed-android');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('It appears you haven\'t properly installed and initiated the Messaging extension in your application. Make you\'ve done the following steps:')).toBeInTheDocument();
      expect(screen.getByText('Add the Messaging extension dependency to your')).toBeInTheDocument();
      expect(screen.getByText('build.gradle')).toBeInTheDocument();
      expect(screen.getByText('import com.adobe.marketing.mobile.Messaging;')).toBeInTheDocument();
      expect(screen.getByText('Messaging.registerExtension();')).toBeInTheDocument();
    });

    it('should render messaging-not-installed-ios details', () => {
      mockUseClientValidationStatus.mockReturnValue('messaging-not-installed-ios');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Add the Messaging extension dependency to your Podfile')).toBeInTheDocument();
      expect(screen.getByText('import AEPMessaging')).toBeInTheDocument();
      expect(screen.getByText('AEPMessaging.registerExtension();')).toBeInTheDocument();
    });

    it('should render no-token-android details with help button', () => {
      mockUseClientValidationStatus.mockReturnValue('no-token-android');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('The Push ID wasn\'t detected on the device. This could be for several reasons:')).toBeInTheDocument();
      expect(screen.getByTestId('openHelp')).toBeInTheDocument();
      expect(screen.getByText('Setup Android Apps for Messaging')).toBeInTheDocument();
    });

    it('should render no-token-ios details with help button', () => {
      mockUseClientValidationStatus.mockReturnValue('no-token-ios');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByTestId('openHelp')).toBeInTheDocument();
      expect(screen.getByText('Article: Asking Permission to Use Notifications')).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call openExpUrl when viewInstalled button is clicked', () => {
      mockUseClientValidationStatus.mockReturnValue('edge-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      const button = screen.getByTestId('viewInstalled');
      fireEvent.click(button);

      expect(mockOpenExpUrl).toHaveBeenCalledWith({ mode: 'installed' });
    });

    it('should call openExpUrl when viewCatalog button is clicked', () => {
      mockUseClientValidationStatus.mockReturnValue('edge-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      const button = screen.getByTestId('viewCatalog');
      fireEvent.click(button);

      expect(mockOpenExpUrl).toHaveBeenCalledWith({ mode: 'catalog' });
    });

    it('should call openExpUrl when viewPublishing button is clicked', () => {
      mockUseClientValidationStatus.mockReturnValue('edge-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      const button = screen.getByTestId('viewPublishing');
      fireEvent.click(button);

      expect(mockOpenExpUrl).toHaveBeenCalledWith({ mode: 'publishing' });
    });

    it('should call openExpUrl when environments link is clicked', () => {
      mockUseClientValidationStatus.mockReturnValue('messaging-not-installed');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      const link = screen.getByTestId('openEnvironments');
      fireEvent.click(link);

      expect(mockOpenExpUrl).toHaveBeenCalledWith({ mode: 'environments' });
    });

    it('should call openHelpUrl when help button is clicked for Android', () => {
      mockUseClientValidationStatus.mockReturnValue('no-token-android');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      const button = screen.getByTestId('openHelp');
      fireEvent.click(button);

      expect(mockOpenHelpUrl).toHaveBeenCalledWith({ mode: 'setupAndroid' });
    });

    it('should call openHelpUrl when help button is clicked for iOS', () => {
      mockUseClientValidationStatus.mockReturnValue('no-token-ios');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      const button = screen.getByTestId('openHelp');
      fireEvent.click(button);

      expect(mockOpenHelpUrl).toHaveBeenCalledWith({ mode: 'setupIos' });
    });
  });

  describe('Data Display', () => {
    it('should display ECID value correctly', () => {
      mockUseECID.mockReturnValue('test-ecid-123');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Ecid')).toBeInTheDocument();
      // The actual value would be in a CopyableValue component
    });

    it('should display Push Token value correctly', () => {
      mockUseSelectedClientPushToken.mockReturnValue('test-push-token-456');

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Push Token')).toBeInTheDocument();
      // The actual value would be in a CopyableValue component
    });

    it('should handle null/undefined values gracefully', () => {
      mockUseECID.mockReturnValue(null);
      mockUseSelectedClientPushToken.mockReturnValue(undefined);

      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Ecid')).toBeInTheDocument();
      expect(screen.getByText('Push Token')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown status gracefully', () => {
      mockUseClientValidationStatus.mockReturnValue('unknown-status');

      expect(() => {
        render(
          <TestWrapper>
            <ClientValidationWidget />
          </TestWrapper>
        );
      }).not.toThrow();

      // Should render without errors
      expect(screen.getByText('Client')).toBeInTheDocument();
    });

    it('should handle missing hook data gracefully', () => {
      mockUseECID.mockReturnValue(null);
      mockUseSelectedClientPushToken.mockReturnValue(null);
      mockUseClientValidationStatus.mockReturnValue(null);

      expect(() => {
        render(
          <TestWrapper>
            <ClientValidationWidget />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <ClientValidationWidget />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Client');
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Device Configured and Push Token Detected');
    });

    it('should have accessible buttons', () => {
      mockUseClientValidationStatus.mockReturnValue('edge-not-configured');

      render(
        <TestWrapper>
          <ClientValidationWidget />
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
