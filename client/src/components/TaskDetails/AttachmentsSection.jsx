import React from "react";
import { Image, FileText, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const AttachmentsSection = ({ selectedTask }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    
  };

  const downloadFile = async (filePath, fileName) => {
    if(!filePath) {
      toast.error("File path is required");
    };
  try {
    const response = await axios.get(`${API}/api/download`, {
      withCredentials: true,
      params: { path: filePath },
      responseType: "blob", // important for files
    });

    // Create a blob URL
   const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // use original name
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Download started!");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Failed to download file");
  }
};

const openFileInNewTab = (url, mimeType) => {
  if (!url) {
    toast.error("File URL not available");
    return;
  }

  if (mimeType === "application/pdf") {
    // Open Cloudinary PDF directly
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    // Fallback: open normally
    window.open(url, "_blank", "noopener,noreferrer");
  }
};


  if (!selectedTask.attachments || selectedTask.attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
        Attachments ({selectedTask.attachments.length})
      </h3>
      <div className="space-y-3">
        {selectedTask.attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {attachment.mimeType.includes("image") ? (
                <Image className="w-5 h-5 text-blue-500" />
              ) : (
                <FileText className="w-5 h-5 text-blue-500" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs">
                  {attachment.originalName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(attachment.size)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openFileInNewTab(attachment.url, attachment.mimeType)}
                className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            <button
  onClick={() => downloadFile(attachment.filePath, attachment.originalName)}
  className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
  title="Download"
>
  <Download className="w-4 h-4" />
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsSection;
