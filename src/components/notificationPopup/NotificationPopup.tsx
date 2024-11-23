import { Snackbar, Alert } from '@mui/material';

interface NotificationProps {
  snackbar: SnackBarState;
  setOpenSnackbar: (openSnackBar: boolean) => void;
}

export interface SnackBarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const initialSnackBarState: SnackBarState = {
  open: false,
  message: '',
  severity: 'success',
};

export const setOpenSnackBarState = (
  message: string,
  severity: 'error' | 'success',
): SnackBarState => ({
  open: true,
  message,
  severity,
});

const NotificationPopup = ({
  snackbar,
  setOpenSnackbar,
}: NotificationProps): JSX.Element => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={() => setOpenSnackbar(false)}
  >
    <Alert
      onClose={() => setOpenSnackbar(false)}
      severity={snackbar.severity}
      sx={{ width: '100%' }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
);

export default NotificationPopup;
