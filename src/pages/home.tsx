import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { billToUrlParam, toCurrency } from '../utils';
import BrandButton from '../shared/brand-button';
import NumericInput from '../shared/numeric-input';

function HomePage() {
  const navigate = useNavigate();
  const [bill, setBill] = React.useState('');
  const [isFormValid, setIsFormValid] = React.useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    navigate(`calc/${billToUrlParam(bill)}`, { replace: true });
  };

  const handleBillChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { value } = event.currentTarget;
    const valueAsCurrency = toCurrency(value);
    setBill(valueAsCurrency);
    setIsFormValid(Boolean(valueAsCurrency) && valueAsCurrency !== '0.00');
  };

  return (
    <section className="grow flex flex-col items-center justify-around w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="grow flex flex-col items-center justify-around w-full"
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
          className="md:my-7 text-6xl md:text-5xl font-extralight"
        />
        <BrandButton type="submit" disabled={!isFormValid}>
          Next
        </BrandButton>
      </form>
    </section>
  );
}

export default HomePage;
