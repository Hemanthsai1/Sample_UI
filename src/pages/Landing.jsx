import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
// @ts-ignore
import logo from "../assets/favicon.png";
import { FaRocket, FaFileAlt, FaChartLine, FaShieldAlt, FaSync, FaMagic, FaSearch, FaEdit, FaHistory } from "react-icons/fa";

function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <FaSearch />,
      title: "Advanced Search",
      description: "Search anything in your document with real-time highlighting and match counting. Find specific terms, phrases, or sections instantly."
    },
    {
      icon: <FaEdit />,
      title: "Edit & Review",
      description: "Edit and review anything in your document with live updates. Make changes to fields, tables, and content, then save your changes instantly."
    },
    {
      icon: <FaHistory />,
      title: "Track Changes",
      description: "Track changes option that monitors what is changed in your document. See all modifications with visual diff showing added, removed, and modified content."
    },
    {
      icon: <FaMagic />,
      title: "AI Summarization",
      description: "Summarization using AI for anything in your document. Get intelligent summaries of sections or entire documents with key points extracted automatically."
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src={logo} alt="Veritascribe Logo" />
            <span className="logo-text">Veritascribe</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            {/* <button className="nav-login-btn" onClick={() => navigate("/login")}>
              Login
            </button> */}
            <button
              className="nav-get-started-btn"
              onClick={() => {
                window.location.href = "https://veritascribe.azurewebsites.net/login";
              }}
            >
              Get Started
            </button>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className={`hero-content ${isVisible ? "fade-in" : ""}`}>
          <h1 className="hero-title">
            Transform Your
            <span className="gradient-text"> Document Workflow</span>
          </h1>
          <p className="hero-subtitle">
            AI-powered document drafting and automation platform that saves you time
            and ensures accuracy in every document you create.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/templates")}>
              See Samples
              <FaRocket className="btn-icon" />
            </button>
              <button className="btn-primary"  onClick={() => {
                window.location.href = "https://veritascribe.azurewebsites.net/signup";
              }}>
              Sign In
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Documents Processed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
     
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to streamline your document workflow
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Select Template</h3>
                <p>Choose from our library of professional templates or upload your own document</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Upload Data Source</h3>
                <p>Provide your data in Excel or Word format for automatic filling</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>AI Processing</h3>
                <p>Our AI engine processes and fills your document with precision</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Review & Download</h3>
                <p>Review your completed document and download when ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Workflow?</h2>
          <p className="cta-subtitle">
            Join thousands of professionals who trust Veritascribe for their document needs
          </p>
          <center>
            <button
              className="btn-primary btn-large"
              onClick={() => {
                window.location.href = "https://veritascribe.azurewebsites.net/login";
              }}
            >
              Get Started Now
              <FaRocket className="btn-icon" />
            </button>
          </center>

        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="Veritascribe Logo" />
            <span>Veritascribe</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="https://veritascribe.azurewebsites.net/login">Login</a>
          </div>
          <div className="footer-copyright">
            © 2026 Veritascribe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

