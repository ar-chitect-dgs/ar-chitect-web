// src/feature/navbar/AppRouter.tsx
import {
  Navigate,
  Route,
  Routes,
  BrowserRouter as Router,
} from 'react-router-dom';

import { ROUTES } from './routes';

import Editor from '../editor/Editor';
import Login from '../../pages/LogIn';
import Profile from '../../pages/Profile';
import Projects from '../../pages/Projects';
import SignUp from '../../pages/SignUp';
import Navbar from './Navbar';
import Settings from '../../pages/Settings';
import About from '../../pages/About';
import Mobile from '../../pages/Mobile';
import Templates from '../../pages/Templates';
import Dev from '../../pages/Dev';
import { useAuth } from '../../hooks/useAuth';
import Creator from '../creator/Creator';
import ProtectedRoute from './ProtectedRoute';

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
                <ProtectedRoute redirectTo={ROUTES.LOGIN}>
                  <SignUp />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.LOGIN}
              element={(
                <ProtectedRoute redirectTo={ROUTES.PROJECTS}>
                  <Login />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.PROJECTS}
              element={(
                <ProtectedRoute redirectTo={ROUTES.LOGIN}>
                  <Projects />
                </ProtectedRoute>
              )}
            />
            <Route
              path={ROUTES.EDITOR}
              element={(
                <ProtectedRoute redirectTo={ROUTES.LOGIN}>
                  <Editor />
                </ProtectedRoute>
              )}
            />
            <Route path={ROUTES.CREATOR} element={<Creator />} />
            <Route
              path={ROUTES.PROFILE}
              element={(
                <ProtectedRoute redirectTo={ROUTES.LOGIN}>
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
