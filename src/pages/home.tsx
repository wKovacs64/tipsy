import * as React from 'react';
import { useNavigate } from 'react-router';
import { billToUrlParam, toCurrency } from '../utils';
import { BrandButton } from '../shared/brand-button';
import { NumericInput } from '../shared/numeric-input';

export function HomePage() {
  const navigate = useNavigate();
  const [bill, setBill] = React.useState('');
  const [isFormValid, setIsFormValid] = React.useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void navigate(`calc/${billToUrlParam(bill)}`, { replace: true });
  };

  const handleBillChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.currentTarget;
    const valueAsCurrency = toCurrency(value);
    setBill(valueAsCurrency);
    setIsFormValid(Boolean(valueAsCurrency) && valueAsCurrency !== '0.00');
  };

  return (
    <section className="flex w-full max-w-xl grow flex-col items-center justify-around">
      <form
        onSubmit={handleSubmit}
        className="flex w-full grow flex-col items-center justify-around"
      >
        <label htmlFor="bill" className="text-5xl md:text-4xl">
          Bill amount:
        </label>
        <NumericInput
          id="bill"
          name="bill"
          placeholder="0.00"
          value={bill}
          onChange={handleBillChange}
          className="text-6xl font-extralight md:my-7 md:text-5xl"
        />
        <BrandButton type="submit" disabled={!isFormValid}>
          Next
        </BrandButton>
      </form>
    </section>
  );
}
