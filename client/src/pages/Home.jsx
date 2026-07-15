import "./login.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome 🎉</h1>
        <p>You have successfully logged in.</p>

        <button
          className="login-btn"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Home;