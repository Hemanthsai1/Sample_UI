import React, { useEffect, useState } from "react";
import { FiGitCommit, FiX } from "react-icons/fi";
import "../../styles/preview.css";
import API from '../../api/api';

const TrackChangesPanel = ({ 
  onClose, 
  onScrollToChange, 
  editedFilePath, 
  oldFilePath, 
  setActivePanel,
  sessionId //  NEW PROP
}) => {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrackChanges = async () => {
    setLoading(true);
    setError("");

    try {
      if (!editedFilePath) {
        setError("No current document version available.");
        return;
      }

      if (!oldFilePath) {
        setError("No Changes Detected");
        return;
      }

      //  Check session ID
      if (!sessionId) {
        setError("No session ID available. Please try uploading again.");
        return;
      }

      // console.log(`Fetching track changes for session: ${sessionId}`);

      //  Include session_id in request
      const response = await API.post("/api/track_changes", {
        session_id: sessionId, //  ADD THIS
        file_type: "docx",
        old_path: oldFilePath,
        edited_path: editedFilePath,
        pdf_path: editedFilePath.replace(".docx", ".pdf")
      });

      const data = response.data;

      if (!data || !Array.isArray(data.changes)) {
        setError("No changes returned from server.");
        setChanges([]);
        return;
      }

      // console.log(` Received ${data.changes.length} changes`);
      setChanges(data.changes);
    } catch (err) {
      // console.error("Failed to fetch track changes:", err);

      let errorMessage = "Failed to fetch track changes.";
      if (err.response) {
        errorMessage = err.response.data?.message || `HTTP Error ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please try again.";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setChanges([]);
    } finally {
      setLoading(false);
    }
  };

  const combineChanges = (cell_change, isBefore = false) => {
    if (!cell_change.added && !cell_change.deleted) {
      return cell_change[isBefore ? "before" : "after"] || "";
    }

    const before = cell_change.before || "";
    const after = cell_change.after || "";
    const deleted = cell_change.deleted || [];
    const added = cell_change.added || [];

    if (isBefore) {
      if (deleted.length) {
        let result = before;
        deleted.forEach((d) => {
          result = result.replace(new RegExp(`\\b${d}\\b`), `<s>${d}</s>`);
        });
        return result;
      }
      return before;
    } else {
      if (added.length) {
        let result = after;
        added.forEach((a) => {
          result = result.replace(new RegExp(`\\b${a}\\b`), `<span class="added-text">${a}</span>`);
        });
        return result;
      }
      return after;
    }
  };

  const formatRowContent = (change, isBefore = false) => {
    if (change.change_type === "row_modified") {
      const cellChangesMap = change.cell_changes.reduce((acc, cell) => {
        acc[cell.column - 1] = combineChanges(cell, isBefore);
        return acc;
      }, {});
      return change.content.map((cell, index) =>
        cellChangesMap[index] ? cellChangesMap[index] : `"${cell}"`
      ).join(" | ");
    } else if (change.change_type === "row_deleted") {
      return change.content.map(c => `<s>"${c}"</s>`).join(" | ");
    } else if (change.change_type === "row_added") {
      return change.content.map(c => `<span class="added-text">"${c}"</span>`).join(" | ");
    }
    return change.content.map(c => `"${c}"`).join(" | ");
  };

  const getScrollText = (change) => {
    if (change.type === "paragraph") {
      return (change.after || change.before || change.fullTextAfter || change.fullTextBefore || "").substring(0, 150);
    }
    if (change.type === "table" && change.content) {
      return change.content.join(" ").substring(0, 150);
    }
    return "";
  };

  useEffect(() => {
    if (sessionId) {
      fetchTrackChanges();
    }
  }, [editedFilePath, oldFilePath, sessionId]);

  return (
    <div className="track-changes-panel">
      <div className="panel-header">
        <div className="header-left">
          <FiGitCommit className="panel-icon" />
          <h3>Track Changes</h3>
        </div>
        <button className="close-btn" onClick={onClose}><FiX /></button>
      </div>

      <div className="changes-content">
        {loading && <p>Loading changes...</p>}

        {error && (
          <div className="error-message">
            {error}
            {error.includes("not found") && (
              <p>
                Please generate a new document version in the Edit panel to enable change tracking.
                <button onClick={() => setActivePanel("edit")}>Go to Edit Panel</button>
              </p>
            )}
          </div>
        )}

        {!loading && !error && changes.length > 0 && (
          <div className="changes-list">
            {changes.map((change, index) => (
              <div
                key={index}
                className="change-item"
                style={{ cursor: "pointer", marginBottom: "12px", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                onClick={() => {
                  onScrollToChange({
                    pageNumber: change.pageNumber || 1,
                    paraIndex: change.paraIndex != null ? change.paraIndex : undefined,
                    text: getScrollText(change)
                  });
                }}
              >
                {change.type === "paragraph" && (
                  <div className="change-container">
                    <p><strong>{change.heading ? `"${change.heading}"` : `Paragraph ${change.index}`}: </strong></p>

                    {change.before && (
                      <div className="change-section">
                        <strong>Before:</strong>
                        <p dangerouslySetInnerHTML={{ __html: change.fullTextBefore || change.before }} />
                      </div>
                    )}
                    {change.after && (
                      <div className="change-section">
                        <strong>After:</strong>
                        <p dangerouslySetInnerHTML={{ __html: change.fullTextAfter || change.after }} />
                      </div>
                    )}
                  </div>
                )}
                {change.type === "table" && (
                  <div className="change-container">
                    {change.heading && (
                      <span className="change-heading">"{change.heading}"</span>
                    )}
                    {change.subheading && (
                      <span className="change-subheading">Side Heading "{change.subheading}"</span>
                    )}
                    <p><strong>Row {change.change_type.replace("row_", "")} </strong></p>
                    {change.change_type === "row_modified" && (
                      <>
                        <div className="change-section">
                          <strong>Before:</strong>
                          <p><span dangerouslySetInnerHTML={{ __html: formatRowContent(change, true) }} /></p>
                        </div>
                        <div className="change-section">
                          <strong>After:</strong>
                          <p><span dangerouslySetInnerHTML={{ __html: formatRowContent(change) }} /></p>
                        </div>
                      </>
                    )}
                    {change.change_type === "row_added" && (
                      <div className="change-section">
                        <strong>After:</strong>
                        <p><span dangerouslySetInnerHTML={{ __html: formatRowContent(change) }} /></p>
                      </div>
                    )}
                    {change.change_type === "row_deleted" && (
                      <div className="change-section">
                        <strong>Before:</strong>
                        <p><span dangerouslySetInnerHTML={{ __html: formatRowContent(change) }} /></p>
                      </div>
                    )}
                  </div>
                )}
                {change.type === "line" && (
                  <div className="change-container">
                    <p><strong>Line {change.index} modified (Page {change.pageNumber}):</strong></p>
                    {change.before && (
                      <div className="change-section">
                        <strong>Before:</strong>
                        <p>
                          {change.fullTextBefore || change.before}
                          {change.deleted?.map((d, i) => (
                            <span key={i} className="deleted-text">{d}</span>
                          ))}
                        </p>
                      </div>
                    )}
                    {change.after && (
                      <div className="change-section">
                        <strong>After:</strong>
                        <p>
                          {change.fullTextAfter || change.after}
                          {change.added?.map((a, i) => (
                            <span key={i} className="added-text">{a}</span>
                          ))}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && changes.length === 0 && (
          <div className="no-changes">
            <h4>No Changes Tracked</h4>
            <p>No differences found between the previous and current document versions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackChangesPanel;