import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance"; // Pastikan path ini benar

const initialState = {
  profile: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunk untuk mengambil data profil
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/profile");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Tidak dianggap error jika profil belum ada
      }
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk untuk membuat profil baru
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/profile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk untuk memperbarui profil
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/profile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk untuk menghapus profil
export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/profile");
      return null; // Mengembalikan null untuk menandakan penghapusan berhasil
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Matcher untuk semua action yang sedang 'pending'
      .addMatcher(
        (action) =>
          action.type.startsWith("profile/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      // Matcher untuk semua action yang 'fulfilled'
      .addMatcher(
        (action) =>
          action.type.startsWith("profile/") &&
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.status = "succeeded";
          // Payload akan mengisi atau mengosongkan (jika null) state profil
          state.profile = action.payload;
        }
      )
      // Matcher untuk semua action yang 'rejected'
      .addMatcher(
        (action) =>
          action.type.startsWith("profile/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload?.message || "An unknown error occurred";
        }
      );
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
