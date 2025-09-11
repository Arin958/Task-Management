const FormTextarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  isFocused, 
  placeholder,
  rows = "4"
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full px-4 py-3 rounded-lg border ${
            isFocused 
              ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900/30" 
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200 outline-none`}
          placeholder={placeholder}
          rows={rows}
        />
      </div>
    </div>
  );
};

export default FormTextarea;