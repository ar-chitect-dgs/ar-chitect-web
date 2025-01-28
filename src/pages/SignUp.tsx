import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { auth, storage } from '../firebaseConfig';
import Card from '../components/card/Card';
import FilledButton from '../components/filledButton/FilledButton';
import './styles/SignUp.css';

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const navigate = useNavigate();

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordValid = (password: string) => password.length >= 6;

  const handleSignUp = async () => {
    if (!isEmailValid(email)) {
      setError(t('signup.invalidEmail'));
      return;
    }

    if (!isPasswordValid(password)) {
      setError(t('signup.invalidPassword'));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const { user } = userCredential;

      let photoURL = '';
      if (profilePic) {
        const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(profilePicRef, profilePic);
        photoURL = await getDownloadURL(profilePicRef);
      }

      await updateProfile(user, {
        displayName,
        photoURL,
      });
      navigate('/projects');
    } catch (error: any) {
      setError(t('signup.signupError'));
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2>{t('signup.title')}</h2>
        <TextField
          label={t('signup.emailLabel')}
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
          error={!!error && !isEmailValid(email)}
          helperText={
            !!error && !isEmailValid(email) ? t('signup.invalidEmail') : ''
          }
        />
        <TextField
          label={t('signup.passwordLabel')}
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
          error={!!error && !isPasswordValid(password)}
          helperText={
            !!error && !isPasswordValid(password)
              ? t('signup.invalidPassword')
              : ''
          }
        />
        <TextField
          label={t('signup.displayNameLabel')}
          fullWidth
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        <div className="profile-picture-group">
          <h3>{t('signup.profilePictureHeader')}</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
            style={{ margin: '16px 0' }}
          />
        </div>

        {error && <Typography color="error">{error}</Typography>}

        <div className="button-group">
          <FilledButton onClick={handleSignUp}>
            {t('signup.signUpButton')}
          </FilledButton>
          <div className="signup-text">
            {t('signup.alreadyHaveAccountText')}
            {' '}
            <Link to="/login" className="login-link">
              {t('signup.loginLink')}
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
