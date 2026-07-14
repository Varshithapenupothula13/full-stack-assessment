import "./login.css";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Create Account</h2>
        <p>Register to continue</p>

        <div className="input-box">
          <FaUser />
          <input type="text" placeholder="Full Name" />
        </div>

        <div className="input-box">
          <FaEnvelope />
          <input type="email" placeholder="Email Address" />
        </div>

        <div className="input-box">
          <FaLock />
          <input type="password" placeholder="Password" />
        </div>

        <div className="input-box">
          <FaLock />
          <input type="password" placeholder="Confirm Password" />
        </div>

        <button className="login-btn">Register</button>

        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;