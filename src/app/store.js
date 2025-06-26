import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import verifyReducer from "../features/verify/verifySlice";
import profileReducer from "../features/profile/profileSlice";
import appReducer from "../features/app/appSlice";
import moodReducer from "../features/mood/moodSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    chat: chatReducer,
    verify: verifyReducer,
    profile: profileReducer,
    mood: moodReducer,
  },
});
