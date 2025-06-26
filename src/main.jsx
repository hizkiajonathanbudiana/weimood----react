// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { store } from "./app/store"; // Import store
// import { Provider } from "react-redux"; // Import Provider

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId="621781117019-0qtib4f9busqj4khtdnqiso5ec0konoh.apps.googleusercontent.com">
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </GoogleOAuthProvider>
//   </StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router"; // 1. Import BrowserRouter
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

// Import file CSS utama jika ada
// import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Provider dari Redux membungkus semuanya */}
    <GoogleOAuthProvider clientId="621781117019-0qtib4f9busqj4khtdnqiso5ec0konoh.apps.googleusercontent.com">
      <Provider store={store}>
        {/* 3. BrowserRouter membungkus App */}
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
