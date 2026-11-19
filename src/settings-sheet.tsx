import * as React from "react";
import type { Defaults } from "./calc";
import { Stepper } from "./stepper";
import { useTheme } from "./theme";

export function SettingsSheet({
  ref,
  defaults,
  onStepDefault,
}: {
  ref: React.RefObject<HTMLDialogElement | null>;
  defaults: Defaults;
  onStepDefault: (field: keyof Defaults, direction: 1 | -1) => void;
}) {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  const titleId = React.useId();
  const darkId = React.useId();

  // A click on the dialog element itself can only land on the backdrop: the
  // padding lives on the inner grid. Escape closes it natively.
  React.useEffect(() => {
    const dialog = ref.current;

    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog?.close();
    };

    dialog?.addEventListener("click", onClick);

    return () => dialog?.removeEventListener("click", onClick);
  }, [ref]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="fixed inset-x-0 top-auto bottom-0 mx-auto w-full max-w-phone rounded-t-4xl bg-background text-foreground ring-2 ring-muted backdrop:bg-backdrop motion-safe:open:transition-transform motion-safe:open:duration-280 motion-safe:open:ease-[cubic-bezier(0.2,0.9,0.3,1)] motion-safe:open:starting:translate-y-full"
    >
      <div className="grid gap-5.5 px-5 pt-5.5 pb-[calc(env(safe-area-inset-bottom)+1.1rem)]">
        <h2 id={titleId} className="font-display text-[1.7rem] leading-none">
          Settings
        </h2>
        <div className="grid grid-cols-[1fr_10rem] items-center gap-y-4 text-[1.15rem] font-bold">
          <span id={darkId}>Dark mode</span>
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-labelledby={darkId}
            className="group grid w-20 justify-self-end rounded-full bg-muted p-1"
            onClick={() => setTheme(dark ? "light" : "dark")}
          >
            <span className="aspect-square w-coin rounded-full bg-muted-foreground group-aria-checked:justify-self-end group-aria-checked:bg-primary group-aria-checked:shadow-[inset_0_0_0_0.45rem_var(--color-primary-foreground)]" />
          </button>
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
          onClick={() => ref.current?.close()}
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
