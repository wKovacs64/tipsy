import * as React from 'react';
import { clsx } from 'clsx';
import { useNavigate, useParams } from 'react-router';
import currency from 'currency.js';
import { Icon } from '#/src/icons/icon';
import { useDefaultPartySize, useDefaultTipPercent } from '#/src/settings';
import { billFromUrlParam, toCurrency, toNumber } from '#/src/utils';
import { BrandButton } from '#/src/shared/brand-button';
import { NumericInput } from '#/src/shared/numeric-input';
import { useTipCalculator } from '#/src/use-tip-calculator';

export function CalcPage() {
  const params = useParams();
  const bill = billFromUrlParam(params.bill);
  const navigate = useNavigate();

  const [initialPartySize] = useDefaultPartySize();
  const [initialTipPercent] = useDefaultTipPercent();

  const billAmount = Number.parseFloat(bill) || 0;

  const tipCalc = useTipCalculator(billAmount, initialTipPercent, initialPartySize);

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
            onClick={tipCalc.decrementTipPercent}
          />
          <CalcInput
            id="tip-percent"
            name="tip-percent"
            value={tipCalc.tipPercent}
            onChange={(e) => tipCalc.changeTipPercent(toNumber(e.target.value))}
          />
          <IncrementButton
            aria-label="increment tip percent"
            onClick={tipCalc.incrementTipPercent}
          />
        </Cell>
        <Cell>
          <label htmlFor="tip-amount">Tip Amount</label>
        </Cell>
        <Cell>
          <DecrementButton aria-label="decrement tip amount" onClick={tipCalc.decrementTipAmount} />
          <CalcInput
            id="tip-amount"
            name="tip-amount"
            value={currency(tipCalc.tipAmount, { symbol: '' }).format()}
            onChange={(e) => tipCalc.changeTipAmount(toNumber(toCurrency(e.target.value)))}
          />
          <IncrementButton aria-label="increment tip amount" onClick={tipCalc.incrementTipAmount} />
        </Cell>
        <HeroCell>
          <label htmlFor="total-amount">Total Amount</label>
        </HeroCell>
        <HeroCell>
          <DecrementButton
            aria-label="decrement total amount"
            onClick={tipCalc.decrementTotalAmount}
          />
          <CalcInput
            id="total-amount"
            name="total-amount"
            className="font-semibold"
            value={currency(tipCalc.totalAmount, { symbol: '' }).format()}
            onChange={(e) => tipCalc.changeTotalAmount(toNumber(toCurrency(e.target.value)))}
          />
          <IncrementButton
            aria-label="increment total amount"
            onClick={tipCalc.incrementTotalAmount}
          />
        </HeroCell>
        <Cell>
          <label htmlFor="number-of-people">Number of People</label>
        </Cell>
        <Cell>
          <DecrementButton
            aria-label="decrement number of people"
            onClick={tipCalc.decrementNumberOfPeople}
          />
          <CalcInput
            id="number-of-people"
            name="number-of-people"
            value={tipCalc.numberOfPeople}
            onChange={(e) => tipCalc.changeNumberOfPeople(toNumber(e.target.value))}
          />
          <IncrementButton
            aria-label="increment number of people"
            onClick={tipCalc.incrementNumberOfPeople}
          />
        </Cell>
        <Cell>
          <label htmlFor="each-person-pays">Each Person Pays</label>
        </Cell>
        <Cell>
          <DecrementButton
            aria-label="decrement each person pays"
            onClick={tipCalc.decrementEachPersonPays}
          />
          <CalcInput
            id="each-person-pays"
            name="each-person-pays"
            value={currency(tipCalc.eachPersonPays, { symbol: '' }).format()}
            onChange={(e) => tipCalc.changeEachPersonPays(toNumber(toCurrency(e.target.value)))}
          />
          <IncrementButton
            aria-label="increment each person pays"
            onClick={tipCalc.incrementEachPersonPays}
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
      <Icon name="feather-chevron-down" size={26} />
    </IconButton>
  );
}

function IncrementButton(props: React.ComponentProps<'button'>) {
  return (
    <IconButton {...props}>
      <Icon name="feather-chevron-up" size={26} />
    </IconButton>
  );
}

function CalcInput(props: React.ComponentProps<'input'>) {
  const { className, ...otherProps } = props;
  return (
    <NumericInput className={clsx('mx-2 max-w-20 text-xl md:text-xl', className)} {...otherProps} />
  );
}
