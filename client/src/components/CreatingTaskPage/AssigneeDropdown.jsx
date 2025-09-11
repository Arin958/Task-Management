import { User, ChevronDown, X, Check } from "lucide-react";

const AssigneeDropdown = ({ 
  teams, 
  assignees, 
  showDropdown, 
  onToggleDropdown, 
  onToggleAssignee, 
  onRemoveAssignee 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <User className="h-4 w-4 mr-1" />
        Assign To
      </label>
      
      {assignees.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {assignees.map(userId => {
            const user = teams.find(member => member._id === userId);
            return user ? (
              <div key={userId} className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm">
                <span>{user.name}</span>
                <button 
                  type="button"
                  onClick={(e) => onRemoveAssignee(userId, e)}
                  className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : null;
          })}
        </div>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={onToggleDropdown}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-gray-100 flex items-center justify-between transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
        >
          <span>Select team members</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {teams.map((member) => (
              <div
                key={member._id}
                onClick={() => onToggleAssignee(member._id)}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  assignees.includes(member._id) 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' 
                    : ''
                }`}
              >
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                </div>
                {assignees.includes(member._id) && (
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Click to select team members. Selected members will appear above.
      </p>
    </div>
  );
};

export default AssigneeDropdown;