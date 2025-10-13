import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import React from 'react';

const renderApp = () => render(<App />);

describe('App', () => {
  it('should render', () => {
    render(<App />);
  });

  it('should render the activities tab', () => {
    render(<App />);
    const activitiesTab = screen.getByRole('tab', { name: 'Activities' });
    expect(activitiesTab).toBeInTheDocument();
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
});
