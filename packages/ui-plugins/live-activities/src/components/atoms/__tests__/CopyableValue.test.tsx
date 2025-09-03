/**
 * Test suite for CopyableValue component
 * Tests copy functionality, truncation, and visual feedback
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { CopyableValue } from '../CopyableValue';
import { TEST_IDS } from '../../../constants/testIds';
import { copyToClipboard } from '../../../utils/clipboard';

import { vi } from 'vitest';

// Mock the clipboard utility
vi.mock('../../../utils/clipboard', () => ({
  copyToClipboard: vi.fn(),
}));

const mockCopyToClipboard = copyToClipboard as ReturnType<typeof vi.fn>;

// Test wrapper with React Spectrum Provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider theme={defaultTheme} colorScheme="light">
    {children}
  </Provider>
);

describe('CopyableValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCopyToClipboard.mockResolvedValue(undefined);
  });

  describe('Basic Functionality', () => {
    it('should render short values without truncation', () => {
      render(
        <TestWrapper>
          <CopyableValue 
            value="short-value" 
            testId={TEST_IDS.COPY_BUTTON('test', 0)}
          />
        </TestWrapper>
      );

      expect(screen.getByText('short-value')).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0))).toBeInTheDocument();
    });

    it('should render long values with truncation', () => {
      const longValue = 'a'.repeat(100);
      render(
        <TestWrapper>
          <CopyableValue 
          value={longValue} 
          maxLength={50}
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const truncatedValue = 'a'.repeat(50) + '...';
      expect(screen.getByText(truncatedValue)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0))).toBeInTheDocument();
    });

    it('should handle null/undefined values', () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value={null} 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      // Should render UnknownBadge for null values
      expect(screen.queryByTestId(TEST_IDS.COPY_BUTTON('test', 0))).not.toBeInTheDocument();
    });

    it('should handle numeric values', () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value={12345} 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      expect(screen.getByText('12345')).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0))).toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('should copy value when copy button is clicked', async () => {
      const testValue = 'test-value-to-copy';
      render(
        <TestWrapper>
          <CopyableValue 
          value={testValue} 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockCopyToClipboard).toHaveBeenCalledWith(testValue);
      });
    });

    it('should show visual feedback after copying', async () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      
      // Initially should show copy icon
      expect(copyButton).toBeInTheDocument();
      
      fireEvent.click(copyButton);

      await waitFor(() => {
        // Should show checkmark after copying
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });

    it('should handle clipboard errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockCopyToClipboard.mockRejectedValue(new Error('Clipboard access denied'));

      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      
      // Should not throw error and should handle the rejection gracefully
      fireEvent.click(copyButton);
      
      // Wait for any async operations to complete
      await waitFor(() => {
        expect(mockCopyToClipboard).toHaveBeenCalledWith('test-value');
      });

      // Should log a warning but not show copied state
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error));
      });

      // Should not show copied feedback when error occurs
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Customization', () => {
    it('should use custom maxLength', () => {
      const longValue = 'a'.repeat(100);
      render(
        <TestWrapper>
          <CopyableValue 
          value={longValue} 
          maxLength={30}
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const truncatedValue = 'a'.repeat(30) + '...';
      expect(screen.getByText(truncatedValue)).toBeInTheDocument();
    });

    it('should show full value when showFullValue is true', () => {
      const longValue = 'a'.repeat(100);
      render(
        <TestWrapper>
          <CopyableValue 
          value={longValue} 
          maxLength={50}
          showFullValue={true}
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      expect(screen.getByText(longValue)).toBeInTheDocument();
    });

    it('should use custom tooltip messages', async () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          copyTooltip="Custom copy tooltip"
          copyFullValueTooltip="Custom full value tooltip"
          copiedMessage="Custom copied message"
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Custom copied message')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      expect(copyButton).toHaveAttribute('aria-label', 'Copy');
    });

    it('should have proper ARIA label for full value copy', () => {
      const longValue = 'a'.repeat(100);
      render(
        <TestWrapper>
          <CopyableValue 
          value={longValue} 
          maxLength={50}
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      expect(copyButton).toHaveAttribute('aria-label', 'Copy full value');
    });

    it('should have proper test ID', () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      expect(screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0))).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('should show copy icon initially', () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      expect(copyButton).toBeInTheDocument();
    });

    it('should show checkmark after successful copy', async () => {
      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      fireEvent.click(copyButton);

      await waitFor(() => {
        // Checkmark should be visible
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });

    it('should reset visual state after timeout', async () => {
      vi.useFakeTimers();
      
      render(
        <TestWrapper>
          <CopyableValue 
          value="test-value" 
          testId={TEST_IDS.COPY_BUTTON('test', 0)}
        />
        </TestWrapper>
      );

      const copyButton = screen.getByTestId(TEST_IDS.COPY_BUTTON('test', 0));
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });

      // Fast-forward time
      vi.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });
});
