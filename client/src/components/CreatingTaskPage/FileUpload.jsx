import { Image, FileText, Trash2 } from "lucide-react";

const FileUpload = ({ 
  label, 
  inputRef, 
  onFileUpload, 
  accept, 
  icon, 
  fileType, 
  files, 
  onRemoveFile, 
  maxSize, 
  fileTypesText 
}) => {
  const IconComponent = icon === "image" ? Image : FileText;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={onFileUpload}
          className="hidden"
          accept={accept}
          multiple
        />
        <div className="flex flex-col items-center justify-center">
          <IconComponent className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {fileTypesText} up to {maxSize} each
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected {fileType === "images" ? "Images" : "Documents"}:
          </h4>
          {fileType === "images" ? (
            <div className="grid grid-cols-3 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name}
                    className="h-20 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <div className="text-xs truncate text-gray-600 dark:text-gray-400 mt-1">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;