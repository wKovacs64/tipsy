import React from 'react';
import NumberInput from '../styles/number-input';

const NumericInput: React.FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement>
> = props => <NumberInput type="text" inputMode="numeric" {...props} />;

export default NumericInput;
