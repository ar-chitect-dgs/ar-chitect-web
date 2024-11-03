// Profile.tsx
import {
  Button, Typography, Avatar, Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebaseConfig';

const Profile = (): JSX.Element => {
  const user = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login'); // Redirect to login after logout
  };

  if (!user) {
    return (
      <Typography variant="h6" textAlign="center" marginTop="20px">
        No user is logged in.
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="400px"
      margin="auto"
      padding="16px"
    >
      {user.photoURL && (
        <Avatar
          src={user.photoURL}
          alt={user.displayName || 'Profile Picture'}
          sx={{ width: 120, height: 120, marginBottom: 2 }}
        />
      )}
      <Typography variant="h5" gutterBottom>
        {user.displayName || 'User'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {user.email}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{ marginTop: 2 }}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Profile;
