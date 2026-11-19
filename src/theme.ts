// The theme the user chose, stored under `theme` in localStorage.
// - `system`: nothing stored. `color-scheme: light dark` and the media queries
//   on the two theme-color metas follow the system setting.
// - `light` / `dark`: stored, and set as `data-theme` on <html>, which pins
//   `color-scheme` and the browser bar color.
// The inline script in index.html applies a stored choice before first paint.
import * as React from "react";

export const themeChoices = ["system", "light", "dark"] as const;

export type ThemeChoice = (typeof themeChoices)[number];

const storageKey = "theme";

const parse = (value: string | null | undefined): ThemeChoice =>
  value === "light" || value === "dark" ? value : "system";

/** Shows `choice` on the page and in the browser bar. */
function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;

  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;

  const metas = document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );

  for (const meta of metas) {
    const own = meta.dataset.theme;

    if (choice === "system") meta.media = `(prefers-color-scheme: ${own})`;
    else meta.media = own === choice ? "all" : "not all";
  }
}

/** Applies a choice made in another tab. */
function onStorage(event: StorageEvent) {
  if (event.key === storageKey) applyTheme(parse(event.newValue));
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });
  window.addEventListener("storage", onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

const currentChoice = () => parse(document.documentElement.dataset.theme);

export function useTheme() {
  const choice = React.useSyncExternalStore(subscribe, currentChoice);

  return {
    choice,
    choose: (next: ThemeChoice) => {
      if (next === "system") window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, next);

      applyTheme(next);
    },
  };
}
