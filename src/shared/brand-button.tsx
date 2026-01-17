import * as React from 'react';

export function BrandButton(props: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className="bg-tipsy shadow-tipsy flex w-full items-center justify-evenly p-3 text-2xl font-extralight text-white disabled:opacity-70 md:text-3xl"
      {...props}
    />
  );
}
