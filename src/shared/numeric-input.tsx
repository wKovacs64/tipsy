import * as React from 'react';
import clsx from 'clsx';

function NumericInput(props: React.ComponentProps<'input'>) {
  const { className, ...otherProps } = props;

  return (
    <input
      type="text"
      inputMode="numeric"
      onFocus={(e) => e.currentTarget.select()}
      autoComplete="off"
      autoCorrect="off"
      className={clsx(
        'w-full text-center',
        'bg-transparent focus:placeholder-transparent',
        'focus:border-accent dark:focus:border-accent border-b-2 border-black outline-hidden dark:border-gray-100',
        className,
      )}
      {...otherProps}
    />
  );
}

export default NumericInput;
