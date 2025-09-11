import { AlertCircle } from "lucide-react";

const FormInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  error, 
  touched, 
  isFocused, 
  required = false, 
  placeholder,
  type = "text"
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full px-4 py-3 rounded-lg border ${
            error && touched 
              ? "border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900/30" 
              : isFocused 
                ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900/30" 
                : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200 outline-none`}
          placeholder={placeholder}
        />
      </div>
      {error && touched && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;