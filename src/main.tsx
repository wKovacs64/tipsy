import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import AppProviders from './app-providers';

if (typeof window !== 'undefined' && !('Cypress' in window)) {
  import('./pwa');
}

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root'),
);
