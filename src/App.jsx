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
      <Route path="/" element={<Dashboard />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
