import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
// @ts-ignore
import logo from "../assets/favicon.png";
import { FaRocket, FaFileAlt, FaChartLine, FaShieldAlt, FaSync, FaMagic, FaSearch, FaEdit, FaHistory, FaLayerGroup, FaDatabase } from "react-icons/fa";

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
      description: "Search anything in your document with real-time highlighting and match counting. Find specific terms, phrases, or sections instantly.",
      image: "/Search.png"
    },
    {
      icon: <FaEdit />,
      title: "Edit & Review",
      description: "Edit and review anything in your document with live updates. Make changes to fields, tables, and content, then save your changes instantly.",
      image: "/Edit_review.png"
    },
    {
      icon: <FaHistory />,
      title: "Track Changes",
      description: "Track changes option that monitors what is changed in your document. See all modifications with visual diff showing added, removed, and modified content.",
      image: "/trackchanges.png"
    },
    {
      icon: <FaMagic />,
      title: "AI Summarization",
      description: "Summarization using AI for anything in your document. Get intelligent summaries of sections or entire documents with key points extracted automatically.",
      image: "/summarize.png"
    },
    {
      icon: <FaLayerGroup />,
      title: "Customize Section",
      description: "Add or remove sections in your document based on your requirements. Dynamically customize document structure by inserting new sections or removing unnecessary ones with ease.",
      image: "/Customize_Section.png"
    },
    {
      icon: <FaDatabase />,
      title: "Multi-input Template Processing",
      description: "Process a single template with multiple data sources to efficiently fill your document. Combine data from various sources into one comprehensive document, streamlining your workflow and reducing manual data entry.",
      image: "/Multi-input Template processing.png"
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src={logo} alt="VeritaScribe Logo" />
            <span className="logo-text">VeritaScribe</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <button
              className="nav-get-started-btn"
              onClick={() => navigate("/demo")}
            >
              Schedule a Demo
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

      {/* Regulatory & Productivity Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <h2 className="section-title">Regulatory & Productivity Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaRocket />
              </div>
              <h3 className="benefit-title">Productivity & Speed</h3>
              <p className="benefit-description">
                Save hours of manual work as AI completes document tasks in minutes, accelerating reviews, approvals, and overall workflows.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaShieldAlt />
              </div>
              <h3 className="benefit-title">Accuracy & Compliance</h3>
              <p className="benefit-description">
                Eliminate human errors with reliable, compliant, and consistent documentation you can trust.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaMagic />
              </div>
              <h3 className="benefit-title">Instant Understanding</h3>
              <p className="benefit-description">
                Quickly grasp long and complex documents through AI-powered summaries and insights in seconds.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaLayerGroup />
              </div>
              <h3 className="benefit-title">Smart Document Customization & Collaboration</h3>
              <p className="benefit-description">
                Easily update default documents for different products, enable smooth team collaboration, and focus on high-value tasks like scientific review and analysis.
              </p>
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
                <div className="feature-image-container">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="feature-image"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      console.error(`Failed to load image: ${feature.image}`);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="Veritascribe Logo" />
            <span>VeritaScribe</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
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

