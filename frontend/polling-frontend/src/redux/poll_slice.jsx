import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

/* ================================
   THUNKS
================================ */

// Fetch all polls for user
export const fetchUserPolls = createAsyncThunk(
  "polls/fetchUserPolls",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("polls/");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching polls");
    }
  }
);

// Fetch single poll detail
export const fetchPollDetail = createAsyncThunk(
  "polls/fetchPollDetail",
  async (pollId, thunkAPI) => {
    try {
      const res = await api.get(`polls/${pollId}/`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching poll detail");
    }
  }
);

// Vote on a poll
export const votePoll = createAsyncThunk(
  "polls/votePoll",
  async ({ pollId, optionId }, thunkAPI) => {
    try {
      const res = await api.post(`polls/${pollId}/vote/`, { option_id: optionId });
      return res.data; //{message: "Vote submitted successfully"}
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error voting");
    }
  }
);

// Fetch poll results (for user view)
export const fetchPollResults = createAsyncThunk(
  "polls/fetchPollResults",
  async (pollId, thunkAPI) => {
    try {
      const res = await api.get(`polls/${pollId}/results/`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching results");
    }
  }
);

// Fetch my votes history
export const fetchMyVotes = createAsyncThunk(
  "polls/fetchMyVotes",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("my-votes/");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching votes");
    }
  }
);

/* ================================
   SLICE
================================ */
const pollSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [],
    currentPoll: null,
    pollResults: null,
    myVotes: [],
    loading: false,
    error: null,
    voteSuccess: null,
  },
  reducers: {
    clearPollError: (state) => {
      state.error = null;
      state.voteSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
        // Fetch User Polls
        .addCase(fetchUserPolls.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUserPolls.fulfilled, (state, action) => {
            state.loading = false;
            state.polls = action.payload;
        })
        .addCase(fetchUserPolls.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Fetch Poll Detail
        .addCase(fetchPollDetail.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchPollDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.currentPoll = action.payload;
        })
        .addCase(fetchPollDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Vote
        .addCase(votePoll.pending, (state) => {
            state.loading = true;
            state.voteSuccess = null;
        })
        .addCase(votePoll.fulfilled, (state, action) => {
            state.loading = false;
            state.voteSuccess = action.payload.message;
        })
        .addCase(votePoll.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // My Votes
        .addCase(fetchMyVotes.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchMyVotes.fulfilled, (state, action) => {
            state.loading = false;
            state.myVotes = action.payload;
        })
        .addCase(fetchMyVotes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Poll Results
        .addCase(fetchPollResults.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchPollResults.fulfilled, (state, action) => {
            state.loading = false;
            state.pollResults = action.payload;
        })
        .addCase(fetchPollResults.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        
        // Listen for Logout to clear poll state
        .addCase('user/logoutUser/fulfilled', (state) => {
            state.polls = [];
            state.currentPoll = null;
            state.pollResults = null;
            state.myVotes = [];
            state.loading = false;
            state.error = null;
            state.voteSuccess = null;
        })
        .addCase('user/logoutUser/rejected', (state) => {
             // Even if logout fails on server, we clear local state
            state.polls = [];
            state.currentPoll = null;
            state.pollResults = null;
            state.myVotes = [];
            state.loading = false;
            state.error = null;
            state.voteSuccess = null;
        });
  },
});

export const { clearPollError } = pollSlice.actions;
export default pollSlice.reducer;
