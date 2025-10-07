/**
 * Test suite for Profile Section Widget
 * Tests profile section rendering and data display
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import ProfileSectionWidget from '../profile-section-widget';
import { vi } from 'vitest';

// Mock the hooks
vi.mock('@assurance/plugin-bridge-provider', () => ({
  useSandbox: vi.fn(),
}));

vi.mock('../../../hooks/useDataStreamValidationStatus', () => ({
  default: vi.fn(),
}));

vi.mock('../../../hooks/useLiveActivitiesValidationStatus', () => ({
  useLiveActivitiesValidationStatus: vi.fn(),
}));

vi.mock('../../../hooks/useProfile', () => ({
  default: vi.fn(),
}));

vi.mock('../../../utils/utils', () => ({
  renderValue: vi.fn(),
}));

vi.mock('../data-stream-status-details', () => ({
  default: ({ status, profileId }: any) => (
    <div data-testid="data-stream-status-details">
      Data Stream Status: {String(status)}, Profile ID: {profileId}
    </div>
  ),
}));

// Import mocked modules
import { useSandbox } from '@assurance/plugin-bridge-provider';
import useDataStreamValidationStatus from '../../../hooks/useDataStreamValidationStatus';
import { useLiveActivitiesValidationStatus } from '../../../hooks/useLiveActivitiesValidationStatus';
import useProfile from '../../../hooks/useProfile';
import { renderValue } from '../../../utils/utils';

const mockUseSandbox = useSandbox as ReturnType<typeof vi.fn>;
const mockUseDataStreamValidationStatus = useDataStreamValidationStatus as ReturnType<typeof vi.fn>;
const mockUseLiveActivitiesValidationStatus = useLiveActivitiesValidationStatus as ReturnType<typeof vi.fn>;
const mockUseProfile = useProfile as ReturnType<typeof vi.fn>;
const mockRenderValue = renderValue as ReturnType<typeof vi.fn>;

// Test wrapper with React Spectrum Provider and IntlProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </Provider>
);

describe('ProfileSectionWidget', () => {
  const mockSandbox = { name: 'test-sandbox' };
  const mockProfile = {
    data: {
      entityId: 'test-profile-123',
      entity: {
        pushNotificationDetails: [{
          pushToken: 'test-push-token',
          platform: 'apns'
        }],
        liveActivityPushNotificationDetails: [{
          pushToken: 'test-live-activity-token',
          platform: 'apns'
        }]
      }
    },
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSandbox.mockReturnValue(mockSandbox);
    mockUseDataStreamValidationStatus.mockReturnValue(false); // valid status
    mockUseLiveActivitiesValidationStatus.mockReturnValue({
      status: 'valid',
      message: 'Live Activities supported'
    });
    mockUseProfile.mockReturnValue(mockProfile);
    mockRenderValue.mockImplementation((value) => value || 'N/A');
  });

  describe('Basic Rendering', () => {
    it('should render the profile section with heading', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should render data stream status details', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByTestId('data-stream-status-details')).toBeInTheDocument();
      expect(screen.getByText(/Data Stream Status: false/)).toBeInTheDocument();
      expect(screen.getByText(/Profile ID: test-profile-123/)).toBeInTheDocument();
    });

    it('should render profile data table', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      // Check for table headers
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when profile is loading', () => {
      mockUseProfile.mockReturnValue({
        ...mockProfile,
        isLoading: true
      });

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });

    it('should show loading spinner when profile data is missing', () => {
      mockUseProfile.mockReturnValue({
        data: null,
        isLoading: false
      });

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });
  });

  describe('Profile Data Display', () => {
    it('should display push notification details', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Push Token')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
    });

    it('should display push notification details', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Push Token')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
    });

    it('should handle missing push notification details', () => {
      const profileWithoutPush = {
        ...mockProfile,
        data: {
          ...mockProfile.data,
          entity: {
            ...mockProfile.data.entity,
            pushNotificationDetails: []
          }
        }
      };

      mockUseProfile.mockReturnValue(profileWithoutPush);

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Push Token')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
    });

    it('should handle missing live activity push notification details', () => {
      const profileWithoutLiveActivity = {
        ...mockProfile,
        data: {
          ...mockProfile.data,
          entity: {
            ...mockProfile.data.entity,
            liveActivityPushNotificationDetails: []
          }
        }
      };

      mockUseProfile.mockReturnValue(profileWithoutLiveActivity);

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Push Token')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
    });
  });

  describe('Data Stream Validation Status', () => {
    it('should pass validation status to DataStreamStatusDetails', () => {
      mockUseDataStreamValidationStatus.mockReturnValue('invalid-dataset');

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Data Stream Status: invalid-dataset, Profile ID: test-profile-123')).toBeInTheDocument();
    });

    it('should pass profile ID to DataStreamStatusDetails', () => {
      const profileWithDifferentId = {
        ...mockProfile,
        data: {
          ...mockProfile.data,
          entityId: 'different-profile-456'
        }
      };

      mockUseProfile.mockReturnValue(profileWithDifferentId);

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText(/Data Stream Status: false/)).toBeInTheDocument();
      expect(screen.getByText(/Profile ID: different-profile-456/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing profile data gracefully', () => {
      mockUseProfile.mockReturnValue({
        data: null,
        isLoading: false
      });

      expect(() => {
        render(
          <TestWrapper>
            <ProfileSectionWidget />
          </TestWrapper>
        );
      }).not.toThrow();

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });

    it('should handle missing entity data gracefully', () => {
      const profileWithoutEntity = {
        ...mockProfile,
        data: {
          ...mockProfile.data,
          entity: null
        }
      };

      mockUseProfile.mockReturnValue(profileWithoutEntity);

      expect(() => {
        render(
          <TestWrapper>
            <ProfileSectionWidget />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle null/undefined values gracefully', () => {
      mockUseSandbox.mockReturnValue(null);
      mockUseDataStreamValidationStatus.mockReturnValue(null);
      mockUseLiveActivitiesValidationStatus.mockReturnValue(null);
      mockUseProfile.mockReturnValue({
        data: null,
        isLoading: false
      });

      expect(() => {
        render(
          <TestWrapper>
            <ProfileSectionWidget />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Profile');
    });

    it('should have proper table structure', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      // Check for table headers
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });

    it('should have accessible loading state', () => {
      mockUseProfile.mockReturnValue({
        ...mockProfile,
        isLoading: true
      });

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
    });
  });

  describe('Data Rendering', () => {
    it('should use renderValue for displaying values', () => {
      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      // renderValue should be called for the values
      expect(mockRenderValue).toHaveBeenCalled();
    });

    it('should handle empty profile data', () => {
      const emptyProfile = {
        data: {
          entityId: 'test-profile-123',
          entity: {
            pushNotificationDetails: [],
            liveActivityPushNotificationDetails: []
          }
        },
        isLoading: false
      };

      mockUseProfile.mockReturnValue(emptyProfile);

      render(
        <TestWrapper>
          <ProfileSectionWidget />
        </TestWrapper>
      );

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByTestId('data-stream-status-details')).toBeInTheDocument();
    });
  });
});
