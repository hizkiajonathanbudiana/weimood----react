import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { getRandomQuote } from "../../api/quotableAPI";

const UNSAVED_KEY = "weimoodchat";

// Load single unsaved chat from localStorage
const loadUnsavedChat = () => {
  const stored = localStorage.getItem(UNSAVED_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse unsaved chat:", error);
    }
  }
  return null;
};

const clearUnsavedChatFromLocal = () => {
  localStorage.removeItem(UNSAVED_KEY);
};

const initialState = {
  dbHistory: [],
  unsavedChat: loadUnsavedChat(), // { text }
  detail: null,
  status: "idle",
  error: null,
  detailStatus: "idle",
  detailError: null,
  quote: { content: "", author: "" },
  quoteStatus: "idle",
};

// Thunks

export const saveChat = createAsyncThunk(
  "chat/saveChat",
  async (text, { rejectWithValue }) => {
    try {
      console.log(text);

      const res = await axiosInstance.post("/chat", {
        text: JSON.stringify(text),
      });
      console.log(res);

      clearUnsavedChatFromLocal();
      return res.data;
    } catch (e) {
      console.error(
        "Save chat API call failed:",
        e.response?.data || e.message
      );
      return rejectWithValue(e.message);
    }
  }
);

export const fetchRandomQuote = createAsyncThunk(
  "chat/fetchRandomQuote",
  async (_, { rejectWithValue }) => {
    try {
      return await getRandomQuote();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/chat");
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const fetchChatDetail = createAsyncThunk(
  "chat/fetchChatDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/chat/${id}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async (chatInput, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/ai", chatInput);
      const text = res.data.mood || res.data.text;
      localStorage.setItem(UNSAVED_KEY, JSON.stringify({ text }));
      return { text };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/chat/${id}`);
      return { id };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearUnsavedChat: (state) => {
      state.unsavedChat = null;
      localStorage.removeItem(UNSAVED_KEY);
    },
    clearDetail: (state) => {
      state.detail = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // History
      .addCase(fetchChatHistory.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchChatHistory.fulfilled, (s, a) => {
        s.status = "idle";
        s.dbHistory = a.payload;
      })
      .addCase(fetchChatHistory.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      // Detail
      .addCase(fetchChatDetail.pending, (s) => {
        s.detailStatus = "loading";
      })
      .addCase(fetchChatDetail.fulfilled, (s, a) => {
        s.detailStatus = "succeeded";
        s.detail = a.payload;
      })
      .addCase(fetchChatDetail.rejected, (s, a) => {
        s.detailStatus = "failed";
        s.detailError = a.payload;
      })
      // Generate AI
      .addCase(sendChatMessage.pending, (s) => {
        s.status = "generating";
        s.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (s, a) => {
        s.status = "idle";
        s.unsavedChat = a.payload;
      })
      .addCase(sendChatMessage.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      // Save
      .addCase(saveChat.pending, (s) => {
        s.status = "saving";
        s.error = null;
      })
      .addCase(saveChat.fulfilled, (s, a) => {
        s.status = "idle";
        s.dbHistory.unshift(a.payload);
        s.unsavedChat = null;
      })
      .addCase(saveChat.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      // Delete
      .addCase(deleteChat.pending, (s) => {
        s.status = "deleting";
        s.error = null;
      })
      .addCase(deleteChat.fulfilled, (s, a) => {
        s.status = "idle";
        s.dbHistory = s.dbHistory.filter((c) => c.id !== a.payload.id);
      })
      .addCase(deleteChat.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      // Quote
      .addCase(fetchRandomQuote.pending, (s) => {
        s.quoteStatus = "loading";
      })
      .addCase(fetchRandomQuote.fulfilled, (s, a) => {
        s.quoteStatus = "succeeded";
        s.quote = a.payload;
      })
      .addCase(fetchRandomQuote.rejected, (s) => {
        s.quoteStatus = "failed";
        s.quote = { content: "Gagal memuat quote.", author: "Sistem" };
      });
  },
});

export const { clearUnsavedChat, clearDetail } = chatSlice.actions;
export default chatSlice.reducer;
