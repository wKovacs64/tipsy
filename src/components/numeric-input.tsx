import React from 'react';
import mergeRefs from '@quid/merge-refs';
import NumberInput from '../elements/number-input';

const NumericInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<typeof NumberInput>
>((props, userRef) => {
  const ref = React.useRef<HTMLInputElement>(null);

  return (
    <NumberInput
      type="text"
      inputMode="numeric"
      ref={mergeRefs(ref, userRef)}
      onKeyDown={(e) => {
        if (e.keyCode === 13 && ref && ref.current) {
          ref.current.blur();
        }
      }}
      onFocus={(e) => e.target.select()}
      {...props}
    />
  );
});

export default NumericInput;
