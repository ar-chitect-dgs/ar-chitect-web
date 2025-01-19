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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
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
  const { t } = useTranslation();
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
    if (!user) return;

    setDeleteDialogOpen(false);
    try {
      await deleteUser(user);
      navigate('/signup');
    } catch (error: any) {
      setSnackbar(
        setOpenSnackBarState(
          t('profile.deleteAccountError'),
          'error',
        ),
      );
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      let photoURL = user?.photoURL || '';

      if (newProfilePic) {
        const profilePicRef = ref(storage, `profilePictures/${user?.uid}`);
        await uploadBytes(profilePicRef, newProfilePic);
        photoURL = await getDownloadURL(profilePicRef);
      }

      await updateProfile(user, {
        displayName: newDisplayName,
        photoURL,
      });

      setSnackbar(
        setOpenSnackBarState(t('profile.updateSuccess'), 'success'),
      );
      setEditMode(false);
    } catch (error: any) {
      setSnackbar(setOpenSnackBarState(t('profile.updateError'), 'error'));
    }
  };

  if (!user) {
    return (
      <div className="profile-message">
        <h3>{t('profile.noUserLoggedIn')}</h3>
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
            alt={t('profile.altText')}
            sx={{
              width: '120px',
              height: '120px',
            }}
          />
        </div>

        {editMode ? (
          <div>
            <div className="profile-field">{t('profile.changeProfilePic')}</div>
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
              <div className="edit-button">
                <EditIcon />
                {t('profile.editProfile')}
              </div>
            </FilledButton>
          </div>
        )}
      </div>
      {editMode ? (
        <div className="edit-mode">
          <div className="profile-field">{t('profile.changeDisplayName')}</div>
          <TextField
            label={t('profile.displayNameLabel')}
            fullWidth
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            margin="normal"
            size="small"
            InputProps={{ sx: { borderRadius: 5, background: 'white' } }}
          />
          <div className={`profile-button-group${editMode ? '-edit' : ''}`}>
            <FilledButton onClick={handleUpdateProfile}>
              {t('profile.saveChanges')}
            </FilledButton>
            <TextButton onClick={() => setEditMode(false)}>
              {t('profile.cancel')}
            </TextButton>
          </div>
        </div>
      ) : (
        <div className="display-mode">
          <div className="profile-field">
            <strong>
              {t('profile.displayName')}
              :
            </strong>
            <span>{user.displayName || t('profile.defaultUser')}</span>
          </div>
          <div className="profile-field">
            <strong>
              {t('profile.email')}
              :
            </strong>
            <span>{user.email}</span>
          </div>
          <div className="profile-button-group">
            <div className="bottom-button">
              <TextButton onClick={handleLogout} className="log-out-button">
                {t('profile.logOut')}
              </TextButton>
            </div>
            <div className="bottom-button">
              <TextButton
                onClick={() => setDeleteDialogOpen(true)}
                className="delete-button"
              >
                {t('profile.deleteAccount')}
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
        <DialogTitle>{t('profile.deleteAccountTitle')}</DialogTitle>
        <DialogContent>
          {t('profile.deleteAccountConfirmation')}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('profile.cancel')}
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="text">
            {t('profile.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
