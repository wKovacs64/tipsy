import * as React from 'react';
import currency from 'currency.js';
import { getPreviousEvenDollar } from './utils';

type State = {
  totalAmount: number;
  numberOfPeople: number;
};

// Derive display values from state
function deriveValues(billAmount: number, state: State) {
  const { totalAmount, numberOfPeople } = state;

  if (billAmount <= 0 || numberOfPeople <= 0) {
    return { tipPercent: 0, tipAmount: 0, totalAmount, eachPersonPays: 0 };
  }

  const tipAmount = currency(totalAmount).subtract(billAmount).value;
  const tipPercent = currency(tipAmount).divide(billAmount).multiply(100).value;
  const eachPersonPays = currency(totalAmount).distribute(numberOfPeople)[0].value;

  return { tipPercent, tipAmount, totalAmount, eachPersonPays };
}

// Compute totalAmount from various inputs
function totalFromTipPercent(billAmount: number, percent: number) {
  const tipAmount = currency(billAmount).multiply(percent).divide(100).value;
  return currency(billAmount).add(tipAmount).value;
}

function totalFromTipAmount(billAmount: number, tipAmount: number) {
  return currency(billAmount).add(tipAmount).value;
}

function totalFromEachPersonPays(perPerson: number, numberOfPeople: number) {
  return currency(perPerson).multiply(numberOfPeople).value;
}

export function useTipCalculator(
  billAmount: number,
  initialTipPercent: number,
  initialPartySize: number,
) {
  const [state, setState] = React.useState<State>({
    totalAmount: totalFromTipPercent(billAmount, initialTipPercent),
    numberOfPeople: initialPartySize,
  });

  const derived = deriveValues(billAmount, state);

  return {
    // Values
    tipPercent: derived.tipPercent,
    tipAmount: derived.tipAmount,
    totalAmount: derived.totalAmount,
    eachPersonPays: derived.eachPersonPays,
    numberOfPeople: state.numberOfPeople,

    // Tip Percent actions
    changeTipPercent: (percent: number) => {
      setState((currentState) => ({
        ...currentState,
        totalAmount: totalFromTipPercent(billAmount, percent),
      }));
    },
    incrementTipPercent: () => {
      setState((currentState) => {
        const { tipPercent: currentTipPercent } = deriveValues(billAmount, currentState);
        return {
          ...currentState,
          totalAmount: totalFromTipPercent(billAmount, currentTipPercent + 1),
        };
      });
    },
    decrementTipPercent: () => {
      setState((currentState) => {
        const { tipPercent: currentTipPercent } = deriveValues(billAmount, currentState);
        const newPercent = currentTipPercent < 1 ? 0 : currentTipPercent - 1;
        return {
          ...currentState,
          totalAmount: totalFromTipPercent(billAmount, newPercent),
        };
      });
    },

    // Tip Amount actions
    changeTipAmount: (amount: number) => {
      setState((currentState) => ({
        ...currentState,
        totalAmount: totalFromTipAmount(billAmount, amount),
      }));
    },
    incrementTipAmount: () => {
      setState((currentState) => {
        const { tipAmount: currentTipAmount } = deriveValues(billAmount, currentState);
        const newTipAmount = currency(currentTipAmount, { increment: 1 }).add(1).dollars();
        return {
          ...currentState,
          totalAmount: totalFromTipAmount(billAmount, newTipAmount),
        };
      });
    },
    decrementTipAmount: () => {
      setState((currentState) => {
        const { tipAmount: currentTipAmount } = deriveValues(billAmount, currentState);
        const newTipAmount = currency(currentTipAmount, { increment: 1 });
        const previousEvenDollar = getPreviousEvenDollar(newTipAmount);
        const finalTipAmount = newTipAmount.value < 1 ? 0 : previousEvenDollar;
        return {
          ...currentState,
          totalAmount: totalFromTipAmount(billAmount, finalTipAmount),
        };
      });
    },

    // Total Amount actions
    changeTotalAmount: (amount: number) => {
      setState((currentState) => ({
        ...currentState,
        totalAmount: amount,
      }));
    },
    incrementTotalAmount: () => {
      setState((currentState) => ({
        ...currentState,
        totalAmount: currency(currentState.totalAmount, { increment: 1 }).add(1).dollars(),
      }));
    },
    decrementTotalAmount: () => {
      setState((currentState) => {
        const newTotalAmount = currency(currentState.totalAmount, { increment: 1 });
        const previousEvenDollar = getPreviousEvenDollar(newTotalAmount);
        const finalTotalAmount = previousEvenDollar < billAmount ? billAmount : previousEvenDollar;
        return { ...currentState, totalAmount: finalTotalAmount };
      });
    },

    // Number of People actions
    changeNumberOfPeople: (count: number) => {
      setState((currentState) => ({
        ...currentState,
        numberOfPeople: count,
      }));
    },
    incrementNumberOfPeople: () => {
      setState((currentState) => ({
        ...currentState,
        numberOfPeople: currentState.numberOfPeople + 1,
      }));
    },
    decrementNumberOfPeople: () => {
      setState((currentState) =>
        currentState.numberOfPeople < 2
          ? currentState
          : { ...currentState, numberOfPeople: currentState.numberOfPeople - 1 },
      );
    },

    // Each Person Pays actions
    changeEachPersonPays: (amount: number) => {
      setState((currentState) => ({
        ...currentState,
        totalAmount: totalFromEachPersonPays(amount, currentState.numberOfPeople),
      }));
    },
    incrementEachPersonPays: () => {
      setState((currentState) => {
        const { eachPersonPays: currentEachPersonPays } = deriveValues(billAmount, currentState);
        const newPerPerson = currency(currentEachPersonPays, { increment: 1 }).add(1).dollars();
        return {
          ...currentState,
          totalAmount: totalFromEachPersonPays(newPerPerson, currentState.numberOfPeople),
        };
      });
    },
    decrementEachPersonPays: () => {
      setState((currentState) => {
        const { eachPersonPays: currentEachPersonPays } = deriveValues(billAmount, currentState);
        const newEachPersonPays = currency(currentEachPersonPays, { increment: 1 });
        const previousEvenDollar = getPreviousEvenDollar(newEachPersonPays);
        const minPerPerson = currency(billAmount).distribute(currentState.numberOfPeople)[0].value;
        const finalEachPersonPays =
          previousEvenDollar < minPerPerson ? minPerPerson : previousEvenDollar;
        return {
          ...currentState,
          totalAmount: totalFromEachPersonPays(finalEachPersonPays, currentState.numberOfPeople),
        };
      });
    },
  };
}
