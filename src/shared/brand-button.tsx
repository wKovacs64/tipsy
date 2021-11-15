function BrandButton(props: JSX.IntrinsicElements['button']) {
  return (
    <button
      type="button"
      className="flex items-center justify-evenly text-white bg-tipsy shadow-tipsy font-extralight text-2xl md:text-3xl w-full disabled:opacity-70 p-3"
      {...props}
    />
  );
}

export default BrandButton;
