import * as React from 'react';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import currency from 'currency.js';
import { useDefaultPartySize, useDefaultTipPercent } from '../settings';
import { billFromUrlParam, getPreviousEvenDollar, toCurrency, toNumber } from '../utils';
import BrandButton from '../shared/brand-button';
import NumericInput from '../shared/numeric-input';

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

function CalcPage() {
  const params = useParams();
  const bill = billFromUrlParam(params.bill);
  const navigate = useNavigate();

  const [initialPartySize] = useDefaultPartySize();
  const [initialTipPercent] = useDefaultTipPercent();

  const billAmount = Number.parseFloat(bill) || 0;
  const initialTipAmount = currency(billAmount).multiply(initialTipPercent).divide(100).value;
  const initialTotalAmount = currency(billAmount).add(initialTipAmount).value;
  const initialEachPersonPays = currency(initialTotalAmount).distribute(initialPartySize)[0].value;

  const initialState: State = {
    tipPercent: initialTipPercent,
    tipAmount: initialTipAmount,
    totalAmount: initialTotalAmount,
    numberOfPeople: initialPartySize,
    eachPersonPays: initialEachPersonPays,
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case ActionType.CHANGE_TIP_PERCENT: {
        const tipAmount = currency(action.payload).divide(100).multiply(billAmount).value;
        const totalAmount = currency(billAmount).add(tipAmount).value;
        const eachPersonPays = currency(totalAmount).distribute(state.numberOfPeople)[0].value;

        return {
          tipPercent: action.payload,
          tipAmount,
          totalAmount,
          numberOfPeople: state.numberOfPeople,
          eachPersonPays,
        };
      }

      case ActionType.CHANGE_TIP_AMOUNT: {
        const tipPercent = currency(action.payload).divide(billAmount).multiply(100).value;
        const totalAmount = currency(billAmount).add(action.payload).value;
        const eachPersonPays = currency(totalAmount).distribute(state.numberOfPeople)[0].value;

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
        const tipPercent = currency(tipAmount).divide(billAmount).multiply(100).value;
        const eachPersonPays = currency(action.payload).distribute(state.numberOfPeople)[0].value;

        return {
          tipPercent,
          tipAmount,
          totalAmount: action.payload,
          numberOfPeople: state.numberOfPeople,
          eachPersonPays,
        };
      }

      case ActionType.CHANGE_NUMBER_OF_PEOPLE: {
        const eachPersonPays = currency(state.totalAmount).distribute(action.payload)[0].value;

        return {
          ...state,
          numberOfPeople: action.payload,
          eachPersonPays,
        };
      }

      case ActionType.CHANGE_EACH_PERSON_PAYS: {
        const totalAmount = currency(action.payload).multiply(state.numberOfPeople).value;
        const tipAmount = currency(totalAmount).subtract(billAmount).value;
        const tipPercent = currency(tipAmount).divide(billAmount).multiply(100).value;

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

  const startOver = () => {
    navigate('/', { replace: true });
  };

  return (
    <section className="flex w-full max-w-xl grow flex-col items-center justify-between font-normal">
      <div className="mb-12 grid w-full grid-cols-[1fr,auto] gap-y-14 text-xl md:text-2xl">
        <Cell>
          <label htmlFor="tip-percent">Tip Percent (%)</label>
        </Cell>
        <Cell>
          <DecrementButton
            aria-label="decrement tip percent"
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TIP_PERCENT,
                payload: state.tipPercent < 1 ? 0 : state.tipPercent - 1,
              });
            }}
          />
          <CalcInput
            id="tip-percent"
            name="tip-percent"
            value={state.tipPercent}
            onChange={(e) => {
              dispatch({
                type: ActionType.CHANGE_TIP_PERCENT,
                payload: toNumber(e.target.value),
              });
            }}
          />
          <IncrementButton
            aria-label="increment tip percent"
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TIP_PERCENT,
                payload: state.tipPercent + 1,
              });
            }}
          />
        </Cell>
        <Cell>
          <label htmlFor="tip-amount">Tip Amount</label>
        </Cell>
        <Cell>
          <DecrementButton
            aria-label="decrement tip amount"
            onClick={() => {
              const current = currency(state.tipAmount, { increment: 1 });
              const previousEvenDollar = getPreviousEvenDollar(current);
              dispatch({
                type: ActionType.CHANGE_TIP_AMOUNT,
                payload: current.value < 1 ? 0 : previousEvenDollar,
              });
            }}
          />
          <CalcInput
            id="tip-amount"
            name="tip-amount"
            value={currency(state.tipAmount, { symbol: '' }).format()}
            onChange={(e) => {
              dispatch({
                type: ActionType.CHANGE_TIP_AMOUNT,
                payload: toNumber(toCurrency(e.target.value)),
              });
            }}
          />
          <IncrementButton
            aria-label="increment tip amount"
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TIP_AMOUNT,
                payload: currency(state.tipAmount, { increment: 1 }).add(1).dollars(),
              });
            }}
          />
        </Cell>
        <HeroCell>
          <label htmlFor="total-amount">Total Amount</label>
        </HeroCell>
        <HeroCell>
          <DecrementButton
            aria-label="decrement total amount"
            onClick={() => {
              const current = currency(state.totalAmount, { increment: 1 });
              const previousEvenDollar = getPreviousEvenDollar(current);
              dispatch({
                type: ActionType.CHANGE_TOTAL_AMOUNT,
                payload: previousEvenDollar < billAmount ? billAmount : previousEvenDollar,
              });
            }}
          />
          <CalcInput
            id="total-amount"
            name="total-amount"
            className="font-semibold"
            value={currency(state.totalAmount, { symbol: '' }).format()}
            onChange={(e) => {
              dispatch({
                type: ActionType.CHANGE_TOTAL_AMOUNT,
                // TODO: deal with manually setting below billAmount
                payload: toNumber(toCurrency(e.target.value)),
              });
            }}
          />
          <IncrementButton
            aria-label="increment total amount"
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_TOTAL_AMOUNT,
                payload: currency(state.totalAmount, { increment: 1 }).add(1).dollars(),
              });
            }}
          />
        </HeroCell>
        <Cell>
          <label htmlFor="number-of-people">Number of People</label>
        </Cell>
        <Cell>
          <DecrementButton
            aria-label="decrement number of people"
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_NUMBER_OF_PEOPLE,
                payload: state.numberOfPeople < 2 ? 1 : state.numberOfPeople - 1,
              });
            }}
          />
          <CalcInput
            id="number-of-people"
            name="number-of-people"
            value={state.numberOfPeople}
            onChange={(e) => {
              dispatch({
                type: ActionType.CHANGE_NUMBER_OF_PEOPLE,
                // TODO: deal with manually setting to 0
                payload: toNumber(e.target.value),
              });
            }}
          />
          <IncrementButton
            aria-label="increment number of people"
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_NUMBER_OF_PEOPLE,
                payload: state.numberOfPeople + 1,
              });
            }}
          />
        </Cell>
        <Cell>
          <label htmlFor="each-person-pays">Each Person Pays</label>
        </Cell>
        <Cell>
          <DecrementButton
            aria-label="decrement each person pays"
            onClick={() => {
              const current = currency(state.eachPersonPays, {
                increment: 1,
              });
              const previousEvenDollar = getPreviousEvenDollar(current);
              const minPerPerson = currency(billAmount).distribute(state.numberOfPeople)[0].value;
              dispatch({
                type: ActionType.CHANGE_EACH_PERSON_PAYS,
                payload: previousEvenDollar < minPerPerson ? minPerPerson : previousEvenDollar,
              });
            }}
          />
          <CalcInput
            id="each-person-pays"
            name="each-person-pays"
            value={currency(state.eachPersonPays, { symbol: '' }).format()}
            onChange={(e) => {
              dispatch({
                type: ActionType.CHANGE_EACH_PERSON_PAYS,
                // TODO: deal with manually setting below minPerPerson
                payload: toNumber(toCurrency(e.target.value)),
              });
            }}
          />
          <IncrementButton
            aria-label="increment each person pays"
            onClick={() => {
              dispatch({
                type: ActionType.CHANGE_EACH_PERSON_PAYS,
                payload: currency(state.eachPersonPays, { increment: 1 }).add(1).dollars(),
              });
            }}
          />
        </Cell>
      </div>
      {/* TODO: this could be a Link */}
      <BrandButton type="button" onClick={startOver}>
        Start Over
      </BrandButton>
    </section>
  );
}

