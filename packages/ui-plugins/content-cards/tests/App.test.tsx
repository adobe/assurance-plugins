import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '../src/App';

describe('Content Cards UI Plugin', () => {
  it('should render events table', async () => {
    await render(<App />);
    expect(await screen.getByLabelText('validation')).toBeInTheDocument();
  });
});
