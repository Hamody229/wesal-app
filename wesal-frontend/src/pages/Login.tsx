import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/wesal-logo.png"; 
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ 
        role: res.data.role,
        name: res.data.name 
      }));

      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" 
         style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      
      <div className="card border-0 shadow-lg p-4 p-md-5 rounded-4" style={{ width: "100%", maxWidth: "420px" }}>
        
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height="50" className="mb-3 rounded-3" />
          <h4 className="fw-bold text-dark mb-1">Welcome Back</h4>
          <p className="text-muted small">Please enter your details to sign in</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center p-2 small mb-4 rounded-3 border-0 bg-danger bg-opacity-10 text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3 position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
              <FiMail size={18} />
            </span>
            <input
              className="form-control form-control-lg ps-5 bg-light border-0"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ fontSize: "0.95rem" }}
            />
          </div>

          <div className="mb-4 position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
              <FiLock size={18} />
            </span>
            <input
              className="form-control form-control-lg ps-5 pe-5 bg-light border-0"
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: "0.95rem" }}
            />
            <span 
              className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted cursor-pointer"
              style={{ cursor: "pointer", zIndex: 10 }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-white" />
            ) : (
              <>
                Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}