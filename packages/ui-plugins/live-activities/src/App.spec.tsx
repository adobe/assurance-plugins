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
    const activitiesTab = screen.getByText('Activities');
    expect(activitiesTab).toBeInTheDocument();
  });

  it('should render the events tab', () => {
    render(<App />);
    const eventsTab = screen.getByText('Events');
    expect(eventsTab).toBeInTheDocument();
  });

  it('should render the validation tab', () => {
    render(<App />);
    const validationTab = screen.getByText('Validation');
    expect(validationTab).toBeInTheDocument();
  });
});
