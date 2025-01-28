import Popper from '@mui/material/Popper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EditorAction, editorActionNames } from '../../types/KeyBinds';

import ToggleButton from '../toggleButton/ToggleButton';
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

  const { t } = useTranslation();

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
      <ToggleButton
        className="key-button"
        onClick={() => setListening(listening ? null : actionName)}
        onKeyDown={listenForKey}
        toggled={listening}
      >
        {actionKey}
      </ToggleButton>
      <span className="label">
        {t(editorActionNames[actionName])}
      </span>
      <Popper open={open} anchorEl={anchor} className="popup">
        {t('settings.keyAlreadyUsed', { key: failedKey })}
      </Popper>
    </div>
  );
};
