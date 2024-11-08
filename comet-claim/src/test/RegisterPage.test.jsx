import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import RegisterPage from '../pages/RegisterPage'

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  },
  ToastContainer: vi.fn()
}))

global.fetch = vi.fn()

describe('RegisterPage Form', () => {
  beforeEach(() => {
    vi.clearAllMocks() //clears mock daa
    fetch.mockReset() //reset the fetch 
    render( //renders new component for each test 
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    )
  })

  // Test Case 1: Successful submission with all fields
  it('should submit successfully with all valid data', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    )

    await fillFormFields({
      foundDate: '2024-11-05',
      finderName: 'Katy',
      finderEmail: 'katysoddy@gmail.com',
      itemFound: 'Water Bottle',
      locationFound: 'ECSW',
      roomNumber: '1.365',
      color: 'White',
      description: 'Bottle has cat stickers on it'
    })

    // Select category
    await fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: 'Other' }
    })

    const submitButton = screen.getByText(/Register Lost Item/i)
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(toast.success).toHaveBeenCalledWith('Item registered successfully!', { //basically checking fro toast success in top right
        position: "top-right",
        autoClose: 5000
      })
    })
  })

  // Test Case 2: All empty fields
  it('should prevent submission with all empty fields', async () => {
    const submitButton = screen.getByText(/Register Lost Item/i)
    await fireEvent.click(submitButton)
    
    expect(fetch).not.toHaveBeenCalled()
  })

  // Test Case 4: Missing finder name only
  it('should show error when finder name is empty', async () => {
    await fillFormFields({
      foundDate: '2024-11-05',
      finderEmail: 'katysoddy@gmail.com',
      itemFound: 'Water Bottle',
      locationFound: 'ECSW',
      roomNumber: '1.365',
      color: 'White',
      description: 'Bottle has cat stickers on it'
    })

    // Select category
    await fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: 'Other' }
    })

    const submitButton = screen.getByText(/Register Lost Item/i)
    const finderNameInput = screen.getByLabelText(/Finder name:/i)
    await fireEvent.click(submitButton)
    
    expect(fetch).not.toHaveBeenCalled()
    expect(finderNameInput.getAttribute('value')).toBe('') //finder name empty
    expect(finderNameInput.required).toBe(true) //finder name required = true
  })

  // Test Case 5: Invalid date format
  it('should reject invalid date format', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid date format' })
      })
    )

    // Submit form without filling in the date
    await fillFormFields({
      finderName: 'Katy',
      finderEmail: 'katysoddy@gmail.com',
      itemFound: 'Water Bottle',
      locationFound: 'ECSW',
      roomNumber: '1.365',
      color: 'White',
      description: 'Bottle has cat stickers on it'
    })

    // Select category
    await fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: 'Other' }
    })

    const submitButton = screen.getByText(/Register Lost Item/i)
    await fireEvent.click(submitButton)

    // The form should not be submitted when date is missing
    expect(fetch).not.toHaveBeenCalled()

    // Verify date field is empty
    const dateInput = screen.getByLabelText(/Found Date:/i)
    expect(dateInput.value).toBe('') //date empty 
  })

  // Test Case 9: Invalid email format (kss210009) 
  it('should reject invalid email format', async () => {
    await fillFormFields({
      foundDate: '2024-11-05',
      finderName: 'Katy',
      finderEmail: 'kss210009', // Invalid email format
      itemFound: 'Water Bottle',
      locationFound: 'ECSW',
      roomNumber: '1.365',
      color: 'White',
      description: 'Bottle has cat stickers on it'
    })

    // Select category
    await fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: 'Other' }
    })

    const submitButton = screen.getByText(/Register Lost Item/i)
    await fireEvent.click(submitButton)

    // Verify that form wasn't submitted due to HTML5 validation
    expect(fetch).not.toHaveBeenCalled()
    
    // Verify email input validity state
    const emailInput = screen.getByLabelText(/Finder email:/i)
    expect(emailInput.validity.valid).toBe(false)
  })
})

// fill form fields
async function fillFormFields(fields) {
  for (const [field, value] of Object.entries(fields)) { //iterates over each field in the fields object
    const label = {
      foundDate: /Found Date:/i,
      finderName: /Finder name:/i,
      finderEmail: /Finder email:/i,
      itemFound: /Item found:/i,
      locationFound: /Location found:/i,
      roomNumber: /Room number:/i,
      color: /Color:/i,
      description: /Description:/i
    }[field]
    
    const input = screen.getByLabelText(label) //finds the input element by its label
    await fireEvent.change(input, { //simulates a change event on the input element
      target: { value }
    })
  }
}