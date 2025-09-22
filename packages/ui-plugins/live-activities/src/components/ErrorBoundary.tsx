import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Flex, Button, Heading } from '@adobe/react-spectrum';
import { defineMessages, useIntl } from 'react-intl';
import Alert from '@spectrum-icons/workflow/Alert';
import Refresh from '@spectrum-icons/workflow/Refresh';
import styles from './ErrorBoundary.css';

const messages = defineMessages({
  errorTitle: {
    id: 'error.boundary.title',
    defaultMessage: 'Something went wrong'
  },
  errorDescription: {
    id: 'error.boundary.description',
    defaultMessage: 'An unexpected error occurred in the Live Activities plugin. Please try refreshing the page.'
  },
  retryButton: {
    id: 'error.boundary.retry',
    defaultMessage: 'Try Again'
  },
  refreshButton: {
    id: 'error.boundary.refresh',
    defaultMessage: 'Refresh Page'
  },
  errorDetails: {
    id: 'error.boundary.details',
    defaultMessage: 'Error Details'
  }
});

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class LiveActivitiesErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Live Activities Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback 
        error={this.state.error} 
        onRetry={this.handleRetry}
        onRefresh={this.handleRefresh}
        showDetails={this.props.showDetails}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
  onRefresh: () => void;
  showDetails?: boolean;
}

function ErrorFallback({ error, onRetry, onRefresh, showDetails = false }: ErrorFallbackProps) {
  const { formatMessage } = useIntl();

  return (
    <View 
      padding="size-400" 
      height="100%" 
      UNSAFE_className={styles.errorContainer}
    >
      <Flex 
        direction="column" 
        alignItems="center" 
        gap="size-300"
        UNSAFE_className={styles.errorContent}
      >
        <Alert size="XL" color="negative" />
        
        <Heading level={2} marginY="size-0">
          {formatMessage(messages.errorTitle)}
        </Heading>
        
        <Text UNSAFE_className={styles.errorDescription}>
          {formatMessage(messages.errorDescription)}
        </Text>
        
        <Flex gap="size-200" wrap>
          <Button 
            variant="primary" 
            onPress={onRetry}
            UNSAFE_className={styles.retryButton}
          >
            <Refresh size="S" />
            <Text>{formatMessage(messages.retryButton)}</Text>
          </Button>
          
          <Button 
            variant="secondary" 
            onPress={onRefresh}
            UNSAFE_className={styles.refreshButton}
          >
            <Text>{formatMessage(messages.refreshButton)}</Text>
          </Button>
        </Flex>
        
        {showDetails && error && (
          <View 
            UNSAFE_className={styles.errorDetailsContainer}
          >
            <Text 
              UNSAFE_className={styles.errorDetailsTitle}
            >
              {formatMessage(messages.errorDetails)}:
            </Text>
            <Text 
              UNSAFE_className={styles.errorDetailsText}
            >
              {error.message}
            </Text>
          </View>
        )}
      </Flex>
    </View>
  );
}

export default LiveActivitiesErrorBoundary;
