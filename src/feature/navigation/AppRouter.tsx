// src/feature/navbar/AppRouter.tsx
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import { ROUTES } from './routes';

import { useAuth } from '../../auth/AuthProvider';
import About from '../../pages/About';
import Dev from '../../pages/Dev';
import Login from '../../pages/LogIn';
import Mobile from '../../pages/Mobile';
import Profile from '../../pages/Profile';
import Projects from '../../pages/Projects';
import Settings from '../../pages/Settings';
import SignUp from '../../pages/SignUp';
import Templates from '../../pages/Templates';
import Creator from '../creator/Creator';
import Editor from '../editor/Editor';
import Navbar from './Navbar';
import ProtectedRoute, { LoginState } from './ProtectedRoute';

const AppRouter = (): JSX.Element => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Navbar />
        <div
          style={{ flexGrow: 1, backgroundColor: 'var(--background-color)' }}
        >
          <Routes>
            <Route
              path={ROUTES.HOME}
              element={
                <Navigate to={isLoggedIn ? ROUTES.PROJECTS : ROUTES.LOGIN} />
              }
            />
            <Route
              path={ROUTES.SIGN_UP}
              element={(
                <ProtectedRoute
                  expectedLoginState={LoginState.LOGGED_OUT}
                  redirectTo={ROUTES.PROFILE}
                >
                  <SignUp />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.LOGIN}
              element={(
                <ProtectedRoute
                  expectedLoginState={LoginState.LOGGED_OUT}
                  redirectTo={ROUTES.PROFILE}
                >
                  <Login />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.PROJECTS}
              element={(
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.EDITOR}
              element={(
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.CREATOR}
              element={(
                <ProtectedRoute>
                  <Creator />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.PROFILE}
              element={(
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              )}
            />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.MOBILE} element={<Mobile />} />
            <Route path={ROUTES.TEMPLATES} element={<Templates />} />
            <Route path={ROUTES.DEV} element={<Dev />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;
