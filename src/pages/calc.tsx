import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import get from 'lodash/get';
import currency from 'currency.js';
import { rhythm, scale } from '../utils/typography';
import getPreviousEvenDollar from '../utils/get-previous-even-dollar';
import toCurrency from '../utils/to-currency';
import toNumber from '../utils/to-number';
import Layout from '../components/layout';
import CurrencyInput from '../components/currency-input';
import NumberInput from '../components/number-input';
import DecrementButton from '../components/decrement-button';
import IncrementButton from '../components/increment-button';
import LinkButton from '../styles/link-button';
import { useDefaultTipPercent, useDefaultPartySize } from '../utils/state';
import {
  initialDefaultTipPercent,
  initialDefaultPartySize,
} from '../utils/defaults';

const CalcGrid = styled.section`
  flex: 1;
  width: 100%;
  max-width: ${rhythm(20)};
  font-weight: 200;
  font-size: ${scale(0.4).fontSize};
  line-height: ${scale(0.4).lineHeight};
  display: grid;
  grid-row-gap: ${rhythm(2)};
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'tip-percent-label tip-percent-input'
    'tip-amount-label tip-amount-input'
    'total-amount-label total-amount-input'
    'number-of-people-label number-of-people-input'
    'each-person-pays-label each-person-pays-input'
    'done-button done-button';
`;

const CalcPageCurrencyInput = styled(CurrencyInput)`
  margin-left: ${rhythm(0.25)};
  margin-right: ${rhythm(0.25)};
`;

const CalcPageNumberInput = styled(NumberInput)`
  margin-left: ${rhythm(0.25)};
  margin-right: ${rhythm(0.25)};
`;

