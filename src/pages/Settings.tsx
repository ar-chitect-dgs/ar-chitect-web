import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useAuth } from '../auth/AuthProvider';
import FilledButton from '../components/filledButton/FilledButton';
import { SettingsTile } from '../components/settingsTile/SettingsTile';
import { applyNewKeyBinds, settingsSelector } from '../redux/slices/settings';
import { defaultKeyBinds, EditorAction, KeyBinds } from '../types/KeyBinds';

import { updateKeyBinds } from '../api/settings';
import { useAppDispatch } from '../redux';
import './styles/Settings.css';

const KeyBindSettings = (): JSX.Element => {
  const { user } = useAuth();
  const { t } = useTranslation();
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

  const saveChanges = async () => {
    if (user == null) return;

    try {
      await updateKeyBinds(user.uid, keyBinds);
    } catch (error) {
      console.error('Error setting new key bindings:', error);
    }

    dispatch(applyNewKeyBinds(keyBinds));
    setIsDirty(false);
  };

  const resetToDefaults = () => {
    if (keyBinds !== defaultKeyBinds) {
      setIsDirty(true);
      setKeyBinds(defaultKeyBinds);
    }
  };

  if (user == null) {
    return <div />;
  }

  return (
    <div>
      <div className="buttons-panel">
        <FilledButton onClick={saveChanges} isDisabled={!isDirty}>
          {t('settings.saveChanges')}
        </FilledButton>
        <FilledButton onClick={resetToDefaults}>
          {t('settings.reset')}
        </FilledButton>
      </div>
      <div className="keys">
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
      <Modal open={false}>
        <div>
          bruh
        </div>
      </Modal>
    </div>
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
      <div className="columns-container">
        <KeyBindSettings />
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
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default Settings;
