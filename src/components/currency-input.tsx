import React from 'react';
import NumberInput from './number-input';

const CurrencyInput: React.FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement>
> = props => <NumberInput placeholder="0.00" {...props} />;

export default CurrencyInput;
