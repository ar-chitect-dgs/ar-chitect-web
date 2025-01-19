import { useAuth } from '../auth/AuthProvider';
import Button from '../components/button/Button';
import { SettingsTile } from '../components/settingsTile/SettingsTile';
import { EditorAction } from '../types/KeyBinds';

import './styles/Settings.css';

const Settings = (): JSX.Element => {
  const { user } = useAuth();

  if (user == null) {
    return <div />;
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        <SettingsTile action={EditorAction.MOVE_DOWN} />
        <SettingsTile action={EditorAction.MOVE_UP} />
        <SettingsTile action={EditorAction.MOVE_FRONT} />
        <SettingsTile action={EditorAction.MOVE_BACK} />
        <SettingsTile action={EditorAction.MOVE_LEFT} />
        <SettingsTile action={EditorAction.MOVE_RIGHT} />
      </div>
      <Button>Save changes</Button>
    </div>
  );
};

export default Settings;
