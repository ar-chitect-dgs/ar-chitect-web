import { FormControl, FormHelperText, TextField } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { saveProject, saveProjectThumbnail } from '../../../api/projectsApi';
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
import { sceneSelector } from '../../../redux/slices/scene';
import {
  projectSelector,
  setProject,
  setProjectId,
  setProjectName,
} from '../../../redux/slices/project';
import './Toolbar.css';
import { useTranslation } from 'react-i18next';

const EditorToolbar = (): JSX.Element => {
  const { t } = useTranslation();
  const { scene } = useSelector(sceneSelector);
  const project = useSelector(projectSelector);
  const [snackbar, setSnackbar] = useState<SnackBarState>(initialSnackBarState);
  const [nameError, setNameError] = useState(false);
  const dispatch = useAppDispatch();

  const captureScreenshot = async (
    userId: string,
    timestamp: number,
  ): Promise<string> => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return '';

    const id = `${userId}-${timestamp}`;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });

    if (blob) {
      const url = await saveProjectThumbnail(blob, id);
      return url;
    }
    throw new Error('Error saving project thumbnail.');
  };

  const handleSaveProject = async () => {
    const user = auth.currentUser;

    if (!user) {
      setSnackbar(
        setOpenSnackBarState(
          t('editorToolbar.saveProjectError'),
          'error',
        ),
      );
      return;
    }

    if (project.projectName.trim() === '') {
      setNameError(true);
      return;
    }

    setNameError(false);

    const createdAt = project.isNewProject ? Date.now() : project.createdAt;
    const thumbnail = await captureScreenshot(user.uid, createdAt);

    const updatedProject = {
      ...project,
      createdAt,
      thumbnail,
    };

    dispatch(setProject(updatedProject));

    try {
      const projectId = await saveProject(user.uid, scene, updatedProject);
      dispatch(setProjectId(projectId));
      setSnackbar(
        setOpenSnackBarState(t('editorToolbar.saveProjectSuccess'), 'success'),
      );
    } catch (error) {
      console.log('Error saving project:', error);
      setSnackbar(setOpenSnackBarState(t('editorToolbar.saveProjectFailure'), 'error'));
    }
  };

  return (
    <div className="root">
      <div className="properties-panel">
        <div className="project-name-panel">
          <FormControl fullWidth>
            <TextField
              label={t('editorToolbar.projectNameLabel')}
              value={project.projectName}
              onChange={(e) => dispatch(setProjectName(e.target.value))}
              error={nameError}
            />
            {nameError && (
              <FormHelperText error>
                {t('editorToolbar.nameError')}
              </FormHelperText>
            )}
          </FormControl>
        </div>

        <div className="adding-panel">
          <div className="header">{t('editorToolbar.addModelHeader')}</div>
          <div className="models-list">
            <ModelsList />
          </div>
        </div>

        <div className="editing-panel">
          <div className="header">{t('editorToolbar.modifyModelHeader')}</div>
          <Properties />
        </div>
        <div className="button-container">
          <div className="button">
            <FilledButton onClick={handleSaveProject}>
              {t('editorToolbar.saveProjectButton')}
            </FilledButton>
          </div>
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
