const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SettingsGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M4 7h8M20 7h-2M4 17h2M12 17h8" />
      <circle cx="15" cy="7" r="2.5" />
      <circle cx="9" cy="17" r="2.5" />
    </svg>
  );
}

export function BackspaceGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z" />
      <path d="m12 10 4 4m0-4-4 4" />
    </svg>
  );
}
