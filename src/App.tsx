import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Projects from './pages/Projects';
import Editor from './pages/editor/Editor';
import './App.css';

const App = (): JSX.Element => (
  <Router>
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '16px', height: '100vh' }}>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
