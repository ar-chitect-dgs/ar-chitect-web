import {
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import FilledButton from '../../../components/filledButton/FilledButton';
import ModelsList from '../../../components/modelsList/ModelsList';
import NotificationPopup, {
  initialSnackBarState,
  setOpenSnackBarState,
  SnackBarState,
} from '../../../components/notificationPopup/NotificationPopup';
import Properties from '../../../components/properties/Properties';
import { auth } from '../../../firebaseConfig';
import { sceneSelector } from '../../../redux/slices/scene';
import { Vector3D } from '../../../types/Scene';
import { saveProject } from '../../../utils/firebaseUtils';
import './Toolbar.css';

const GUI = (): JSX.Element => {
  const { scene } = useSelector(sceneSelector);
  const [projectName, setProjectName] = useState('');
  const [snackbar, setSnackbar] = useState<SnackBarState>(initialSnackBarState);
  const [nameError, setNameError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const handleSaveProject = async () => {
    const user = auth.currentUser;

    if (!user) {
      setSnackbar(
        setOpenSnackBarState(
          'You must be logged in to save a project.',
          'error',
        ),
      );
      return;
    }

    if (projectName.trim() === '') {
      setNameError(true);
      setHelperText('Project name cannot be empty.');
      return;
    }

    setNameError(false);
    setHelperText('');

    const userId = user.uid;
    const corners: Vector3D[] = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { x: 10, y: 10, z: 0 },
      { x: 0, y: 10, z: 0 },
    ];

    try {
      await saveProject(userId, scene, projectName, corners);
      setSnackbar(
        setOpenSnackBarState('Project saved successfully.', 'success'),
      );
    } catch {
      setSnackbar(setOpenSnackBarState('Error saving project.', 'error'));
    }
  };

  return (
    <div className="root">
      <div className="properties-panel">
        <div className="project-name-panel">
          <FormControl fullWidth>
            <TextField
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              error={nameError}
            />
            {nameError && (
            <FormHelperText error>
              Project name cannot be empty.
            </FormHelperText>
            )}
          </FormControl>
        </div>

        <div className="adding-panel">
          <div className="header">Add a model...</div>
          <div className="models-list">
            <ModelsList />
          </div>
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
      <NotificationPopup
        snackbar={snackbar}
        setOpenSnackbar={(open: boolean) =>
          setSnackbar((prev: SnackBarState) => ({
            ...prev,
            open,
          }))}
      />
    </div>
  );
};

export default GUI;
