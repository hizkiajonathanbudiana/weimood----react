import { createSlice, isRejected } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  redirectTo: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    clearRedirect: (state) => {
      state.redirectTo = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isRejected, (state, action) => {
      const errorMessage = action.payload?.message || action.error?.message;
      state.error = errorMessage;

      console.log("Global error handler caught:", errorMessage);

      switch (errorMessage) {
        case "User not verified":
          state.redirectTo = "/verify";
          break;
        case "Profile not found":
          state.redirectTo = "/profile";
          break;
        case "Invalid or expired token":
        case "No token provided, please login":
          state.redirectTo = "/auth";
          break;
        default:
          state.redirectTo = null;
          break;
      }
    });
  },
});

export const { clearRedirect } = appSlice.actions;
export default appSlice.reducer;
