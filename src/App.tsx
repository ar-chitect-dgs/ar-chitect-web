// App.tsx
import {
  BrowserRouter as Router, Route, Routes, Navigate,
} from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import SignUp from './pages/SignUp';
import Login from './pages/LogIn';
import Projects from './pages/Projects';
import Editor from './pages/editor/Editor';
import Profile from './pages/Profile';

function App(): JSX.Element {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: '16px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/projects" />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
