import FilledButton from '../../../components/filledButton/FilledButton';
import { useAppDispatch } from '../../../redux';
import { normalizePoints } from '../../../redux/slices/creator';
import './Toolbar.css';

function CreatorToolbar(): JSX.Element {
  const dispatch = useAppDispatch();

  const handleDone = () => {
    dispatch(normalizePoints());
  };

  return (
    <div>
      <FilledButton onClick={handleDone}>Done</FilledButton>
    </div>
  );
}

export default CreatorToolbar;
