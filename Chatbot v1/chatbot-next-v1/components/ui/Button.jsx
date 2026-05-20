export default function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-2xl
        font-medium
        transition-all duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        hover:scale-[1.02]
        active:scale-[0.98]
        ${className}
      `}
    >
      {children}
    </button>
  );
}