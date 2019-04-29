import currency from 'currency.js';
import useStepper, {
  State as StepperState,
  Action as StepperAction,
} from 'use-stepper';
import getPreviousEvenDollar from './get-previous-even-dollar';
import getNextEvenDollar from './get-next-even-dollar';

export function formatCurrency(newValue: currency.Any): string {
  return currency(newValue).format();
}

export function createDollarReducer(
  { min }: { min: number } = { min: -Number.MAX_VALUE },
): typeof useStepper.defaultReducer {
  function validValueClosestTo(desiredFloat: number): string {
    return formatCurrency(
      Math.min(Number.MAX_VALUE, Math.max(desiredFloat, min)),
    );
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
        if (newValue !== dollarReducerState.value) {
          return { value: newValue };
        }
        return dollarReducerState;
      }
      case useStepper.actionTypes.decrement: {
        const previousEvenDollar = getPreviousEvenDollar(currentCurrencyValue);
        const newValue = validValueClosestTo(previousEvenDollar);
        if (newValue !== dollarReducerState.value) {
          return { value: newValue };
        }
        return dollarReducerState;
      }
      case useStepper.actionTypes.coerce: {
        return dollarReducerState;
      }
      case useStepper.actionTypes.setValue: {
        // console.log(`--- dollarStepper setValue: ${action.payload}`);
        if (
          action.payload !== undefined &&
          action.payload !== dollarReducerState.value
        ) {
          const newValue = formatCurrency(action.payload);
          // const newValue = toCurrency(action.payload);
          // console.log('TCL: newValue', newValue);
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

export function createIntReducer(
  { min }: { min: number } = { min: -Number.MAX_VALUE },
): typeof useStepper.defaultReducer {
  function validValueClosestTo(desiredInt: number): string {
    return String(Math.min(Number.MAX_SAFE_INTEGER, Math.max(desiredInt, min)));
  }

  function intReducer(
    intReducerState: StepperState,
    action: StepperAction,
  ): StepperState {
    const integerValue = parseInt(intReducerState.value, 10);
    switch (action.type) {
      case useStepper.actionTypes.increment: {
        const newValue = validValueClosestTo(integerValue + 1);
        if (newValue !== intReducerState.value) {
          return { value: newValue };
        }
        return intReducerState;
      }
      case useStepper.actionTypes.decrement: {
        const newValue = validValueClosestTo(integerValue - 1);
        if (newValue !== intReducerState.value) {
          return { value: newValue };
        }
        return intReducerState;
      }
      case useStepper.actionTypes.coerce: {
        return intReducerState;
      }
      case useStepper.actionTypes.setValue: {
        if (action.payload !== undefined) {
          const desiredInt = parseInt(action.payload || '0', 10);
          const newValue = String(desiredInt);
          if (!Number.isNaN(desiredInt)) {
            // const newValue = validValueClosestTo(desiredInt);
            if (newValue !== intReducerState.value) {
              return { value: newValue };
            }
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
