import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { sceneSelector } from '../../../redux/slices/scene';
import { saveProject } from '../../../utils/firebaseUtils';
import { auth } from '../../../firebaseConfig';
import { SceneObject, Vector3D } from '../../../types/Scene';
import Properties from './properties/Properties';
import ModelsList from '../../../components/modelsList/ModelsList';
import NotificationPopup, {
  initialSnackBarState,
  SnackBarState,
} from '../../../components/notificationPopup/NotificationPopup';
import FilledButton from '../../../components/FilledButton/FilledButton';

const GUI = (): JSX.Element => {
  const { scene } = useSelector(sceneSelector);
  const [projectName, setProjectName] = useState('');
  const [snackbar, setSnackbar] = useState<SnackBarState>(initialSnackBarState);

  const handleSaveProject = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setSnackbar({
          open: true,
          message: 'You must be logged in to save a project.',
          severity: 'error',
        });
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
        setSnackbar({
          open: true,
          message: 'Project name cannot be empty!',
          severity: 'error',
        });
        return;
      }

      await saveProject(userId, scene, projectName, corners);
      setSnackbar({
        open: true,
        message: 'Project saved successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving project.',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ padding: 2, overflow: 'auto' }}>
      <Box className="PropertiesPanel">
        <TextField
          label="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <ModelsList />

        {Object.values(scene.objects).map((val: SceneObject) => (
          <Properties key={val.id} object={val} />
        ))}

        <FilledButton onClick={handleSaveProject}>Save Project</FilledButton>
      </Box>

      <NotificationPopup
        snackbar={snackbar}
        setOpenSnackbar={(open: boolean) =>
          setSnackbar((prev: SnackBarState) => ({
            ...prev,
            open,
          }))}
      />
    </Box>
  );
};

export default GUI;
