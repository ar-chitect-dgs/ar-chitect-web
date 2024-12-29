import {
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { saveProject } from '../../../api/projectsApi';
import FilledButton from '../../../components/filledButton/FilledButton';
import ModelsList from '../../../components/modelsList/ModelsList';
import NotificationPopup, {
  initialSnackBarState,
  setOpenSnackBarState,
  SnackBarState,
} from '../../../components/notificationPopup/NotificationPopup';
import Properties from '../../../components/properties/Properties';
import { auth } from '../../../firebaseConfig';
import { useAppDispatch } from '../../../redux';
import { changeName, sceneSelector } from '../../../redux/slices/scene';
import './Toolbar.css';

const EditorToolbar = (): JSX.Element => {
  const { scene } = useSelector(sceneSelector);
  const [snackbar, setSnackbar] = useState<SnackBarState>(initialSnackBarState);
  const [nameError, setNameError] = useState(false);
  const dispatch = useAppDispatch();

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

    if (scene.projectName.trim() === '') {
      setNameError(true);
      return;
    }

    setNameError(false);

    try {
      await saveProject(user.uid, scene);
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
              value={scene.projectName}
              onChange={(e) => dispatch(changeName(e.target.value))}
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

export default EditorToolbar;
