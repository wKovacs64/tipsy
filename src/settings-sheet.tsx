import * as React from "react";
import type { Defaults } from "./calc";
import { Stepper } from "./stepper";
import { themeChoices, useTheme, type ThemeChoice } from "./theme";

const themeNames: Record<ThemeChoice, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

/**
 * Closes the sheet once its slide down has played. `data-closing` starts the
 * slide; with reduced motion there is nothing to wait for. Safari closes a
 * dialog without its exit transition, so the attribute does the work there.
 */
async function dismiss(dialog: HTMLDialogElement) {
  if ("closing" in dialog.dataset) return;

  dialog.dataset.closing = "";
  await Promise.allSettled(dialog.getAnimations().map((a) => a.finished));
  dialog.close();
  delete dialog.dataset.closing;
}

export function SettingsSheet({
  ref,
  defaults,
  onStepDefault,
}: {
  ref: React.RefObject<HTMLDialogElement | null>;
  defaults: Defaults;
  onStepDefault: (field: keyof Defaults, direction: 1 | -1) => void;
}) {
  const theme = useTheme();
  const titleId = React.useId();
  const themeId = React.useId();

  // Every way out (Done, a tap on the backdrop, Escape) slides the sheet
  // down first. A click on the dialog element itself can only land on the
  // backdrop: the padding lives on the inner grid.
  React.useEffect(() => {
    const dialog = ref.current;

    if (!dialog) return undefined;

    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) void dismiss(dialog);
    };

    const onCancel = (event: Event) => {
      event.preventDefault();
      void dismiss(dialog);
    };

    dialog.addEventListener("click", onClick);
    dialog.addEventListener("cancel", onCancel);

    return () => {
      dialog.removeEventListener("click", onClick);
      dialog.removeEventListener("cancel", onCancel);
    };
  }, [ref]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="fixed inset-x-0 top-auto bottom-0 mx-auto w-full max-w-phone sheet rounded-t-4xl bg-background text-foreground ring-2 ring-muted backdrop:bg-backdrop"
    >
      <div className="grid gap-5.5 px-5 pt-5.5 pb-[calc(env(safe-area-inset-bottom)+1.1rem)]">
        <h2 id={titleId} className="font-display text-[1.7rem] leading-none">
          Settings
        </h2>
        <div className="grid grid-cols-[1fr_10rem] items-center gap-y-4 text-[1.15rem] font-bold">
          <span id={themeId}>Theme</span>
          <div
            role="radiogroup"
            aria-labelledby={themeId}
            className="grid grid-cols-3 rounded-full bg-muted p-1"
          >
            {themeChoices.map((choice) => (
              <label
                key={choice}
                className="relative grid h-coin place-items-center rounded-full text-base has-checked:bg-primary has-checked:text-primary-foreground"
              >
                {/* The radio covers its label so it takes the tap itself. */}
                <input
                  type="radio"
                  name="theme"
                  checked={theme.choice === choice}
                  className="absolute inset-0 cursor-pointer appearance-none rounded-full"
                  onChange={() => theme.choose(choice)}
                />
                {themeNames[choice]}
              </label>
            ))}
          </div>
          <span>Default tip</span>
          <Stepper
            name="default tip"
            onStep={(direction) => onStepDefault("percent", direction)}
          >
            <span className="text-center font-display text-[1.3rem] leading-none tabular-nums">
              {defaults.percent}%
            </span>
          </Stepper>
          <span>Default split</span>
          <Stepper
            name="default split"
            onStep={(direction) => onStepDefault("people", direction)}
          >
            <span className="text-center font-display text-[1.3rem] leading-none tabular-nums">
              {defaults.people}
            </span>
          </Stepper>
        </div>
        <button
          type="button"
          className="h-13.5 rounded-full bg-primary font-display text-[1.4rem] leading-none text-primary-foreground active:scale-97"
          onClick={() => {
            if (ref.current) void dismiss(ref.current);
          }}
        >
          Done
        </button>
        <footer className="flex justify-between text-label text-muted-foreground">
          <span>v{__VERSION__}</span>
          <a
            href="https://github.com/wKovacs64/tipsy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-[0.2em]"
          >
            GitHub
          </a>
        </footer>
      </div>
    </dialog>
  );
}
