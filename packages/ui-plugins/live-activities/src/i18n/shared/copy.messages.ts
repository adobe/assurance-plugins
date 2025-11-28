import { defineMessages } from 'react-intl';

/**
 * Shared copy/clipboard messages
 * Used for copy-to-clipboard functionality across components
 */
export const copyMessages = defineMessages({
  copy: {
    id: 'common.copy.action',
    defaultMessage: 'Copy'
  },
  copyValue: {
    id: 'common.copy.value',
    defaultMessage: 'Copy value'
  },
  copyFullValue: {
    id: 'common.copy.fullValue',
    defaultMessage: 'Copy full value'
  },
  copyContent: {
    id: 'common.copy.content',
    defaultMessage: 'Copy Content'
  },
  copied: {
    id: 'common.copy.success',
    defaultMessage: 'Copied!'
  },
  contentCopied: {
    id: 'common.copy.contentSuccess',
    defaultMessage: 'Content copied to clipboard'
  }
});
