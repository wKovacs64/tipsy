import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import get from 'lodash/get';
import currency from 'currency.js';
import useStepper from 'use-stepper';
import { rhythm, scale } from '../utils/typography';
import { createDollarReducer, createIntReducer } from '../utils/stepper';
import toCurrency from '../utils/to-currency';
import Layout from '../components/layout';
import NumericInput from '../components/numeric-input';
import DecrementButton from '../components/decrement-button';
import IncrementButton from '../components/increment-button';
import Content from '../styles/content';
import BrandButton from '../styles/brand-button';
import { useDefaultPartySize, useDefaultTipPercent } from '../utils/state';
import {
  appDefaultPartySize,
  appDefaultTipPercent,
} from '../utils/app-defaults';

const CalcGrid = styled.section`
  width: 100%;
  font-size: ${scale(0.25).fontSize};
  line-height: ${scale(0.25).lineHeight};
  display: grid;
  grid-row-gap: ${rhythm(2)};
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'tip-percent-label tip-percent-input'
    'tip-amount-label tip-amount-input'
    'total-amount-label total-amount-input'
    'number-of-people-label number-of-people-input'
    'each-person-pays-label each-person-pays-input';
  margin-bottom: ${rhythm(2)};
`;

const CalcInput = styled(NumericInput)`
  margin-left: ${rhythm(0.25)};
  margin-right: ${rhythm(0.25)};
  font-size: ${scale(0.25).fontSize};
  line-height: ${scale(0.25).lineHeight};
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
`;

const HeroCell = styled(Cell)`
  border-style: solid;
  border-left: 0;
  border-right: 0;
  border-top-width: ${rhythm(0.05)};
  border-bottom-width: ${rhythm(0.05)};
  font-weight: 600;
  padding: ${rhythm(1.5)} 0;
`;

enum ActionType {
  CHANGE_TIP_PERCENT,
  CHANGE_TIP_AMOUNT,
  CHANGE_TOTAL_AMOUNT,
  CHANGE_NUMBER_OF_PEOPLE,
  CHANGE_EACH_PERSON_PAYS,
}

interface ChangeTipPercent {
  type: ActionType.CHANGE_TIP_PERCENT;
  payload: string;
}

interface ChangeTipAmount {
  type: ActionType.CHANGE_TIP_AMOUNT;
  payload: string;
}

interface ChangeTotalAmount {
  type: ActionType.CHANGE_TOTAL_AMOUNT;
  payload: string;
}

interface ChangeNumberOfPeople {
  type: ActionType.CHANGE_NUMBER_OF_PEOPLE;
  payload: string;
}

interface ChangeEachPersonPays {
  type: ActionType.CHANGE_EACH_PERSON_PAYS;
  payload: string;
}

type Action =
  | ChangeTipPercent
  | ChangeTipAmount
  | ChangeTotalAmount
  | ChangeNumberOfPeople
  | ChangeEachPersonPays;

interface State {
  tipPercent: string;
  tipAmount: string;
  totalAmount: string;
  numberOfPeople: string;
  eachPersonPays: string;
}

const CalcPage: React.FunctionComponent<
  import('reach__router').RouteComponentProps
