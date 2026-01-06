import React, { useState, useEffect, useRef } from "react";
import { FiEdit3, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { TbTableHeart, TbRowRemove } from "react-icons/tb";
import { FcAddRow } from "react-icons/fc";
import { toast } from "react-toastify";
import "../../styles/editreviewpanel.css";
import API from "../../api/api";

const EditReviewPanel = ({
  data,
  currentSheet,
  onSheetChange,
  onDataChange,
  onHasChanges,
  onClose,
  onEditComplete,
  stripTimestamp,
  scrollToChangeId,
  changeRefs,
  sessionId, //  NEW PROP
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [localData, setLocalData] = useState(data);
  const [activeSheet, setActiveSheet] = useState(currentSheet);
  const [activeSeparator, setActiveSeparator] = useState(null);
  const panelRef = useRef(null);
  const contentRefs = useRef({});

  useEffect(() => {
    setLocalData(data);
    if (currentSheet && !activeSheet) {
      setActiveSheet(currentSheet);
      onSheetChange?.(currentSheet);
    }
  }, [data, currentSheet, onSheetChange, activeSheet]);

  useEffect(() => {
    const handleClickOutside = () => setActiveSeparator(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollToChangeId && changeRefs.current[scrollToChangeId]) {
      const cellEl = changeRefs.current[scrollToChangeId];
      if (cellEl && panelRef.current) {
        cellEl.scrollIntoView({ behavior: "smooth", block: "center" });
        cellEl.classList.add("highlight-change");
        setTimeout(() => cellEl.classList.remove("highlight-change"), 3000);
      }
    }
  }, [scrollToChangeId, changeRefs]);

  useEffect(() => {
    Object.keys(contentRefs.current).forEach((sheet) => {
      const el = contentRefs.current[sheet];
      if (el && activeSheet === sheet) {
        el.style.maxHeight = `${el.scrollHeight}px`;
      } else if (el) {
        el.style.maxHeight = "0px";
      }
    });
  }, [activeSheet, localData]);

  const handleDataUpdate = (updatedData) => {
    setLocalData(updatedData);
    onDataChange(updatedData);
    onHasChanges(true);
  };

  const handleCellChange = (sheet, rowIndex, colIndex, newValue) => {
    // // console.log(`Cell change: ${sheet}[${rowIndex}][${colIndex}] = "${newValue}"`);
    
    setLocalData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      newData.excel_data[sheet].rows[rowIndex][colIndex] = newValue;
      
      onDataChange?.(newData);
      
      return newData;
    });
    
    onHasChanges?.(true);
  };

  const handleAddRow = (sheet, insertIndex, position = "above") => {
    setLocalData(prev => {
      const newData = structuredClone(prev);

      const sheetData = newData.excel_data[sheet];
      const newRow = sheetData.columns.map(() => "");

      const actualIndex = position === "below" ? insertIndex + 1 : insertIndex;

      sheetData.rows.splice(actualIndex, 0, newRow);

      onDataChange?.(newData);
      onHasChanges?.(true);

      return newData;
    });

    setActiveSeparator(null);
  };

  const handleRemoveRow = (sheet, rowIndex) => {
    const sheetData = localData.excel_data[sheet];
    const updatedData = { ...localData };
    updatedData.excel_data[sheet].rows = sheetData.rows.filter((_, i) => i !== rowIndex);
    handleDataUpdate(updatedData);
    setActiveSeparator(null);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      //  Check session ID
      if (!sessionId) {
        throw new Error("No session ID available. Please upload files first.");
      }

      const formData = new FormData();

      // STEP 1: Collect logo files and track metadata
      const fileEntries = [];
      const logoMetadata = {};
      
      Object.keys(localData.excel_data).forEach(sheet => {
        localData.excel_data[sheet].rows.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (cell instanceof File && cell.size > 0) {
              const key = `file_${sheet}_${r}_${c}`;
              const columnName = localData.excel_data[sheet].columns[c];
              
              formData.append(key, cell);
              fileEntries.push({ 
                sheet, 
                r, 
                c, 
                filename: cell.name, 
                size: cell.size,
                columnName
              });
              
              // Track logo metadata
              const lowerCol = columnName.toLowerCase();
              if (lowerCol.includes('logo') || lowerCol.includes('picture') || lowerCol.includes('image')) {
                if (!logoMetadata[sheet]) {
                  logoMetadata[sheet] = {};
                }
                logoMetadata[sheet][columnName] = cell.name;
                // // console.log(`Tracked logo: Sheet="${sheet}", Column="${columnName}", File="${cell.name}"`);
              }
            }
          });
        });
      });

      // STEP 2: Prepare JSON data - replace Files with filenames
      const dataToSend = JSON.parse(JSON.stringify(localData));
      fileEntries.forEach(({ sheet, r, c, filename }) => {
        dataToSend.excel_data[sheet].rows[r][c] = filename;
      });

      // // console.log("Data to send:", dataToSend.excel_data);

      // STEP 3: If there are logos, upload them first
      if (fileEntries.length > 0) {
        const payload = {
          excel_data: dataToSend.excel_data,
          logo_metadata: logoMetadata,
          timestamp: Date.now()
        };

        formData.append("excel_data", JSON.stringify(payload));

        // // console.log("Uploading logos:", {
        //   sessionId,
        //   files: fileEntries.length,
        //   logoMetadata: logoMetadata,
        //   totalSize: fileEntries.reduce((sum, f) => sum + f.size, 0)
        // });

        const response = await fetch(
          `${API.defaults.baseURL}/api/save-sheet-data/${sessionId}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        // // console.log(" Logo upload response:", result);
        
        toast.success(`Saved ${fileEntries.length} logo(s) successfully!`);
      } else {
        // // console.log("No logos to upload");
      }
      
      // STEP 4: Update parent state with ALL changes (logos + text)
      // // console.log("Updating parent state with:", dataToSend);
      onDataChange(dataToSend);
      
      // STEP 5: Save to localStorage immediately
      // // console.log("Saving to localStorage...");
      localStorage.setItem("previewData", JSON.stringify(dataToSend));
      // // console.log(" Data saved to localStorage");
      
      // STEP 6: Wait for state update, then trigger document regeneration
      toast.info("Regenerating document with changes...");
      
      setTimeout(() => {
        // // console.log("Triggering document regeneration...");
        onEditComplete();
      }, 500);

    } catch (err) {
      // // console.error("Save failed:", err);
      toast.error(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSheet = (sheet) => {
    setActiveSheet((prev) => {
      const newSheet = prev === sheet ? null : sheet;
      onSheetChange?.(newSheet);
      return newSheet;
    });
  };

  if (!localData || !localData.excel_data) {
    return <div>No data available for editing</div>;
  }

  return (
    <div className="edit-review-panel" ref={panelRef}>
      <div className="panel-header">
        <div className="header-left">
          <FiEdit3 className="panel-icon" />
          <h3>Edit & Review Data</h3>
        </div>
        <button className="close-btn" onClick={onClose} data-testid="edit-panel-close-btn">
          <FiX />
        </button>
      </div>

      <div className="edit-content">
        {Object.keys(localData.excel_data).map((sheet) => (
          <div key={sheet} className="sheet-section">
            <div
              className={`sheet-header ${activeSheet === sheet ? "active" : ""}`}
              onClick={() => toggleSheet(sheet)}
              data-testid={`sheet-header-${sheet}`}
            >
              {activeSheet === sheet ? <FiChevronDown /> : <FiChevronRight />}
              <h4>{localData.excel_data[sheet].display_name || sheet}</h4>
            </div>
            <div
              className={`sheet-content ${activeSheet === sheet ? "expanded" : ""}`}
              ref={(el) => (contentRefs.current[sheet] = el)}
            >
              {localData.excel_data[sheet].rows.length > 0 ? (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {localData.excel_data[sheet].columns.map((c, idx) => (
                          <th key={idx}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {localData.excel_data[sheet].rows.map((row, r) => (
                        <React.Fragment key={`${sheet}-${r}`}>
                          <tr>
                            {row.map((cell, c) => {
                              const changeId = `${sheet}-${r}-${c}`;
                              const columnName = localData.excel_data[sheet].columns[c]?.toLowerCase() || "";
                              const isLogoColumn = columnName.includes("logo") || columnName.includes("picture") || columnName.includes("image");

                              return (
                                <td key={c} ref={(el) => (changeRefs.current[changeId] = el)}>
                                  {isLogoColumn ? (
                                    <div className="logo-cell">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files[0];
                                          if (!file) return;

                                          const MAX_SIZE = 50 * 1024;
                                          if (file.size > MAX_SIZE) {
                                            toast.error("Logo too large (>50KB). Please compress.");
                                            return;
                                          }
                                          if (file.size < 1024) {
                                            toast.error("File too small — may be corrupted.");
                                            return;
                                          }
                                          if (!file.type.startsWith("image/")) {
                                            toast.error("Please upload an image file.");
                                            return;
                                          }

                                          handleCellChange(sheet, r, c, file);

                                          toast.success(`"${file.name}" selected — will be saved on "Save & Fill"`, {
                                            position: "top-center",
                                            autoClose: 4000,
                                          });
                                        }}
                                      />

                                      {cell instanceof File ? (
                                        <div className="logo-preview-container">
                                          <img
                                            src={URL.createObjectURL(cell)}
                                            alt="New uploaded logo"
                                            className="logo-preview"
                                          />
                                          <small style={{ color: "green" }}>{cell.name} (new — will be uploaded)</small>
                                        </div>
                                      ) : typeof cell === "string" && cell.trim() ? (
                                        <div className="logo-preview-container">
                                          <img
                                            src={`/company_logos/${encodeURIComponent(cell.trim())}?t=${Date.now()}`}
                                            alt="Current logo"
                                            className="logo-preview"
                                            onError={(e) => {
                                              e.currentTarget.style.display = "none";
                                            }}
                                          />
                                          <small style={{ color: "#999" }}>{cell.trim()} (current)</small>
                                        </div>
                                      ) : (
                                        <small style={{ color: "#999" }}>No logo selected</small>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={stripTimestamp(cell ?? "")}
                                      onChange={(e) => handleCellChange(sheet, r, c, e.target.value)}
                                      className="cell-input"
                                    />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                          <tr className="separator-row">
                            <td colSpan={localData.excel_data[sheet].columns.length}>
                              <div
                                className="separator"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSeparator(
                                    activeSeparator?.sheet === sheet && activeSeparator?.row === r
                                      ? null
                                      : { sheet, row: r }
                                  );
                                }}
                              >
                                <div className="separator-line"></div>
                                <div className="separator-actions">
                                  <TbTableHeart className="heart-icon" />
                                </div>
                                <div className="separator-line"></div>
                              </div>
                            </td>
                          </tr>
                          {activeSeparator?.sheet === sheet && activeSeparator?.row === r && (
                            <tr className="action-menu-row visible">
                              <td colSpan={localData.excel_data[sheet].columns.length}>
                                <div className="action-menu-inside-table">
                                  <button className="add-row" onClick={() => handleAddRow(sheet, r, "above")}>
                                    <FcAddRow /> Add Row Above
                                  </button>
                                  <button className="remove-row" onClick={() => handleRemoveRow(sheet, r)}>
                                    <TbRowRemove /> Remove Row
                                  </button>
                                  <button className="add-row-below" onClick={() => handleAddRow(sheet, r, "below")}>
                                    <FcAddRow /> Add Row Below
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-sheet">
                  <p>No Changes Required</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="edit-actions">
        <button 
          onClick={handleSaveChanges} 
          disabled={isSaving || !sessionId}
          className="save-btn"
        >
          {isSaving ? "Saving & Embedding..." : "Save and Fill"}
        </button>
        <button onClick={onClose} className="cancel-btn" data-testid="cancel-edit-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditReviewPanel;