import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import get from 'lodash/get';
import currency from 'currency.js';
import useStepper from 'use-stepper';
import { rhythm, scale } from '../utils/typography';
import { createDollarReducer, createIntReducer } from '../utils/stepper';
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

const CalcPage: React.FunctionComponent<
  import('reach__router').RouteComponentProps
> = ({ location, navigate }) => {
  const tipPercentUpdated = React.useRef(false);
  const tipAmountUpdated = React.useRef(false);
  const totalAmountUpdated = React.useRef(false);
  const numberOfPeopleUpdated = React.useRef(false);
  const eachPersonPaysUpdated = React.useRef(false);

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
    .divide(100);
  const initialTotalAmount = currency(billAmount).add(initialTipAmount);
  const initialEachPersonPays = currency(initialTotalAmount).distribute(
    initialPartySize,
  )[0];

  const tipPercentStepper = useStepper({
    defaultValue: initialTipPercent,
    stateReducer: createIntReducer({ min: 0 }),
  });

  const tipAmountStepper = useStepper({
    defaultValue: initialTipAmount.value,
    stateReducer: createDollarReducer({ min: 0 }),
  });

  const numberOfPeopleStepper = useStepper({
    defaultValue: initialPartySize,
    stateReducer: createIntReducer({ min: 1 }),
  });

  const totalAmountStepper = useStepper({
    defaultValue: initialTotalAmount.value,
    stateReducer: createDollarReducer({
      min: billAmount / parseInt(numberOfPeopleStepper.value, 10),
    }),
  });

  const eachPersonPaysStepper = useStepper({
    defaultValue: initialEachPersonPays.value,
    stateReducer: createDollarReducer({
      min: billAmount / parseInt(numberOfPeopleStepper.value, 10),
    }),
  });

  function startOver() {
    if (navigate) {
      navigate('/', { replace: true });
    }
  }

  // tipPercent updated
  React.useLayoutEffect(() => {
    if (tipPercentUpdated.current) {
      const tipAmount = currency(tipPercentStepper.value)
        .divide(100)
        .multiply(billAmount);
      const totalAmount = currency(billAmount).add(tipAmount);
      const eachPersonPays = currency(totalAmount).distribute(
        parseInt(numberOfPeopleStepper.value, 10),
      )[0];

      tipAmountStepper.setValue(String(tipAmount.intValue));
      totalAmountStepper.setValue(String(totalAmount.intValue));
      eachPersonPaysStepper.setValue(String(eachPersonPays.intValue));

      tipPercentUpdated.current = false;
    }
  }, [
    tipPercentStepper.value,
    billAmount,
    eachPersonPaysStepper,
    numberOfPeopleStepper.value,
    tipAmountStepper,
    totalAmountStepper,
  ]);

  // tipAmount updated
  React.useLayoutEffect(() => {
    if (tipAmountUpdated.current) {
      const tipPercent = currency(tipAmountStepper.value)
        .divide(billAmount)
        .multiply(100);
      const totalAmount = currency(billAmount).add(tipAmountStepper.value);
      const eachPersonPays = currency(totalAmount).distribute(
        parseInt(numberOfPeopleStepper.value, 10),
      )[0];

      tipPercentStepper.setValue(String(tipPercent.value));
      totalAmountStepper.setValue(String(totalAmount.intValue));
      eachPersonPaysStepper.setValue(String(eachPersonPays.intValue));

      tipAmountUpdated.current = false;
    }
  }, [
    billAmount,
    eachPersonPaysStepper,
    numberOfPeopleStepper.value,
    tipAmountStepper.value,
    tipPercentStepper,
    totalAmountStepper,
  ]);

  // totalAmount updated
  React.useLayoutEffect(() => {
    if (totalAmountUpdated.current) {
      const tipAmount = currency(totalAmountStepper.value).subtract(billAmount);
      const tipPercent = currency(tipAmount)
        .divide(billAmount)
        .multiply(100);
      const eachPersonPays = currency(totalAmountStepper.value).distribute(
        parseInt(numberOfPeopleStepper.value, 10),
      )[0];

      tipPercentStepper.setValue(String(tipPercent.value));
      tipAmountStepper.setValue(String(tipAmount.intValue));
      eachPersonPaysStepper.setValue(String(eachPersonPays.intValue));

      totalAmountUpdated.current = false;
    }
  }, [
    billAmount,
    eachPersonPaysStepper,
    numberOfPeopleStepper.value,
    tipAmountStepper,
    tipPercentStepper,
    totalAmountStepper.value,
  ]);

  // numberOfPeople updated
  React.useLayoutEffect(() => {
    if (numberOfPeopleUpdated.current) {
      const eachPersonPays = currency(totalAmountStepper.value).distribute(
        parseInt(numberOfPeopleStepper.value, 10),
      )[0];

      eachPersonPaysStepper.setValue(String(eachPersonPays.intValue));

      numberOfPeopleUpdated.current = false;
    }
  }, [
    eachPersonPaysStepper,
    numberOfPeopleStepper.value,
    totalAmountStepper.value,
  ]);

  // eachPersonPays updated
  React.useLayoutEffect(() => {
    if (eachPersonPaysUpdated.current) {
      const totalAmount = currency(eachPersonPaysStepper.value).multiply(
        parseInt(numberOfPeopleStepper.value, 10),
      );
      const tipAmount = currency(totalAmount).subtract(billAmount);
      const tipPercent = currency(tipAmount)
        .divide(billAmount)
        .multiply(100);

      tipPercentStepper.setValue(String(tipPercent.value));
      tipAmountStepper.setValue(String(tipAmount.intValue));
      totalAmountStepper.setValue(String(totalAmount.intValue));

      eachPersonPaysUpdated.current = false;
    }
  }, [
    billAmount,
    eachPersonPaysStepper.value,
    numberOfPeopleStepper.value,
    tipAmountStepper,
    totalAmountStepper,
    tipPercentStepper,
  ]);

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
              {...tipPercentStepper.getDecrementProps({
                onClick: () => {
                  tipPercentUpdated.current = true;
                },
              })}
            />
            <CalcInput
              id="tip-percent"
              name="tip-percent"
              {...tipPercentStepper.getInputProps({
                onChange: () => {
                  tipPercentUpdated.current = true;
                },
              })}
            />
            <IncrementButton
              aria-label="increment tip percent"
              {...tipPercentStepper.getIncrementProps({
                onClick: () => {
                  tipPercentUpdated.current = true;
                },
              })}
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
              {...tipAmountStepper.getDecrementProps({
                onClick: () => {
                  tipAmountUpdated.current = true;
                },
              })}
            />
            <CalcInput
              id="tip-amount"
              name="tip-amount"
              {...tipAmountStepper.getInputProps({
                onChange: () => {
                  tipAmountUpdated.current = true;
                },
              })}
            />
            <IncrementButton
              aria-label="increment tip amount"
              {...tipAmountStepper.getIncrementProps({
                onClick: () => {
                  tipAmountUpdated.current = true;
                },
              })}
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
                onClick: () => {
                  totalAmountUpdated.current = true;
                },
              })}
            />
            <CalcInput
              css={css`
                font-weight: 600;
              `}
              id="total-amount"
              name="total-amount"
              {...totalAmountStepper.getInputProps({
                onChange: () => {
                  totalAmountUpdated.current = true;
                },
              })}
            />
            <IncrementButton
              aria-label="increment total amount"
              {...totalAmountStepper.getIncrementProps({
                onClick: () => {
                  totalAmountUpdated.current = true;
                },
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
              {...numberOfPeopleStepper.getDecrementProps({
                onClick: () => {
                  numberOfPeopleUpdated.current = true;
                },
              })}
            />
            <CalcInput
              id="number-of-people"
              name="number-of-people"
              {...numberOfPeopleStepper.getInputProps({
                onChange: () => {
                  numberOfPeopleUpdated.current = true;
                },
              })}
            />
            <IncrementButton
              aria-label="increment number of people"
              {...numberOfPeopleStepper.getIncrementProps({
                onClick: () => {
                  numberOfPeopleUpdated.current = true;
                },
              })}
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
              {...eachPersonPaysStepper.getDecrementProps({
                onClick: () => {
                  eachPersonPaysUpdated.current = true;
                },
              })}
            />
            <CalcInput
              id="each-person-pays"
              name="each-person-pays"
              {...eachPersonPaysStepper.getInputProps({
                onChange: () => {
                  eachPersonPaysUpdated.current = true;
                },
              })}
            />
            <IncrementButton
              aria-label="increment each person pays"
              {...eachPersonPaysStepper.getIncrementProps({
                onClick: () => {
                  eachPersonPaysUpdated.current = true;
                },
              })}
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
