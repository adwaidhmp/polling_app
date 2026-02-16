import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/user_slices";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      if (user.is_staff) {
        navigate("/admin/dashboard");
      } else {
        navigate("/polls");
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="glass-card" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px" }}>
        
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem", background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Welcome Back
        </h2>

        {error && (
             <div style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                {error.error || "Login failed"}
            </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-secondary)", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Email Address</label>
            <input
              type="email"
              className="glass-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-secondary)", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Password</label>
            <input
              type="password"
              className="glass-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: "center", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
