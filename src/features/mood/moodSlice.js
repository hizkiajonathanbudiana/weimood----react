// src/features/mood/moodSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  moodHistory: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Fetch the single moods record from backend
export const fetchAllMoods = createAsyncThunk(
  "mood/fetchAllMoods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/moods");
      // response.data = { moods: { happy: 2, ... } }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Log a new mood entry
export const logMood = createAsyncThunk(
  "mood/logMood",
  async (moodName, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/moods", { mood: moodName });
      return response.data.mood;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    resetMoodState: (state) => {
      state.moodHistory = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMoods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllMoods.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Wrap the single record in an array to keep the same shape
        state.moodHistory = [{ moods: action.payload.moods }];
      })
      .addCase(fetchAllMoods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Gagal mengambil data mood.";
      })
      .addCase(logMood.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.moodHistory.findIndex(
          (x) => x.moods.id === updated.id
        );
        if (idx >= 0) {
          state.moodHistory[idx] = { moods: updated };
        } else {
          state.moodHistory.push({ moods: updated });
        }
      });
  },
});

export const { resetMoodState } = moodSlice.actions;
export default moodSlice.reducer;
