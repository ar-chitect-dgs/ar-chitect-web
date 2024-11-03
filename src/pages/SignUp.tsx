// SignUp.tsx
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Button, TextField, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, storage } from '../firebaseConfig';

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Upload profile picture to Firebase Storage
      let photoURL = '';
      if (profilePic) {
        const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(profilePicRef, profilePic);
        photoURL = await getDownloadURL(profilePicRef);
      }

      // Update user profile with display name and photo URL
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
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Display Name"
        fullWidth
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        margin="normal"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
        style={{ margin: '16px 0' }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleSignUp} fullWidth>
        Sign Up
      </Button>
    </div>
  );
};

export default SignUp;
