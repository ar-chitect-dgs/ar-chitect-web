import { FormControl, TextField } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FilledButton from '../../../components/filledButton/FilledButton';
import { useAppDispatch } from '../../../redux';
import {
  changeInteractionState,
  clearCreatorState,
  creatorSelector,
  Interaction,
} from '../../../redux/slices/creator';
import { set } from '../../../redux/slices/scene';
import { ROUTES } from '../../navigation/routes';
import './Toolbar.css';
import { projectSelector, setProjectName } from '../../../redux/slices/project';

function CreatorToolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projectName } = useSelector(projectSelector);
  const { interaction, points } = useSelector(creatorSelector);

  const handleDone = async () => {
    try {
      dispatch(set({ corners: points }));
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
          onChange={(e) => dispatch(setProjectName(e.target.value))}
        />
      </FormControl>
      <FilledButton onClick={handleDone}>Done</FilledButton>
      <FilledButton
        className={
          interaction === Interaction.DeletingVertex ? 'active' : 'inactive'
        }
        onClick={handleSwitchDelete}
      >
        Delete
      </FilledButton>
    </div>
  );
}

export default CreatorToolbar;
