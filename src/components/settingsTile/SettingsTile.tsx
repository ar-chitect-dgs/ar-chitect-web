import { useState } from 'react';
import Popper from '@mui/material/Popper';
import Button from '../button/Button';

import { EditorAction, editorActionNames } from '../../types/KeyBinds';
import './SettingsTile.css';

interface SettingsTileProps {
  actionName: EditorAction;
  actionKey: string;
  listening: boolean;
  setListening: (action: EditorAction | null) => void;
  changeKeyBind: (action: EditorAction, key: string) => boolean;
}

export const SettingsTile = ({
  actionName,
  actionKey,
  listening,
  setListening,
  changeKeyBind,
}: SettingsTileProps): JSX.Element => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [failedKey, setFailedKey] = useState('');

  const open = Boolean(anchor);

  const listenForKey = (event: React.KeyboardEvent) => {
    if (!listening) return;

    let { key } = event;
    if (key.length === 1) key = key.toUpperCase();

    const ok = changeKeyBind(actionName, key);

    if (ok) {
      setListening(null);
    } else {
      setFailedKey(key);
      setAnchor(event.currentTarget as HTMLElement);
      setTimeout(() => setAnchor(null), 1000);
    }
  };

  return (
    <div className="tile">
      <span className="label">
        {editorActionNames[actionName]}
      </span>
      <Button
        className={`button${listening ? ' listening' : ''}`}
        onClick={() => setListening(listening ? null : actionName)}
        onKeyDown={listenForKey}
      >
        {actionKey}
      </Button>
      <Popper open={open} anchorEl={anchor} className="popup">
        Key
        {' '}
        {failedKey}
        {' '}
        is already used.
      </Popper>
    </div>
  );
};
