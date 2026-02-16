import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

/* ================================
   REGISTER THUNK
   POST: /register/
================================ */
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("register/", formData);

      return res.data; // {message: "User registered successfully"}
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* ================================
   LOGIN THUNK
   POST: /login/
================================ */
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("login/", formData);

      // Save token in localStorage
      localStorage.setItem("access", res.data.tokens.access);
      localStorage.setItem("refresh", res.data.tokens.refresh);

      return res.data; // user + tokens
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* ================================
   LOGOUT THUNK
================================ */
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const refresh = localStorage.getItem("refresh");
      await api.post("logout/", { refresh });
      return; 
    } catch (error) {
      // Even if API fails, we want to logout locally
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

/* ================================
   AUTH SLICE
================================ */
const userSlice = createSlice({
  name: "user",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    access: localStorage.getItem("access") || null,

    loading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    clearAuthMessage: (state) => {
        state.successMessage = null;
        state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder

      /* ===== REGISTER ===== */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access = action.payload.tokens.access;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      /* ===== LOGOUT ===== */
      .addCase(logoutUser.fulfilled, (state) => {
          state.user = null;
          state.access = null;
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state) => {
          // Force logout even if API fails
          state.user = null;
          state.access = null;
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
      });
  },
});

export const { clearAuthMessage } = userSlice.actions;
export default userSlice.reducer;
