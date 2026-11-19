// The inline script in index.html applies a stored theme before first paint.
// With nothing stored, `color-scheme: light dark` and the media queries on
// the two theme-color metas follow the system setting.
import * as React from "react";

export type Theme = "light" | "dark";

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

function subscribe(onChange: () => void) {
  const media = darkQuery();
  const observer = new MutationObserver(onChange);

  media.addEventListener("change", onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });

  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function themeInEffect(): Theme {
  const chosen = document.documentElement.dataset.theme;

  if (chosen === "light" || chosen === "dark") return chosen;

  return darkQuery().matches ? "dark" : "light";
}

/** Sets the page theme and the matching browser bar color. */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  const metas = document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );

  for (const meta of metas) {
    meta.media = meta.dataset.theme === theme ? "all" : "not all";
  }
}

export function useTheme() {
  const theme = React.useSyncExternalStore(subscribe, themeInEffect);

  return {
    theme,
    setTheme: (next: Theme) => {
      window.localStorage.setItem("theme", next);
      applyTheme(next);
    },
  };
}
