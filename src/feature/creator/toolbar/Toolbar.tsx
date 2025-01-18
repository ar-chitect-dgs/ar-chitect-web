import { FormControl, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { normalizePoints } from '../../../utils/utils';

function CreatorToolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projectName } = useSelector(projectSelector);
  const { interaction, points } = useSelector(creatorSelector);
  const { t } = useTranslation();

  const handleDone = async () => {
    try {
      const corners = normalizePoints(points);

      dispatch(setScene({ corners }));
    } catch (error) {
      console.error(error);
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
          label={t('creatorToolbar.projectNameLabel')}
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
          {interaction === Interaction.DeletingVertex
            ? t('creatorToolbar.stopDeletingVertices')
            : t('creatorToolbar.startDeletingVertices')}
        </TextButton>
      </div>

      <div className="toolbar-next">
        <FilledButton onClick={handleDone}>
          {t('creatorToolbar.goToRoomDesign')}
        </FilledButton>
      </div>
    </div>
  );
}

export default CreatorToolbar;
