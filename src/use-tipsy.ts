import * as React from "react";
import {
  cleared,
  derive,
  pressKey,
  setField,
  stepState,
  type CalcState,
  type Defaults,
  type Entry,
  type Field,
  type Key,
} from "./calc";
import { useDefaults } from "./settings";

const billEntry: Entry = { field: "bill", mode: "replace" };

export function useTipsy() {
  const { defaults, setDefault } = useDefaults();

  const [state, setState] = React.useState<CalcState>(() => ({
    calc: cleared(defaults),
    entry: billEntry,
  }));

  return {
    state,
    calc: state.calc,
    d: derive(state.calc),
    entry: state.entry,
    defaults,
    select: (field: Field) => {
      setState((current) => ({
        ...current,
        entry: { field, mode: "replace" },
      }));
    },
    step: (field: Field, direction: 1 | -1) => {
      setState((current) => stepState(current, field, direction));
    },
    press: (key: Key) => {
      setState((current) => pressKey(current, key));
    },
    clear: () => {
      setState({ calc: cleared(defaults), entry: billEntry });
    },
    /** Saves a default. With no bill yet, it also applies right away. */
    stepDefault: (field: keyof Defaults, direction: 1 | -1) => {
      const value = Math.max(
        field === "people" ? 1 : 0,
        defaults[field] + direction,
      );

      setDefault(field, value);
      setState((current) =>
        current.calc.bill === 0
          ? {
              calc: setField(current.calc, field, value),
              entry: { field: current.entry.field, mode: "replace" },
            }
          : current,
      );
    },
  };
}

export type Tipsy = ReturnType<typeof useTipsy>;
