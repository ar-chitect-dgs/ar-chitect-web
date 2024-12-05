import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps =>
  useContext(AuthContext) as AuthContextProps;

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authContextValue: AuthContextProps = {
    user,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
