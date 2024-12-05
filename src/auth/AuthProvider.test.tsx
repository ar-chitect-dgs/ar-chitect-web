import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import AuthProvider, { useAuth } from './AuthProvider';

jest.mock('firebase/auth');
jest.mock('../firebaseConfig', () => ({
  auth: jest.fn(),
}));

describe('AuthProvider', () => {
  const mockUser = { uid: '123', email: 'test@example.com' };

  const ChildComponent = () => {
    const { user, isLoggedIn } = useAuth();
    return (
      <div>
        <div>{`User: ${user ? user.email : 'null'}`}</div>
        <div>
          {`Logged In: ${isLoggedIn.toString()}`}
        </div>
      </div>
    );
  };

  const TestComponent = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should provide user and isLoggedIn as true when authenticated', () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(
      <TestComponent>
        <ChildComponent />
      </TestComponent>,
    );

    expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logged In: true')).toBeInTheDocument();
  });

  it('should provide user as null and isLoggedIn as false when not authenticated', () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    render(
      <TestComponent>
        <ChildComponent />
      </TestComponent>,
    );

    expect(screen.getByText('User: null')).toBeInTheDocument();
    expect(screen.getByText('Logged In: false')).toBeInTheDocument();
  });
});
