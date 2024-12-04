import { useSelector } from 'react-redux';
import FilledButton from '../../../components/filledButton/FilledButton';
import { useAppDispatch } from '../../../redux';
import {
  changeInteractionState, creatorSelector, Interaction, normalizePoints,
} from '../../../redux/slices/creator';
import './Toolbar.css';

function CreatorToolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const { interaction } = useSelector(creatorSelector);

  const handleDone = () => {
    dispatch(normalizePoints());
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
