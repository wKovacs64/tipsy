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

function CalcPage() {
  const params = useParams();
  const bill = billFromUrlParam(params.bill);
  const navigate = useNavigate();

  const [initialPartySize] = useDefaultPartySize();
  const [initialTipPercent] = useDefaultTipPercent();

  const billAmount = Number.parseFloat(bill) || 0;

  const [state, setState] = React.useState<State>({
    totalAmount: totalFromTipPercent(billAmount, initialTipPercent),
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
              setState((currentState) => {
                const { tipPercent: currentTipPercent } = deriveValues(billAmount, currentState);
                const newPercent = currentTipPercent < 1 ? 0 : currentTipPercent - 1;
                return {
                  ...currentState,
                  totalAmount: totalFromTipPercent(billAmount, newPercent),
                };
              });
            }}
          />
          <CalcInput
            id="tip-percent"
            name="tip-percent"
            value={tipPercent}
            onChange={(e) => {
              setState((currentState) => ({
                ...currentState,
                totalAmount: totalFromTipPercent(billAmount, toNumber(e.target.value)),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment tip percent"
            onClick={() => {
              setState((currentState) => {
                const { tipPercent: currentTipPercent } = deriveValues(billAmount, currentState);
                return {
                  ...currentState,
                  totalAmount: totalFromTipPercent(billAmount, currentTipPercent + 1),
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
            }}
          />
          <CalcInput
            id="tip-amount"
            name="tip-amount"
            value={currency(tipAmount, { symbol: '' }).format()}
            onChange={(e) => {
              setState((currentState) => ({
                ...currentState,
                totalAmount: totalFromTipAmount(billAmount, toNumber(toCurrency(e.target.value))),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment tip amount"
            onClick={() => {
              setState((currentState) => {
                const { tipAmount: currentTipAmount } = deriveValues(billAmount, currentState);
                const newTipAmount = currency(currentTipAmount, { increment: 1 }).add(1).dollars();
                return {
                  ...currentState,
                  totalAmount: totalFromTipAmount(billAmount, newTipAmount),
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
              setState((currentState) => {
                const newTotalAmount = currency(currentState.totalAmount, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(newTotalAmount);
                const finalTotalAmount =
                  previousEvenDollar < billAmount ? billAmount : previousEvenDollar;
                return { ...currentState, totalAmount: finalTotalAmount };
              });
            }}
          />
          <CalcInput
            id="total-amount"
            name="total-amount"
            className="font-semibold"
            value={currency(totalAmount, { symbol: '' }).format()}
            onChange={(e) => {
              setState((currentState) => ({
                ...currentState,
                totalAmount: toNumber(toCurrency(e.target.value)),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment total amount"
            onClick={() => {
              setState((currentState) => ({
                ...currentState,
                totalAmount: currency(currentState.totalAmount, { increment: 1 }).add(1).dollars(),
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
              setState((currentState) =>
                currentState.numberOfPeople < 2
                  ? currentState
                  : { ...currentState, numberOfPeople: currentState.numberOfPeople - 1 },
              );
            }}
          />
          <CalcInput
            id="number-of-people"
            name="number-of-people"
            value={state.numberOfPeople}
            onChange={(e) => {
              setState((currentState) => ({
                ...currentState,
                numberOfPeople: toNumber(e.target.value),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment number of people"
            onClick={() => {
              setState((currentState) => ({
                ...currentState,
                numberOfPeople: currentState.numberOfPeople + 1,
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
              setState((currentState) => {
                const { eachPersonPays: currentEachPersonPays } = deriveValues(
                  billAmount,
                  currentState,
                );
                const newEachPersonPays = currency(currentEachPersonPays, { increment: 1 });
                const previousEvenDollar = getPreviousEvenDollar(newEachPersonPays);
                const minPerPerson = currency(billAmount).distribute(currentState.numberOfPeople)[0]
                  .value;
                const finalEachPersonPays =
                  previousEvenDollar < minPerPerson ? minPerPerson : previousEvenDollar;
                return {
                  ...currentState,
                  totalAmount: totalFromEachPersonPays(
                    finalEachPersonPays,
                    currentState.numberOfPeople,
                  ),
                };
              });
            }}
          />
          <CalcInput
            id="each-person-pays"
            name="each-person-pays"
            value={currency(eachPersonPays, { symbol: '' }).format()}
            onChange={(e) => {
              setState((currentState) => ({
                ...currentState,
                totalAmount: totalFromEachPersonPays(
                  toNumber(toCurrency(e.target.value)),
                  currentState.numberOfPeople,
                ),
              }));
            }}
          />
          <IncrementButton
            aria-label="increment each person pays"
            onClick={() => {
              setState((currentState) => {
                const { eachPersonPays: currentEachPersonPays } = deriveValues(
                  billAmount,
                  currentState,
                );
                const newPerPerson = currency(currentEachPersonPays, { increment: 1 })
                  .add(1)
                  .dollars();
                return {
                  ...currentState,
                  totalAmount: totalFromEachPersonPays(newPerPerson, currentState.numberOfPeople),
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
