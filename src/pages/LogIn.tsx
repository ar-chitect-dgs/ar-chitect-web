import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { TextField, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebaseConfig';
import Card from '../components/card/Card';
import FilledButton from '../components/filledButton/FilledButton';
import TextButton from '../components/textButton/TextButton';
import googleIcon from '../assets/google.svg';
import './styles/LogIn.css';

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/projects');
    } catch (error: any) {
      setError(t('login.loginFailed'));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/projects');
    } catch (error: any) {
      setError(t('login.loginFailed'));
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2>{t('login.title')}</h2>
        <TextField
          label={t('login.emailLabel')}
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        <TextField
          label={t('login.passwordLabel')}
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        {error && <Typography color="error">{error}</Typography>}

        <div className="button-group">
          <FilledButton onClick={handleLogin}>
            {t('login.loginButton')}
          </FilledButton>

          <div className="signup-text">
            {t('login.signupText')}
            {' '}
            <Link to="/signup" className="signup-link">
              {t('login.signupLink')}
            </Link>
          </div>
        </div>

        <Divider style={{ margin: '20px 0' }}>{t('login.orDivider')}</Divider>
        <div className="google-link">
          <TextButton onClick={handleGoogleLogin}>
            <div className="google-button">
              <img
                src={googleIcon}
                height="20px"
                alt={t('login.googleIconAlt')}
              />
              {t('login.googleButton')}
            </div>
          </TextButton>
        </div>
      </Card>
    </div>
  );
};

export default Login;
