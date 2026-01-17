import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import gitCommit from 'git-current-commit';
import babel from 'vite-plugin-babel';

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({
      exclude: ['**/node_modules/**'],
      filter: /\.[jt]sx?$/u,
      loader: 'jsx',
      babelConfig: {
        presets: ['@babel/preset-typescript'],
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    {
      name: 'html-commit',
      transformIndexHtml(html) {
        return html.replace(/(<html[^>]*)(>)/i, `$1 data-commit="${gitCommit.sync()}"$2`);
      },
    },
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
        globPatterns: ['icon-*.png', '**/**.{js,css,html,ico,webmanifest}', 'assets/*.woff?(2)'],
      },
    }),
  ],
});
