import { useCallback } from 'react';
import FilledButton from '../../../components/filledButton/FilledButton';
import './Toolbar.css';

function CreatorToolbar(): JSX.Element {
  const handleDone = useCallback(() => { }, []);

  return (
    <div>
      <FilledButton onClick={handleDone}>Done</FilledButton>
    </div>
  );
}

export default CreatorToolbar;
