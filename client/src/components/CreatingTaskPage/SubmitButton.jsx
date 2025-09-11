import { Loader2, Plus } from "lucide-react";

const SubmitButton = ({ loading }) => {
  return (
    <div className="pt-2">
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg shadow-sm dark:shadow-gray-900/30 transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Creating Task...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;