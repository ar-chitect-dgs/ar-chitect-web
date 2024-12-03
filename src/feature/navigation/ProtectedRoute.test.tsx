import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('ProtectedRoute', () => {
  it('should render children if authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: true });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={(
              <ProtectedRoute redirectTo="/login">
                <div>Protected Content</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </BrowserRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login if not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: false });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={(
              <ProtectedRoute redirectTo="/login">
                <div>Protected Content</div>
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
