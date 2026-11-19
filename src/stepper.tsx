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
      <Coin label={`Decrease ${name}`} onClick={() => onStep(-1)}>
        −
      </Coin>
      {children}
      <Coin label={`Increase ${name}`} onClick={() => onStep(1)}>
        +
      </Coin>
    </div>
  );
}

function Coin({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="aspect-square w-coin pressable rounded-full bg-primary text-2xl leading-none font-bold text-primary-foreground"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
