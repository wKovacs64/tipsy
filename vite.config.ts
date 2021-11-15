import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import gitCommit from 'git-current-commit';

export default defineConfig({
  define: {
    __COMMIT__: JSON.stringify(gitCommit.sync()),
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'Tipsy',
        name: 'Tipsy',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#8d6c9f',
        background_color: '#ffffff',
      },
      workbox: {
        globPatterns: [
          'icon-*.png',
          '**/**.{js,css,html,ico,webmanifest}',
          'assets/*.woff?(2)',
        ],
      },
    }),
  ],
});
