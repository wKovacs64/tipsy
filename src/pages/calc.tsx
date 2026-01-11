import * as React from 'react';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import currency from 'currency.js';
import { useDefaultPartySize, useDefaultTipPercent } from '../settings';
import { billFromUrlParam, getPreviousEvenDollar, toCurrency, toNumber } from '../utils';
import BrandButton from '../shared/brand-button';
import NumericInput from '../shared/numeric-input';

type State = {
  totalAmount: number;
  numberOfPeople: number;
};

function deriveValues(billAmount: number, state: State) {
  const { totalAmount, numberOfPeople } = state;

  if (billAmount <= 0 || numberOfPeople <= 0) {
    return { tipPercent: 0, tipAmount: 0, totalAmount: billAmount, eachPersonPays: 0 };
  }

  const tipAmount = currency(totalAmount).subtract(billAmount).value;
  const tipPercent = currency(tipAmount).divide(billAmount).multiply(100).value;
  const eachPersonPays = currency(totalAmount).distribute(numberOfPeople)[0].value;

  return { tipPercent, tipAmount, totalAmount, eachPersonPays };
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

  const [state, setState] = React.useState<State>({
    totalAmount: initialTotalAmount,
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
              setState((prev) => {
                const { tipPercent: prevTipPercent } = deriveValues(billAmount, prev);
                const newPercent = prevTipPercent < 1 ? 0 : prevTipPercent - 1;
                const newTipAmount = currency(billAmount).multiply(newPercent).divide(100).value;
                return { ...prev, totalAmount: currency(billAmount).add(newTipAmount).value };
              });
            }}
          />
          <CalcInput
            id="tip-percent"
            name="tip-percent"
            value={tipPercent}
            onChange={(e) => {
              setState((prev) => {
                const newPercent = toNumber(e.target.value);
                const newTipAmount = currency(billAmount).multiply(newPercent).divide(100).value;
                return { ...prev, totalAmount: currency(billAmount).add(newTipAmount).value };
              });
            }}
          />
          <IncrementButton
            aria-label="increment tip percent"
            onClick={() => {
              setState((prev) => {
                const { tipPercent: prevTipPercent } = deriveValues(billAmount, prev);
                const newPercent = prevTipPercent + 1;
                const newTipAmount = currency(billAmount).multiply(newPercent).divide(100).value;
                return { ...prev, totalAmount: currency(billAmount).add(newTipAmount).value };
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
              setState((prev) => {
                const { tipAmount: prevTipAmount } = deriveValues(billAmount, prev);
                const current = currency(prevTipAmount, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(current);
                const newTipAmount = current.value < 1 ? 0 : previousEvenDollar;
                return { ...prev, totalAmount: currency(billAmount).add(newTipAmount).value };
              });
            }}
          />
          <CalcInput
            id="tip-amount"
            name="tip-amount"
            value={currency(tipAmount, { symbol: '' }).format()}
            onChange={(e) => {
              setState((prev) => {
                const newTipAmount = toNumber(toCurrency(e.target.value));
                return { ...prev, totalAmount: currency(billAmount).add(newTipAmount).value };
              });
            }}
          />
          <IncrementButton
            aria-label="increment tip amount"
            onClick={() => {
              setState((prev) => {
                const { tipAmount: prevTipAmount } = deriveValues(billAmount, prev);
                const newTipAmount = currency(prevTipAmount, { increment: 1 }).add(1).dollars();
                return { ...prev, totalAmount: currency(billAmount).add(newTipAmount).value };
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
              setState((prev) => {
                const current = currency(prev.totalAmount, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(current);
                const newTotal = previousEvenDollar < billAmount ? billAmount : previousEvenDollar;
                return { ...prev, totalAmount: newTotal };
              });
            }}
          />
          <CalcInput
            id="total-amount"
            name="total-amount"
            className="font-semibold"
            value={currency(totalAmount, { symbol: '' }).format()}
            onChange={(e) => {
              setState((prev) => ({
                ...prev,
                totalAmount: toNumber(toCurrency(e.target.value)),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment total amount"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                totalAmount: currency(prev.totalAmount, { increment: 1 }).add(1).dollars(),
              }));
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
              setState((prev) =>
                prev.numberOfPeople < 2
                  ? prev
                  : { ...prev, numberOfPeople: prev.numberOfPeople - 1 },
              );
            }}
          />
          <CalcInput
            id="number-of-people"
            name="number-of-people"
            value={state.numberOfPeople}
            onChange={(e) => {
              setState((prev) => ({
                ...prev,
                numberOfPeople: Math.max(1, toNumber(e.target.value)),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment number of people"
            onClick={() => {
              setState((prev) => ({ ...prev, numberOfPeople: prev.numberOfPeople + 1 }));
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
              setState((prev) => {
                const { eachPersonPays: prevEachPersonPays } = deriveValues(billAmount, prev);
                const current = currency(prevEachPersonPays, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(current);
                const minPerPerson = currency(billAmount).distribute(prev.numberOfPeople)[0].value;
                const newPerPerson =
                  previousEvenDollar < minPerPerson ? minPerPerson : previousEvenDollar;
                return {
                  ...prev,
                  totalAmount: currency(newPerPerson).multiply(prev.numberOfPeople).value,
                };
              });
            }}
          />
          <CalcInput
            id="each-person-pays"
            name="each-person-pays"
            value={currency(eachPersonPays, { symbol: '' }).format()}
            onChange={(e) => {
              setState((prev) => {
                const newPerPerson = toNumber(toCurrency(e.target.value));
                return {
                  ...prev,
                  totalAmount: currency(newPerPerson).multiply(prev.numberOfPeople).value,
                };
              });
            }}
          />
          <IncrementButton
            aria-label="increment each person pays"
            onClick={() => {
              setState((prev) => {
                const { eachPersonPays: prevEachPersonPays } = deriveValues(billAmount, prev);
                const newPerPerson = currency(prevEachPersonPays, { increment: 1 })
                  .add(1)
                  .dollars();
                return {
                  ...prev,
                  totalAmount: currency(newPerPerson).multiply(prev.numberOfPeople).value,
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
