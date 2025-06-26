import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import Toastify from "toastify-js";

import {
  loginUser,
  googleLoginUser,
  registerUser,
} from "../features/auth/authSlice";

// --- STYLES & ICONS (Best practice: keep them co-located or in a separate file) ---

// Dynamic aura background animations.

// Reusable SVG Icon component.
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Google Icon component.
const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
  >
    <path
      fill="currentColor"
      d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 398.7 0 256S111.8 0 244 0c69.8 0 131.3 28.5 175.2 74.2L340.5 150.2C311.5 123.8 279.1 112 244 112c-73.8 0-134.3 60.3-134.3 134.8s60.5 134.7 134.3 134.7c86.3 0 112-61.7 115.6-93.1H244v-64.8h243.6c1.3 12.8 2.4 25.4 2.4 38.8z"
    />
  </svg>
);

// --- NOTIFICATION SERVICE ---

// A sleek, on-brand toast notification system.
const showToast = (message, type = "info") => {
  const backgrounds = {
    success: "linear-gradient(135deg, #dcfce7, #ccfbf1)", // green-100, teal-100
    error: "linear-gradient(135deg, #fee2e2, #ffedd5)", // red-100, orange-100
    info: "linear-gradient(135deg, #f3e8ff, #fecaca)", // purple-100, rose-100
  };

  const borders = {
    success: "rgb(74 222 128)", // green-400
    error: "rgb(248 113 113)", // red-400
    info: "rgb(192 132 252)", // purple-400
  };

  Toastify({
    text: message,
    duration: 4000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: backgrounds[type] || backgrounds["info"],
      color: "#374151", // gray-700
      fontFamily: "sans-serif",
      fontSize: "15px",
      fontWeight: "600",
      padding: "14px 24px",
      borderRadius: "1rem",
      border: `1px solid ${borders[type] || borders["info"]}`,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
  }).showToast();
};

// --- MAIN AUTHENTICATION PAGE COMPONENT ---

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);

  // Effect to handle navigation and feedback toasts
  useEffect(() => {
    // Navigate to dashboard on successful login
    if (status === "succeeded" && user) {
      if (mode === "login" || (mode === "register" && user)) {
        showToast("Welcome back!", "success");
        navigate("/dashboard");
      }
    }

    // On successful registration, switch to login mode and notify user
    if (mode === "register" && status === "succeeded" && !user) {
      showToast("Registration successful! Please log in.", "success");
      setMode("login");
      setEmail("");
      setPassword("");
    }

    // Show error toast on failure
    if (status === "failed" && error) {
      showToast(error, "error");
    }
  }, [status, error, user, navigate, mode]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ email, password }));
    }
  };

  const handleGoogleSuccess = (res) => {
    dispatch(googleLoginUser({ token: res.credential }));
  };

  const handleGoogleError = () => {
    showToast("Google login failed. Please try again.", "error");
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setEmail("");
    setPassword("");
  };

  const isLoading = status === "loading";

  return (
    <>
      <main className="relative min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden font-sans">
        {/* Aura Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-purple-200 rounded-full filter blur-3xl opacity-50 animate-aura-1"></div>
          <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-rose-200 rounded-full filter blur-3xl opacity-50 animate-aura-2"></div>
          <div className="absolute top-[20%] right-[15%] w-64 h-64 lg:w-80 lg:h-80 bg-teal-200 rounded-full filter blur-3xl opacity-40 animate-aura-3"></div>
        </div>

        {/* Frosted Glass Auth Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-white/20 shadow-lg">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                {mode === "login" ? "Find Your Rhythm" : "Create Your Account"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {mode === "login"
                  ? "Log in to tune into your personalized day"
                  : "Join us to start your wellness journey"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 pointer-events-none">
                  <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </div>
                <input
                  type="text"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-transparent rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 pointer-events-none">
                  <Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-transparent rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 font-semibold text-white bg-gray-800 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transform active:scale-[0.98] transition-all duration-200 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? mode === "login"
                    ? "Logging In..."
                    : "Creating Account..."
                  : mode === "login"
                  ? "Continue"
                  : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-xs font-light text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                shape="pill"
                size="large"
              />
            </div>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                onClick={toggleMode}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 hover:underline transition-colors duration-200"
              >
                {mode === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Log In"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
