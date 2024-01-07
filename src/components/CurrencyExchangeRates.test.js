import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import CurrencyExchangeRates from './CurrencyExchangeRates';

// Mocking Axios for API calls
jest.mock('axios');

describe('CurrencyExchangeRates Component', () => {
  test('renders exchange rates on successful API call', async () => {
    const mockExchangeRates = [
      { symbol: 'USDCAD', rate: 1.25 },
      { symbol: 'GBPUSD', rate: 1.32 },
    ];

    axios.get.mockResolvedValueOnce({ data: mockExchangeRates });

    render(<CurrencyExchangeRates />);

    await waitFor(() => {
      expect(screen.getByText('USDCAD')).toBeInTheDocument();
      expect(screen.getByText('GBPUSD')).toBeInTheDocument();
    });
  });

  test('renders error message on failed API call', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<CurrencyExchangeRates />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching exchange rates. Please try again.')).toBeInTheDocument();
    });
  });

  test('triggers manual refresh on button click', async () => {
    const mockExchangeRates = [
      { symbol: 'USDCAD', rate: 1.25 },
    ];

    axios.get.mockResolvedValueOnce({ data: mockExchangeRates });

    render(<CurrencyExchangeRates />);

    await waitFor(() => {
      expect(screen.getByText('USDCAD')).toBeInTheDocument();
    });

    axios.get.mockResolvedValueOnce({ data: [] });

    userEvent.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(screen.queryByText('USDCAD')).not.toBeInTheDocument();
    });
  });
});
