import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Flex, Button, Heading } from '@adobe/react-spectrum';
import { defineMessages, useIntl } from 'react-intl';
import Alert from '@spectrum-icons/workflow/Alert';
import Refresh from '@spectrum-icons/workflow/Refresh';

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
      UNSAFE_style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px'
      }}
    >
      <Flex 
        direction="column" 
        alignItems="center" 
        gap="size-300"
        UNSAFE_style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}
      >
        <Alert size="XL" color="negative" />
        
        <Heading level={2} marginY="size-0">
          {formatMessage(messages.errorTitle)}
        </Heading>
        
        <Text UNSAFE_style={{ color: 'var(--spectrum-global-color-gray-700)' }}>
          {formatMessage(messages.errorDescription)}
        </Text>
        
        <Flex gap="size-200" wrap>
          <Button 
            variant="primary" 
            onPress={onRetry}
            UNSAFE_style={{ minWidth: '120px' }}
          >
            <Refresh size="S" />
            <Text>{formatMessage(messages.retryButton)}</Text>
          </Button>
          
          <Button 
            variant="secondary" 
            onPress={onRefresh}
            UNSAFE_style={{ minWidth: '120px' }}
          >
            <Text>{formatMessage(messages.refreshButton)}</Text>
          </Button>
        </Flex>
        
        {showDetails && error && (
          <View 
            UNSAFE_style={{
              marginTop: 'var(--spectrum-global-dimension-size-300)',
              padding: 'var(--spectrum-global-dimension-size-200)',
              backgroundColor: 'var(--spectrum-global-color-gray-100)',
              borderRadius: 'var(--spectrum-global-dimension-size-50)',
              border: '1px solid var(--spectrum-global-color-gray-300)',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Text 
              UNSAFE_style={{ 
                fontWeight: 'bold',
                marginBottom: 'var(--spectrum-global-dimension-size-100)'
              }}
            >
              {formatMessage(messages.errorDetails)}:
            </Text>
            <Text 
              UNSAFE_style={{ 
                fontFamily: 'monospace',
                fontSize: 'var(--spectrum-global-dimension-size-100)',
                wordBreak: 'break-word'
              }}
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
