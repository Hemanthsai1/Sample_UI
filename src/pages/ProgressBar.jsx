import React from "react";
import "../styles/progressBar.css";

function ProgressBar({ progress, status, isVisible }) {
  return (
    isVisible && (
      <div className="progress-overlay">
        <div className="progress-container">
          <h3>Processing Document</h3>
          
          <div className="progress-bar-wrapper">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="progress-info">
            <span className="progress-percentage">{progress}%</span>
            <span className="progress-status">{status}</span>
          </div>
          
          <div className="progress-steps">
            <div className={`step ${progress >= 10 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Reading</span>
            </div>
            <div className={`step ${progress >= 25 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Processing</span>
            </div>
            <div className={`step ${progress >= 60 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Filling</span>
            </div>
            <div className={`step ${progress >= 85 ? 'active' : ''}`}>
              <span className="step-number">4</span>
              <span className="step-label">Finalizing</span>
            </div>
            <div className={`step ${progress >= 100 ? 'active' : ''}`}>
              <span className="step-number">✓</span>
              <span className="step-label">Complete</span>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default ProgressBar;