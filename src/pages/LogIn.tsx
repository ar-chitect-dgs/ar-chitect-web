import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { TextField, Typography, Divider } from '@mui/material';
import { auth } from '../firebaseConfig';
import Card from '../components/card/Card';
import './styles/LogIn.css';
import FilledButton from '../components/filledButton/FilledButton';
import TextButton from '../components/textButton/TextButton';
import googleIcon from '../assets/google.svg';

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/projects');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/projects');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2>Login to your existing account</h2>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        {error && <Typography color="error">{error}</Typography>}

        <div className="button-group">
          <FilledButton onClick={handleLogin}>Log In</FilledButton>

          <div className="signup-text">
            Don&apos;t have an account?
            {' '}
            <Link to="/signup" className="signup-link">
              Sign-up
            </Link>
          </div>
        </div>

        <Divider style={{ margin: '20px 0' }}>OR</Divider>
        <div className="google-link">
          <TextButton onClick={handleGoogleLogin}>
            <div className="google-button">
              <img src={googleIcon} height="20px" alt="Google Icon" />
              Connect with Google
            </div>
          </TextButton>
        </div>
      </Card>
    </div>
  );
};

export default Login;
