import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user_slices";
import adminReducer from "./admin_slice";
import pollReducer from "./poll_slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    polls: pollReducer,
  },
});
