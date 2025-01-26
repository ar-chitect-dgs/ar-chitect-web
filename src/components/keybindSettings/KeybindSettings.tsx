import { useTranslation } from 'react-i18next';
import { unstable_usePrompt as usePrompt } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/AuthProvider';
import {
  applyNewKeyBinds,
  settingsSelector,
} from '../../redux/slices/settings';
import { defaultKeyBinds, EditorAction, KeyBinds } from '../../types/KeyBinds';
import { useAppDispatch } from '../../redux';
import { updateKeyBinds } from '../../api/settings';
import FilledButton from '../filledButton/FilledButton';
import { SettingsTile } from '../settingsTile/SettingsTile';

import './KeybindSettings.css';

const KeyBindSettings = (): JSX.Element => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [listening, setListening] = useState<EditorAction | null>(null);
  const { keyBinds: currentKeyBinds } = useSelector(settingsSelector);
  const [keyBinds, setKeyBinds] = useState<KeyBinds>(currentKeyBinds);
  const [isDirty, setIsDirty] = useState(false);
  const dispatch = useAppDispatch();

  usePrompt({ message: t('settings.unsavedChanges'), when: isDirty });

  const availableActions: EditorAction[] = Object.values(EditorAction).filter(
    (value): value is EditorAction => typeof value !== 'string',
  ) as EditorAction[];

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
      <h2>{t('settings.controlsTitle')}</h2>
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

      <div className="buttons-panel">
        <FilledButton onClick={saveChanges} isDisabled={!isDirty}>
          {t('settings.saveChanges')}
        </FilledButton>
        <FilledButton onClick={resetToDefaults}>
          {t('settings.reset')}
        </FilledButton>
      </div>
    </div>
  );
};

export default KeyBindSettings;
