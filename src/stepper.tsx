export function Stepper({
  name,
  onStep,
  children,
}: {
  name: string;
  onStep: (direction: 1 | -1) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center rounded-full bg-muted p-1">
      <Coin side="start" label={`Decrease ${name}`} onClick={() => onStep(-1)}>
        −
      </Coin>
      {children}
      <Coin side="end" label={`Increase ${name}`} onClick={() => onStep(1)}>
        +
      </Coin>
    </div>
  );
}

// The tap area reaches past the coin, outward and up and down, but not toward
// the value between the coins, which is tappable too.
const reach = {
  start: "after:[inset-inline:-9px_0]",
  end: "after:[inset-inline:0_-9px]",
};

function Coin({
  side,
  label,
  onClick,
  children,
}: {
  side: keyof typeof reach;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`relative aspect-square w-coin pressable rounded-full bg-primary text-2xl leading-none font-bold text-primary-foreground after:absolute after:[inset-block:-6px] ${reach[side]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
