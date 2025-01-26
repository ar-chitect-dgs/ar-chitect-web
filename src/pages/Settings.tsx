import {
  Card,
  FormControl, FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  settingsSelector,
  switchBoundingBoxes,
  switchEditorSliders,
} from '../redux/slices/settings';
import { useAppDispatch } from '../redux';
import './styles/Settings.css';
import ScrollBar from '../components/scrollbar/ScrollBar';
import KeyBindSettings from '../components/keybindSettings/KeybindSettings';

const Settings = (): JSX.Element => {
  const { i18n, t } = useTranslation();
  const { displayBoundingBoxes, useEditorSliders } = useSelector(settingsSelector);
  const [language, setLanguage] = useState(i18n.language.split('-')[0]);
  const dispatch = useAppDispatch();

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    const language = event.target.value as string;
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <div className="settings-page">
      <div className="settings-scrollbar-outside-container">
        <ScrollBar className="settings-scrollbar">
          <div className="settings-scrollbar-inside-container">
            <Card>
              <KeyBindSettings />
            </Card>
            <Card>
              <h2>{t('settings.otherTitle')}</h2>
              <div className="other-settings-row">
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>{t('settings.language')}</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={changeLanguage}
                    defaultValue="en"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="pl">Polski</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Switch />}
                  checked={displayBoundingBoxes}
                  onChange={() => dispatch(switchBoundingBoxes())}
                  label={t('settings.boundingBoxes')}
                />
                <FormControlLabel
                  control={<Switch />}
                  checked={useEditorSliders}
                  onChange={() => dispatch(switchEditorSliders())}
                  label={t('settings.sliders')}
                />
              </div>
            </Card>
          </div>
        </ScrollBar>
      </div>
    </div>
  );
};

export default Settings;
