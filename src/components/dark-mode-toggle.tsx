import Switch from 'react-switch';
import useDarkMode from 'use-dark-mode';
import { appDefaultDarkMode } from '../state';
import { palette } from '../theme';

function DarkModeToggle(): JSX.Element | null {
  const darkMode = useDarkMode(appDefaultDarkMode);

  // defer rendering of the toggle until the client has been hydrated
  if (typeof window === 'undefined') return null;

  return (
    <Switch
      id="dark-mode"
      aria-checked={darkMode.value}
      checked={darkMode.value}
      onChange={darkMode.toggle}
      onColor={palette.primary}
    />
  );
}

export default DarkModeToggle;
