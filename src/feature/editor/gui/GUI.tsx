import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { sceneSelector } from '../../../redux/slices/scene';
import { saveProject } from '../../../utils/firebaseUtils';
import { auth } from '../../../firebaseConfig';
import { SceneObject, Vector3D } from '../../../types/Scene';
import Properties from '../../../components/properties/Properties';
import ModelsList from '../../../components/modelsList/ModelsList';
import NotificationPopup, {
  initialSnackBarState,
  SnackBarState,
} from '../../../components/notificationPopup/NotificationPopup';
import FilledButton from '../../../components/FilledButton/FilledButton';
import './GUI.css';

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
    } catch {
      setSnackbar({
        open: true,
        message: 'Error saving project.',
        severity: 'error',
      });
    }
  };

  return (
    <div className="root">
      <div className="propertiesPanel">
        <div className="projectNamePanel">
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div className="addingPanel">
          <div className="header">Add a model...</div>
          <div className="modelsList">
            <ModelsList />
          </div>
        </div>
        <div className="editingPanel">
          <div className="header">Modify selected model:</div>
          <div className="modelsList">
            {Object.values(scene.objects).map((val: SceneObject) => (
              <Properties key={val.id} object={val} />
            ))}
          </div>
        </div>
        <FilledButton onClick={handleSaveProject}>Save Project</FilledButton>
      </div>
      <NotificationPopup
        snackbar={snackbar}
        setOpenSnackbar={(open: boolean) =>
          setSnackbar((prev: SnackBarState) => ({
            ...prev,
            open,
          }))
        }
      />
    </div>
  );
};

export default GUI;
