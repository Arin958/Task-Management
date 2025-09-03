import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchForBosss = createAsyncThunk(
    "dashboard/fetchForBosss",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/api/dashboard/boss`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const fetchForEmployee = createAsyncThunk(
    "dashboard/fetchForEmployee",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/api/dashboard/employee`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        boss: null,
        employee: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchForBosss.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchForBosss.fulfilled, (state, action) => {
                state.loading = false;
                state.boss = action.payload;
            })
            .addCase(fetchForBosss.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchForEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchForEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employee = action.payload;
            })
            .addCase(fetchForEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;