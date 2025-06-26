import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLoginUser } from "../features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import NavBar from "../components/NavBar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil state yang relevan dari Redux store
  const { status, error, user } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    dispatch(googleLoginUser({ token: credentialResponse.credential }));
  };

  // useEffect akan "mendengarkan" perubahan pada state Redux
  // dan bereaksi sesuai kebutuhan.
  useEffect(() => {
    if (status === "succeeded" && user) {
      console.log("Login Redux sukses, navigasi ke dashboard.");
      navigate("/dashboard");
    }
    if (status === "failed" && error) {
      alert("Login gagal: " + error);
    }
  }, [status, user, navigate, error]);

  return (
    <div className="login-container">
      <NavBar />
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Tombol akan disable saat loading */}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => {
          console.log("Google Login Failed");
          alert("Google login gagal dari client-side.");
        }}
      />
    </div>
  );
}

export default Login;
