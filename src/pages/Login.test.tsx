import { configureStore } from '@reduxjs/toolkit';
import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { auth } from '../firebaseConfig';

import rootReducer from '../redux';
import Login from './LogIn';

const mockNavigate = jest.fn();

type ExtendedRenderResult = RenderResult & { store: ReturnType<typeof configureStore> };

export function renderWithProviders(
  ui: React.ReactElement,
): ExtendedRenderResult {
  const store = configureStore({ reducer: rootReducer });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  } as ExtendedRenderResult;
}

jest.mock('firebase/auth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(mockNavigate),
}));
jest.mock('../firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => callback(null)),
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    renderWithProviders(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getAllByText(/login.emailLabel/i)[0]).toBeInTheDocument();
  });

  it('should login with email and password successfully', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    renderWithProviders(
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

    renderWithProviders(
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

    renderWithProviders(
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

    renderWithProviders(
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
