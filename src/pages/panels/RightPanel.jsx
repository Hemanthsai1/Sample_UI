import React from "react";
import { TbFileAi } from "react-icons/tb";
import { FiSearch, FiEdit3, FiGitCommit, FiFileText } from "react-icons/fi";
import { VscOpenPreview } from "react-icons/vsc";
import "../../styles/rightpanel.css";

const RightPanel = ({
  currentStage,
  hasChanges,
  isFilling,
  downloads,
  onFill,
  onDownload,
  onPanelToggle,
}) => {
  return (
    <>
      {/* Document Editor Header */}
      <div className="panel-title-wrapper">
        <h1 className="panel-title">Document Editor</h1>
      </div>

      {/* Right Panel */}
      <div className="right-panel-container">
        <div className="main-actions">
          <button
            className={`action-btn search-btn ${
              currentStage === "search" ? "active" : ""
            }`}
            onClick={() => onPanelToggle("search")}
          >
            <FiSearch className="action-icon" />
            <span>Search</span>
          </button>

          <button
            className={`action-btn edit-btn ${
              currentStage === "edit" ? "active" : ""
            }`}
            onClick={() => onPanelToggle("edit")}
          >
            <FiEdit3 className="action-icon" />
            <span>Edit & Review</span>
          </button>

          <button
            className={`action-btn track-btn ${
              currentStage === "track" ? "active" : ""
            }`}
            onClick={() => onPanelToggle("track")}
          >
            <FiGitCommit className="action-icon" />
            <span>Track Changes</span>
          </button>

          <button
            className={`action-btn summarization-btn ${
              currentStage === "summarization" ? "active" : ""
            }`}
            onClick={() => onPanelToggle("summarization")}
          >
            <TbFileAi className="action-icon" />
            <span>Summarization</span>
          </button>

            <button
            className={`action-btn summarization-btn`}
          >
            <VscOpenPreview className="action-icon" />
            <span>Data Source Preview</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RightPanel;
