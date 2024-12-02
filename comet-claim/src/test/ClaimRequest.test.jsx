import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import ClaimRequest from '../pages/ClaimRequest'

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    },
    ToastContainer: vi.fn()
}))

global.fetch = vi.fn()

describe('ClaimRequest Form', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        fetch.mockReset()
        render(
            <BrowserRouter>
                <ClaimRequest />
            </BrowserRouter>
        )
    })
})

// Test Case 1: successful claim request submission
it('submit successfully with valid data', async () => {
    fetch.mockImplementationOnce(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
    })
    )

})