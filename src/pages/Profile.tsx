import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, signOut, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { auth, storage } from '../firebaseConfig';
import FilledButton from '../components/filledButton/FilledButton';
import TextButton from '../components/textButton/TextButton';
import NotificationPopup, {
  initialSnackBarState,
  setOpenSnackBarState,
  SnackBarState,
} from '../components/notificationPopup/NotificationPopup';
import './styles/Profile.css';

const Profile = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<SnackBarState>(initialSnackBarState);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleteDialogOpen(false); // Close the dialog
    try {
      await deleteUser(user!);
      navigate('/signup'); 
    } catch (error: any) {
      setSnackbar(
        setOpenSnackBarState(
          'Failed to delete account. Please try again.',
          'error',
        ),
      );
    }
  };

  const handleUpdateProfile = async () => {
    try {
      let photoURL = user?.photoURL || '';

      if (newProfilePic) {
        const profilePicRef = ref(storage, `profilePictures/${user?.uid}`);
        await uploadBytes(profilePicRef, newProfilePic);
        photoURL = await getDownloadURL(profilePicRef);
      }

      await updateProfile(user!, {
        displayName: newDisplayName,
        photoURL,
      });

      setSnackbar(
        setOpenSnackBarState('Profile updated successfully', 'success'),
      );
      setEditMode(false);
    } catch (error: any) {
      setSnackbar(setOpenSnackBarState('Failed to update profile', 'error'));
    }
  };

  if (!user) {
    return (
      <div className="profile-message">
        <h3>No user is logged in.</h3>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className={`top-container${editMode ? '-edit' : ''}`}>
        <div className="avatar-container">
          <Avatar
            src={
              editMode && newProfilePic
                ? URL.createObjectURL(newProfilePic)
                : user.photoURL || ''
            }
            alt="Profile Picture"
            sx={{
              width: '120px',
              height: '120px',
            }}
          />
        </div>

        {editMode ? (
          <div>
            <div className="profile-field">Change Profile Picture:</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewProfilePic(e.target.files?.[0] || null)}
              className="profile-file-input"
            />
          </div>
        ) : (
          <div className="edit-button-container">
            <FilledButton onClick={() => setEditMode(true)}>
              <EditIcon />
              Edit Profile
            </FilledButton>
          </div>
        )}
      </div>
      {editMode ? (
        <div className="edit-mode">
          <div className="profile-field">Change Display name:</div>
          <TextField
            label="Display Name"
            fullWidth
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            margin="normal"
            size="small"
            InputProps={{ sx: { borderRadius: 5, background: 'white' } }}
          />
          <div className={`profile-button-group${editMode ? '-edit' : ''}`}>
            <FilledButton onClick={handleUpdateProfile}>
              Save Changes
            </FilledButton>
            <TextButton onClick={() => setEditMode(false)}>Cancel</TextButton>
          </div>
        </div>
      ) : (
        <div className="display-mode">
          <div className="profile-field">
            <strong>Display Name:</strong>
            <span>{user.displayName || 'User'}</span>
          </div>
          <div className="profile-field">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>
          <div className="profile-button-group">
            <div className="bottom-button">
              <TextButton onClick={handleLogout} className="log-out-button">
                Log Out
              </TextButton>
            </div>
            <div className="bottom-button">
              <TextButton
                onClick={() => setDeleteDialogOpen(true)}
                className="delete-button"
              >
                Delete Account
              </TextButton>
            </div>
          </div>
        </div>
      )}
      <NotificationPopup
        snackbar={snackbar}
        setOpenSnackbar={(open: boolean) =>
          setSnackbar((prev: SnackBarState) => ({
            ...prev,
            open,
          }))}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="text"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