> = ({ location, navigate }) => {
  const [initialPartySizeFromStorage] = useDefaultPartySize(
    appDefaultPartySize,
  );
  const [initialTipPercentFromStorage] = useDefaultTipPercent(
    appDefaultTipPercent,
  );

  // HACK: null check to prevent Cypress tests from crashing because for some
  // reason the values returned from these persisted state hooks are null
  // occasionally (only in Cypress)
  const initialPartySize =
    initialPartySizeFromStorage !== null
      ? initialPartySizeFromStorage
      : appDefaultPartySize;
  const initialTipPercent =
    initialTipPercentFromStorage !== null
      ? initialTipPercentFromStorage
      : appDefaultTipPercent;

  const billAmount = get(location, 'state.bill', 0);
  const initialTipAmount = currency(billAmount)
    .multiply(initialTipPercent)
    .divide(100).value;
  const initialTotalAmount = currency(billAmount).add(initialTipAmount).value;
  const initialEachPersonPays = currency(initialTotalAmount).distribute(
    initialPartySize,
  )[0].value;

  const initialState: State = {
    tipPercent: String(initialTipPercent),
    tipAmount: toCurrency(String(initialTipAmount)),
    totalAmount: toCurrency(String(initialTotalAmount)),
    numberOfPeople: String(initialPartySize),
    eachPersonPays: toCurrency(String(initialEachPersonPays)),
  };

  const reducer = (state: State, action: Action): State => {
    // console.log(`ACTION (${action.type}): ${action.payload}`);
    // console.log('INCOMING STATE:');
    // console.table(state);

    switch (action.type) {
      case ActionType.CHANGE_TIP_PERCENT: {
        const tipAmount = currency(action.payload)
          .divide(100)
          .multiply(billAmount).value;
        const totalAmount = currency(billAmount).add(tipAmount).value;
        const eachPersonPays = currency(totalAmount).distribute(
          parseInt(state.numberOfPeople, 10),
        )[0].value;

        return {
          tipPercent: action.payload,
          tipAmount: toCurrency(String(tipAmount)),
          totalAmount: toCurrency(String(totalAmount)),
          numberOfPeople: state.numberOfPeople,
          eachPersonPays: toCurrency(String(eachPersonPays)),
        };
      }

      case ActionType.CHANGE_TIP_AMOUNT: {
        const tipPercent = currency(action.payload)
          .divide(billAmount)
          .multiply(100).value;
        const totalAmount = currency(billAmount).add(action.payload).value;
        const eachPersonPays = currency(totalAmount).distribute(
          parseInt(state.numberOfPeople, 10),
        )[0].value;

        return {
          tipPercent: String(tipPercent),
          tipAmount: action.payload,
          totalAmount: toCurrency(String(totalAmount)),
          numberOfPeople: state.numberOfPeople,
          eachPersonPays: toCurrency(String(eachPersonPays)),
        };
      }

      case ActionType.CHANGE_TOTAL_AMOUNT: {
        const tipAmount = currency(action.payload).subtract(billAmount).value;
        const tipPercent = currency(tipAmount)
          .divide(billAmount)
          .multiply(100).value;
        const eachPersonPays = toCurrency(
          currency(action.payload)
            .distribute(parseInt(state.numberOfPeople, 10))[0]
            .toString(),
        );

        return {
          tipPercent: String(tipPercent),
          tipAmount: toCurrency(String(tipAmount)),
          totalAmount: action.payload,
          numberOfPeople: state.numberOfPeople,
          eachPersonPays: toCurrency(String(eachPersonPays)),
        };
      }

      case ActionType.CHANGE_NUMBER_OF_PEOPLE: {
        const eachPersonPays = currency(state.totalAmount).distribute(
          parseInt(action.payload, 10),
        )[0].value;

        return {
          ...state,
          numberOfPeople: action.payload,
          eachPersonPays: toCurrency(String(eachPersonPays)),
        };
      }

      case ActionType.CHANGE_EACH_PERSON_PAYS: {
        const totalAmount = currency(action.payload).multiply(
          state.numberOfPeople,
        ).value;
        const tipAmount = currency(totalAmount).subtract(billAmount).value;
        const tipPercent = currency(tipAmount)
          .divide(billAmount)
          .multiply(100).value;

        return {
          tipPercent: String(tipPercent),
          tipAmount: toCurrency(String(tipAmount)),
          totalAmount: toCurrency(String(totalAmount)),
          numberOfPeople: state.numberOfPeople,
          eachPersonPays: action.payload,
        };
      }
      default:
        throw new Error('Unrecognized state reducer action type!');
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  // NEW REDUCERS

  const tipPercentStepper = useStepper({
    defaultValue: initialTipPercent,
    stateReducer: createIntReducer({ min: 0 }),
  });

  const tipAmountStepper = useStepper({
    defaultValue: initialTipAmount,
    stateReducer: createDollarReducer({ min: 0 }),
  });

  const totalAmountStepper = useStepper({
    defaultValue: initialTotalAmount,
    stateReducer: createDollarReducer({ min: billAmount }),
  });

  const numberOfPeopleStepper = useStepper({
    defaultValue: initialPartySize,
    stateReducer: createIntReducer({ min: 1 }),
  });

  const eachPersonPaysStepper = useStepper({
    defaultValue: initialEachPersonPays,
    stateReducer: createDollarReducer({
      min: billAmount / initialPartySize,
    }),
  });

  /*

  // DISPATCHER EFFECTS

  // tipPercent changed
  React.useEffect(() => {
    console.log(`tipPercent changed (${tipPercentStepper.value})`);
    dispatch({
      type: ActionType.CHANGE_TIP_PERCENT,
      payload: tipPercentStepper.value,
      // payload: parseInt(tipPercentStepper.value, 10),
    });
  }, [tipPercentStepper.value]);

  // tipAmount changed
  React.useEffect(() => {
    console.log(`tipAmount changed (${tipAmountStepper.value})`);
    dispatch({
      type: ActionType.CHANGE_TIP_AMOUNT,
      payload: tipAmountStepper.value,
      // payload: parseFloat(tipAmountStepper.value),
    });
  }, [tipAmountStepper.value]);

  // totalAmount changed
  React.useEffect(() => {
    console.log(`totalAmount changed (${totalAmountStepper.value})`);
    dispatch({
      type: ActionType.CHANGE_TOTAL_AMOUNT,
      payload: totalAmountStepper.value,
      // payload: parseFloat(totalAmountStepper.value),
    });
  }, [totalAmountStepper.value]);

  // numberOfPeople changed
  React.useEffect(() => {
    console.log(`numberOfPeople changed (${numberOfPeopleStepper.value})`);
    dispatch({
      type: ActionType.CHANGE_NUMBER_OF_PEOPLE,
      payload: numberOfPeopleStepper.value,
      // payload: parseInt(numberOfPeopleStepper.value, 10),
    });
  }, [numberOfPeopleStepper.value]);

  // eachPersonPays changed
  React.useEffect(() => {
    console.log(`eachPersonPays changed (${eachPersonPaysStepper.value})`);
    dispatch({
      type: ActionType.CHANGE_EACH_PERSON_PAYS,
      payload: eachPersonPaysStepper.value,
      // payload: parseFloat(eachPersonPaysStepper.value),
    });
  }, [eachPersonPaysStepper.value]);

  // MAIN STATE EFFECT

  React.useEffect(() => {
    const {
      tipPercent,
      tipAmount,
      totalAmount,
      numberOfPeople,
      eachPersonPays,
    } = state;

    console.log('STATE CHANGED');
    console.table({
      tipPercent,
      tipAmount,
      totalAmount,
      numberOfPeople,
      eachPersonPays,
    });

    tipPercentStepper.setValue(String(tipPercent));
    console.log(`SETTING TIP AMOUNT: ${tipAmount}`);
    tipAmountStepper.setValue(String(tipAmount));
    console.log(`SETTING TOTAL AMOUNT: ${totalAmount}`);
    totalAmountStepper.setValue(String(totalAmount));
    numberOfPeopleStepper.setValue(String(numberOfPeople));
    console.log(`SETTING EPP: ${eachPersonPays}`);
    eachPersonPaysStepper.setValue(String(eachPersonPays));
  }, [JSON.stringify(state)]);

  */
  /*

  // TAKE 2 (memoize reducer creation)

  // const tipPercentReducer = React.useMemo(
  //   () => createIntReducer({ min: 0 }),
  //   [],
  // );
  // const tipAmountReducer = React.useMemo(
  //   () => createDollarReducer({ min: 0 }),
  //   [],
  // );
  // const totalAmountReducer = React.useMemo(
  //   () => createDollarReducer({ min: billAmount }),
  //   [billAmount],
  // );
  // const numberOfPeopleReducer = React.useMemo(
  //   () => createIntReducer({ min: 1 }),
  //   [],
  // );
  // const eachPersonPaysReducer = React.useMemo(
  //   () =>
  //     createDollarReducer({
  //       min: billAmount / initialPartySize,
  //     }),
  //   [billAmount, initialPartySize],
  // );

  // const tipPercentStepper = useStepper({
  //   defaultValue: initialTipPercent,
  //   stateReducer: tipPercentReducer,
  // });

  // const tipAmountStepper = useStepper({
  //   defaultValue: initialTipAmount,
  //   stateReducer: tipAmountReducer,
  // });

  // const totalAmountStepper = useStepper({
  //   defaultValue: initialTotalAmount,
  //   stateReducer: totalAmountReducer,
  // });

  // const numberOfPeopleStepper = useStepper({
  //   defaultValue: initialPartySize,
  //   stateReducer: numberOfPeopleReducer,
  // });

  // const eachPersonPaysStepper = useStepper({
  //   defaultValue: initialEachPersonPays,
  //   stateReducer: eachPersonPaysReducer,
  // });

  // TAKE 3 (memoize stepper options object)

  // const tipPercentStepper = useStepper(
  //   React.useMemo(
  //     () => ({
  //       defaultValue: initialTipPercent,
  //       stateReducer: createIntReducer({ min: 0 }),
  //     }),
  //     [initialTipPercent],
  //   ),
  // );

  // const tipAmountStepper = useStepper(
  //   React.useMemo(
  //     () => ({
  //       defaultValue: initialTipAmount,
  //       stateReducer: createDollarReducer({ min: 0 }),
  //     }),
  //     [initialTipAmount],
  //   ),
  // );

  // const totalAmountStepper = useStepper(
  //   React.useMemo(
  //     () => ({
  //       defaultValue: initialTotalAmount,
  //       stateReducer: createDollarReducer({ min: billAmount }),
  //     }),
  //     [initialTotalAmount, billAmount],
  //   ),
  // );

  // const numberOfPeopleStepper = useStepper(
  //   React.useMemo(
  //     () => ({
  //       defaultValue: initialPartySize,
  //       stateReducer: createIntReducer({ min: 1 }),
  //     }),
  //     [initialPartySize],
  //   ),
  // );

  // const eachPersonPaysStepper = useStepper(
  //   React.useMemo(
  //     () => ({
  //       defaultValue: initialEachPersonPays,
  //       stateReducer: createDollarReducer({
  //         min: billAmount / initialPartySize,
  //       }),
  //     }),
  //     [initialEachPersonPays, billAmount, initialPartySize],
  //   ),
  // );

  */

  /*

  // BUGGY EFFECTS! 🤣

  // tipPercent changed
  React.useEffect(() => {
    console.log(`tipPercent changed (${tipPercentStepper.value})`);
    const tipAmount = currency(tipPercentStepper.value)
      .divide(100)
      .multiply(billAmount).value;
    console.log('TCL: tipAmount', tipAmount);
    const totalAmount = currency(billAmount).add(tipAmount).value;
    console.log('TCL: totalAmount', totalAmount);
    const eachPersonPays = currency(totalAmount).distribute(
      parseInt(numberOfPeopleStepper.value, 10),
    )[0].value;
    console.log('TCL: eachPersonPays', eachPersonPays);

    tipAmountStepper.setValue(String(tipAmount));
    totalAmountStepper.setValue(String(totalAmount));
    eachPersonPaysStepper.setValue(String(eachPersonPays));
  }, [
    tipPercentStepper.value,
    // tipPercentStepper,
    // billAmount,
    // numberOfPeopleStepper.value,
    // tipAmountStepper,
    // totalAmountStepper,
    // eachPersonPaysStepper,
  ]);

  // tipAmount changed
  React.useEffect(() => {
    console.log('tipAmount changed');
    const tipPercent = currency(tipAmountStepper.value)
      .divide(billAmount)
      .multiply(100).value;
    const totalAmount = currency(billAmount).add(tipAmountStepper.value).value;
    const eachPersonPays = currency(totalAmount).distribute(
      parseInt(eachPersonPaysStepper.value, 10),
    )[0].value;

    tipPercentStepper.setValue(String(tipPercent));
    totalAmountStepper.setValue(String(totalAmount));
    eachPersonPaysStepper.setValue(String(eachPersonPays));
  }, [
    tipAmountStepper.value,
    // billAmount,
    // tipPercentStepper,
    // totalAmountStepper,
    // eachPersonPaysStepper,
  ]);

  // totalAmount changed
  React.useEffect(() => {
    console.log(`totalAmount changed (${totalAmountStepper.value})`);
    const tipAmount = currency(totalAmountStepper.value).subtract(billAmount)
      .value;
    console.log('TCL: tipAmount', tipAmount);
    const tipPercent = currency(tipAmount)
      .divide(billAmount)
      .multiply(100).value;
    console.log('TCL: tipPercent', tipPercent);
    const eachPersonPays = currency(totalAmountStepper.value).distribute(
      parseInt(numberOfPeopleStepper.value, 10),
    )[0].value;
    console.log('TCL: eachPersonPays', eachPersonPays);

    tipPercentStepper.setValue(String(tipPercent));
    tipAmountStepper.setValue(String(tipAmount));
    eachPersonPaysStepper.setValue(String(eachPersonPays));
  }, [
    totalAmountStepper.value,
    // billAmount,
    // numberOfPeopleStepper.value,
    // tipPercentStepper,
    // tipAmountStepper,
    // eachPersonPaysStepper.value,
    // eachPersonPaysStepper,
  ]);

  // numberOfPeople changed
  React.useEffect(() => {
    console.log('numberOfPeople changed');
    const eachPersonPays = currency(totalAmountStepper.value).distribute(
      parseInt(numberOfPeopleStepper.value, 10),
    )[0].value;

    eachPersonPaysStepper.setValue(String(eachPersonPays));
  }, [
    // totalAmountStepper.value,
    numberOfPeopleStepper.value,
    // eachPersonPaysStepper,
  ]);

  // eachPersonPays changed
  React.useEffect(() => {
    console.log('eachPersonPays changed');
    const totalAmount = currency(eachPersonPaysStepper.value).multiply(
      parseInt(numberOfPeopleStepper.value, 10),
    ).value;
    const tipAmount = currency(totalAmount).subtract(billAmount).value;
    const tipPercent = currency(tipAmount)
      .divide(billAmount)
      .multiply(100).value;

    tipPercentStepper.setValue(String(tipPercent));
    tipAmountStepper.setValue(String(tipAmount));
    totalAmountStepper.setValue(String(totalAmount));
  }, [
    eachPersonPaysStepper.value,
    // numberOfPeopleStepper.value,
    // billAmount,
    // tipPercentStepper,
    // tipAmountStepper,
    // totalAmountStepper,
  ]);

  */

  function startOver() {
    if (navigate) {
      navigate('/', { replace: true });
    }
  }

  return (
    <Layout>
      <Content>
        <CalcGrid>
          <Cell
            css={css`
              grid-area: tip-percent-label;
            `}
          >
            <label htmlFor="tip-percent">Tip Percent (%)</label>
          </Cell>
          <Cell
            css={css`
              grid-area: tip-percent-input;
            `}
          >
            <DecrementButton
              aria-label="decrement tip percent"
              {...tipPercentStepper.getDecrementProps()}
            />
            <CalcInput
              id="tip-percent"
              name="tip-percent"
              {...tipPercentStepper.getInputProps()}
            />
            <IncrementButton
              aria-label="increment tip percent"
              {...tipPercentStepper.getIncrementProps()}
            />
          </Cell>
          <Cell
            css={css`
              grid-area: tip-amount-label;
            `}
          >
            <label htmlFor="tip-amount">Tip Amount</label>
          </Cell>
          <Cell
            css={css`
              grid-area: tip-amount-input;
            `}
          >
            <DecrementButton
              aria-label="decrement tip amount"
              {...tipAmountStepper.getDecrementProps()}
            />
            <CalcInput
              id="tip-amount"
              name="tip-amount"
              {...tipAmountStepper.getInputProps({
                onChange: () => {},
              })}
            />
            <IncrementButton
              aria-label="increment tip amount"
              {...tipAmountStepper.getIncrementProps()}
            />
          </Cell>
          <HeroCell
            css={css`
              grid-area: total-amount-label;
            `}
          >
            <label htmlFor="total-amount">Total Amount</label>
          </HeroCell>
          <HeroCell
            css={css`
              grid-area: total-amount-input;
            `}
          >
            <DecrementButton
              aria-label="decrement total amount"
              {...totalAmountStepper.getDecrementProps({
                onClick: () => {},
              })}
            />
            <CalcInput
              css={css`
                font-weight: 600;
              `}
              id="total-amount"
              name="total-amount"
              {...totalAmountStepper.getInputProps({
                onChange: e => {},
              })}
              // value={currency(state.totalAmount).format()}
            />
            <IncrementButton
              aria-label="increment total amount"
              {...totalAmountStepper.getIncrementProps({
                onClick: () => {},
              })}
            />
          </HeroCell>
          <Cell
            css={css`
              grid-area: number-of-people-label;
            `}
          >
            <label htmlFor="number-of-people">Number of People</label>
          </Cell>
          <Cell
            css={css`
              grid-area: number-of-people-input;
            `}
          >
            <DecrementButton
              aria-label="decrement number of people"
              {...numberOfPeopleStepper.getDecrementProps()}
            />
            <CalcInput
              id="number-of-people"
              name="number-of-people"
              {...numberOfPeopleStepper.getInputProps()}
            />
            <IncrementButton
              aria-label="increment number of people"
              {...numberOfPeopleStepper.getIncrementProps()}
            />
          </Cell>
          <Cell
            css={css`
              grid-area: each-person-pays-label;
            `}
          >
            <label htmlFor="each-person-pays">Each Person Pays</label>
          </Cell>
          <Cell
            css={css`
              grid-area: each-person-pays-input;
            `}
          >
            <DecrementButton
              aria-label="decrement each person pays"
              {...eachPersonPaysStepper.getDecrementProps()}
            />
            <CalcInput
              id="each-person-pays"
              name="each-person-pays"
              {...eachPersonPaysStepper.getInputProps()}
            />
            <IncrementButton
              aria-label="increment each person pays"
              {...eachPersonPaysStepper.getIncrementProps()}
            />
          </Cell>
        </CalcGrid>
        <BrandButton type="button" onClick={startOver}>
          Start Over
        </BrandButton>
      </Content>
    </Layout>
  );
};

export default CalcPage;
