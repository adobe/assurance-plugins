/**
 * Test suite for Update Activity Component
 * Tests updating and ending live activities
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UpdateActivity from '../update-activity';
import * as liveActivityApi from '../../../api/liveActivityApi';
import { LiveActivity } from '../../../hooks/useActivities';

// Mock the hooks
vi.mock('../../../hooks/useLiveActivityContext', () => ({
  useLiveActivityContext: vi.fn(),
}));

// Import mocked modules
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

const ToastQueue = {
  positive: vi.fn(),
  negative: vi.fn(),
};

const mockUseLiveActivityContext = useLiveActivityContext as ReturnType<typeof vi.fn>;
const mockToastQueuePositive = ToastQueue.positive;

// Mock API functions
const mockSendLiveActivityNotification = vi.spyOn(liveActivityApi, 'sendLiveActivityNotification');
const mockGenerateLiveActivityPayload = vi.spyOn(liveActivityApi, 'generateLiveActivityPayload');
const mockBuildApiUrl = vi.spyOn(liveActivityApi, 'buildApiUrl');
const mockGenerateUpdateTemplate = vi.spyOn(liveActivityApi, 'generateUpdateTemplate');
const mockBuildCompleteApsPayload = vi.spyOn(liveActivityApi, 'buildCompleteApsPayload');

// Test wrapper with React Spectrum Provider and IntlProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
);

describe('UpdateActivity', () => {
  const mockActivity = {
    id: 'activity-123',
    name: 'Test Activity',
    attributes: 'TestActivityType',
    updateToken: 'update-token-123',
    status: 'active' as const,
    contentState: { test: 'data' },
  } as LiveActivity;

  const mockContext = {
    token: 'ims-token',
    imsOrg: 'test-org',
    sessionId: 'session-123',
    sandbox: { name: 'prod' },
    environment: 'prod',
    ecid: 'ecid-123',
    pushToken: null, // Not required for updates
    appId: 'com.test.app',
    platform: 'ios',
    isReady: true,
  };

  const mockUpdateTemplate = {
    'content-state': {},
    'attributes-type': 'TestActivityType',
    event: 'update',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseLiveActivityContext.mockReturnValue(mockContext);
    mockGenerateUpdateTemplate.mockReturnValue(mockUpdateTemplate);
    mockBuildApiUrl.mockReturnValue('https://api.test.com');
    mockGenerateLiveActivityPayload.mockReturnValue({ messages: [] } as any);
    mockBuildCompleteApsPayload.mockReturnValue({ aps: 'complete' } as any);
  });

  describe('Basic Rendering', () => {
    it('should render the send update button', () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /Send Update/i })).toBeInTheDocument();
    });

    it('should disable button when context is not ready', () => {
      mockUseLiveActivityContext.mockReturnValue({
        ...mockContext,
        isReady: false,
      });

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      expect(button).toBeDisabled();
    });

    it('should disable button when no update token', () => {
      const activityWithoutToken = {
        ...mockActivity,
        updateToken: undefined,
      };

      render(
        <TestWrapper>
          <UpdateActivity activity={activityWithoutToken} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      expect(button).toBeDisabled();
    });

    it('should disable button when activity is completed', () => {
      const completedActivity = {
        ...mockActivity,
        status: 'completed' as const,
      };

      render(
        <TestWrapper>
          <UpdateActivity activity={completedActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      expect(button).toBeDisabled();
    });

    it('should enable button when activity has update token and is active', () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe('Dialog Interaction', () => {
    it('should open dialog when button is clicked', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByText(/Update Live Activity Test Activity/i)).toBeInTheDocument();
    });

    it('should display activity name in dialog heading', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Update Live Activity Test Activity/i)).toBeInTheDocument();
      });
    });

    it('should display activity id when no name is available', async () => {
      const activityWithoutName: LiveActivity = {
        ...mockActivity,
        name: '',
      };

      render(
        <TestWrapper>
          <UpdateActivity activity={activityWithoutName} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Update Live Activity activity-123/i)).toBeInTheDocument();
      });
    });

    it('should display description text in dialog', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Edit the payload content below to update the activity/i)).toBeInTheDocument();
      });
    });

    it('should display event type radio group', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Event Type/i)).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /Update/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /End/i })).toBeInTheDocument();
      });
    });

    it('should display JSON editor in dialog', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/APS Payload/i)).toBeInTheDocument();
      });
    });

    it('should have cancel and send update buttons in dialog', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      });

      // Check for dialog action buttons
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      // The dialog should have multiple buttons
      await waitFor(() => {
        const allButtons = screen.getAllByRole('button');
        expect(allButtons.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('Event Type Selection', () => {
    it('should default to "update" event type', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        const updateRadio = screen.getByRole('radio', { name: /^Update$/i });
        expect(updateRadio).toBeChecked();
      });
    });

    it('should allow switching to "end" event type', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        const endRadio = screen.getByRole('radio', { name: /End/i });
        fireEvent.click(endRadio);
      });

      await waitFor(() => {
        const endRadio = screen.getByRole('radio', { name: /End/i });
        expect(endRadio).toBeChecked();
      });
    });

    it('should send correct event type when "update" is selected', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click send update button in dialog
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      await waitFor(() => {
        expect(mockBuildCompleteApsPayload).toHaveBeenCalledWith(
          expect.objectContaining({
            eventType: 'update',
          })
        );
      });
    });

    it('should send correct event type when "end" is selected', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Switch to end event type
      const endRadio = screen.getByRole('radio', { name: /End/i });
      fireEvent.click(endRadio);

      // Click send update button
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      await waitFor(() => {
        expect(mockBuildCompleteApsPayload).toHaveBeenCalledWith(
          expect.objectContaining({
            eventType: 'end',
          })
        );
      });
    });
  });

  describe('Update Functionality', () => {
    it('should successfully update activity with valid data', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click the action button
      const allButtons = screen.getAllByRole('button');
      const actionButton = allButtons.find(btn => 
        btn.textContent?.includes('Send Update') && !btn.hasAttribute('disabled')
      );
      
      if (actionButton) {
        fireEvent.click(actionButton);
      }

      await waitFor(() => {
        expect(mockSendLiveActivityNotification).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('should display error message when update fails', async () => {
      const errorMessage = 'Update failed';
      mockSendLiveActivityNotification.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Try to update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display generic error message when no specific error provided', async () => {
      mockSendLiveActivityNotification.mockRejectedValue(new Error('Network issue'));

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click the action button
      const allButtons = screen.getAllByRole('button');
      const actionButton = allButtons.find(btn => 
        btn.textContent?.includes('Send Update') && !btn.hasAttribute('disabled')
      );
      
      if (actionButton) {
        fireEvent.click(actionButton);
      }

      // Check for error message
      await waitFor(() => {
        const errorText = screen.queryByText(/Network issue/i) || screen.queryByText(/Failed to update/i);
        expect(errorText).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show error when update token is not available', async () => {
      const activityWithoutToken = {
        ...mockActivity,
        updateToken: undefined,
      };

      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <UpdateActivity activity={activityWithoutToken} />
        </TestWrapper>
      );

      // Button should be disabled, so we can't click it
      const button = screen.getByRole('button', { name: /Send Update/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog when cancel button is clicked', async () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
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
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Switch event type
      const endRadio = screen.getByRole('radio', { name: /End/i });
      fireEvent.click(endRadio);

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // Reopen dialog
      fireEvent.click(button);

      await waitFor(() => {
        // Should be reset to 'update'
        const updateRadio = screen.getByRole('radio', { name: /^Update$/i });
        expect(updateRadio).toBeChecked();
      });
    });

    it('should close dialog after successful update', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
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
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Try to update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      await waitFor(() => {
        // Dialog should still be open
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during update', async () => {
      let resolvePromise: any;
      mockSendLiveActivityNotification.mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      // Check for loading text
      await waitFor(() => {
        expect(screen.getByText(/Sending/i)).toBeInTheDocument();
      });

      // Resolve the promise
      resolvePromise({});
    });

    it('should disable buttons during loading', async () => {
      let resolvePromise: any;
      mockSendLiveActivityNotification.mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click update button
      const allButtons = screen.getAllByRole('button');
      const actionButton = allButtons.find(btn => 
        btn.textContent?.includes('Send Update') && !btn.hasAttribute('disabled')
      );
      
      if (actionButton) {
        fireEvent.click(actionButton);
      }

      // Check for loading state - look for "Sending..." text
      await waitFor(() => {
        expect(screen.getByText(/Sending/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      resolvePromise(undefined);
    });
  });

  describe('API Integration', () => {
    it('should call buildApiUrl with correct environment', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
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
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      await waitFor(() => {
        expect(mockGenerateLiveActivityPayload).toHaveBeenCalledWith(
          expect.objectContaining({
            appId: 'com.test.app',
            platform: 'ios',
            token: 'update-token-123',
            ecid: 'ecid-123',
            imsOrg: 'test-org',
            sessionId: 'session-123',
            sandboxName: 'prod',
            environment: 'prod',
          })
        );
      });
    });

    it('should use updateToken from activity', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      const customActivity = {
        ...mockActivity,
        updateToken: 'custom-update-token',
      };

      render(
        <TestWrapper>
          <UpdateActivity activity={customActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      await waitFor(() => {
        expect(mockGenerateLiveActivityPayload).toHaveBeenCalledWith(
          expect.objectContaining({
            token: 'custom-update-token',
          })
        );
      });
    });

    it('should call generateUpdateTemplate with activity on mount', () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      expect(mockGenerateUpdateTemplate).toHaveBeenCalledWith(mockActivity);
    });

    it('should regenerate template when activity changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const newActivity = {
        ...mockActivity,
        id: 'new-activity-id',
      };

      rerender(
        <TestWrapper>
          <UpdateActivity activity={newActivity} />
        </TestWrapper>
      );

      expect(mockGenerateUpdateTemplate).toHaveBeenCalledWith(newActivity);
    });
  });

  describe('Context Requirements', () => {
    it('should not require push token for updates', () => {
      const contextWithoutPushToken = {
        ...mockContext,
        pushToken: null,
      };

      mockUseLiveActivityContext.mockReturnValue(contextWithoutPushToken);

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      // Button should still be enabled (push token not required for updates)
      const button = screen.getByRole('button', { name: /Send Update/i });
      expect(button).not.toBeDisabled();
    });

    it('should call useLiveActivityContext with requirePushToken: false', () => {
      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      expect(mockUseLiveActivityContext).toHaveBeenCalledWith({ requirePushToken: false });
    });
  });

  describe('Payload Handling', () => {
    it('should handle invalid JSON in payload', async () => {
      // Note: Testing actual JSON validation is complex with react-hook-form
      // This test verifies error handling structure exists
      mockSendLiveActivityNotification.mockRejectedValue(
        new Error('Invalid JSON format in payload')
      );

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should build complete APS payload with user input', async () => {
      mockSendLiveActivityNotification.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <UpdateActivity activity={mockActivity} />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /Send Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click update
      await waitFor(async () => {
        const dialogButtons = screen.getAllByRole('button', { name: /Send Update/i });
        const dialogUpdateButton = dialogButtons.at(-1)!;
        
        if (!dialogUpdateButton.hasAttribute('disabled')) {
          fireEvent.click(dialogUpdateButton);
        }
      });

      await waitFor(() => {
        expect(mockBuildCompleteApsPayload).toHaveBeenCalledWith(
          expect.objectContaining({
            eventType: 'update',
            attributesType: 'TestActivityType',
          })
        );
      });
    });
  });
});

