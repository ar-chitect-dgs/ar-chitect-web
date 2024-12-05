import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../auth/AuthProvider');

// eslint-disable-next-line import/first
import ProtectedRoute from './ProtectedRoute';
// eslint-disable-next-line import/first
import { useAuth } from '../../auth/AuthProvider';

describe('ProtectedRoute', () => {
  const mockUseAuth = useAuth as jest.Mock;

  it('should redirect to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={(
              <ProtectedRoute>
                <div>Protected Page</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });

  it('should render the component when authenticated', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={(
              <ProtectedRoute>
                <div>Protected Page</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(getByText('Protected Page')).toBeInTheDocument();
  });

  it('should redirect to a custom path when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/custom-login" element={<div>Custom Login Page</div>} />
          <Route
            path="/protected"
            element={(
              <ProtectedRoute redirectTo="/custom-login">
                <div>Protected Page</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(getByText('Custom Login Page')).toBeInTheDocument();
  });

  it('should handle undefined isLoggedIn state', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: undefined });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={(
              <ProtectedRoute>
                <div>Protected Page</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });
});
