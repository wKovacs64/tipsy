import clsx from 'clsx';

function NumericInput(props: JSX.IntrinsicElements['input']) {
  const { className, ...otherProps } = props;

  return (
    <input
      type="text"
      inputMode="numeric"
      onFocus={(e) => e.currentTarget.select()}
      className={clsx(
        'text-center w-full',
        'bg-transparent focus:placeholder-transparent',
        'border-b-2 border-black dark:border-gray-100 focus:border-accent dark:focus:border-accent outline-none',
        className,
      )}
      {...otherProps}
    />
  );
}

export default NumericInput;
