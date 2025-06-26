// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // <— harus 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { clearRedirect } from "./features/app/appSlice";
import { fetchUser } from "./features/auth/authSlice"; // <— import thunk-nya

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { redirectTo } = useSelector((s) => s.app);
  const user = useSelector((s) => s.auth.user);

  // 🔑 fetch current user sekali pas mount
  useEffect(() => {
    dispatch(fetchUser()).finally(() => setLoading(false));
  }, [dispatch]);

  // handle global redirect dari appSlice
  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
      dispatch(clearRedirect());
    }
  }, [redirectTo, navigate, dispatch]);

  if (loading) return <div>Loading…</div>;

  return (
    <Routes>
      {user ? (
        // protected routes
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </>
      ) : (
        // public routes
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </>
      )}
    </Routes>
  );
}
export default App;
