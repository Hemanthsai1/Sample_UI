import React, { useState } from "react";
import { TbFileAi } from "react-icons/tb";
import { FiX } from "react-icons/fi";
import "../../styles/summarization.css";
import API from '../../api/api';

const SummarizationPanel = ({ onClose }) => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter a paragraph to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await API.post("/api/summarize", { prompt: inputText.trim() });
      const data = response.data;
      
      if (!data || !data.summary) throw new Error("No summary returned from server");

      setSummary(data.summary);
    } catch (err) {
      // console.error("Error generating summary:", err);

      let errorMessage = "Failed to generate summary. Please try again.";
      if (err.response) {
        errorMessage = err.response.data?.message || `HTTP Error ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please try again.";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarization-panel">
      <div className="panel-header">
        <div className="header-left">
          <TbFileAi className="panel-icon" />
          <h3>Summarization</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>
      </div>

      <div className="summaries-content">
        <div className="input-section">
          <textarea
            className="input-field"
            placeholder="Enter paragraph to summarize..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
          />

          <button className="summarize-btn" onClick={handleSummarize} disabled={loading}>
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          {error && <div className="error-message">{error}</div>}

          {!loading && summary && (
            <div className="summary-output">
              <h5>Generated Summary</h5>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarizationPanel;