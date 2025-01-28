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

    expect(screen.getByText(/signUp.profilePictureHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/signUp.signUpButton/i)).toBeInTheDocument();
  });

  it('should sign up with email and password successfully', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/signUp.displayNameLabel/i), {
      target: { value: 'name' },
    });
    fireEvent.change(screen.getByLabelText(/signup.emailLabel/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/signUp.passwordLabel/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText(/signUp.signUpButton/i));

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

    fireEvent.change(screen.getByLabelText(/signUp.displayNameLabel/i), {
      target: { value: 'name' },
    });
    fireEvent.change(screen.getByLabelText(/signup.emailLabel/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/signUp.passwordLabel/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText(/signUp.signUpButton/i));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password',
      );
      expect(screen.getByText(/signUp.alreadyHaveAccountText/i)).toBeInTheDocument();
    });
  });

  it('should navigate to login page when "Log in" link is clicked', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText(/signUp.loginLink/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/login', expect.any(Object),
      );
    });
  });
});
