import { renderHook } from '@testing-library/react-hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from './useAuth';

jest.mock('firebase/auth');

describe('useAuth', () => {
  it('should return null user and false isLoggedIn initially', () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('should return user and true isLoggedIn when user is authenticated', () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as any;

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
  });
});
