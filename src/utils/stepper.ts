import currency from 'currency.js';
import useStepper, {
  State as StepperState,
  Action as StepperAction,
} from 'use-stepper';
import getPreviousEvenDollar from './get-previous-even-dollar';
import getNextEvenDollar from './get-next-even-dollar';
import toCurrency from './to-currency';

export function formatCurrency(newValue: currency.Any): string {
  return currency(newValue).format();
}

export function createDollarReducer({
  min = -Number.MAX_VALUE,
  max = Number.MAX_VALUE,
}: { min?: number; max?: number } = {}): typeof useStepper.defaultReducer {
  function validValueClosestTo(desiredFloat: number): string {
    return formatCurrency(Math.min(max, Math.max(desiredFloat, min)));
  }

  function dollarReducer(
    dollarReducerState: StepperState,
    action: StepperAction,
  ): StepperState {
    const currentNumericValue = parseFloat(dollarReducerState.value);
    const currentCurrencyValue = currency(currentNumericValue);
    switch (action.type) {
      case useStepper.actionTypes.increment: {
        const newValue = validValueClosestTo(
          getNextEvenDollar(currentCurrencyValue),
        );
        return { value: newValue };
      }
      case useStepper.actionTypes.decrement: {
        const previousEvenDollar = getPreviousEvenDollar(currentCurrencyValue);
        const newValue = validValueClosestTo(previousEvenDollar);
        return { value: newValue };
      }
      case useStepper.actionTypes.coerce: {
        return dollarReducerState;
      }
      case useStepper.actionTypes.setValue: {
        if (action.payload !== undefined) {
          const newValue = toCurrency(action.payload);
          return { value: newValue };
        }
        return dollarReducerState;
      }
      default:
        return useStepper.defaultReducer(dollarReducerState, action);
    }
  }

  return dollarReducer;
}

export function createIntReducer({
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
}: { min?: number; max?: number } = {}): typeof useStepper.defaultReducer {
  function validValueClosestTo(desiredInt: number): string {
    return String(Math.min(max, Math.max(desiredInt, min)));
  }

  function intReducer(
    intReducerState: StepperState,
    action: StepperAction,
  ): StepperState {
    const integerValue = parseInt(intReducerState.value, 10);
    switch (action.type) {
      case useStepper.actionTypes.increment: {
        const newValue = validValueClosestTo(integerValue + 1);
        return { value: newValue };
      }
      case useStepper.actionTypes.decrement: {
        const newValue = validValueClosestTo(integerValue - 1);
        return { value: newValue };
      }
      case useStepper.actionTypes.coerce: {
        return intReducerState;
      }
      case useStepper.actionTypes.setValue: {
        if (action.payload !== undefined) {
          const desiredInt = parseInt(action.payload || '0', 10);
          if (!Number.isNaN(desiredInt)) {
            const newValue = validValueClosestTo(desiredInt);
            return { value: newValue };
          }
        }
        return intReducerState;
      }
      default:
        return useStepper.defaultReducer(intReducerState, action);
    }
  }

  return intReducer;
}
