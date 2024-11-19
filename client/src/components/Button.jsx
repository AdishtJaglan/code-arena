/* eslint-disable react/prop-types */
const Button = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800",
    secondary:
      "border border-gray-700 text-gray-300 hover:bg-gray-800 active:bg-gray-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
