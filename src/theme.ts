import * as React from "react";

export const themeChoices = ["system", "light", "dark"] as const;

export type ThemeChoice = (typeof themeChoices)[number];

const storageKey = "theme";

const parse = (value: string | null | undefined): ThemeChoice =>
  value === "light" || value === "dark" ? value : "system";

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
