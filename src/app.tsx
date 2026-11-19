import * as React from "react";
import {
  derive,
  fieldLabel,
  fieldNames,
  money,
  stepField,
  type Field,
} from "./calc";
import { BackspaceGlyph, SettingsGlyph } from "./glyphs";
import { SettingsSheet } from "./settings-sheet";
import { Stepper } from "./stepper";
import { useTipsy } from "./use-tipsy";

const steppers: Field[] = ["percent", "tip", "people", "each"];
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const keyClass =
  "pressable grid h-[clamp(2.7rem,7cqh,3.8rem)] place-items-center rounded-full sideways:h-auto";

/** Feeds a value's length to font sizes that shrink long values to fit. */
function chars(text: string) {
  const style: React.CSSProperties & Record<`--${string}`, number> = {
    "--chars": text.length,
  };

  return style;
}

const digitKeyClass = `${keyClass} bg-primary font-display text-[1.7rem] leading-none text-primary-foreground`;
const quietKeyClass = `${keyClass} text-[1.05rem] leading-none font-bold inset-ring-2 inset-ring-foreground`;

export function App() {
  const ui = useTipsy();
  const { calc, d } = ui;
  const sheet = React.useRef<HTMLDialogElement>(null);
  const selected = (field: Field) => ui.entry.field === field;

  const down = derive(stepField(calc, "total", -1)).total;
  const up = derive(stepField(calc, "total", 1)).total;
  const total = fieldLabel(ui.state, "total");

  const onKeyDown = React.useEffectEvent((event: KeyboardEvent) => {
    // Shift stays allowed: some layouts need it for the digit row.
    const modified = event.altKey || event.ctrlKey || event.metaKey;

    if (modified || sheet.current?.open === true) return;

    if (event.key === "Backspace") {
      event.preventDefault();
      ui.press("back");
    } else if (/^\d$/.test(event.key)) {
      event.preventDefault();
      ui.press(Number(event.key));
    }
  });

  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);

    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    // The column is the size container its `cqh`/`cqw` clamps measure, so
    // the calculator fits the viewport without scrolling. Sideways, it spans
    // the screen in three columns: readout, steppers, keypad.
    <div className="[container-type:size] mx-auto h-dvh max-w-phone touch-manipulation pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] select-none [-webkit-tap-highlight-color:transparent] sideways:max-w-none">
      <main className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto_auto] px-4.5 pt-3 pb-3.5 sideways:grid-cols-[1fr_1.2fr_0.9fr] sideways:grid-rows-[auto_minmax(0,1fr)] sideways:gap-x-6">
        <header className="flex items-center justify-between sideways:col-start-1 sideways:row-start-1">
          <h1 className="inline-block origin-bottom-left -rotate-7 font-display text-3xl leading-none">
            Tipsy
          </h1>
          <button
            type="button"
            aria-label="Settings"
            aria-haspopup="dialog"
            onClick={() => sheet.current?.showModal()}
          >
            <SettingsGlyph />
          </button>
        </header>
        <SettingsSheet
          ref={sheet}
          defaults={ui.defaults}
          onStepDefault={ui.stepDefault}
        />

        <div className="grid content-center gap-[clamp(0.5rem,3cqh,1.75rem)] sideways:col-start-1 sideways:row-start-2">
          <div className="flex items-baseline justify-between">
            <Label>{fieldNames.bill}</Label>
            <FieldButton
              name={fieldNames.bill}
              value={fieldLabel(ui.state, "bill")}
              selected={selected("bill")}
              className="text-[clamp(2rem,5.4cqh,2.8rem)]"
              onSelect={() => ui.select("bill")}
            />
          </div>

          <div className="grid grid-cols-[1fr_auto] content-center items-center gap-x-3">
            <Label className="col-span-full">{fieldNames.total}</Label>
            <button
              type="button"
              aria-label={`${fieldNames.total} ${total}`}
              aria-pressed={selected("total")}
              className="group justify-self-start font-display text-[min(23cqw,calc(96cqw/var(--chars)),15cqh)] leading-none tabular-nums sideways:text-[min(15cqh,calc(22cqw/var(--chars)))]"
              style={chars(total)}
              onClick={() => ui.select("total")}
            >
              {/* Keyed so each new total replays the wobble. */}
              <span
                key={total}
                className="block origin-[20%_100%] border-b-4 border-transparent group-aria-pressed:border-primary motion-safe:animate-wobble"
              >
                {total}
              </span>
            </button>
            <div className="grid gap-1.5">
              <Pill
                label={`Round total up to ${money(up)}`}
                onClick={() => ui.step("total", 1)}
              >
                ↑ {money(up)}
              </Pill>
              <Pill
                label={`Round total down to ${money(down)}`}
                disabled={down === d.total}
                onClick={() => ui.step("total", -1)}
              >
                ↓ {money(down)}
              </Pill>
            </div>
          </div>
        </div>

        <div className="mb-[clamp(0.6rem,2cqh,1.1rem)] grid grid-cols-2 gap-x-2.75 gap-y-[clamp(0.35rem,1.2cqh,0.7rem)] sideways:row-span-2 sideways:mb-0 sideways:grid-cols-1 sideways:content-center">
          {steppers.map((field) => {
            const value = fieldLabel(ui.state, field);

            return (
              <div
                key={field}
                className="grid gap-0.5 sideways:grid-cols-[3.5rem_1fr] sideways:items-center"
              >
                <Label className="ps-2.5">{fieldNames[field]}</Label>
                <Stepper
                  name={fieldNames[field]}
                  onStep={(direction) => ui.step(field, direction)}
                >
                  <FieldButton
                    name={fieldNames[field]}
                    value={value}
                    selected={selected(field)}
                    // Long amounts shrink to stay between the coins.
                    className="pt-1 text-[min(1.3rem,calc(36cqw/var(--chars)))] sideways:text-[min(1.3rem,calc(16cqw/var(--chars)))]"
                    style={chars(value)}
                    onSelect={() => ui.select(field)}
                  />
                </Stepper>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-x-2.25 gap-y-[clamp(0.35rem,1cqh,0.55rem)] sideways:row-span-2 sideways:grid-rows-4">
          {digits.map((digit) => (
            <button
              key={digit}
              type="button"
              className={digitKeyClass}
              onClick={() => ui.press(digit)}
            >
              {digit}
            </button>
          ))}
          <button type="button" className={quietKeyClass} onClick={ui.clear}>
            Clear
          </button>
          <button
            type="button"
            className={digitKeyClass}
            onClick={() => ui.press(0)}
          >
            0
          </button>
          <button
            type="button"
            aria-label="Delete digit"
            className={quietKeyClass}
            onClick={() => ui.press("back")}
          >
            <BackspaceGlyph />
          </button>
        </div>
      </main>
    </div>
  );
}

function Label({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`text-label font-bold text-muted-foreground ${className}`}>
      {children}
    </span>
  );
}

function FieldButton({
  name,
  value,
  selected,
  className,
  style,
  onSelect,
}: {
  name: string;
  value: string;
  selected: boolean;
  className: string;
  style?: React.CSSProperties;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${name} ${value}`}
      aria-pressed={selected}
      className={`border-b-4 border-transparent font-display leading-none tabular-nums aria-pressed:border-primary ${className}`}
      style={style}
      onClick={onSelect}
    >
      {value}
    </button>
  );
}

function Pill({
  label,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className="pressable rounded-full bg-foreground px-3.25 py-2.25 text-[1.05rem] font-bold whitespace-nowrap text-background tabular-nums disabled:opacity-30"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
