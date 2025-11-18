import { defineMessages } from 'react-intl';

/**
 * Shared form-related messages
 * Common form labels, placeholders, and validation messages
 */
export const formMessages = defineMessages({
  search: {
    id: 'common.form.search',
    defaultMessage: 'Search'
  },
  searchPlaceholder: {
    id: 'common.form.searchPlaceholder',
    defaultMessage: 'Search...'
  },
  filter: {
    id: 'common.form.filter',
    defaultMessage: 'Filter'
  },
  filterBy: {
    id: 'common.form.filterBy',
    defaultMessage: 'Filter by {field}'
  },
  all: {
    id: 'common.form.all',
    defaultMessage: 'All'
  },
  none: {
    id: 'common.form.none',
    defaultMessage: 'None'
  },
  required: {
    id: 'common.form.required',
    defaultMessage: 'Required'
  },
  optional: {
    id: 'common.form.optional',
    defaultMessage: 'Optional'
  }
});

