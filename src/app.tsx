import '@fontsource/source-sans-3/latin-200.css';
import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-600.css';
import { Routes, Route } from 'react-router';
import { Layout } from './core/layout';
import { HomePage } from './pages/home';
import { CalcPage } from './pages/calc';
import { SettingsPage } from './pages/settings';
import { NotFoundPage } from './pages/not-found';
import './app.css';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calc/:bill" element={<CalcPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
