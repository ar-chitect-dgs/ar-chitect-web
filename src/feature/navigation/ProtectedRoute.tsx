import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: JSX.Element;
  redirectTo: string;
}

const ProtectedRoute = ({
  children,
  redirectTo,
}: ProtectedRouteProps): JSX.Element => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
