import * as React from 'react';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import currency from 'currency.js';
import { useDefaultPartySize, useDefaultTipPercent } from '../settings';
import { billFromUrlParam, getPreviousEvenDollar, toCurrency, toNumber } from '../utils';
import BrandButton from '../shared/brand-button';
import NumericInput from '../shared/numeric-input';

type TipSource =
  | { type: 'percent'; value: number }
  | { type: 'amount'; value: number }
  | { type: 'total'; value: number }
  | { type: 'perPerson'; value: number };

type State = {
  tipSource: TipSource;
  numberOfPeople: number;
};

function deriveValues(billAmount: number, state: State) {
  const { tipSource, numberOfPeople } = state;

  if (billAmount <= 0 || numberOfPeople <= 0) {
    return { tipPercent: 0, tipAmount: 0, totalAmount: billAmount, eachPersonPays: 0 };
  }

  let tipAmount: number;
  switch (tipSource.type) {
    case 'percent':
      tipAmount = currency(billAmount).multiply(tipSource.value).divide(100).value;
      break;
    case 'amount':
      tipAmount = tipSource.value;
      break;
    case 'total':
      tipAmount = currency(tipSource.value).subtract(billAmount).value;
      break;
    case 'perPerson':
      tipAmount = currency(tipSource.value).multiply(numberOfPeople).subtract(billAmount).value;
      break;
  }

  const totalAmount = currency(billAmount).add(tipAmount).value;

  return {
    tipPercent: currency(tipAmount).divide(billAmount).multiply(100).value,
    tipAmount,
    totalAmount,
    eachPersonPays: currency(totalAmount).distribute(numberOfPeople)[0].value,
  };
}

