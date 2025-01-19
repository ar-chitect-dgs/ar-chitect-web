import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import Login from './LogIn';
import { auth } from '../firebaseConfig';

const mockNavigate = jest.fn();

jest.mock('firebase/auth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(mockNavigate),
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getAllByText(/login.emailLabel/i)[0]).toBeInTheDocument();
  });

  it('should login with email and password successfully', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/login.emailLabel/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/login.passwordLabel/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText(/login.loginButton/i));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });

  it('should show error message on failed email/password login', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error('Invalid credentials'),
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/login.emailLabel/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/login.passwordLabel/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText(/login.loginButton/i));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password',
      );
      expect(screen.getByText(/loginFailed/i)).toBeInTheDocument();
    });
  });

  it('should login with Google successfully', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText(/googleButton/i));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(
        auth,
        expect.any(GoogleAuthProvider),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });

  it('should show error message on failed Google login', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValue(
      new Error('Google login failed'),
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText(/login.googleButton/i));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(
        auth,
        expect.any(GoogleAuthProvider),
      );
      expect(screen.getByText(/login.loginFailed/i)).toBeInTheDocument();
    });
  });
});
