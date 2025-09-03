// src/redux/invitationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;;

// --- Async Thunks --- //
export const validateInvitation = createAsyncThunk(
  "invitation/validateInvitation",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/invitation/validate/${token}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Validation failed");
    }
  }
);

export const registerWithInvitation = createAsyncThunk(
  "invitation/registerWithInvitation",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/invitation/register`, payload, {
        withCredentials: true, // for JWT cookies
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const generateInvitationLink = createAsyncThunk(
  "invitation/generateInvitationLink",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/invitation/generate`, payload ,{
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Invitation generation failed");
    }
  }
)

// --- Slice --- //
const invitationSlice = createSlice({
  name: "invitation",
  initialState: {
    invitation: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetInvitationState: (state) => {
      state.invitation = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // validateInvitation
    builder
      .addCase(validateInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateInvitation.fulfilled, (state, action) => {
        state.loading = false;
        state.invitation = action.payload;
      })
      .addCase(validateInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // registerWithInvitation
    builder
      .addCase(registerWithInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerWithInvitation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.invitation = action.payload;
      })
      .addCase(registerWithInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // generateInvitationLink
      .addCase(generateInvitationLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(generateInvitationLink.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.invitation = action.payload;
      })
      .addCase(generateInvitationLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetInvitationState } = invitationSlice.actions;
export default invitationSlice.reducer;
