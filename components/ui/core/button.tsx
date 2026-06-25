export const PrimaryButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[34px] overflow-hidden rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 text-sm font-semibold text-blue-300 transition-all hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-blue-200 focus:outline-none active:scale-95"
    >
      {children}
    </button>
  );
};

export const SuccessButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[34px] overflow-hidden rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-300 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none active:scale-95"
    >
      {children}
    </button>
  );
};
