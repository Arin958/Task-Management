import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../store/slices/taskSlice";
import { fetchUsers } from "../store/slices/userSlice";
import { toast } from "sonner";
import TaskFormHeader from "../components/CreatingTaskPage/TaskFormHeader";
import FormTextarea from "../components/CreatingTaskPage/FormTextarea";
import FormSelect from "../components/CreatingTaskPage/FormSelect";
import DateInput from "../components/CreatingTaskPage/DateInput";
import FileUpload from "../components/CreatingTaskPage/FileUpload";
import AssigneeDropdown from "../components/CreatingTaskPage/AssigneeDropdown";
import SubmitButton from "../components/CreatingTaskPage/SubmitButton";
import FormInput from "../components/CreatingTaskPage/FormInput";
import { AlertCircle } from "lucide-react";


const CreatingTaskPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.task);
  const { teams } = useSelector((state) => state.user);
  

  // Local form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignees: [],
  });

  // File state
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFocused, setIsFocused] = useState({});
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers(user.companyId));
  }, [dispatch, user.companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );
    
    if (validImageFiles.length !== files.length) {
      toast.error("Some files were skipped. Only images under 5MB are allowed.");
    }
    
    setImageFiles(prev => [...prev, ...validImageFiles]);
    e.target.value = '';
  };

const handleDocumentUpload = (e) => {
  const files = Array.from(e.target.files);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  const validDocumentFiles = files.filter(file =>
    allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
  );

  if (validDocumentFiles.length !== files.length) {
    toast.error("Some files were skipped. Only PDFs, Word, and Excel documents under 10MB are allowed.");
  }

  // ✅ Store raw files directly (don’t re-wrap with new File)
  setDocumentFiles(prev => [...prev, ...validDocumentFiles]);

  // Debug
  validDocumentFiles.forEach(file => {
    console.log(`Selected file: ${file.name}, size: ${file.size}, type: ${file.type}`);
  });

  e.target.value = "";
};

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setIsFocused((prev) => ({ ...prev, [name]: false }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required";
        else if (value.trim().length < 3) error = "Title must be at least 3 characters";
        break;
      case "dueDate":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) error = "Due date cannot be in the past";
        }
        break;
      default:
        break;
    }
    
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    
    return error === "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const toggleAssignee = (userId) => {
    setFormData((prev) => {
      if (prev.assignees.includes(userId)) {
        return {
          ...prev,
          assignees: prev.assignees.filter(id => id !== userId)
        };
      } else {
        return {
          ...prev,
          assignees: [...prev.assignees, userId]
        };
      }
    });
  };

  const removeAssignee = (userId, e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.filter(id => id !== userId)
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Mark all fields as touched
  const allTouched = {};
  Object.keys(formData).forEach((key) => {
    allTouched[key] = true;
  });
  setTouched(allTouched);

  if (validateForm()) {
    // Create FormData object to handle file uploads
    const submitData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "assignees" && Array.isArray(formData[key])) {
        // Append each assignee individually instead of stringifying
        formData[key].forEach((assignee) => {
          submitData.append("assignees", assignee);
        });
      } else if (formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    // Append image files
    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    // ✅ Append document files directly (no new File())
    documentFiles.forEach((file) => {
      submitData.append("documents", file);
    });

    // Debug: Log all FormData entries
  
for (let [key, value] of submitData.entries()) {
  if (value instanceof File) {
    console.log("Uploading file:", key, value.name, value.size, value.type);
  } else {
    console.log("Uploading field:", key, value);
  }
}

    try {
      await dispatch(createTask(submitData)).unwrap();
      toast.success("Task created successfully!");

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        assignees: [],
      });
      setImageFiles([]);
      setDocumentFiles([]);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Task creation error:", error);
      toast.error(error.message || "Failed to create task");
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
          
          <TaskFormHeader />
          
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onFocus={() => handleFocus('title')}
              onBlur={handleBlur}
              error={errors.title}
              touched={touched.title}
              isFocused={isFocused.title}
              required
              placeholder="Enter task title"
            />
            
            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onFocus={() => handleFocus('description')}
              onBlur={handleBlur}
              isFocused={isFocused.description}
              placeholder="Describe the task details, requirements, and objectives..."
              rows="4"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "todo", label: "To Do" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "review", label: "Review" },
                  { value: "completed", label: "Completed" }
                ]}
                statusColor={formData.status}
              />
              
              <FormSelect
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "critical", label: "Critical" }
                ]}
                priorityColor={formData.priority}
              />
            </div>
            
            <DateInput
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              onFocus={() => handleFocus('dueDate')}
              onBlur={handleBlur}
              error={errors.dueDate}
              touched={touched.dueDate}
              isFocused={isFocused.dueDate}
            />
            
            <div className="space-y-4">
              <FileUpload
                label="Attach Images"
                inputRef={imageInputRef}
                onFileUpload={handleImageUpload}
                accept="image/*"
                icon="image"
                fileType="images"
                files={imageFiles}
                onRemoveFile={removeImage}
                maxSize="5MB"
                fileTypesText="PNG, JPG, GIF"
              />
              
              <FileUpload
                label="Attach Documents"
                inputRef={documentInputRef}
                onFileUpload={handleDocumentUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                icon="file"
                fileType="documents"
                files={documentFiles}
                onRemoveFile={removeDocument}
                maxSize="10MB"
                fileTypesText="PDF, DOC, DOCX, XLS, XLSX"
              />
            </div>
            
            {(user?.role === "admin" || user?.role === "manager" || user?.role === "superadmin") && (
              <AssigneeDropdown
                teams={teams}
                assignees={formData.assignees}
                showDropdown={showAssigneeDropdown}
                onToggleDropdown={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                onToggleAssignee={toggleAssignee}
                onRemoveAssignee={removeAssignee}
              />
            )}
            
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" />
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error creating task
                  </h3>
                </div>
                <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error.message}</p>
              </div>
            )}
            
            <SubmitButton loading={loading} />
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatingTaskPage;