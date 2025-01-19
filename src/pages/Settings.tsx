import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Modal,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { useAuth } from '../auth/AuthProvider';
import { EditorAction, KeyBinds } from '../types/KeyBinds';
import { SettingsTile } from '../components/settingsTile/SettingsTile';
import { applyNewKeyBinds, settingsSelector } from '../redux/slices/settings';
import FilledButton from '../components/filledButton/FilledButton';

import './styles/Settings.css';
import { useAppDispatch } from '../redux';

const KeyBindSettings = (): JSX.Element => {
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
    <>
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
    </>
  );
};

const Settings = (): JSX.Element => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    const language = event.target.value as string;
    i18n.changeLanguage(language);
  };

  return (
    <div className="settings-page">
      <h1>{t('settings.title')}</h1>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>{t('settings.language')}</InputLabel>
        <Select
          value={i18n.language}
          label="Language"
          onChange={changeLanguage}
          defaultValue="en"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="pl">Polski</MenuItem>
          {/* Add more languages as needed */}
        </Select>
      </FormControl>
      <KeyBindSettings />
    </div>
  );
};

export default Settings;
