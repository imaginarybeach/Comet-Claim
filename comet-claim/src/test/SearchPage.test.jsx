import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SearchPage from '../pages/SearchPage';

global.fetch = vi.fn()

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
    ]

describe('SearchPage', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(testItems),
      })
    })
  
    
    test('display all registered items', async () => {
        render(<SearchPage />)
      
        await waitFor(() => 
            expect(screen.getByText(/iphone/i)).toBeInTheDocument()
        )
        expect(screen.queryByText(/Backpack/i)).toBeInTheDocument()
    });

    //Test 1 - display values of search queries by name
    test('display items based on search query', async () => {
        render(<SearchPage />)
      
        await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument())
    
        userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'phone')
        await waitFor(() => {
            expect(screen.getByText(/iphone/i)).toBeInTheDocument()
            expect(screen.getByText(/electronics/i)).toBeInTheDocument()
            expect(screen.getByText(/123456/i)).toBeInTheDocument()

            expect(screen.queryByText(/Backpack/i)).not.toBeInTheDocument()
          })

    });

    //Test 2 - display result of search queries by description
    test('display searched items by description', async () => {
        render(<SearchPage />)
      
        await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument())
    
        userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'black')
        await waitFor(() => {
            expect(screen.getByText(/iphone/i)).toBeInTheDocument()
          })
  
    });

    //Test 3 - display result of search queries by category
    test('display searched items by category', async () => {
        render(<SearchPage />)
      
        await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument())
    
        userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'electronics')
        await waitFor(() => {
            expect(screen.getByText(/iphone/i)).toBeInTheDocument()
          })
  
    });

    //Test 4 - display when fetch error
    test('display item fetch error - no matches', async () => {
        fetch.mockResolvedValueOnce({ ok: false })
    
        render(<SearchPage />)
    
        await waitFor(() => expect(screen.queryByText(/iphone/i)).not.toBeInTheDocument())
        expect(screen.getByText(/No items found. Try adjusting your search criteria./i)).toBeInTheDocument()
    });

    //Test 5 - display when search criteria is invalid 
    test('display result when search criteria invalid', async () => {
        render(<SearchPage />)
      
        await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument())
    
        userEvent.type(screen.getByPlaceholderText(/Search by item name or description/i), 'orange')
        await waitFor(() => {
            expect(screen.queryByText(/iphone/i)).not.toBeInTheDocument()
            expect(screen.queryByText(/Backpack/i)).not.toBeInTheDocument()
          })
      });

      //Test 6 - display filtered results
      test('display filtered results', async () => {
        render(<SearchPage />)
      
        await waitFor(() => expect(screen.getByText(/iphone/i)).toBeInTheDocument())
    
        userEvent.click(screen.getByText(/Filter/i))
        await waitFor(() => {
            expect(screen.queryByText(/iphone/i)).toBeInTheDocument()
          })
      });
});


