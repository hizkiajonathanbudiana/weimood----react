import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { clearRedirect } from "./features/app/appSlice";
import { fetchCurrentUser } from "./features/auth/authSlice"; // thunk baru
import Dashboard from "./pages/Dashboard";
import VerifyPage from "./pages/Verify";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const { redirectTo } = useSelector((state) => state.app);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 1️⃣ fetch user saat App mount
  useEffect(() => {
    dispatch(fetchCurrentUser()).finally(() => setLoading(false));
  }, [dispatch]);

  // 2️⃣ handle redirect dari anywhere
  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
      dispatch(clearRedirect());
    }
  }, [redirectTo, navigate, dispatch]);

  if (loading) {
    return <div>Loading…</div>;
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </>
      )}
    </Routes>
  );
}

export default App;
