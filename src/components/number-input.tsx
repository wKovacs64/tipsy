import React from 'react';
import StyledNumberInput from '../styles/number-input';

const NumberInput: React.FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ placeholder = '0', ...props }) => (
  <StyledNumberInput
    placeholder={placeholder}
    type="number"
    pattern="[0-9]"
    {...props}
  />
);

export default NumberInput;
