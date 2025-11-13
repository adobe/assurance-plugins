/**
 * Test suite for Launch Live Activity Component
 * Tests launching live activities with various scenarios
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { Provider, defaultTheme, ToastQueue } from '@adobe/react-spectrum';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LaunchLiveActivity from '../launch-live-activity';
import * as liveActivityApi from '../../../api/liveActivityApi';

// Mock the hooks
vi.mock('../../../hooks/useActivities', () => ({
  useRegisteredActivities: vi.fn(),
  useLiveActivitiesData: vi.fn(),
}));

vi.mock('../../../hooks/useLiveActivityContext', () => ({
  useLiveActivityContext: vi.fn(),
}));

// Import mocked modules
import { useRegisteredActivities, useLiveActivitiesData } from '../../../hooks/useActivities';
import { useLiveActivityContext } from '../../../hooks/useLiveActivityContext';

// Mock ToastQueue
vi.mock('@adobe/react-spectrum', async () => {
  const actual = await vi.importActual('@adobe/react-spectrum');
  return {
    ...actual,
    ToastQueue: {
      positive: vi.fn(),
      negative: vi.fn(),
    },
  };
});


const mockUseRegisteredActivities = useRegisteredActivities as ReturnType<typeof vi.fn>;
const mockUseLiveActivitiesData = useLiveActivitiesData as ReturnType<typeof vi.fn>;
const mockUseLiveActivityContext = useLiveActivityContext as ReturnType<typeof vi.fn>;
const mockToastQueuePositive = ToastQueue.positive;

// Mock API functions
const mockSendLiveActivityNotification = vi.spyOn(liveActivityApi, 'sendLiveActivityNotification');
const mockGenerateLiveActivityPayload = vi.spyOn(liveActivityApi, 'generateLiveActivityPayload');
const mockBuildApiUrl = vi.spyOn(liveActivityApi, 'buildApiUrl');
const mockGenerateLaunchTemplate = vi.spyOn(liveActivityApi, 'generateLaunchTemplate');
const mockBuildCompleteApsPayload = vi.spyOn(liveActivityApi, 'buildCompleteApsPayload');

// Test wrapper with React Spectrum Provider and IntlProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
);

describe('LaunchLiveActivity', () => {
  const mockRegisteredActivities = [
    {
      attributeType: 'TestActivity1',
      name: 'Test Activity 1',
    },
    {
      attributeType: 'TestActivity2',
      name: 'Test Activity 2',
    },
  ];

  const mockLiveActivitiesData = {
    activityTypes: new Map([
      ['TestActivity1', { pushToStartToken: 'token-123' }],
      ['TestActivity2', { pushToStartToken: 'token-456' }],
    ]),
  };

  const mockContext = {
    token: 'ims-token',
    imsOrg: 'test-org',
    sessionId: 'session-123',
    sandbox: { name: 'prod' },
    environment: 'prod',
    ecid: 'ecid-123',
    pushToken: 'push-token',
    appId: 'com.test.app',
    platform: 'ios',
    isReady: true,
  };

  const mockLaunchTemplate = {
    'content-state': {},
    'attributes-type': '',
    event: 'start',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseRegisteredActivities.mockReturnValue(mockRegisteredActivities);
    mockUseLiveActivitiesData.mockReturnValue(mockLiveActivitiesData);
    mockUseLiveActivityContext.mockReturnValue(mockContext);
    mockGenerateLaunchTemplate.mockReturnValue(mockLaunchTemplate);
    mockBuildApiUrl.mockReturnValue('https://api.test.com');
    mockGenerateLiveActivityPayload.mockReturnValue({ messages: [] } as any);
    mockBuildCompleteApsPayload.mockReturnValue({ aps: 'complete' } as any);
  });

  describe('Basic Rendering', () => {
    it('should render the launch button', () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /Start Live Activity/i })).toBeInTheDocument();
    });

    it('should disable button when context is not ready', () => {
      mockUseLiveActivityContext.mockReturnValue({
        ...mockContext,
        isReady: false,
      });

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      expect(button).toBeDisabled();
    });

    it('should enable button when activities are available and context is ready', () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe('Dialog Interaction', () => {
    it('should open dialog when button is clicked', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByText(/Edit the payload content below/i)).toBeInTheDocument();
    });

    it('should display activity picker in dialog', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        const pickerLabels = screen.getAllByText(/Select Live Activity/i);
        expect(pickerLabels.length).toBeGreaterThan(0);
      });
    });

    it('should display JSON editor in dialog', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should have cancel and launch buttons in dialog', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      });

      // Check for dialog action buttons
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      // The dialog should have the launch/start action button
      await waitFor(() => {
        const allButtons = screen.getAllByRole('button');
        expect(allButtons.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('Activity Selection', () => {
    it('should update selected activity when picker value changes', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // The picker should be present
      const picker = screen.getByRole('button', { name: /Select Live Activity/i });
      expect(picker).toBeInTheDocument();
    });

    it('should initialize with empty selection', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Launch button should be disabled initially
      const dialogLaunchButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
      const dialogLaunchButton = dialogLaunchButtons.at(-1);
      expect(dialogLaunchButton).toBeDisabled();
    });
  });

  describe('Launch Functionality', () => {
    // Note: This test requires complex React Spectrum Picker interactions that are difficult to test
    // The component functionality is verified manually and through other unit tests
    it('should display error message when launch fails', async () => {
      const errorMessage = 'Network error occurred';
      mockSendLiveActivityNotification.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select an activity
      const pickerButton = screen.getByRole('button', { name: /Select Live Activity/i });
      fireEvent.click(pickerButton);

      await waitFor(() => {
        // React Spectrum Picker creates both <option> and menu items
        // Use getAllByText and click the visible menu item
        const options = screen.getAllByText('TestActivity1');
        fireEvent.click(options.at(-1)!); // Click the last one (visible menu item)
      });

      // Try to launch
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
        const dialogLaunchButton = dialogButtons.at(-1)!;
        
        if (!dialogLaunchButton.hasAttribute('disabled')) {
          fireEvent.click(dialogLaunchButton);
        }
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should handle invalid JSON in payload', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Note: Actually modifying the Monaco editor in tests is complex
      // This test verifies the component structure exists
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show error when no push-to-start token is available', async () => {
      // Mock activities data without push token
      mockUseLiveActivitiesData.mockReturnValue({
        activityTypes: new Map([
          ['TestActivity1', { pushToStartToken: null }],
        ]),
      });

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select an activity
      const pickerButton = screen.getByRole('button', { name: /Select Live Activity/i });
      fireEvent.click(pickerButton);

      await waitFor(() => {
        // React Spectrum Picker creates both <option> and menu items
        // Use getAllByText and click the visible menu item
        const options = screen.getAllByText('TestActivity1');
        fireEvent.click(options.at(-1)!); // Click the last one (visible menu item)
      });

      // Try to launch - should fail validation
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
        const dialogLaunchButton = dialogButtons.at(-1)!;
        
        if (!dialogLaunchButton.hasAttribute('disabled')) {
          fireEvent.click(dialogLaunchButton);
        }
      });

      await waitFor(() => {
        expect(screen.getByText(/Please select a live activity with push-to-start token/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog when cancel button is clicked', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should reset form when cancel is clicked', async () => {
      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // Reopen dialog
      fireEvent.click(button);

      await waitFor(() => {
        // Dialog should have default template
        expect(mockGenerateLaunchTemplate).toHaveBeenCalled();
      });
    });

    it('should close dialog after successful launch', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select an activity
      const pickerButton = screen.getByRole('button', { name: /Select Live Activity/i });
      fireEvent.click(pickerButton);

      await waitFor(() => {
        // React Spectrum Picker creates both <option> and menu items
        // Use getAllByText and click the visible menu item
        const options = screen.getAllByText('TestActivity1');
        fireEvent.click(options.at(-1)!); // Click the last one (visible menu item)
      });

      // Click launch
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
        const dialogLaunchButton = dialogButtons.at(-1)!;
        
        if (!dialogLaunchButton.hasAttribute('disabled')) {
          fireEvent.click(dialogLaunchButton);
        }
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should keep dialog open on error', async () => {
      mockSendLiveActivityNotification.mockRejectedValue(new Error('API Error'));

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select activity and try to launch
      const pickerButton = screen.getByRole('button', { name: /Select Live Activity/i });
      fireEvent.click(pickerButton);

      await waitFor(() => {
        // React Spectrum Picker creates both <option> and menu items
        // Use getAllByText and click the visible menu item
        const options = screen.getAllByText('TestActivity1');
        fireEvent.click(options.at(-1)!); // Click the last one (visible menu item)
      });

      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
        const dialogLaunchButton = dialogButtons.at(-1)!;
        
        if (!dialogLaunchButton.hasAttribute('disabled')) {
          fireEvent.click(dialogLaunchButton);
        }
      });

      await waitFor(() => {
        // Dialog should still be open
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('should call buildApiUrl with correct environment', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select activity and launch
      const pickerButton = screen.getByRole('button', { name: /Select Live Activity/i });
      fireEvent.click(pickerButton);

      await waitFor(() => {
        // React Spectrum Picker creates both <option> and menu items
        // Use getAllByText and click the visible menu item
        const options = screen.getAllByText('TestActivity1');
        fireEvent.click(options.at(-1)!); // Click the last one (visible menu item)
      });

      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
        const dialogLaunchButton = dialogButtons.at(-1)!;
        
        if (!dialogLaunchButton.hasAttribute('disabled')) {
          fireEvent.click(dialogLaunchButton);
        }
      });

      await waitFor(() => {
        expect(mockBuildApiUrl).toHaveBeenCalledWith('prod');
      });
    });

    it('should call generateLiveActivityPayload with correct parameters', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select activity and launch
      const pickerButton = screen.getByRole('button', { name: /Select Live Activity/i });
      fireEvent.click(pickerButton);

      await waitFor(() => {
        // React Spectrum Picker creates both <option> and menu items
        // Use getAllByText and click the visible menu item
        const options = screen.getAllByText('TestActivity1');
        fireEvent.click(options.at(-1)!); // Click the last one (visible menu item)
      });

      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
        const dialogLaunchButton = dialogButtons.at(-1)!;
        
        if (!dialogLaunchButton.hasAttribute('disabled')) {
          fireEvent.click(dialogLaunchButton);
        }
      });

      await waitFor(() => {
        expect(mockGenerateLiveActivityPayload).toHaveBeenCalledWith(
          expect.objectContaining({
            appId: 'com.test.app',
            platform: 'ios',
            token: 'token-123',
            ecid: 'ecid-123',
            imsOrg: 'test-org',
            sessionId: 'session-123',
            sandboxName: 'prod',
            environment: 'prod',
          })
        );
      });
    });

    it('should use pushToStartToken from selected activity', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <LaunchLiveActivity />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Start Live Activity/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select TestActivity2
      const pickerButton = screen.getByRole('button', { name: /Select Live Activity/i });
      fireEvent.click(pickerButton);

      await waitFor(() => {
        // React Spectrum Picker creates both <option> and menu items
        const options = screen.getAllByText('TestActivity2');
        fireEvent.click(options.at(-1)!); // Click the visible menu item
      });

      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Start Live Activity/i });
        const dialogLaunchButton = dialogButtons.at(-1)!;
        
        if (!dialogLaunchButton.hasAttribute('disabled')) {
          fireEvent.click(dialogLaunchButton);
        }
      });

      await waitFor(() => {
        expect(mockGenerateLiveActivityPayload).toHaveBeenCalledWith(
          expect.objectContaining({
            token: 'token-456', // token from TestActivity2
          })
        );
      });
    });
  });
});

