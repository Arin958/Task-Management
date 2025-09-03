import React from "react";

const CommentsTab = ({ task, newComment, setNewComment, handleAddComment }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Comments</h3>
      <div className="space-y-4 mb-6">
        {task.comments && task.comments.length > 0 ? (
          task.comments.map(comment => (
            <div key={comment._id} className="flex">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{comment.user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
        )}
      </div>
      <div className="flex">
        <img
          src="https://i.pravatar.cc/40?u=you"
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            rows="2"
          />
          <button
            onClick={handleAddComment}
            disabled={newComment.trim() === ""}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsTab;