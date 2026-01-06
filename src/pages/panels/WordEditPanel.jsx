import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { FiX, FiSave, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { TbRowRemove } from "react-icons/tb";
import { FcAddRow } from "react-icons/fc";
import debounce from "lodash/debounce";
import "../../styles/wordeditpanel.css";
import API from '../../api/api'

const EnhancedTable = memo(({ tableData, headingId, onCellChange, onImageUpload, onRemoveImage, tableId }) => {
  if (!tableData || !tableData.cells || !tableData.grid) {
    return <div className="table-error">Invalid table data</div>;
  }

  const { cells, grid } = tableData;
  const cellMap = {};
  cells.forEach(cell => cellMap[cell.id] = cell);

  const rendered = new Set();

  const renderCell = (cellId, rowIdx, colIdx) => {
    if (!cellId || rendered.has(cellId)) return null;
    const cell = cellMap[cellId];
    if (!cell) return null;

    rendered.add(cellId);

    // Show upload ONLY if cell has image(s) or other non-text content
    const hasNonText = cell.images?.length > 0 || cell.nested_tables?.length > 0;

    return (
      <td
        key={cell.id}
        rowSpan={cell.rowspan}
        colSpan={cell.colspan}
        className={`table-cell ${cell.rowspan > 1 ? 'has-rowspan' : ''} ${cell.colspan > 1 ? 'has-colspan' : ''}`}
      >
        {/* Images */}
        {cell.images && cell.images.length > 0 && (
          <div className="cell-images">
            {cell.images.map(img => (
              <div key={img.id} className="cell-image">
                <img src={img.base64} alt={img.filename} />
                <button
                  className="remove-image-btn"
                  onClick={() => onRemoveImage(headingId, tableId, cell.id, img.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text */}
        <textarea
          value={cell.text || ""}
          onChange={(e) => onCellChange(headingId, tableId, cell.id, e.target.value)}
          placeholder={`R${cell.row + 1}C${cell.col + 1}`}
          rows={3}
        />

        {/* Upload: ONLY if has non-text content */}
        {hasNonText && (
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageUpload(headingId, tableId, cell.id, e)}
            />
          </div>
        )}

        {/* Nested Tables */}
        {cell.nested_tables && cell.nested_tables.length > 0 && (
          <div className="nested-tables-container">
            {cell.nested_tables.map(nested => (
              <div key={nested.id} className="nested-table-item">
                <EnhancedTable
                  tableData={nested}
                  headingId={headingId}
                  tableId={tableId}
                  onCellChange={onCellChange}
                  onImageUpload={onImageUpload}
                  onRemoveImage={onRemoveImage}
                />
              </div>
            ))}
          </div>
        )}
      </td>
    );
  };

  return (
    <div className="enhanced-table-wrapper">
      <table className="enhanced-table">
        <tbody>
          {grid.map((row, rowIdx) => (
            <tr key={`row-${rowIdx}`}>
              {row.map((cellId, colIdx) => {
                const isLeftSame = colIdx > 0 && row[colIdx - 1] === cellId;
                const isAboveSame = rowIdx > 0 && grid[rowIdx - 1][colIdx] === cellId;

                if (!cellId || rendered.has(cellId) || isLeftSame || isAboveSame) {
                  return null;
                }

                return renderCell(cellId, rowIdx, colIdx);
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// Memoized ContentItem with enhanced table support (UPDATED: Pass new handlers)
const ContentItem = memo(({ content, headingId, handleContentChange, handleUpdateCell, handleTableCellChange }) => {
  switch (content.type) {
    case "paragraph":
      return (
        <div className="content-item paragraph">
          <textarea
            value={content.text || ""}
            onChange={(e) => handleContentChange(headingId, content.id, "text", e.target.value)}
            rows={3}
          />
        </div>
      );
    case "key_value":
  return (
    <div className="content-item key-value">
      {/* KEY – READ-ONLY */}
      <div className="readonly-key">
        {content.key || "(empty key)"}
      </div>

      {/* VALUE – EDITABLE */}
      <input
        type="text"
        value={content.value || ""}
        placeholder="Value"
        onChange={(e) => handleContentChange(headingId, content.id, "value", e.target.value)}
        className="editable-value"
      />
    </div>
  );
    case "table":
      return (
        <div className="content-item table-content">
          {content.cells && content.grid ? (
            <EnhancedTable
              tableData={content}
              headingId={headingId}
              tableId={content.id}
              onCellChange={(headingId, tableId, cellId, value) => handleUpdateCell(headingId, tableId, cellId, (cell) => { cell.text = value })}
              onImageUpload={(headingId, tableId, cellId, event) => handleImageUpload(headingId, tableId, cellId, event)} // NEW
              onRemoveImage={(headingId, tableId, cellId, imgId) => handleUpdateCell(headingId, tableId, cellId, (cell) => { cell.images = cell.images.filter(i => i.id !== imgId); cell.has_image = cell.images.length > 0 })} // NEW
            />
          ) : content.rows ? (
            // Fallback for old format (UPDATED: textarea)
            <div className="simple-table-wrapper">
              <table className="simple-table">
                <tbody>
                  {content.rows.map((row, rowIdx) => (
                    <tr key={`row-${rowIdx}`}>
                      {row.map((cell, cellIdx) => (
                        <td key={`cell-${rowIdx}-${cellIdx}`}>
                          <textarea
                            value={cell || ""}
                            onChange={(e) => handleTableCellChange(headingId, content.id, rowIdx, cellIdx, e.target.value)}
                            rows={3}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-error">Invalid table format</div>
          )}
        </div>
      );
    case "list":
      return (
        <div className="content-item list-content">
          {content.items.map((item, idx) => (
            <div key={idx} className="list-item">
              {item.key && (
                <input
                  type="text"
                  value={item.key}
                  placeholder="Key"
                  onChange={(e) => handleContentChange(headingId, item.id, "key", e.target.value)}
                />
              )}
              <input
                type="text"
                value={item.text || ""}
                placeholder="Item"
                onChange={(e) => handleContentChange(headingId, item.id, "text", e.target.value)}
              />
              {item.value && (
                <input
                  type="text"
                  value={item.value}
                  placeholder="Value"
                  onChange={(e) => handleContentChange(headingId, item.id, "value", e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      );
    default:
      return <div>Unsupported type: {content.type}</div>;
  }
});

const WordEditPanel = ({
  wordData: propWordData,
  onClose,
  onEditComplete,
  onDataChange,
  onHasChanges,
  isLoading: propIsLoading
}) => {
  const [wordData, setWordData] = useState(propWordData || { headings: [] });
  const [activeHeading, setActiveHeading] = useState(null);
  const contentRefs = useRef({});

  // Debounced state update
  const debouncedDataChange = useCallback(
    debounce((updatedData) => {
      onDataChange?.(updatedData);
      onHasChanges?.(true);
    }, 300, { leading: false, trailing: true }),
    [onDataChange, onHasChanges]
  );

  // NEW: Generic cell updater for text/images in tables/nested
  const handleUpdateCell = useCallback((headingId, tableId, cellId, updater) => {
    setWordData(prev => {
      const updated = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation issues
      const heading = updated.headings.find(h => h.id === headingId);
      if (!heading) return prev;
      const table = heading.content.find(c => c.id === tableId);
      if (!table) return prev;

      const updateRecursive = (cells) => {
        for (let i = 0; i < cells.length; i++) {
          if (cells[i].id === cellId) {
            updater(cells[i]);
            return true;
          }
          if (cells[i].nested_tables) {
            for (let nt of cells[i].nested_tables) {
              if (updateRecursive(nt.cells)) return true;
            }
          }
        }
        return false;
      };

      updateRecursive(table.cells);
      debouncedDataChange(updated);
      return updated;
    });
  }, [debouncedDataChange]);

  // NEW: Handle image upload (appends new image)
  const handleImageUpload = useCallback((headingId, tableId, cellId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const newImage = {
        id: `img_${Math.random().toString(36).slice(2)}`,
        filename: file.name,
        base64,
        size: file.size,
      };
      handleUpdateCell(headingId, tableId, cellId, (cell) => {
        cell.images.push(newImage);
        cell.has_image = true;
      });
    };
    reader.readAsDataURL(file);
  }, [handleUpdateCell]);

  // Initialize wordData and activeHeading
  useEffect(() => {
    if (propWordData) {
      setWordData(propWordData);
      if (!activeHeading) {
        const highlightedHeadings = propWordData.headings.filter(h =>
          h.content.some(c => c.is_highlighted)
        );
        if (highlightedHeadings.length > 0) {
          setActiveHeading(highlightedHeadings[0].id);
        }
      }
    }
  }, [propWordData, activeHeading]);

  // Update max-height for smooth transitions
  useEffect(() => {
    Object.keys(contentRefs.current).forEach(headingId => {
      const el = contentRefs.current[headingId];
      if (el && activeHeading === headingId) {
        el.style.maxHeight = `${el.scrollHeight}px`;
      } else if (el) {
        el.style.maxHeight = "0px";
      }
    });
  }, [activeHeading, wordData]);

  // Accordion toggle
  const toggleHeading = useCallback((headingId) => {
    setActiveHeading(prev => (prev === headingId ? null : headingId));
  }, []);

  // Update content (paragraph / key-value)
  const handleContentChange = useCallback((headingId, contentId, field, value) => {
    const updated = { ...wordData };
    const heading = updated.headings.find(h => h.id === headingId);
    if (!heading) return;
    const content = heading.content.find(c => c.id === contentId);
    if (!content) return;

    if (field === "text") content.text = value;
    if (field === "key") content.key = value;
    if (field === "value") content.value = value;

    setWordData(updated);
    debouncedDataChange(updated);
  }, [wordData, debouncedDataChange]);

  // Handle old format table cell changes (simple rows/cols)
  const handleTableCellChange = useCallback((headingId, tableId, rowIdx, cellIdx, value) => {
    const updated = { ...wordData };
    const heading = updated.headings.find(h => h.id === headingId);
    if (!heading) return;
    const table = heading.content.find(c => c.id === tableId);
    if (!table || table.type !== "table") return;

    // Old format with rows array
    if (table.rows && table.rows[rowIdx] && table.rows[rowIdx][cellIdx] !== undefined) {
      table.rows[rowIdx][cellIdx] = value;
      setWordData(updated);
      debouncedDataChange(updated);
    }
  }, [wordData, debouncedDataChange]);

// Replace the handleSaveChanges function in WordEditPanel.jsx

const handleSaveChanges = useCallback(async () => {
  debouncedDataChange.flush();

  try {
    // console.log("WORD DATA SENT:", JSON.stringify(wordData, null, 2));
    // Step 1: Update the Word data source using Axios
    const response = await API.post("/api/word/update_data", wordData , {

      headers: { "Content-Type": "application/json" },
    });

    // Axios treats non-2xx responses as errors, so no need to check response.ok
    // But optionally, you can validate the response data
    if (!response.data || response.data.error) {
      throw new Error(response.data?.error || "Failed to save changes");
    }

    alert("Changes saved successfully! Click 'Ok' to 'Fill Document'.");
    onHasChanges?.(true); // Mark that changes exist
    onEditComplete?.();    // Close panel and trigger fill

  } catch (err) {
    // console.error("Save error:", err);
    alert(`Error: ${err.message}`);
  }
}, [wordData, onHasChanges, onEditComplete, debouncedDataChange]);
  return (
    <div className="word-edit-panel">
      <div className="panel-header">
        <h3>Edit Word Data</h3>
        <button className="close-btn" onClick={onClose}><FiX /></button>
      </div>
      <div className="word-edit-content">
        <span className="total-headings">Total Headings: {wordData.headings.length}</span>
        {wordData.headings.map((heading) => (
          <div key={heading.id} className="heading-section">
            <div
              className={`heading-header ${activeHeading === heading.id ? "active" : ""}`}
              onClick={() => toggleHeading(heading.id)}
            >
              {activeHeading === heading.id ? <FiChevronDown /> : <FiChevronRight />}
              <h4>{heading.text}</h4>
              <span>{heading.content.length} items</span>
            </div>
            <div
              className={`heading-content ${activeHeading === heading.id ? "expanded" : ""}`}
              ref={el => (contentRefs.current[heading.id] = el)}
            >
              {heading.content.length === 0 ? (
                <p>No Changes Required Here</p>
              ) : (
                heading.content.map(c => (
                  <div key={c.id} className="content-wrapper">
                    <ContentItem
                      content={c}
                      headingId={heading.id}
                      handleContentChange={handleContentChange}
                      handleUpdateCell={handleUpdateCell}
                      handleTableCellChange={handleTableCellChange}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="word-edit-bottom">
        <button className="save-btn" onClick={handleSaveChanges}>
           Save and Fill
        </button>
        <button className="close-btn" onClick={onClose}>
         Close
        </button>
      </div>
    </div>
  );
};

export default WordEditPanel;