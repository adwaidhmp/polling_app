import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthMessage, logoutUser } from "../redux/user_slices";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearAuthMessage()); 
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(logoutUser()); // Ensure previous session is cleared so Login page doesn't redirect
        navigate("/login");
        dispatch(clearAuthMessage()); 
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="glass-card" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px" }}>
        
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem", background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Create Account
        </h2>

        {error && (
             <div style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                {JSON.stringify(error)}
            </div>
        )}

        {successMessage && (
             <div style={{ background: "rgba(16, 185, 129, 0.2)", color: "#6ee7b7", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                {successMessage}
            </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-secondary)", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Full Name</label>
            <input
              type="text"
              className="glass-input"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

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
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
