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
  type CalcState,
  type Entry,
  type Field,
} from "./calc";

const start = cleared({ percent: 20, people: 1 });

const withBill = (bill: number, people = 1) =>
  setField({ ...start, people }, "bill", bill);

const totalOf = (calc: Calc) => derive(calc).total;

const tipAfter = (from: Calc) => derive(stepField(from, "tip", -1)).tip;

const offGrid: Calc = {
  bill: 1235,
  percent: 20,
  people: 1,
  total: { from: "amount", cents: 1500 },
};

describe("cleared", () => {
  test("starts from the defaults with no bill", () => {
    expect(cleared({ percent: 18, people: 3 })).toEqual({
      bill: 0,
      percent: 18,
      people: 3,
      total: { from: "percent" },
    });
  });
});

describe("setField", () => {
  test("bill applies the percent", () => {
    expect(totalOf(withBill(4763))).toBe(5716);
  });

  test("bill returns a fixed amount to the percent", () => {
    const rounded = setField(withBill(4763), "total", 6000);

    expect(rounded.total).toEqual({ from: "amount", cents: 6000 });

    const rebilled = setField(rounded, "bill", 1000);

    expect(rebilled.total).toEqual({ from: "percent" });
    expect(totalOf(rebilled)).toBe(1200);
  });

  test("percent sets the total from the percent", () => {
    expect(setField(offGrid, "percent", 15)).toEqual({
      bill: 1235,
      percent: 15,
      people: 1,
      total: { from: "percent" },
    });
    expect(totalOf(setField(offGrid, "percent", 15))).toBe(1420);
  });

  test("tip fixes the total without changing the percent", () => {
    expect(setField(withBill(1235), "tip", 300)).toMatchObject({
      percent: 20,
      total: { from: "amount", cents: 1535 },
    });
  });

  test("total, not below the bill", () => {
    expect(totalOf(setField(withBill(1235), "total", 1600))).toBe(1600);
    expect(totalOf(setField(withBill(1235), "total", 9))).toBe(1235);
  });

  test("people has a minimum of one", () => {
    expect(setField(start, "people", 0).people).toBe(1);
    expect(setField(start, "people", 4).people).toBe(4);
  });

  test("people keeps a fixed amount", () => {
    const rounded = setField(withBill(4763), "total", 6000);

    expect(totalOf(setField(rounded, "people", 3))).toBe(6000);
  });

  test("each multiplies by people, not below the bill", () => {
    expect(totalOf(setField(withBill(1235, 2), "each", 1500))).toBe(3000);
    expect(totalOf(setField(withBill(1235, 2), "each", 9))).toBe(1235);
  });
});

describe("stepField", () => {
  test("bill does not step", () => {
    const calc = withBill(1235);

    expect(stepField(calc, "bill", 1)).toBe(calc);
  });

  test("percent steps by one whole percent", () => {
    const up = stepField(withBill(1235), "percent", 1);
    const down = stepField(withBill(1235), "percent", -1);

    expect(up.percent).toBe(21);
    expect(totalOf(up)).toBe(1494);
    expect(down.percent).toBe(19);
    expect(totalOf(down)).toBe(1470);
  });

  test("percent stops at zero", () => {
    expect(
      stepField(setField(start, "percent", 0), "percent", -1).percent,
    ).toBe(0);
  });

  test("an off-grid percent steps to the next whole percent", () => {
    const up = stepField(offGrid, "percent", 1);
    const down = stepField(offGrid, "percent", -1);

    expect(up).toMatchObject({ percent: 22, total: { from: "percent" } });
    expect(totalOf(up)).toBe(1507);
    expect(down.percent).toBe(21);
    expect(totalOf(down)).toBe(1494);
  });

  test("percent steps on a bill too small to tell percents apart", () => {
    const small = setField(withBill(50), "percent", 24);
    const down = stepField(small, "percent", -1);

    expect(totalOf(down)).toBe(totalOf(small));
    expect(percentLabel(derive(down))).toBe("23%");
    expect(percentLabel(derive(stepField(down, "percent", -1)))).toBe("22%");
  });

  test("tip steps to even dollars, not below zero", () => {
    const calc = withBill(1235);

    expect(derive(stepField(calc, "tip", 1)).tip).toBe(300);
    expect(tipAfter(calc)).toBe(200);
    expect(tipAfter(setField(calc, "tip", 300))).toBe(200);
    expect(tipAfter(setField(calc, "tip", 50))).toBe(0);
    expect(tipAfter(setField(calc, "tip", 0))).toBe(0);
  });

  test("total steps to even dollars, not below the bill", () => {
    expect(totalOf(stepField(withBill(1235), "total", 1))).toBe(1500);
    expect(totalOf(stepField(withBill(1235), "total", -1))).toBe(1400);

    const tight = setField(withBill(1450), "total", 1482);

    expect(totalOf(stepField(tight, "total", -1))).toBe(1450);
  });

  test("people steps by one, not below one", () => {
    expect(stepField(start, "people", -1).people).toBe(1);
    expect(stepField({ ...start, people: 2 }, "people", 1).people).toBe(3);
  });

  test("each steps to even dollars, not below an even share of the bill", () => {
    const calc = withBill(1235, 2);

    expect(totalOf(stepField(calc, "each", 1))).toBe(1600);
    expect(totalOf(stepField(calc, "each", -1))).toBe(1400);

    const tight = setField(withBill(1390, 2), "total", 1400);

    expect(totalOf(stepField(tight, "each", -1))).toBe(1390);
  });
});

