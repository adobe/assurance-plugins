import { View, Text, Flex, Heading, Divider, Button, Well, ActionGroup, Item, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';

import MonacoEditor from '@monaco-editor/react';

import ViewList from '@spectrum-icons/workflow/ViewList';
import Code from '@spectrum-icons/workflow/Code';
import Copy from '@spectrum-icons/workflow/Copy';
import ViewDetail from '@spectrum-icons/workflow/ViewDetail';

import React, { useState, useMemo } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import dayjs from 'dayjs';

import classNames from 'classnames';

import usePluginState from '../../hooks/usePluginState';
import { copyToClipboard } from '../../utils/clipboard';

import styles from './ContentStateCard.module.css';
import InfoField from './InfoField';
import Card from './card';

interface ContentStateCardProps {
  contentState: any;
  noContentStateMessage: string;
  lastUpdatedTimestamp?: number;
  eventId?: string; // ID of the event that generated this content state
}

const messages = defineMessages({
  viewMode: {
    id: 'contentState.viewMode',
    defaultMessage: 'View Mode'
  },
  formatted: {
    id: 'contentState.formatted',
    defaultMessage: 'Formatted'
  },
  raw: {
    id: 'contentState.raw',
    defaultMessage: 'Raw JSON'
  },
  copyContent: {
    id: 'contentState.copyContent',
    defaultMessage: 'Copy Content'
  },
  contentCopied: {
    id: 'contentState.contentCopied',
    defaultMessage: 'Content copied to clipboard'
  },
  viewEventDetails: {
    id: 'contentState.viewEventDetails',
    defaultMessage: 'View Event Details'
  },
  viewEventDetailsTooltip: {
    id: 'contentState.viewEventDetailsTooltip',
    defaultMessage: 'Navigate to the event that generated this content state'
  }
});

function ContentStateCard({ contentState, noContentStateMessage, lastUpdatedTimestamp, eventId }: ContentStateCardProps) {
  const { formatMessage } = useIntl();
  const { activityNavigation: { navigateToEventDetails } } = usePluginState();
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copySuccess, setCopySuccess] = useState(false);

  // Memoize JSON stringify to avoid expensive recalculations on every render
  const stringifiedContentState = useMemo(() => {
    return JSON.stringify(contentState, null, 2);
  }, [contentState]);

  const handleViewEventDetails = () => {
    if (eventId) {
      navigateToEventDetails(eventId);
    }
  };

  const handleCopy = async () => {
    const content = viewMode === 'formatted' 
      ? JSON.stringify(contentState, null, 2)
      : JSON.stringify(contentState);
    
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      console.warn('Copy functionality is not available. Please manually select and copy the content from the display area.');
    }
  };

  const renderFormattedContent = () => {
    if (!contentState || typeof contentState !== 'object') {
      return (
        <View 
          UNSAFE_className={styles.noContentStateContainer}
        >
          <Text>{String(contentState)}</Text>
        </View>
      );
    }

    const formatValue = (value: any, key: string) => {
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      if (typeof value === 'boolean') return value ? 'true' : 'false';
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'string') {
        // Check if it's a timestamp
        if (key.toLowerCase().includes('time') || key.toLowerCase().includes('date')) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return `${value} (${date.toLocaleString()})`;
          }
        }
        return value;
      }
      if (Array.isArray(value)) {
        return `[${value.length} items] ${JSON.stringify(value)}`;
      }
      if (typeof value === 'object') {
        const keys = Object.keys(value);
        return `{${keys.length} properties} ${JSON.stringify(value)}`;
      }
      return String(value);
    };

    const getValueType = (value: any) => {
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      if (Array.isArray(value)) return 'array';
      return typeof value;
    };

    return (
      <Flex direction="column" gap="size-150">
        {Object.entries(contentState).map(([key, value]) => (
          <View 
            key={key}
            UNSAFE_className={styles.formattedContentItem}
          >
            <Flex direction="row" gap="size-200" alignItems="start">
              <View UNSAFE_className={styles.formattedContentKey}>
                <Text 
                  UNSAFE_className={styles.formattedContentKeyLabel}
                >
                  {key}
                </Text>
                <Text 
                  UNSAFE_className={styles.formattedContentKeyType}
                >
                  {getValueType(value)}
                </Text>
              </View>
              <View UNSAFE_className={styles.formattedContentValue}>
                <Text 
                  UNSAFE_className={classNames(styles.formattedContentValueText, {
                    [styles.monospace]: getValueType(value) !== 'string'
                  })}
                >
                  {formatValue(value, key)}
                </Text>
              </View>
            </Flex>
          </View>
        ))}
      </Flex>
    );
  };

  const renderRawContent = () => (
    <View 
      UNSAFE_className={styles.rawContentContainer}
    >
      <MonacoEditor
        height="200px"
        language="json"
        value={stringifiedContentState}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 12,
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
          theme: 'vs-light'
        }}
      />
    </View>
  );

  return (
    <Card>
      <View padding="size-200" height="100%">
        <Flex direction="column" gap="size-200" height="100%">
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Flex direction="row" alignItems="center" gap="size-200">
              <Heading level={3} marginY="size-0">
                Current Content State
              </Heading>
              {contentState && (                                 
                  <TooltipTrigger>
                    <Button
                      variant="secondary"
                      isQuiet
                      onPress={handleCopy}
                      UNSAFE_className={classNames({
                        [styles.copyButton]: copySuccess
                      })}
                    >
                      <Copy size="S" />
                    </Button>
                    <Tooltip>
                      <Text>{copySuccess ? formatMessage(messages.contentCopied) : formatMessage(messages.copyContent)}</Text>
                    </Tooltip>
                  </TooltipTrigger>                
              )}
            </Flex>
            {contentState && (
              <ActionGroup
                aria-label="Content view mode"
                selectionMode="single"
                selectedKeys={[viewMode]}
                onSelectionChange={() => {
                    setViewMode(prev => (prev === 'formatted' ? 'raw' : 'formatted'));
                }}
                isEmphasized
                density="compact"
                UNSAFE_className={styles.viewModeActionGroup}
              >
                <Item key="formatted">
                  <ViewList size="S" />
                </Item>
                <Item key="raw">
                  <Code size="S" />
                </Item>
              </ActionGroup>
            )}
          </Flex>
          
          <Divider />
          
          <View flex="1" overflow="auto">
            {contentState ? (
              <Well>
                <Flex direction="column" gap="size-200">
                  {/* Content State Summary */}
                  <Flex direction="row" justifyContent="space-between" alignItems="center" marginBottom="size-150">
                    <Text 
                      UNSAFE_className={styles.contentStateSummary}
                    >
                      Content State ({Object.keys(contentState).length} properties)
                    </Text>
                    {eventId && (
                      <TooltipTrigger>
                        <Button
                          variant="secondary"
                          onPress={handleViewEventDetails}
                          UNSAFE_className={styles.viewEventDetailsButton}
                        >
                          <ViewDetail size="XS" />
                          <Text UNSAFE_className={styles.viewEventDetailsButtonText}>
                            {formatMessage(messages.viewEventDetails)}
                          </Text>
                        </Button>
                        <Tooltip>
                          <Text>{formatMessage(messages.viewEventDetailsTooltip)}</Text>
                        </Tooltip>
                      </TooltipTrigger>
                    )}
                  </Flex>
                  
                  {viewMode === 'formatted' ? renderFormattedContent() : renderRawContent()}
                  
                  <Divider />
                  
                  <InfoField
                    label="Last updated"
                    value={lastUpdatedTimestamp 
                      ? dayjs(lastUpdatedTimestamp).format('MMM D, YYYY [at] h:mm:ss A')
                      : 'Unknown'
                    }
                  />
                </Flex>
              </Well>
            ) : (
              <Flex 
                direction="column" 
                alignItems="center" 
                justifyContent="center" 
                height="100%"
                gap="size-200"
              >
                <Text 
                  UNSAFE_className={styles.noContentStateText}
                >
                  {noContentStateMessage}
                </Text>
                <Text 
                  UNSAFE_className={styles.noContentStateHint}
                >
                  Content state will appear here when the activity is updated
                </Text>
              </Flex>
            )}
          </View>
        </Flex>
      </View>
    </Card>
  );
}

export default ContentStateCard;
