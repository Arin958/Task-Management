import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchCompanyTasks = createAsyncThunk(
  "tasks/fetchCompanyTasks",
  async (
    {
      page = 1,
      limit = 10,
      status = "all",
      priority = "all",
      search = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        limit,
      };

      // Only include filters if not "all" or empty
      if (status && status !== "all") params.status = status;
      if (priority && priority !== "all") params.priority = priority;
      if (search && search.trim() !== "") params.search = search;

      const response = await axios.get(`${API}/api/task`, {
        params, // 👈 send query params
        withCredentials: true,
      });

      return response.data.data; // backend returns { success, data }
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/api/task/createTask`,
        taskData,
        {
          headers: {
             'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create task" }
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/api/task/${taskId}`, updates, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update task" }
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/api/task/${taskId}`, {
        withCredentials: true,
      });
      return taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete task" }
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/api/task/${taskId}`, {
        withCredentials: true,
      });
    
      return response.data.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, comment }, { rejectWithValue }) => {
    try {
      // Your API call to add comment
      const response = await axios.post(`${API}/api/task/${taskId}/comments`, comment, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

const initialState = {
  tasks: [],
  selectedTask: [],
  loading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCompanyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
         if (state.tasks?.docs) {
    state.tasks.docs.push(action.payload);
  } else {
    // If not paginated yet, initialize it
    state.tasks = { docs: [action.payload] };
  }
  state.loading = false;
  state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
  const updatedTask = action.payload;

  if (state.tasks?.docs) {
    const index = state.tasks.docs.findIndex(
      (task) => task._id === updatedTask._id
    );
    if (index !== -1) {
      state.tasks.docs[index] = updatedTask;
    }
  }
  state.loading = false;
  state.error = null;      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
