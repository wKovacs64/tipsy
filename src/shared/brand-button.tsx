function BrandButton(props: JSX.IntrinsicElements['button']) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-evenly bg-tipsy p-3 text-2xl font-extralight text-white shadow-tipsy disabled:opacity-70 md:text-3xl"
      {...props}
    />
  );
}

export default BrandButton;
