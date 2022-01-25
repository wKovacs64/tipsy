import clsx from 'clsx';

function NumericInput(props: JSX.IntrinsicElements['input']) {
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
        'border-b-2 border-black outline-none focus:border-accent dark:border-gray-100 dark:focus:border-accent',
        className,
      )}
      {...otherProps}
    />
  );
}

export default NumericInput;
