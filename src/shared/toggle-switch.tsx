import { clsx } from 'clsx';
import { Icon } from '#/src/icons/icon';

export function ToggleSwitch({
  id,
  checked,
  onChange,
  disabled,
  className,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'group relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full select-none',
        'has-checked:bg-tipsy bg-gray-300 transition-colors duration-200',
        'dark:has-checked:bg-tipsy dark:bg-gray-600',
        'has-focus-visible:ring-tipsy has-focus-visible:ring-2 has-focus-visible:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {/* Handle */}
      <span
        className={clsx(
          'absolute top-1 left-1 flex h-6 w-6 items-center justify-center',
          'rounded-full bg-white shadow-md',
          'transition-transform duration-200 group-has-checked:translate-x-6',
        )}
      >
        {/* X icon (visible when unchecked) */}
        <Icon
          name="lucide-x"
          size="0.875rem"
          className="absolute text-gray-400 transition-opacity duration-200 group-has-checked:opacity-0"
        />
        {/* Check icon (visible when checked) */}
        <Icon
          name="lucide-check"
          size="0.875rem"
          className="text-tipsy absolute opacity-0 transition-opacity duration-200 group-has-checked:opacity-100"
        />
      </span>
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="absolute inset-0 cursor-pointer appearance-none focus:outline-hidden disabled:cursor-not-allowed"
      />
    </div>
  );
}