const HeroCell = styled.div`
  border-style: solid;
  border-left: 0;
  border-right: 0;
  border-top-width: ${rhythm(0.05)};
  border-bottom-width: ${rhythm(0.05)};
  font-weight: 400;
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
  payload: number;
}

interface ChangeTipAmount {
  type: ActionType.CHANGE_TIP_AMOUNT;
  payload: number;
}

interface ChangeTotalAmount {
  type: ActionType.CHANGE_TOTAL_AMOUNT;
  payload: number;
}

interface ChangeNumberOfPeople {
  type: ActionType.CHANGE_NUMBER_OF_PEOPLE;
  payload: number;
}

interface ChangeEachPersonPays {
  type: ActionType.CHANGE_EACH_PERSON_PAYS;
  payload: number;
}

type Action =
  | ChangeTipPercent
  | ChangeTipAmount
  | ChangeTotalAmount
  | ChangeNumberOfPeople
  | ChangeEachPersonPays;

interface State {
  tipPercent: number;
  tipAmount: number;
  totalAmount: number;
  numberOfPeople: number;
  eachPersonPays: number;
}

const CalcPage: React.FunctionComponent<
  import('reach__router').RouteComponentProps
> = ({ location }) => {
  const [defaultPartySize] = useDefaultPartySize(initialDefaultPartySize);
  const [defaultTipPercent] = useDefaultTipPercent(initialDefaultTipPercent);

  const billAmount = get(location, 'state.bill', 0);
  const initialTipAmount = currency(billAmount)
    .multiply(defaultTipPercent)
    .divide(100).value;
  const initialTotalAmount = currency(billAmount).add(initialTipAmount).value;
  const initialEachPersonPays = currency(initialTotalAmount).distribute(
    defaultPartySize,
  )[0].value;

  const initialState: State = {
    tipPercent: defaultTipPercent,
    tipAmount: initialTipAmount,
    totalAmount: initialTotalAmount,
    numberOfPeople: defaultPartySize,
    eachPersonPays: initialEachPersonPays,
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case ActionType.CHANGE_TIP_PERCENT: {
        const tipAmount = currency(action.payload)
          .divide(100)
          .multiply(billAmount).value;
        const totalAmount = currency(billAmount).add(tipAmount).value;
        const eachPersonPays = currency(totalAmount).distribute(
          state.numberOfPeople,
        )[0].value;

        return {
          tipPercent: action.payload,
          tipAmount,
          totalAmount,
          numberOfPeople: state.numberOfPeople,
          eachPersonPays,
        };
      }

      case ActionType.CHANGE_TIP_AMOUNT: {
        const tipPercent = currency(action.payload)
          .divide(billAmount)
          .multiply(100).value;
        const totalAmount = currency(billAmount).add(action.payload).value;
        const eachPersonPays = currency(totalAmount).distribute(
          state.numberOfPeople,
        )[0].value;

        return {
          tipPercent,
          tipAmount: action.payload,
          totalAmount,
          numberOfPeople: state.numberOfPeople,
          eachPersonPays,
        };
      }

      case ActionType.CHANGE_TOTAL_AMOUNT: {
        const tipAmount = currency(action.payload).subtract(billAmount).value;
        const tipPercent = currency(tipAmount)
          .divide(billAmount)
          .multiply(100).value;
        const eachPersonPays = currency(action.payload).distribute(
          state.numberOfPeople,
        )[0].value;

        return {
          tipPercent,
          tipAmount,
          totalAmount: action.payload,
          numberOfPeople: state.numberOfPeople,
          eachPersonPays,
        };
      }

      case ActionType.CHANGE_NUMBER_OF_PEOPLE: {
        const eachPersonPays = currency(state.totalAmount).distribute(
          action.payload,
        )[0].value;

        return {
          ...state,
          numberOfPeople: action.payload,
          eachPersonPays,
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
          tipPercent,
          tipAmount,
          totalAmount,
          numberOfPeople: state.numberOfPeople,
          eachPersonPays: action.payload,
        };
      }
      default:
        throw new Error('Unrecognized state reducer action type!');
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Layout>
      <CalcGrid>
        <div
          css={css`
            grid-area: tip-percent-label;
          `}
        >
          Tip Percent (%)
        </div>
        <div
          css={css`
            grid-area: tip-percent-input;
          `}
        >
          <DecrementButton
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TIP_PERCENT,
                payload: state.tipPercent < 1 ? 0 : state.tipPercent - 1,
              });
            }}
          />
          <CalcPageNumberInput
            value={state.tipPercent}
            onChange={e => {
              dispatch({
                type: ActionType.CHANGE_TIP_PERCENT,
                payload: toNumber(e.target.value),
              });
            }}
          />
          <IncrementButton
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TIP_PERCENT,
                payload: state.tipPercent + 1,
              });
            }}
          />
        </div>
        <div
          css={css`
            grid-area: tip-amount-label;
          `}
        >
          Tip Amount
        </div>
        <div
          css={css`
            grid-area: tip-amount-input;
          `}
        >
          <DecrementButton
            onClick={() => {
              const current = currency(state.tipAmount, { increment: 1 });
              const previousEvenDollar = getPreviousEvenDollar(current);
              dispatch({
                type: ActionType.CHANGE_TIP_AMOUNT,
                payload: current.value < 1 ? 0 : previousEvenDollar,
              });
            }}
          />
          <CalcPageCurrencyInput
            value={currency(state.tipAmount).format()}
            onChange={e => {
              dispatch({
                type: ActionType.CHANGE_TIP_AMOUNT,
                payload: toNumber(toCurrency(e.target.value)),
              });
            }}
          />
          <IncrementButton
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TIP_AMOUNT,
                payload: currency(state.tipAmount, { increment: 1 })
                  .add(1)
                  .dollars(),
              });
            }}
          />
        </div>
        <HeroCell
          css={css`
            grid-area: total-amount-label;
          `}
        >
          Total Amount
        </HeroCell>
        <HeroCell
          css={css`
            grid-area: total-amount-input;
          `}
        >
          <DecrementButton
            onClick={() => {
              const current = currency(state.totalAmount, { increment: 1 });
              const previousEvenDollar = getPreviousEvenDollar(current);
              dispatch({
                type: ActionType.CHANGE_TOTAL_AMOUNT,
                payload:
                  previousEvenDollar < billAmount
                    ? billAmount
                    : previousEvenDollar,
              });
            }}
          />
          <CalcPageCurrencyInput
            value={currency(state.totalAmount).format()}
            onChange={e => {
              dispatch({
                type: ActionType.CHANGE_TOTAL_AMOUNT,
                // TODO: deal with manually setting below billAmount
                payload: toNumber(toCurrency(e.target.value)),
              });
            }}
          />
          <IncrementButton
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TOTAL_AMOUNT,
                payload: currency(state.totalAmount, { increment: 1 })
                  .add(1)
                  .dollars(),
              });
            }}
          />
        </HeroCell>
        <div
          css={css`
            grid-area: number-of-people-label;
          `}
        >
          Number of People
        </div>
        <div
          css={css`
            grid-area: number-of-people-input;
          `}
        >
          <DecrementButton
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_NUMBER_OF_PEOPLE,
                payload:
                  state.numberOfPeople < 2 ? 1 : state.numberOfPeople - 1,
              });
            }}
          />
          <CalcPageNumberInput
            value={state.numberOfPeople}
            onChange={e => {
              dispatch({
                type: ActionType.CHANGE_NUMBER_OF_PEOPLE,
                // TODO: deal with manually setting to 0
                payload: toNumber(e.target.value),
              });
            }}
          />
          <IncrementButton
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_NUMBER_OF_PEOPLE,
                payload: state.numberOfPeople + 1,
              });
            }}
          />
        </div>
        <div
          css={css`
            grid-area: each-person-pays-label;
          `}
        >
          Each Person Pays
        </div>
        <div
          css={css`
            grid-area: each-person-pays-input;
          `}
        >
          <DecrementButton
            onClick={() => {
              const current = currency(state.eachPersonPays, { increment: 1 });
              const previousEvenDollar = getPreviousEvenDollar(current);
              const minPerPerson = currency(billAmount).distribute(
                state.numberOfPeople,
              )[0].value;
              dispatch({
                type: ActionType.CHANGE_EACH_PERSON_PAYS,
                payload:
                  previousEvenDollar < minPerPerson
                    ? minPerPerson
                    : previousEvenDollar,
              });
            }}
          />
          <CalcPageCurrencyInput
            value={currency(state.eachPersonPays).format()}
            onChange={e => {
              dispatch({
                type: ActionType.CHANGE_EACH_PERSON_PAYS,
                // TODO: deal with manually setting below minPerPerson
                payload: toNumber(toCurrency(e.target.value)),
              });
            }}
          />
          <IncrementButton
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_EACH_PERSON_PAYS,
                payload: currency(state.eachPersonPays, { increment: 1 })
                  .add(1)
                  .dollars(),
              });
            }}
          />
        </div>
        <LinkButton
          to="/"
          replace
          css={css`
            grid-area: done-button;
          `}
        >
          Done
        </LinkButton>
      </CalcGrid>
    </Layout>
  );
};

export default CalcPage;
