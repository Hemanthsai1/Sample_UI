import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
// @ts-ignore
import logo from "../assets/favicon.png";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call - replace with actual authentication
    setTimeout(() => {
      setIsLoading(false);
      // For now, just navigate to upload page
      // In production, validate credentials first
      navigate("/upload");
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="gradient-orb login-orb-1"></div>
        <div className="gradient-orb login-orb-2"></div>
        <div className="gradient-orb login-orb-3"></div>
      </div>

      <div className="login-container">
        <div className={`login-card ${isVisible ? "slide-in" : ""}`}>
          <div className="login-header">
            <div className="login-logo">
              <img src={logo} alt="Veritascribe Logo" />
              <h1 className="login-title">Veritascribe</h1>
            </div>
            <p className="login-subtitle">Welcome back! Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="button-loader"></span>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/upload"); }}>
                Get Started
              </a>
            </p>
          </div>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button
            className="guest-button"
            onClick={() => navigate("/upload")}
          >
            Continue as Guest
          </button>
        </div>

        <div className="login-info">
          <h2>Streamline Your Document Workflow</h2>
          <ul className="info-list">
            <li>
              <span className="info-icon">✓</span>
              AI-powered document processing
            </li>
            <li>
              <span className="info-icon">✓</span>
              Real-time progress tracking
            </li>
            <li>
              <span className="info-icon">✓</span>
              Secure and reliable platform
            </li>
            <li>
              <span className="info-icon">✓</span>
              Multiple template support
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;

