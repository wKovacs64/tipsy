// The calculator model. Every value is an integer (cents, whole percent,
// people), so there is no float math and typing a key appends a digit to an
// integer for every field.

export type Field = "bill" | "percent" | "tip" | "total" | "people" | "each";

export type Key = number | "back";

export type Calc = {
  bill: number;
  /** Percent the tip snaps back to whenever the bill changes. */
  percent: number;
  total: number;
  people: number;
};

/**
 * The field the keypad types into, and the digits typed into it so far.
 * `typed` is null until the first key, which replaces the field's value.
 */
export type Entry = { field: Field; typed: number | null };

/** Everything the calculator screen holds besides the saved defaults. */
export type CalcState = { calc: Calc; entry: Entry };

export type Defaults = { percent: number; people: number };

const maxMoney = 9_999_999;

/** Largest value the keypad can type into each field. */
export const maxEntry: Record<Field, number> = {
  bill: maxMoney,
  percent: 999,
  tip: maxMoney,
  total: maxMoney,
  people: 999,
  each: maxMoney,
};

const totalAtPercent = (bill: number, percent: number) =>
  bill + Math.round((bill * percent) / 100);

export function derive(calc: Calc) {
  const tip = calc.total - calc.bill;

  // On a small bill several percents round to the same total, so the anchor
  // is the percent whenever it still produces the total. With no bill there
  // is nothing to take a percent of, so the anchor stands.
  const atAnchor =
    calc.bill === 0 || totalAtPercent(calc.bill, calc.percent) === calc.total;

  const percent = atAnchor ? calc.percent : (tip / calc.bill) * 100;

  return {
    ...calc,
    tip,
    percent,
    percentIsWhole:
      atAnchor || totalAtPercent(calc.bill, Math.round(percent)) === calc.total,
    each: Math.ceil(calc.total / calc.people),
  };
}

export type Derived = ReturnType<typeof derive>;

export function cleared(defaults: Defaults): Calc {
  return {
    bill: 0,
    percent: defaults.percent,
    total: 0,
    people: defaults.people,
  };
}

/** The total never drops below the bill, so the tip is never negative. */
const setters: Record<Field, (calc: Calc, value: number) => Calc> = {
  bill: (calc, value) => ({
    ...calc,
    bill: value,
    total: totalAtPercent(value, calc.percent),
  }),
  percent: (calc, value) => ({
    ...calc,
    percent: value,
    total: totalAtPercent(calc.bill, value),
  }),
  tip: (calc, value) => ({ ...calc, total: calc.bill + value }),
  total: (calc, value) => ({ ...calc, total: Math.max(calc.bill, value) }),
  people: (calc, value) => ({ ...calc, people: Math.max(1, value) }),
  each: (calc, value) => ({
    ...calc,
    total: Math.max(calc.bill, value * calc.people),
  }),
};

export function setField(calc: Calc, field: Field, value: number) {
  return setters[field](calc, value);
}

const nextDollar = (cents: number) => (Math.floor(cents / 100) + 1) * 100;

const previousDollar = (cents: number) =>
  cents % 100 === 0 ? cents - 100 : Math.floor(cents / 100) * 100;

/** The value one step from the current one, for every field but the bill. */
const steps: Record<
  Exclude<Field, "bill">,
  (d: Derived, direction: 1 | -1) => number
> = {
  percent: (d, direction) => {
    if (d.percentIsWhole) return Math.max(0, Math.round(d.percent) + direction);

    return Math.max(
      0,
      direction > 0 ? Math.floor(d.percent) + 1 : Math.ceil(d.percent) - 1,
    );
  },
  tip: (d, direction) =>
    direction > 0 ? nextDollar(d.tip) : Math.max(0, previousDollar(d.tip)),
  total: (d, direction) =>
    direction > 0
      ? nextDollar(d.total)
      : Math.max(d.bill, previousDollar(d.total)),
  people: (d, direction) => d.people + direction,
  each: (d, direction) =>
    direction > 0
      ? nextDollar(d.each)
      : Math.max(Math.ceil(d.bill / d.people), previousDollar(d.each)),
};

export function stepField(calc: Calc, field: Field, direction: 1 | -1) {
  if (field === "bill") return calc;

  return setField(calc, field, steps[field](derive(calc), direction));
}

/** Applies one step and ends any typing, so the field shows its new value. */
export function stepState(
  state: CalcState,
  field: Field,
  direction: 1 | -1,
): CalcState {
  return {
    calc: stepField(state.calc, field, direction),
    entry: { field: state.entry.field, typed: null },
  };
}

/**
 * Types `key` into the entry's field. Digits past `maxEntry` are ignored.
 * Backspace before any digit starts from the value the field shows.
 */
export function pressKey(state: CalcState, key: Key): CalcState {
  const { calc, entry } = state;
  const { field } = entry;

  if (key === "back") {
    const d = derive(calc);
    const shown = field === "percent" ? Math.round(d.percent) : d[field];
    const typed = Math.floor((entry.typed ?? shown) / 10);

    return { calc: setField(calc, field, typed), entry: { field, typed } };
  }

  const typed = (entry.typed ?? 0) * 10 + key;

  if (typed > maxEntry[field]) return state;

  return { calc: setField(calc, field, typed), entry: { field, typed } };
}

export function money(cents: number) {
  const absolute = Math.abs(Math.round(cents));
  const dollars = Math.floor(absolute / 100).toLocaleString("en-US");
  const rest = String(absolute % 100).padStart(2, "0");

  return `${cents < 0 ? "-" : ""}${dollars}.${rest}`;
}

export function percentLabel(d: Derived) {
  return d.percentIsWhole
    ? `${Math.round(d.percent)}%`
    : `${d.percent.toFixed(1)}%`;
}

export const fieldNames: Record<Field, string> = {
  bill: "Bill",
  percent: "Tip %",
  tip: "Tip",
  total: "Total",
  people: "Split",
  each: "Each",
};

export function displayValue(d: Derived, field: Field) {
  if (field === "percent") return percentLabel(d);

  if (field === "people") return String(d.people);

  return money(d[field]);
}

/**
 * What a field shows: the digits being typed into it, else its value. The
 * two differ while a typed number is still below the field's minimum, such
 * as the first digits of a total.
 */
export function fieldLabel(state: CalcState, field: Field) {
  const typed = state.entry.field === field ? state.entry.typed : null;

  if (typed === null) return displayValue(derive(state.calc), field);

  if (field === "percent") return `${typed}%`;

  if (field === "people") return String(typed);

  return money(typed);
}
