// eslint-disable-next-line import/no-extraneous-dependencies
import * as ReactRouter from 'react-router';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import SignUp from './SignUp';
import { auth } from '../firebaseConfig';

const mockNavigate = jest.fn();

jest.mock('firebase/auth');

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(ReactRouter, 'useNavigate')
      .mockImplementation(() => mockNavigate);
  });

  it('should render sign-up form', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    expect(screen.getByText(/choose a profile picture/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('should sign up with email and password successfully', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/display name/i), {
      target: { value: 'name' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password',
      );

      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });

  it('should show error message on failed sign-up', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error('Sign-up failed'),
    );

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/display name/i), {
      target: { value: 'name' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password',
      );
      expect(screen.getByText(/sign-up failed/i)).toBeInTheDocument();
    });
  });

  it('should navigate to login page when "Log in" link is clicked', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText(/log in/i));

    await waitFor(() => {
      console.log(mockNavigate.mock.calls);
      expect(mockNavigate).toHaveBeenCalledWith(
        '/login', expect.any(Object),
      );
    });
  });
});
