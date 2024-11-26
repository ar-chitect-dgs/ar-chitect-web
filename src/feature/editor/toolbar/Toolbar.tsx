import {
  Alert, Snackbar,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ModelList from '../../../components/ModelList/ModelList';
import Properties from '../../../components/properties/Properties';
import { auth } from '../../../firebaseConfig';
import { sceneSelector } from '../../../redux/slices/scene';
import { Vector3D } from '../../../types/Scene';
import { saveProject } from '../../../utils/firebaseUtils';
import './Toolbar.css';
import FilledButton from '../../../components/filledButton/FilledButton';

function Toolbar(): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const [projectName, setProjectName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );

  const handleSaveProject = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setSnackbarMessage('You must be logged in to save a project.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      const userId = user.uid;
      const corners: Vector3D[] = [
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 },
        { x: 10, y: 10, z: 0 },
        { x: 0, y: 10, z: 0 },
      ];

      if (projectName.trim() === '') {
        setSnackbarMessage('Project name cannot be empty!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      await saveProject(userId, scene, projectName, corners);
      setSnackbarMessage('Project saved successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Error saving project');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="root">
      <div className="properties-panel">
        <div className="">
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>

        <div className="adding-panel">
          <div className="header">Add a model...</div>
          <ModelList />
        </div>

        <div className="editing-panel">
          <div className="header">Modify selected model:</div>
          <Properties />
        </div>

        <div className="button">
          <FilledButton
            onClick={handleSaveProject}
          >
            Save Project
          </FilledButton>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Toolbar;
