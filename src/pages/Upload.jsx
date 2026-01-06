import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/upload.css";
// @ts-ignore
import logo from "../assets/favicon.png";
import API from "../api/api";

function Upload() {
  const [docChoice, setDocChoice] = useState("");
  const [userDoc, setUserDoc] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [totalSteps, setTotalSteps] = useState(5);
  const eventSourceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  const waitForProgressComplete = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (progress >= 100 || !eventSourceRef.current) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };

  const connectToProgressStream = (sessionId, phase) => {
    if (eventSourceRef.current) eventSourceRef.current.close();

    const rawBase = API.defaults.baseURL || window.location.origin;
    const baseURL = rawBase.replace(/\/+$/, "");
    const url = `${baseURL}/api/progress/${sessionId}`;

    // console.log(`Connecting to SSE: ${url} [${phase}]`);

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      // console.log(`SSE opened: ${phase} (${sessionId})`);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.step !== undefined) {
          const nextPercent = ((data.step + 1) / totalSteps) * 100;

          const interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= nextPercent) {
                clearInterval(interval);
                return nextPercent;
              }
              return prev + 1;
            });
          }, 20);

          setProgressMessage(data.message);
        } else if (data.status === "done") {
          setProgress(100);
          setProgressMessage("Completed Filling");
        }
      } catch (err) {
        // console.error("Failed to parse SSE message:", err);
      }
    };

    eventSource.onerror = (err) => {
      // console.error(`SSE Error [${phase}]:`, err);
      eventSource.close();
      if (eventSourceRef.current === eventSource) eventSourceRef.current = null;
      setProgressMessage(`Completed ${phase}`);
    };

    eventSource.phase = phase;
    eventSourceRef.current = eventSource;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((!docChoice && !userDoc) || !dataSource) {
      alert("Please select a template or upload a Word document and provide a data source.");
      return;
    }

    const formData = new FormData();

    try {
      setLoading(true);
      setProgress(0);
      setProgressMessage("Initializing...");

      // === UPLOAD PHASE ===
      if (userDoc) formData.append("template", userDoc, userDoc.name);
      else if (docChoice) {
        const templateResp = await API.get(`/api/templates/${encodeURIComponent(docChoice)}`, { responseType: "blob" });
        formData.append("template", new Blob([templateResp.data]), docChoice);
      }

      formData.append("dataSource", dataSource, dataSource.name);

      // console.log("Starting upload...");
      const uploadRes = await API.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadData = uploadRes.data;
      // console.log("Upload response:", uploadData);

      if (uploadData.session_id) {
        sessionStorage.setItem('sessionId', uploadData.session_id);
        // console.log("Stored session_id:", uploadData.session_id);
        
        connectToProgressStream(uploadData.session_id, "upload");
        await waitForProgressComplete();
      } else {
        throw new Error("No session_id received from server");
      }

      // === FILL PHASE ===
      // console.log("Starting fill operation...");
      setProgress(0);
      setProgressMessage("Filling document...");

      const sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        throw new Error("No session ID found. Please try uploading again.");
      }

      const fillFormData = new FormData();
      fillFormData.append("data", dataSource, dataSource.name);

      // console.log(` Sending to /api/fill/${sessionId}`);
      const fillRes = await API.post(`/api/fill/${sessionId}`, fillFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fillResult = fillRes.data;
      // console.log("Fill response:", fillResult);

      if (fillResult.session_id) {
        connectToProgressStream(fillResult.session_id, "fill");
        await waitForProgressComplete();
      }

      localStorage.setItem("previewData", JSON.stringify(uploadData));
      localStorage.setItem("filledData", JSON.stringify(fillResult));

      await new Promise((r) => setTimeout(r, 500));
      navigate("/preview");

    } catch (err) {
      // console.error("Upload/Fill error:", err);
      setProgressMessage("Error occurred!");
      setProgress(0);
      alert(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
  };

  const getProgressLabel = () => {
    if (progress === 0) return "0%";
    if (progress < 100) return `${Math.round(progress)}%`;
    return "Done!";
  };

  return (
  <div className={`upload-page ${loading ? "blurred" : ""}`}>
    {/* Navbar */}
    <div className="navbar">
      <div className="logo-title">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src={logo} alt="Logo" />
          <span className="line">Veritascribe</span>
        </Link>
      </div>
      <div className="nav-actions">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </div>

    {/* Upload Form */}
    <form onSubmit={handleSubmit} className="uploadForm">
      <div className="upload-wrapper">
        <div className="container">
          <h2>Select Template</h2>
          <label htmlFor="docSelect">Standard Document:</label>
          <select
            id="docSelect"
            value={docChoice}
            onChange={(e) => setDocChoice(e.target.value)}
          >
            <option value="">-- Choose a document --</option>
            <option value="photostability.docx">Protocol for photostability</option>
            <option value="New_Analytical_doc.docx">Analytical Method Validation Protocol</option>
            <option value="structure.docx">NDA Template</option>
            <option value="report_template.docx">Report Template</option>
          </select>
        </div>

        <div className="container">
          <h2>Upload Data Source</h2>
          <input
            type="file"
            accept=".xlsx,.docx"
            onChange={(e) => setDataSource(e.target.files[0])}
          />
        </div>
      </div>

      <div style={{ maxWidth: "300px", margin: "20px auto" }}>
        {!loading && (
          <button type="submit">Upload and Fill Document</button>
        )}
      </div>
    </form>

    {/* Overlay while loading */}
    {loading && (
      <div className="progress-overlay">
        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="progress-text">{getProgressLabel()}</span>
            </div>
          </div>
          <p className="progress-message">{progressMessage}</p>
        </div>
      </div>
    )}
  </div>
);

}
export default Upload;