function CalcPage() {
  const params = useParams();
  const bill = billFromUrlParam(params.bill);
  const navigate = useNavigate();

  const [initialPartySize] = useDefaultPartySize();
  const [initialTipPercent] = useDefaultTipPercent();

  const billAmount = Number.parseFloat(bill) || 0;

  const [state, setState] = React.useState<State>({
    tipSource: { type: 'percent', value: initialTipPercent },
    numberOfPeople: initialPartySize,
  });

  const { tipPercent, tipAmount, totalAmount, eachPersonPays } = deriveValues(billAmount, state);

  const startOver = () => {
    void navigate('/', { replace: true });
  };

  return (
    <section className="flex w-full max-w-xl grow flex-col items-center justify-between font-normal">
      <div className="mb-12 grid w-full grid-cols-[1fr_auto] gap-y-14 text-xl md:text-2xl">
        <Cell>
          <label htmlFor="tip-percent">Tip Percent (%)</label>
        </Cell>
        <Cell>
          <DecrementButton
            aria-label="decrement tip percent"
            onClick={() => {
              setState((previousState) => {
                const { tipPercent: prevTipPercent } = deriveValues(billAmount, previousState);
                return {
                  ...previousState,
                  tipSource: {
                    type: 'percent',
                    value: prevTipPercent < 1 ? 0 : prevTipPercent - 1,
                  },
                };
              });
            }}
          />
          <CalcInput
            id="tip-percent"
            name="tip-percent"
            value={tipPercent}
            onChange={(e) => {
              setState((previousState) => ({
                ...previousState,
                tipSource: { type: 'percent', value: toNumber(e.target.value) },
              }));
            }}
          />
          <IncrementButton
            aria-label="increment tip percent"
            onClick={() => {
              setState((previousState) => {
                const { tipPercent: prevTipPercent } = deriveValues(billAmount, previousState);
                return {
                  ...previousState,
                  tipSource: { type: 'percent', value: prevTipPercent + 1 },
                };
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
              setState((previousState) => {
                const { tipAmount: prevTipAmount } = deriveValues(billAmount, previousState);
                const current = currency(prevTipAmount, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(current);
                return {
                  ...previousState,
                  tipSource: { type: 'amount', value: current.value < 1 ? 0 : previousEvenDollar },
                };
              });
            }}
          />
          <CalcInput
            id="tip-amount"
            name="tip-amount"
            value={currency(tipAmount, { symbol: '' }).format()}
            onChange={(e) => {
              setState((previousState) => ({
                ...previousState,
                tipSource: { type: 'amount', value: toNumber(toCurrency(e.target.value)) },
              }));
            }}
          />
          <IncrementButton
            aria-label="increment tip amount"
            onClick={() => {
              setState((previousState) => {
                const { tipAmount: prevTipAmount } = deriveValues(billAmount, previousState);
                return {
                  ...previousState,
                  tipSource: {
                    type: 'amount',
                    value: currency(prevTipAmount, { increment: 1 }).add(1).dollars(),
                  },
                };
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
              setState((previousState) => {
                const { totalAmount: prevTotalAmount } = deriveValues(billAmount, previousState);
                const current = currency(prevTotalAmount, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(current);
                return {
                  ...previousState,
                  tipSource: {
                    type: 'total',
                    value: previousEvenDollar < billAmount ? billAmount : previousEvenDollar,
                  },
                };
              });
            }}
          />
          <CalcInput
            id="total-amount"
            name="total-amount"
            className="font-semibold"
            value={currency(totalAmount, { symbol: '' }).format()}
            onChange={(e) => {
              setState((previousState) => ({
                ...previousState,
                tipSource: { type: 'total', value: toNumber(toCurrency(e.target.value)) },
              }));
            }}
          />
          <IncrementButton
            aria-label="increment total amount"
            onClick={() => {
              setState((previousState) => {
                const { totalAmount: prevTotalAmount } = deriveValues(billAmount, previousState);
                return {
                  ...previousState,
                  tipSource: {
                    type: 'total',
                    value: currency(prevTotalAmount, { increment: 1 }).add(1).dollars(),
                  },
                };
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
              setState((previousState) => ({
                ...previousState,
                numberOfPeople:
                  previousState.numberOfPeople < 2 ? 1 : previousState.numberOfPeople - 1,
              }));
            }}
          />
          <CalcInput
            id="number-of-people"
            name="number-of-people"
            value={state.numberOfPeople}
            onChange={(e) => {
              setState((previousState) => ({
                ...previousState,
                numberOfPeople: Math.max(1, toNumber(e.target.value)),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment number of people"
            onClick={() => {
              setState((previousState) => ({
                ...previousState,
                numberOfPeople: previousState.numberOfPeople + 1,
              }));
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
              setState((previousState) => {
                const { eachPersonPays: prevEachPersonPays } = deriveValues(
                  billAmount,
                  previousState,
                );
                const current = currency(prevEachPersonPays, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(current);
                const minPerPerson = currency(billAmount).distribute(
                  previousState.numberOfPeople,
                )[0].value;
                return {
                  ...previousState,
                  tipSource: {
                    type: 'perPerson',
                    value: previousEvenDollar < minPerPerson ? minPerPerson : previousEvenDollar,
                  },
                };
              });
            }}
          />
          <CalcInput
            id="each-person-pays"
            name="each-person-pays"
            value={currency(eachPersonPays, { symbol: '' }).format()}
            onChange={(e) => {
              setState((previousState) => ({
                ...previousState,
                tipSource: { type: 'perPerson', value: toNumber(toCurrency(e.target.value)) },
              }));
            }}
          />
          <IncrementButton
            aria-label="increment each person pays"
            onClick={() => {
              setState((previousState) => {
                const { eachPersonPays: prevEachPersonPays } = deriveValues(
                  billAmount,
                  previousState,
                );
                return {
                  ...previousState,
                  tipSource: {
                    type: 'perPerson',
                    value: currency(prevEachPersonPays, { increment: 1 }).add(1).dollars(),
                  },
                };
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

type CellProps = React.ComponentProps<'div'>;

function Cell(props: CellProps) {
  const { className, ...otherProps } = props;
  return <div className={clsx('flex items-center', className)} {...otherProps} />;
}

function HeroCell(props: CellProps) {
  const { className, ...otherProps } = props;
  return (
    <Cell
      className={clsx('border-y border-black py-10 font-semibold', className)}
      {...otherProps}
    />
  );
}

function IconButton(props: React.ComponentProps<'button'>) {
  const { className, ...otherProps } = props;
  return (
    <button type="button" className={clsx('dark:text-accent p-1.5', className)} {...otherProps} />
  );
}

function DecrementButton(props: React.ComponentProps<'button'>) {
  return (
    <IconButton {...props}>
      <FiChevronDown size={26} />
    </IconButton>
  );
}

function IncrementButton(props: React.ComponentProps<'button'>) {
  return (
    <IconButton {...props}>
      <FiChevronUp size={26} />
    </IconButton>
  );
}

function CalcInput(props: React.ComponentProps<'input'>) {
  const { className, ...otherProps } = props;
  return (
    <NumericInput className={clsx('mx-2 max-w-20 text-xl md:text-xl', className)} {...otherProps} />
  );
}

export default CalcPage;
