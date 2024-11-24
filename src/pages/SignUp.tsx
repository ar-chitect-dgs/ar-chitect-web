import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
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

  const navigate = useNavigate();

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordValid = (password: string) => password.length >= 6;

  const handleSignUp = async () => {
    if (!isEmailValid(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!isPasswordValid(password)) {
      setError('Password must be at least 6 characters');
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
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2>Create a new account</h2>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
          error={!!error && !isEmailValid(email)}
          helperText={
            !!error && !isEmailValid(email) ? 'Invalid email format' : ''
          }
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
          error={!!error && !isPasswordValid(password)}
          helperText={
            !!error && !isPasswordValid(password)
              ? 'Password must be at least 6 characters'
              : ''
          }
        />
        <TextField
          label="Display Name"
          fullWidth
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          margin="normal"
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        <div className="profile-picture-group">
          <h3>Choose a profile picture:</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
            style={{ margin: '16px 0' }}
          />
        </div>

        {error && <Typography color="error">{error}</Typography>}

        <div className="button-group">
          <FilledButton onClick={handleSignUp}>Sign Up</FilledButton>
          <div className="signup-text">
            Already have an account?
            {' '}
            <Link to="/login" className="login-link">
              Log in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
