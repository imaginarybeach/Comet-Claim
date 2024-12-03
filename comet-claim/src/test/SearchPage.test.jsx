import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchPage from '../pages/SearchPage';

vi.mock('../firebase/firebaseConfig', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mockToken')
    }
  }
}));

global.fetch = vi.fn();

const testItems = [
  {
    itemName: 'iphone',
    category: 'Electronics',
    color: 'Black',
    foundDate: '2024-08-01',
    locationFound: 'ECS',
    finderName: 'John',
    status: 'Lost',
    keyId: '123456',
    description: 'black case',
    imageUrl: '',
  },
  {
    itemName: 'Backpack',
    category: 'Other',
    color: 'Red',
    foundDate: '2024-08-01',
    locationFound: 'JSOM',
    finderName: 'Jane',
    status: 'Found',
    keyId: '567891',
    description: '',
    imageUrl: '',
  },
];

describe('SearchPage', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(testItems),
    });
  });

  afterEach(() => {
    fetch.mockClear();
  });

  it('displays all registered items', async () => {
    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument());
    expect(screen.getByText(/Backpack/i)).toBeInTheDocument();
  });

  it('displays items based on search query', async () => {
    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument());

    userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'phone');
    await waitFor(() => {
      expect(screen.getByText(/iphone/i)).toBeInTheDocument();
      expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
      expect(screen.getByText(/123456/i)).toBeInTheDocument();

      expect(screen.queryByText(/Backpack/i)).not.toBeInTheDocument();
    });
  });

  it('displays searched items by description', async () => {
    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument());

    userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'black');
    await waitFor(() => {
      expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    });
  });

  it('displays searched items by category', async () => {
    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument());

    userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'electronics');
    await waitFor(() => {
      expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    });
  });

  it('displays item fetch error - no matches', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<SearchPage />);

    await waitFor(() => expect(screen.queryByText(/iphone/i)).not.toBeInTheDocument());
    expect(screen.getByText(/No items found. Try adjusting your search criteria./i)).toBeInTheDocument();
  });

  it('displays result when search criteria invalid', async () => {
    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument());

    userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'orange');
    await waitFor(() => {
      expect(screen.queryByText(/iphone/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Backpack/i)).not.toBeInTheDocument();
    });
  });

  it('displays filtered results', async () => {
    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument());

    userEvent.click(screen.getByText(/Filter/i));
    await waitFor(() => {
      expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    });
  });
});
