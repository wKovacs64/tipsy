import '@fontsource/source-sans-pro/latin-200.css';
import '@fontsource/source-sans-pro/latin-400.css';
import '@fontsource/source-sans-pro/latin-600.css';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route } from 'react-router-dom';
import Layout from './core/layout';
import HomePage from './pages/home';
import CalcPage from './pages/calc';
import SettingsPage from './pages/settings';
import NotFoundPage from './pages/not-found';
import './app.css';

function App() {
  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ 'data-commit': __COMMIT__ }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="calc/:bill" element={<CalcPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
