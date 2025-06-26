import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Toastify from "toastify-js";

import {
  verifyCode,
  resendVerificationCode,
  resetVerifyState,
} from "../features/verify/verifySlice";

// --- STYLES & ICONS ---

// --- NOTIFICATION SERVICE ---

// On-brand toast notification system.
const showToast = (message, type = "info") => {
  const backgrounds = {
    success: "linear-gradient(135deg, #dcfce7, #ccfbf1)",
    error: "linear-gradient(135deg, #fee2e2, #ffedd5)",
    info: "linear-gradient(135deg, #f3e8ff, #fecaca)",
  };

  const borders = {
    success: "rgb(74 222 128)",
    error: "rgb(248 113 113)",
    info: "rgb(192 132 252)",
  };

  Toastify({
    text: message,
    duration: 4000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: backgrounds[type] || backgrounds.info,
      color: "#374151",
      fontFamily: "sans-serif",
      fontSize: "15px",
      fontWeight: "600",
      padding: "14px 24px",
      borderRadius: "1rem",
      border: `1px solid ${borders[type] || borders.info}`,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
  }).showToast();
};

// --- MAIN VERIFICATION PAGE COMPONENT ---

function VerifyPage() {
  const [code, setCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verifyStatus, resendStatus, error, successMessage } = useSelector(
    (state) => state.verify
  );

  // Effect to handle feedback and navigation
  useEffect(() => {
    if (verifyStatus === "succeeded") {
      showToast(successMessage || "Verification successful!", "success");
      const timer = setTimeout(() => {
        dispatch(resetVerifyState());
        navigate("/login");
      }, 2000); // Shorten redirect time after toast
      return () => clearTimeout(timer);
    }
    if (verifyStatus === "failed" && error) {
      showToast(error, "error");
    }
  }, [verifyStatus, successMessage, error, navigate, dispatch]);

  // Effect to show feedback on resend action
  useEffect(() => {
    if (resendStatus === "succeeded" && successMessage) {
      showToast(successMessage, "info");
    }
    if (resendStatus === "failed" && error) {
      showToast(error, "error");
    }
  }, [resendStatus, successMessage, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetVerifyState());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6 && verifyStatus !== "loading") {
      dispatch(verifyCode({ verifyCode: code }));
    }
  };

  const handleResendCode = () => {
    if (resendStatus !== "loading") {
      dispatch(resendVerificationCode());
    }
  };

  const isVerifying = verifyStatus === "loading";
  const isResending = resendStatus === "loading";

  return (
    <>
      <main className="relative min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden font-sans">
        {/* Aura Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[15%] left-[5%] w-72 h-72 bg-teal-200 rounded-full filter blur-3xl opacity-40 animate-aura-1"></div>
          <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-rose-200 rounded-full filter blur-3xl opacity-50 animate-aura-2"></div>
        </div>

        {/* Frosted Glass Card */}
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-white/20 shadow-lg">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Check Your Email
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                We sent a 6-digit verification code to your email address.
              </p>
            </div>

            {/* Verification Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="verification-code" className="sr-only">
                  Verification Code
                </label>
                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength="6"
                  placeholder="------"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/[^0-9]/g, ""))
                  } // Allow only numbers
                  disabled={isVerifying}
                  className="w-full text-center text-3xl tracking-[1rem] font-mono bg-white/50 border-2 border-transparent rounded-xl py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 disabled:bg-gray-200/50"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || code.length !== 6}
                className="w-full py-3 font-semibold text-white bg-gray-800 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transform active:scale-[0.98] transition-all duration-200 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Verify Account"}
              </button>
            </form>

            {/* Resend Code */}
            <div className="text-sm text-gray-600">
              <p>
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="font-semibold text-purple-600 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-wait transition-colors"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default VerifyPage;
