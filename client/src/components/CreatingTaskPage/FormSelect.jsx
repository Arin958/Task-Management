import { ChevronDown } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "todo": return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
    case "in-progress": return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    case "review": return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30";
    case "completed": return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    default: return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "low": return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    case "medium": return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    case "high": return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
    case "critical": return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    default: return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
  }
};

const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  statusColor, 
  priorityColor 
}) => {
  const colorClass = statusColor ? getStatusColor(statusColor) : getPriorityColor(priorityColor);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none transition-all duration-200 outline-none ${colorClass} pr-10`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default FormSelect;