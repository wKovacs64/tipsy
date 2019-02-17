import React from 'react';
import NumberInput from '../styles/number-input';

const NumericInput: React.FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  const ref = React.useRef<HTMLInputElement>(null);

  return (
    <NumberInput
      type="text"
      inputMode="numeric"
      ref={ref}
      onKeyDown={e => {
        if (e.keyCode === 13 && ref && ref.current) {
          ref.current.blur();
        }
      }}
      {...props}
    />
  );
};

export default NumericInput;
