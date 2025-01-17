import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import './styles/About.css';

const Settings = (): JSX.Element => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    const language = event.target.value as string;
    i18n.changeLanguage(language);
  };

  return (
    <div className="about-page">
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
    </div>
  );
};

export default Settings;
