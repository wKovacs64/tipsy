import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import gitCommit from "git-current-commit";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    {
      name: "html-commit",
      transformIndexHtml(html) {
        return html.replace(
          /(<html[^>]*)(>)/i,
          `$1 data-commit="${gitCommit.sync()}"$2`,
        );
      },
    },
    VitePWA({
      // With no onNeedRefresh in pwa.ts, "prompt" defers a new version to the next launch instead of reloading mid-calculation.
      registerType: "prompt",
      manifest: {
        short_name: "Tipsy",
        name: "Tipsy",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#24122c",
        background_color: "#24122c",
      },
      workbox: {
        globPatterns: [
          "icon-*.png",
          "**/**.{js,css,html,ico,webmanifest}",
          "assets/*.woff2",
        ],
      },
    }),
  ],
});
