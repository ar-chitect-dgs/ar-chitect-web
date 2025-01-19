import { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../button/Button';

import { useAppDispatch } from '../../redux';
import { setKeyBind, settingsSelector } from '../../redux/slices/settings';
import { EditorAction } from '../../types/KeyBinds';
import './SettingsTile.css';

export const SettingsTile = ({ action } : {action: EditorAction}): JSX.Element => {
  const [listening, setListening] = useState(false);
  const dispatch = useAppDispatch();
  const { keyBinds } = useSelector(settingsSelector);

  console.log(keyBinds, action);

  const listenForKey = (event: React.KeyboardEvent) => {
    if (!listening) return;

    dispatch(setKeyBind(action, event.key));
    setListening(!listening);
  };

  return (
    <div className="tile">
      <div className="label">
        {action}
      </div>
      <Button
        className="button"
        onClick={() => setListening(!listening)}
        onKeyDown={listenForKey}
      >
        {keyBinds[action]}
      </Button>
    </div>
  );
};
