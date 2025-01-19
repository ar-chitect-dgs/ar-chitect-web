import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Modal } from '@mui/material';
import { useAuth } from '../auth/AuthProvider';
import { EditorAction, KeyBinds } from '../types/KeyBinds';
import { SettingsTile } from '../components/settingsTile/SettingsTile';
import { applyNewKeyBinds, settingsSelector } from '../redux/slices/settings';
import FilledButton from '../components/filledButton/FilledButton';

import './styles/Settings.css';
import { useAppDispatch } from '../redux';

const Settings = (): JSX.Element => {
  const { user } = useAuth();
  const [listening, setListening] = useState<EditorAction | null>(null);
  const { keyBinds: currentKeyBinds } = useSelector(settingsSelector);
  const [keyBinds, setKeyBinds] = useState<KeyBinds>(currentKeyBinds);
  const [isDirty, setIsDirty] = useState(false);
  const dispatch = useAppDispatch();

  const availableActions: EditorAction[] = Object.values(EditorAction)
    .filter((value): value is EditorAction => typeof value !== 'string') as EditorAction[];

  const changeListening = (action: EditorAction | null) => {
    setListening(action);
  };

  const changeKeyBind = (action: EditorAction, key: string): boolean => {
    if (Object.values(keyBinds).includes(key)) {
      return false;
    }

    setIsDirty(true);
    setKeyBinds({ ...keyBinds, [action]: key });
    return true;
  };

  const saveChanges = () => {
    // todo send to api
    dispatch(applyNewKeyBinds(keyBinds));
    setIsDirty(false);
  };

  if (user == null) {
    return <div />;
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        {availableActions.map((action) => (
          <SettingsTile
            key={action}
            actionName={action as EditorAction}
            actionKey={keyBinds[action]}
            listening={listening === action}
            setListening={changeListening}
            changeKeyBind={changeKeyBind}
          />
        ))}
      </div>
      <FilledButton onClick={saveChanges} isDisabled={!isDirty}>
        Save changes
      </FilledButton>
      <Modal open={false}>
        <div>
          bruh
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
