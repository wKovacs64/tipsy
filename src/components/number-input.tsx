import React from 'react';
import StyledNumberInput from '../styles/number-input';

const NumberInput: React.FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ placeholder = '0', ...props }) => (
  <StyledNumberInput
    placeholder={placeholder}
    type="text"
    inputMode="numeric"
    {...props}
  />
);

export default NumberInput;
