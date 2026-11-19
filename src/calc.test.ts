import { describe, expect, test } from "vitest";
import {
  cleared,
  derive,
  displayValue,
  fieldLabel,
  maxEntry,
  money,
  percentLabel,
  pressKey,
  setField,
  stepField,
  stepState,
  type Calc,
  type Entry,
  type Field,
} from "./calc";

const start = cleared({ percent: 20, people: 1 });

const withBill = (bill: number, people = 1) =>
  setField({ ...start, people }, "bill", bill);

/** Bill $12.35 with the total set to $15.00, so the tip is 21.457%. */
const offGrid: Calc = { bill: 1235, percent: 20, total: 1500, people: 1 };

describe("cleared", () => {
  test("starts from the defaults with no bill", () => {
    expect(cleared({ percent: 18, people: 3 })).toEqual({
      bill: 0,
      percent: 18,
      total: 0,
      people: 3,
    });
  });
});

describe("setField", () => {
  test("bill applies the anchor percent", () => {
    expect(withBill(4763).total).toBe(5716);
  });

  test("bill re-applies the anchor percent after the total changed", () => {
    const rounded = setField(withBill(4763), "total", 6000);

    expect(setField(rounded, "bill", 1000).total).toBe(1200);
  });

  test("percent moves the anchor and the total", () => {
    expect(setField(withBill(1235), "percent", 15)).toEqual({
      bill: 1235,
      percent: 15,
      total: 1420,
      people: 1,
    });
  });

  test("tip sets the total without moving the anchor", () => {
    expect(setField(withBill(1235), "tip", 300)).toMatchObject({
      percent: 20,
      total: 1535,
    });
  });

  test("total, not below the bill", () => {
    expect(setField(withBill(1235), "total", 1600).total).toBe(1600);
    expect(setField(withBill(1235), "total", 9).total).toBe(1235);
  });

  test("people has a minimum of one", () => {
    expect(setField(start, "people", 0).people).toBe(1);
    expect(setField(start, "people", 4).people).toBe(4);
  });

  test("each multiplies by people, not below the bill", () => {
    expect(setField(withBill(1235, 2), "each", 1500).total).toBe(3000);
    expect(setField(withBill(1235, 2), "each", 9).total).toBe(1235);
  });
});

describe("stepField", () => {
  test("bill does not step", () => {
    const calc = withBill(1235);

    expect(stepField(calc, "bill", 1)).toBe(calc);
  });

  test("percent steps by one whole percent", () => {
    expect(stepField(withBill(1235), "percent", 1)).toMatchObject({
      percent: 21,
      total: 1494,
    });
    expect(stepField(withBill(1235), "percent", -1)).toMatchObject({
      percent: 19,
      total: 1470,
    });
  });

  test("percent stops at zero", () => {
    expect(
      stepField(setField(start, "percent", 0), "percent", -1).percent,
    ).toBe(0);
  });

  test("an off-grid percent steps to the next whole percent", () => {
    expect(stepField(offGrid, "percent", 1)).toMatchObject({
      percent: 22,
      total: 1507,
    });
    expect(stepField(offGrid, "percent", -1)).toMatchObject({
      percent: 21,
      total: 1494,
    });
  });

  test("percent steps on a bill too small to tell percents apart", () => {
    // 23% and 24% of $0.50 both round to a 12 cent tip.
    const small = setField(withBill(50), "percent", 24);
    const down = stepField(small, "percent", -1);

    expect(down.total).toBe(small.total);
    expect(percentLabel(derive(down))).toBe("23%");
    expect(percentLabel(derive(stepField(down, "percent", -1)))).toBe("22%");
  });

  test("tip steps to even dollars, not below zero", () => {
    const calc = withBill(1235);

    expect(derive(stepField(calc, "tip", 1)).tip).toBe(300);
    expect(derive(stepField(calc, "tip", -1)).tip).toBe(200);
    expect(derive(stepField(setField(calc, "tip", 300), "tip", -1)).tip).toBe(
      200,
    );
    expect(derive(stepField(setField(calc, "tip", 50), "tip", -1)).tip).toBe(0);
    expect(derive(stepField(setField(calc, "tip", 0), "tip", -1)).tip).toBe(0);
  });

  test("total steps to even dollars, not below the bill", () => {
    expect(stepField(withBill(1235), "total", 1).total).toBe(1500);
    expect(stepField(withBill(1235), "total", -1).total).toBe(1400);

    const tight = setField(withBill(1450), "total", 1482);

    expect(stepField(tight, "total", -1).total).toBe(1450);
  });

  test("people steps by one, not below one", () => {
    expect(stepField(start, "people", -1).people).toBe(1);
    expect(stepField({ ...start, people: 2 }, "people", 1).people).toBe(3);
  });

  test("each steps to even dollars, not below an even share of the bill", () => {
    const calc = withBill(1235, 2);

    expect(stepField(calc, "each", 1).total).toBe(1600);
    expect(stepField(calc, "each", -1).total).toBe(1400);

    const tight = setField(withBill(1390, 2), "total", 1400);

    expect(stepField(tight, "each", -1).total).toBe(1390);
  });
});

