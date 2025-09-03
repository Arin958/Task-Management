import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const initialState = {
    company: null,
    loading: false,
    error: null,
};

export const getCompanyDetails = createAsyncThunk(
    "company/getCompanyDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/api/company/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch company details"
            );
        }
    }
);

export const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCompanyDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompanyDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload;
            })
            .addCase(getCompanyDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default companySlice.reducer;