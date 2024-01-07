import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import IpoCalendar from './IpoCalendar';

// Mocking Axios for API calls
jest.mock('axios');

describe('IpoCalendar Component', () => {
  test('renders IPO data on successful API call', async () => {
    const mockIpoData = [
      { id: 1, companyName: 'Company A', symbol: 'A' },
      { id: 2, companyName: 'Company B', symbol: 'B' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockIpoData });

    render(<IpoCalendar />);

    await waitFor(() => {
      expect(screen.getByText('Company A')).toBeInTheDocument();
      expect(screen.getByText('Company B')).toBeInTheDocument();
    });
  });

  test('renders error message on failed API call', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<IpoCalendar />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching IPO data. Please try again.')).toBeInTheDocument();
    });
  });

  test('triggers manual refresh on button click', async () => {
    const mockIpoData = [
      { id: 1, companyName: 'Company A', symbol: 'A' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockIpoData });

    render(<IpoCalendar />);

    await waitFor(() => {
      expect(screen.getByText('Company A')).toBeInTheDocument();
    });

    axios.get.mockResolvedValueOnce({ data: [] }); 

    userEvent.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(screen.queryByText('Company A')).not.toBeInTheDocument();
    });
  });
});
