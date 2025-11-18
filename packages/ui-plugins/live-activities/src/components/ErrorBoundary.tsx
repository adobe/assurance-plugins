import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Flex, Button, Heading } from '@adobe/react-spectrum';
import { useIntl } from 'react-intl';
import Alert from '@spectrum-icons/workflow/Alert';
import Refresh from '@spectrum-icons/workflow/Refresh';
import classNames from 'classnames';
import { errorMessages, actionMessages } from '../i18n';
import './ErrorBoundary.css';

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
      UNSAFE_className={classNames('errorContainer')}
    >
      <Flex 
        direction="column" 
        alignItems="center" 
        gap="size-300"
        UNSAFE_className={classNames('errorContent')}
      >
        <Alert size="XL" color="negative" />
        
        <Heading level={2} marginY="size-0">
          {formatMessage(errorMessages.errorTitle)}
        </Heading>
        
        <Text UNSAFE_className={classNames('errorDescription')}>
          {formatMessage(errorMessages.errorDescription)}
        </Text>
        
        <Flex gap="size-200" wrap>
          <Button 
            variant="primary" 
            onPress={onRetry}
            UNSAFE_className={classNames('retryButton')}
          >
            <Refresh size="S" />
            <Text>{formatMessage(actionMessages.retry)}</Text>
          </Button>
          
          <Button 
            variant="secondary" 
            onPress={onRefresh}
            UNSAFE_className={classNames('refreshButton')}
          >
            <Text>{formatMessage(actionMessages.refresh)}</Text>
          </Button>
        </Flex>
        
        {showDetails && error && (
          <View 
            UNSAFE_className={classNames('errorDetailsContainer')}
          >
            <Text 
              UNSAFE_className={classNames('errorDetailsTitle')}
            >
              {formatMessage(errorMessages.errorDetails)}:
            </Text>
            <Text 
              UNSAFE_className={classNames('errorDetailsText')}
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
