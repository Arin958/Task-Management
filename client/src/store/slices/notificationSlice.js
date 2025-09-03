import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const API = import.meta.env.VITE_API_BASE_URL

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/api/notification`, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    "notification/markNotificationAsRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API}/api/notification/${notificationId}/read`, null, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notification/markAllNotificationsAsRead",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API}/api/notifications/read`, null, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map((notification) => {
                    if (notification.id === action.payload.id) {
                        return action.payload;
                    }
                    return notification;
                });
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(markAllNotificationsAsRead.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
                state.notifications = action.payload;
            })
            .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default notificationSlice.reducer;