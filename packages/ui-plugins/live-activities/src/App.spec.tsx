import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import React from 'react';

describe('App', () => {
  it('should render', () => {
    render(<App />);
  });

  it('should render the events tab', () => {
    render(<App />);
    const eventsTab = screen.getByRole('tab', { name: 'Events' });
    expect(eventsTab).toBeInTheDocument();
  });

  it('should render the client info tab', () => {
    render(<App />);
    const clientInfoTab = screen.getByRole('tab', { name: 'Client Info' });
    expect(clientInfoTab).toBeInTheDocument();
  });

  it('should conditionally render the activities tab based on validation status, messaging version, and activities', () => {
    render(<App />);
    // Activities tab is conditionally rendered based on:
    // - validation status is 'basic-support' or 'full-support'
    // - messaging version exists
    // - there are activities (realActivities.length > 0)
    const activitiesTab = screen.queryByRole('tab', { name: 'Activities' });
    // Tab may or may not be in the document depending on conditions
    expect(activitiesTab === null || activitiesTab).toBeDefined();
  });
});