describe("derive", () => {
  test("tip, percent and each", () => {
    expect(derive(withBill(1235, 2))).toMatchObject({
      tip: 247,
      percent: 20,
      percentIsWhole: true,
      each: 741,
    });
  });

  test("each rounds up to the cent", () => {
    expect(derive({ ...start, total: 1000, people: 3 }).each).toBe(334);
  });

  test("with no bill the percent is the anchor", () => {
    expect(derive(setField(start, "percent", 18))).toMatchObject({
      percent: 18,
      percentIsWhole: true,
    });
  });

  test("a total typed with no bill leaves the percent at the anchor", () => {
    expect(derive(setField(start, "total", 500))).toMatchObject({
      tip: 500,
      percent: 20,
      percentIsWhole: true,
    });
  });

  test("a rounded total leaves the percent off-grid", () => {
    expect(derive(offGrid).percentIsWhole).toBe(false);
  });
});

describe("formatters", () => {
  test("money", () => {
    expect(money(0)).toBe("0.00");
    expect(money(5)).toBe("0.05");
    expect(money(123_456)).toBe("1,234.56");
    expect(money(-50)).toBe("-0.50");
  });

  test("percentLabel shows one decimal when off-grid", () => {
    expect(percentLabel(derive(withBill(1235)))).toBe("20%");
    expect(percentLabel(derive(offGrid))).toBe("21.5%");
  });

  test("displayValue", () => {
    const d = derive(withBill(1235, 2));

    expect(displayValue(d, "percent")).toBe("20%");
    expect(displayValue(d, "people")).toBe("2");
    expect(displayValue(d, "each")).toBe("7.41");
  });
});

const fresh = (field: Field): Entry => ({ field, typed: null });
const typing = (field: Field, typed: number): Entry => ({ field, typed });

describe("pressKey", () => {
  test("the first key replaces the value", () => {
    expect(pressKey({ calc: withBill(4763), entry: fresh("bill") }, 5)).toEqual(
      {
        calc: withBill(5),
        entry: typing("bill", 5),
      },
    );
  });

  test("later keys append a digit", () => {
    expect(
      pressKey({ calc: withBill(47), entry: typing("bill", 47) }, 6).calc.bill,
    ).toBe(476);
  });

  test("back drops the last digit", () => {
    expect(
      pressKey({ calc: withBill(4763), entry: typing("bill", 4763) }, "back")
        .calc.bill,
    ).toBe(476);
    expect(
      pressKey({ calc: withBill(4763), entry: fresh("bill") }, "back").calc
        .bill,
    ).toBe(476);
  });

  test("a total below the bill is kept as typed digits only", () => {
    const first = pressKey({ calc: withBill(1235), entry: fresh("total") }, 1);

    expect(first.calc.total).toBe(1235);
    expect(first.entry.typed).toBe(1);

    const done = [6, 0, 0].reduce(pressKey, first);

    expect(done.calc.total).toBe(1600);
  });

  test("no sequence of keys makes the tip negative", () => {
    const keys = [1, "back", "back", 5, 9, 9, "back", 0] as const;

    for (const field of ["tip", "total", "each"] as const) {
      const state = { calc: withBill(5000, 2), entry: fresh(field) };

      keys.reduce((current, key) => {
        const next = pressKey(current, key);

        expect(derive(next.calc).tip).toBeGreaterThanOrEqual(0);

        return next;
      }, state);
    }
  });

  test("each types a share of the total", () => {
    const state = { calc: withBill(1235, 2), entry: typing("each", 150) };

    expect(pressKey(state, 0).calc.total).toBe(3000);
  });

  test("percent types whole percents", () => {
    expect(
      pressKey({ calc: offGrid, entry: typing("percent", 21) }, 0).calc.percent,
    ).toBe(210);
  });

  test("back before any digit starts from the rounded percent", () => {
    expect(
      pressKey({ calc: offGrid, entry: fresh("percent") }, "back").calc.percent,
    ).toBe(2);
  });

  test("people stays at least one while a zero is typed", () => {
    const zero = pressKey({ calc: start, entry: fresh("people") }, 0);

    expect(zero.calc.people).toBe(1);
    expect(pressKey(zero, 2).calc.people).toBe(2);
  });

  test("digits past a field's maximum are ignored", () => {
    const bill = {
      calc: withBill(maxEntry.bill),
      entry: typing("bill", maxEntry.bill),
    };

    const percent = {
      calc: setField(start, "percent", 999),
      entry: typing("percent", 999),
    };

    expect(pressKey(bill, 1)).toBe(bill);
    expect(pressKey(percent, 1)).toBe(percent);
  });

  test("back works on a value above the typing maximum", () => {
    const huge = setField(withBill(maxEntry.bill), "percent", 999);

    expect(huge.total).toBeGreaterThan(maxEntry.total);
    expect(
      pressKey({ calc: huge, entry: fresh("total") }, "back").entry.typed,
    ).toBe(Math.floor(huge.total / 10));
  });
});

describe("stepState", () => {
  test("steps the field and ends typing", () => {
    const typed = pressKey({ calc: withBill(1235), entry: fresh("total") }, 1);

    expect(stepState(typed, "total", 1)).toEqual({
      calc: { ...withBill(1235), total: 1300 },
      entry: fresh("total"),
    });
  });
});

describe("fieldLabel", () => {
  test("shows typed digits in the selected field only", () => {
    const state = pressKey({ calc: withBill(1235), entry: fresh("total") }, 1);

    expect(fieldLabel(state, "total")).toBe("0.01");
    expect(fieldLabel(state, "tip")).toBe("0.00");
  });

  test("shows the value once typing ends", () => {
    const state = { calc: withBill(1235, 2), entry: fresh("people") };

    expect(fieldLabel(state, "people")).toBe("2");
    expect(fieldLabel(pressKey(state, 0), "people")).toBe("0");
    expect(fieldLabel(state, "percent")).toBe("20%");
  });
});
