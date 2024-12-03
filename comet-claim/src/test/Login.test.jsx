import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../pages/Login/Login';
import { signIn } from '../auth/authService';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

// Mock Firebase's initialization and authentication
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApp: vi.fn().mockReturnValue({}),
  getAuth: vi.fn().mockReturnValue({
    currentUser: {
      getIdTokenResult: vi.fn().mockResolvedValue({
        claims: { },
      }),
    },
  }),
}));

// Mock Firebase authentication methods
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn().mockReturnValue({
    currentUser: {
      getIdTokenResult: vi.fn().mockResolvedValue({
        claims: { },
      }),
    },
  }),
  setPersistence: vi.fn().mockResolvedValue({}),
  browserSessionPersistence: "browserSessionPersistence",
  getIdTokenResult: vi.fn(),
}));

// Mock the authentication service
vi.mock('../auth/authService', () => ({
  signIn: vi.fn(),
}));

// Mock the useNavigate hook from react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(), // Mock useNavigate
    BrowserRouter: actual.BrowserRouter,
  };
});

// Mock the react-toastify module, including ToastContainer
vi.mock('react-toastify', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ToastContainer: vi.fn(() => <div>Mocked ToastContainer</div>), // Mocked ToastContainer
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});


describe('Login Component', () => {
    let mockNavigate, mockToastSuccess, mockToastError;

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    mockToastSuccess = vi.fn();
    vi.mocked(toast.success).mockImplementation(mockToastSuccess);
    mockToastError = vi.fn();
    vi.mocked(toast.error).mockImplementation(mockToastError);
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  //Test 1
  it('renders the login form', () => {
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
    expect(screen.getByText(/student sign in/i)).toBeInTheDocument();
  });



  //Test 2
  it('toggles between staff and student sign in', () => {
    const toggle = screen.getByText(/student sign in/i);
    fireEvent.click(toggle);
    expect(screen.getByText(/staff sign in/i)).toBeInTheDocument();
  });



  //Test 3
  it('authenticates and navigates for staff', async () => {
    getAuth().currentUser.getIdTokenResult = vi.fn().mockResolvedValue({
      claims: { role: 'staff' }, 
    });
  
    signIn.mockResolvedValueOnce({ user: { email: 'test@staff.com' } });
  
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@staff.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('test@staff.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/search');
      expect(mockToastSuccess).toHaveBeenCalledWith('Logged In', {
        position: "top-right",
        autoClose: 1000,
      });
    });
  });
  


  //Test 4
  it('authenticates and navigates for student', async () => {
    getAuth().currentUser.getIdTokenResult = vi.fn().mockResolvedValue({
      claims: { role: 'student' }, 
    });

    fireEvent.click(screen.getByText(/student sign in/i)); 
  
    signIn.mockResolvedValueOnce({ user: { email: 'test@student.com' } });
  
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@student.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/submit/i));
  
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('test@student.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/claimRequest'); 
      expect(mockToastSuccess).toHaveBeenCalledWith('Logged In', {
        position: "top-right",
        autoClose: 1000,
      });
    });
  });
  


  //Test 5
  it('unauthorized access', async () => {
    getAuth().currentUser.getIdTokenResult = vi.fn().mockResolvedValue({
      claims: { role: 'staff' }, //staff role
    });
    fireEvent.click(screen.getByText(/student sign in/i)); // Switch to student login

    signIn.mockResolvedValueOnce({
      user: { email: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Unauthorized access', {
        position: "top-right",
        autoClose: 5000,
      });
       expect(mockNavigate).not.toHaveBeenCalled();
    });
  });



  //Test 6
  it('shows error on incorrect credentials', async () => {
    signIn.mockRejectedValueOnce({
      message: 'auth/invalid-email-password' 
    });
  
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/submit/i));
  
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
      expect(mockToastError).toHaveBeenCalledWith('invalid email password', {
        position: "top-right",
        autoClose: 5000,
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
