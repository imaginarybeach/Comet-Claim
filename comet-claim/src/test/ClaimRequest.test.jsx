import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import ClaimRequest from '../pages/ClaimRequest'; 

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  global.fetch.mockClear();
});

describe('ClaimRequest', () => {
  it('fetches and displays lost items to claim', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          itemName: 'Phone',
          category: 'Electronics',
          locationFound: 'ECS',
          foundDate: '2024-01-01',
          status: 'Lost',
          imageUrl: 'laptop.jpg',
        },
      ],
    });

    render(<ClaimRequest />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => screen.getByText(/Phone/));

    expect(screen.getByTestId('item-name-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-location-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-status-1')).toBeInTheDocument();
  });

  
  it('submits claim successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          itemName: 'Phone',
          category: 'Electronics',
          locationFound: 'ECS',
          foundDate: '2024-01-01',
          status: 'Lost',
          imageUrl: 'laptop.jpg',
        },
      ],
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Claim submitted successfully' }),
    });

    render(<ClaimRequest />);

    await waitFor(() => screen.getByText(/Phone/));

    fireEvent.click(screen.getByTestId('item-name-1'));

    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Celina' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'celina@example.com' } });
    fireEvent.change(screen.getByTestId('input-description'), { target: { value: 'lost it in ECS' } });

    fireEvent.click(screen.getByTestId('submit-button'));

  // Mock the alert function
  window.alert = vi.fn();

  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Claim request submitted successfully! The staff will review your claim.'));
  });
});
