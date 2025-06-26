import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  verifyStatus: "idle",
  resendStatus: "idle",
  error: null,
  successMessage: "",
};

export const verifyCode = createAsyncThunk(
  "verify/verifyCode",
  async ({ verifyCode }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/verify", { verifyCode });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  "verify/resendCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/verify/send");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const verifySlice = createSlice({
  name: "verify",
  initialState,
  reducers: {
    resetVerifyState: (state) => {
      state.verifyStatus = "idle";
      state.resendStatus = "idle";
      state.error = null;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyCode.pending, (state) => {
        state.verifyStatus = "loading";
        state.error = null;
        state.successMessage = "";
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.verifyStatus = "succeeded";
        state.successMessage = action.payload.message;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.error = action.payload.message;
      })

      .addCase(resendVerificationCode.pending, (state) => {
        state.resendStatus = "loading";
        state.error = null;
      })
      .addCase(resendVerificationCode.fulfilled, (state, action) => {
        state.resendStatus = "succeeded";
        console.log("Resend success:", action.payload.message);
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.resendStatus = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { resetVerifyState } = verifySlice.actions;

export default verifySlice.reducer;
