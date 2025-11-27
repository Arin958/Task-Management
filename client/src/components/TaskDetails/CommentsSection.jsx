import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../store/slices/taskSlice";
import { MessageSquare, Image, Smile, Send, ThumbsUp } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";

const CommentsSection = ({ selectedTask, user }) => {

  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(
        addComment({
          taskId: selectedTask._id,
          comment: {
            text: newComment,
            user: {
              _id: user._id,
              name: user.name,
              avatar: user.avatar,
            },
          },
        })
      );
      setNewComment("");
    }
    toast.success("Comment added successfully!");
  };

  const handleEmojiClick = (emojiData) => {
    setNewComment(newComment + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2" />
        Comments
        {selectedTask.comments && selectedTask.comments.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({selectedTask.comments.length})
          </span>
        )}
      </h2>

      {/* Add Comment */}
      <div className="mb-6 relative">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              rows="3"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <Image className="w-5 h-5" />
                </button>
                <button 
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-1" />
                Comment
              </button>
            </div>
          </div>
        </div>
        
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-12 z-10">
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              width={300}
              height={400}
            />
          </div>
        )}
      </div>

      {/* Comments List */}
      {selectedTask.comments && selectedTask.comments.length > 0 ? (
        <div className="space-y-4">
          {selectedTask.comments.map((comment, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {comment.userId?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {comment.userId?.name || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt || new Date())}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </div>
                <div className="flex items-center mt-1">
                  <button className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    Like
                  </button>
                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;