import { FormControl, TextField } from '@mui/material';
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
import { projectSelector, setProjectName } from '../../../redux/slices/project';
import { setScene } from '../../../redux/slices/scene';
import { ROUTES } from '../../navigation/routes';
import './Toolbar.css';
import TextButton from '../../../components/textButton/TextButton';

function CreatorToolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projectName } = useSelector(projectSelector);
  const { interaction, points } = useSelector(creatorSelector);

  const handleDone = async () => {
    try {
      dispatch(setScene({ corners: points }));
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
    <div className="toolbar">
      <FormControl fullWidth>
        <TextField
          label="Project Name"
          value={projectName}
          onChange={(e) => dispatch(setProjectName(e.target.value))}
        />
      </FormControl>
      <div className="toolbar-delete">
        <TextButton
          className={
            interaction === Interaction.DeletingVertex ? 'active' : 'inactive'
          }
          onClick={handleSwitchDelete}
        >
          {`${interaction === Interaction.DeletingVertex ? 'Stop deleting vertices' : 'Start deleting vertices'}`}
        </TextButton>
      </div>

      <div className="toolbar-next">
        <FilledButton onClick={handleDone}>Go to the room design</FilledButton>
      </div>
    </div>
  );
}

export default CreatorToolbar;
