import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

/* ================================
   THUNKS
================================ */

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("admin/dashboard/");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const createPoll = createAsyncThunk(
  "admin/createPoll",
  async (pollData, thunkAPI) => {
    try {
      const res = await api.post("admin/polls/create/", pollData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAdminPolls = createAsyncThunk(
  "admin/fetchPolls",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("admin/polls/");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPollResults = createAsyncThunk(
    "admin/fetchPollResults",
    async (pollId, thunkAPI) => {
      try {
        const res = await api.get(`polls/${pollId}/results/`);
        return res.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
    }
  );

/* ================================
   SLICE
================================ */
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboardStats: null,
    polls: [],
    pollResults: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.pollResults = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Poll
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Polls
      .addCase(fetchAdminPolls.fulfilled, (state, action) => {
        state.polls = action.payload;
      })

      // Poll Results
      .addCase(fetchPollResults.pending, (state) => {
          state.loading = true;
      })
      .addCase(fetchPollResults.fulfilled, (state, action) => {
          state.loading = false;
          state.pollResults = action.payload;
      });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
