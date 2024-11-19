/* eslint-disable react/prop-types */
const Input = ({ icon: Icon, label, error, ...props }) => (
  <div className="relative">
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        {...props}
        className={`w-full rounded-lg border bg-gray-800 py-3 pl-10 pr-4 text-gray-100 placeholder-gray-400 transition-colors duration-200 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-700 focus:border-violet-500"
        } focus:outline-none focus:ring-1 focus:ring-violet-500`}
      />
      {label && (
        <label className="absolute -top-2 left-2 bg-gray-900 px-1 text-xs text-gray-400">
          {label}
        </label>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default Input;
