// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { fetchUser } from "./features/auth/authSlice";
import { clearRedirect } from "./features/app/appSlice";

import Dashboard from "./pages/Dashboard";
import VerifyPage from "./pages/Verify";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";

function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  const loading = useSelector((s) => s.auth.status === "loading");
  const location = useLocation();

  if (loading) {
    return <div>Loading…</div>;
  }
  if (!user) {
    // kalau belum login, redirect ke /auth
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const user = useSelector((s) => s.auth.user);
  const { redirectTo } = useSelector((s) => s.app);

  useEffect(() => {
    dispatch(fetchUser()).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && redirectTo) {
      navigate(redirectTo);
      dispatch(clearRedirect());
    }
  }, [loading, redirectTo, navigate, dispatch]);

  if (loading) {
    return <div>Loading…</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />

      {/* Protected */}
      <Route
        path="/verify"
        element={
          <ProtectedRoute>
            <VerifyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
