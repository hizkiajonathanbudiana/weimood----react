import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { clearRedirect } from "./features/app/appSlice";

import Dashboard from "./pages/Dashboard";
import VerifyPage from "./pages/Verify";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { redirectTo } = useSelector((state) => state.app);

  useEffect(() => {
    if (redirectTo) {
      console.log(`Redirecting to: ${redirectTo}`);
      navigate(redirectTo);
      dispatch(clearRedirect());
    }
  }, [redirectTo, navigate, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;

// // src/App.jsx
// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate } from "react-router"; // <-- react-router-dom
// import { useSelector, useDispatch } from "react-redux";
// import { clearRedirect } from "./features/app/appSlice";
// import { fetchUser } from "./features/auth/authSlice"; // <-- thunk fetchUser

// import Dashboard from "./pages/Dashboard";
// import VerifyPage from "./pages/Verify";
// import ProfilePage from "./pages/ProfilePage";
// import AuthPage from "./pages/AuthPage";
// import LandingPage from "./pages/LandingPage";

// export default function App() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const { redirectTo } = useSelector((s) => s.app);
//   const user = useSelector((s) => s.auth.user);

//   // Fetch current user sekali pas mount
//   useEffect(() => {
//     dispatch(fetchUser()).finally(() => setLoading(false));
//   }, [dispatch]);

//   // Handle global redirects (e.g. ke /auth, /verify, /profile)
//   useEffect(() => {
//     if (redirectTo) {
//       navigate(redirectTo);
//       dispatch(clearRedirect());
//     }
//   }, [redirectTo, navigate, dispatch]);

//   if (loading) return <div>Loading…</div>;

//   return (
//     <Routes>
//       {user ? (
//         // Protected routes
//         <>
//           <Route path="/verify" element={<VerifyPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </>
//       ) : (
//         // Public routes
//         <>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/auth" element={<AuthPage />} />
//         </>
//       )}
//     </Routes>
//   );
// }