describe("derive", () => {
  test("tip, percent and each", () => {
    expect(derive(withBill(1235, 2))).toMatchObject({
      total: 1482,
      tip: 247,
      percent: 20,
      percentIsWhole: true,
      each: 741,
    });
  });

  test("each rounds up to the cent", () => {
    const calc = setField({ ...start, people: 3 }, "total", 1000);

    expect(derive(calc).each).toBe(334);
  });

  test("with no bill the percent is the chosen one", () => {
    expect(derive(setField(start, "percent", 18))).toMatchObject({
      percent: 18,
      percentIsWhole: true,
    });
  });

  test("a total typed with no bill leaves the chosen percent", () => {
    expect(derive(setField(start, "total", 500))).toMatchObject({
      tip: 500,
      percent: 20,
      percentIsWhole: true,
    });
  });

  test("a fixed amount shows the percent it works out to", () => {
    expect(derive(offGrid).percentIsWhole).toBe(false);
    expect(derive(setField(withBill(1000), "total", 1200)).percentIsWhole).toBe(
      true,
    );
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

const replace = (field: Field): Entry => ({ field, mode: "replace" });

const append = (field: Field, digits: number): Entry => ({
  field,
  mode: "append",
  digits,
});

describe("pressKey", () => {
  test("the first key replaces the value", () => {
    expect(
      pressKey({ calc: withBill(4763), entry: replace("bill") }, 5),
    ).toEqual({ calc: withBill(5), entry: append("bill", 5) });
  });

  test("later keys append a digit", () => {
    expect(
      pressKey({ calc: withBill(47), entry: append("bill", 47) }, 6).calc.bill,
    ).toBe(476);
  });

  test("back drops the last digit", () => {
    const typing = { calc: withBill(4763), entry: append("bill", 4763) };
    const selected = { calc: withBill(4763), entry: replace("bill") };

    expect(pressKey(typing, "back").calc.bill).toBe(476);
    expect(pressKey(selected, "back").calc.bill).toBe(476);
  });

  test("a total below the bill is kept as typed digits only", () => {
    const first = pressKey(
      { calc: withBill(1235), entry: replace("total") },
      1,
    );

    expect(totalOf(first.calc)).toBe(1235);
    expect(first.entry).toEqual(append("total", 1));

    const done = [6, 0, 0].reduce(pressKey, first);

    expect(totalOf(done.calc)).toBe(1600);
  });

  test("no sequence of keys makes the tip negative", () => {
    const keys = [1, "back", "back", 5, 9, 9, "back", 0] as const;

    for (const field of ["tip", "total", "each"] as const) {
      const state: CalcState = {
        calc: withBill(5000, 2),
        entry: replace(field),
      };

      keys.reduce((current, key) => {
        const next = pressKey(current, key);

        expect(derive(next.calc).tip).toBeGreaterThanOrEqual(0);

        return next;
      }, state);
    }
  });

  test("each types a share of the total", () => {
    const state = { calc: withBill(1235, 2), entry: append("each", 150) };

    expect(totalOf(pressKey(state, 0).calc)).toBe(3000);
  });

  test("percent types whole percents", () => {
    expect(
      pressKey({ calc: offGrid, entry: append("percent", 21) }, 0).calc.percent,
    ).toBe(210);
  });

  test("back before any digit starts from the rounded percent", () => {
    expect(
      pressKey({ calc: offGrid, entry: replace("percent") }, "back").calc
        .percent,
    ).toBe(2);
  });

  test("people stays at least one while a zero is typed", () => {
    const zero = pressKey({ calc: start, entry: replace("people") }, 0);

    expect(zero.calc.people).toBe(1);
    expect(pressKey(zero, 2).calc.people).toBe(2);
  });

  test("digits past a field's maximum are ignored", () => {
    const bill = {
      calc: withBill(maxEntry.bill),
      entry: append("bill", maxEntry.bill),
    };

    const percent = {
      calc: setField(start, "percent", 999),
      entry: append("percent", 999),
    };

    expect(pressKey(bill, 1)).toBe(bill);
    expect(pressKey(percent, 1)).toBe(percent);
  });

  test("back works on a value above the typing maximum", () => {
    const huge = setField(withBill(maxEntry.bill), "percent", 999);

    expect(totalOf(huge)).toBeGreaterThan(maxEntry.total);
    expect(
      pressKey({ calc: huge, entry: replace("total") }, "back").entry,
    ).toEqual(append("total", Math.floor(totalOf(huge) / 10)));
  });
});

describe("stepState", () => {
  test("steps the field and ends typing", () => {
    const typed = pressKey(
      { calc: withBill(1235), entry: replace("total") },
      1,
    );

    const stepped = stepState(typed, "total", 1);

    expect(totalOf(stepped.calc)).toBe(1300);
    expect(stepped.entry).toEqual(replace("total"));
  });
});

describe("fieldLabel", () => {
  test("shows typed digits in the selected field only", () => {
    const state = pressKey(
      { calc: withBill(1235), entry: replace("total") },
      1,
    );

    expect(fieldLabel(state, "total")).toBe("0.01");
    expect(fieldLabel(state, "tip")).toBe("0.00");
  });

  test("shows the value until a key is pressed", () => {
    const state = { calc: withBill(1235, 2), entry: replace("people") };

    expect(fieldLabel(state, "people")).toBe("2");
    expect(fieldLabel(pressKey(state, 0), "people")).toBe("0");
    expect(fieldLabel(state, "percent")).toBe("20%");
  });
});