type CellProps = JSX.IntrinsicElements['div'];

function Cell(props: CellProps) {
  const { className, ...otherProps } = props;
  return <div className={clsx('flex items-center', className)} {...otherProps} />;
}

function HeroCell(props: CellProps) {
  const { className, ...otherProps } = props;
  return (
    <Cell
      className={clsx('border-b border-t border-black py-10 font-semibold', className)}
      {...otherProps}
    />
  );
}

function IconButton(props: JSX.IntrinsicElements['button']) {
  const { className, ...otherProps } = props;
  return (
    <button type="button" className={clsx('p-1.5 dark:text-accent', className)} {...otherProps} />
  );
}

function DecrementButton(props: JSX.IntrinsicElements['button']) {
  return (
    <IconButton {...props}>
      <FiChevronDown size={26} />
    </IconButton>
  );
}

function IncrementButton(props: JSX.IntrinsicElements['button']) {
  return (
    <IconButton {...props}>
      <FiChevronUp size={26} />
    </IconButton>
  );
}

function CalcInput(props: JSX.IntrinsicElements['input']) {
  const { className, ...otherProps } = props;
  return (
    <NumericInput
      className={clsx('mx-2 max-w-[5rem] text-xl md:text-xl', className)}
      {...otherProps}
    />
  );
}

export default CalcPage;
