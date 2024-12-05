import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { useAuth } from '../../auth/AuthProvider';

export enum LoginState {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
}

type ProtectedRouteProps = {
  expectedLoginState?: LoginState;
  redirectTo?: string;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  expectedLoginState = LoginState.LOGGED_IN,
  redirectTo = ROUTES.LOGIN,
  children,
}: ProtectedRouteProps): React.ReactElement => {
  const { isLoggedIn } = useAuth();

  const expectedState = expectedLoginState === LoginState.LOGGED_IN;
  if (expectedState !== isLoggedIn) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;
