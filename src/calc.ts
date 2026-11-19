// The calculator model. Every value is an integer (cents, whole percent,
// people), so there is no float math and typing a key appends a digit to an
// integer for every field.

export type Field = "bill" | "percent" | "tip" | "total" | "people" | "each";

export type Key = number | "back";

export type Calc = {
  bill: number;
  /** The tip percent, and the one a new bill returns the total to. */
  percent: number;
  people: number;
  total: Total;
};

/**
 * Where the total comes from.
 * - `percent`: the bill plus `percent` of it. Setting the bill or the
 *   percent, and Clear, lead here.
 * - `amount`: a fixed number of cents, set or stepped through the tip, total
 *   or each. Changing the split keeps it.
 */
export type Total = { from: "percent" } | { from: "amount"; cents: number };

/**
 * The field the keypad types into, and what its next digit does.
 * - `replace`: the next digit replaces the field's value. Selecting a field,
 *   stepping any field, and Clear lead here.
 * - `append`: the next digit appends to `digits`, the number typed so far.
 *   Any key leads here.
 */
export type Entry =
  | { field: Field; mode: "replace" }
  | { field: Field; mode: "append"; digits: number };

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
  const { bill, people } = calc;

  const total =
    calc.total.from === "percent"
      ? totalAtPercent(bill, calc.percent)
      : calc.total.cents;

  const tip = total - bill;

  // A fixed amount shows the percent it works out to. With no bill there is
  // nothing to take a percent of, so the chosen percent stands.
  const measured = calc.total.from === "amount" && bill > 0;
  const percent = measured ? (tip / bill) * 100 : calc.percent;

  return {
    bill,
    people,
    total,
    tip,
    percent,
    percentIsWhole:
      !measured || totalAtPercent(bill, Math.round(percent)) === total,
    each: Math.ceil(total / people),
  };
}

export type Derived = ReturnType<typeof derive>;

export function cleared(defaults: Defaults): Calc {
  return {
    bill: 0,
    percent: defaults.percent,
    people: defaults.people,
    total: fromPercent,
  };
}

const fromPercent: Total = { from: "percent" };

/** A fixed total, never below the bill, so the tip is never negative. */
const amount = (calc: Calc, cents: number): Total => ({
  from: "amount",
  cents: Math.max(calc.bill, cents),
});

const setters: Record<Field, (calc: Calc, value: number) => Calc> = {
  bill: (calc, value) => ({ ...calc, bill: value, total: fromPercent }),
  percent: (calc, value) => ({ ...calc, percent: value, total: fromPercent }),
  tip: (calc, value) => ({ ...calc, total: amount(calc, calc.bill + value) }),
  total: (calc, value) => ({ ...calc, total: amount(calc, value) }),
  people: (calc, value) => ({ ...calc, people: Math.max(1, value) }),
  each: (calc, value) => ({
    ...calc,
    total: amount(calc, value * calc.people),
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
    entry: { field: state.entry.field, mode: "replace" },
  };
}

/**
 * Types `key` into the entry's field. Digits past `maxEntry` are ignored.
 * Backspace before any digit starts from the value the field shows.
 */
export function pressKey(state: CalcState, key: Key): CalcState {
  const { calc, entry } = state;
  const { field } = entry;

  const typed = (digits: number): CalcState => ({
    calc: setField(calc, field, digits),
    entry: { field, mode: "append", digits },
  });

  if (key === "back") {
    const d = derive(calc);
    const shown = field === "percent" ? Math.round(d.percent) : d[field];

    return typed(
      Math.floor((entry.mode === "append" ? entry.digits : shown) / 10),
    );
  }

  const digits = (entry.mode === "append" ? entry.digits : 0) * 10 + key;

  return digits > maxEntry[field] ? state : typed(digits);
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
export function fieldLabel({ calc, entry }: CalcState, field: Field) {
  if (entry.field !== field || entry.mode === "replace") {
    return displayValue(derive(calc), field);
  }

  if (field === "percent") return `${entry.digits}%`;

  if (field === "people") return String(entry.digits);

  return money(entry.digits);
}
