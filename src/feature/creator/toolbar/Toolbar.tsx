import { FormControl, FormHelperText, TextField } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject, getProject } from '../../../api/projectsApi';
import { useAuth } from '../../../auth/AuthProvider';
import FilledButton from '../../../components/filledButton/FilledButton';
import { useAppDispatch } from '../../../redux';
import {
  changeInteractionState, clearCreatorState, creatorSelector, Interaction,
} from '../../../redux/slices/creator';
import { set } from '../../../redux/slices/scene';
import { ROUTES } from '../../navigation/routes';
import './Toolbar.css';

function CreatorToolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { interaction, points } = useSelector(creatorSelector);
  const [projectName, setProjectName] = useState('');
  const [nameError, setNameError] = useState(false);

  const handleDone = async () => {
    if (projectName.trim() === '') {
      setNameError(true);
      return;
    }

    setNameError(false);

    if (!isLoggedIn || user == null) {
      return;
    }

    let id;
    try {
      id = await createProject(user.uid, projectName, points);
    } catch (error) {
      console.error('Error creating project:', error);
      return;
    }

    try {
      const scene = await getProject(id, user.uid);
      dispatch(set(scene));
    } catch (error) {
      console.error('Error getting project:', error);
    }

    navigate(ROUTES.EDITOR);
    dispatch(clearCreatorState());
  };

  const handleSwitchDelete = () => {
    if (interaction === Interaction.Idle) {
      dispatch(changeInteractionState(Interaction.DeletingVertex));
    } else if (interaction === Interaction.DeletingVertex) {
      dispatch(changeInteractionState(Interaction.Idle));
    }
  };

  return (
    <div>
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
      <FilledButton onClick={handleDone}>Done</FilledButton>
      <FilledButton
        className={interaction === Interaction.DeletingVertex ? 'active' : 'inactive'}
        onClick={handleSwitchDelete}
      >
        Delete
      </FilledButton>
    </div>
  );
}

export default CreatorToolbar;
