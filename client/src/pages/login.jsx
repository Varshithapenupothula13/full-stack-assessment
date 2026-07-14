import "./login.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to continue</p>

        <div className="input-box">
          <FaEnvelope />
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="input-box">
          <FaLock />
          <input type="password" placeholder="Enter your password" />
        </div>

        <button className="login-btn">Login</button>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;