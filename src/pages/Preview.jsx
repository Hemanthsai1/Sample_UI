import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import PDFViewer from "./PDFViewer";
import SearchPanel from "./panels/SearchPanel";
import SummarizationPanel from "./panels/Summarization";
import EditReviewPanel from "./panels/EditReviewPanel";
import WordEditPanel from "./panels/WordEditPanel";
import TrackChangesPanel from "./panels/TrackChangesPanel";
import RightPanel from "./panels/RightPanel";
// @ts-ignore
import logo from "../assets/favicon.png";
import * as XLSX from "xlsx";
import API from "../api/api";
import { toast } from "react-toastify";

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };
}

function Preview() {
  const debouncedFillRef = useRef(null);
  const [data, setData] = useState(null);
  const [baselineData, setBaselineData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [downloads, setDownloads] = useState(null);
  const [oldDownloads, setOldDownloads] = useState(null);
  const [currentSheet, setCurrentSheet] = useState("");
  const [isFilling, setIsFilling] = useState(false);
  const [currentStage, setCurrentStage] = useState("filled");
  const [activePanel, setActivePanel] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [changes, setChanges] = useState([]);
  const [scrollToChangeId, setScrollToChangeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [isLoadingWordData, setIsLoadingWordData] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sectionPageMap, setSectionPageMap] = useState({});



  const pdfViewerRef = useRef(null);
  const changeRefs = useRef({});

  const pdfPath = useMemo(() => {
    if (!sessionId) return null;

    const basePath = downloads?.pdf || `/api/preview_pdf/${sessionId}`;
    if (!basePath) return null;

    const timestamp = new Date().getTime();
    return basePath.includes("?")
      ? `${basePath}&t=${timestamp}`
      : `${basePath}?t=${timestamp}`;
  }, [downloads?.pdf, sessionId]);
  useEffect(() => {
    if (!sessionId) return;

    console.log("Fetching PDF heading map for sessionId:", sessionId);

    const fetchHeadingMap = async () => {
      try {
        const res = await API.get(`/api/excel_sheet_page_map/${sessionId}`);

        // If backend returns 404 or empty map, fallback
        if (!res.data || !res.data.sheet_page_map) {
          console.warn("Excel sheet → PDF page map not found");
          setSectionPageMap({});
        } else {
          setSectionPageMap(res.data.sheet_page_map);
        }

      } catch (err) {
        console.error("Failed to fetch PDF heading map, using fallback", err);
        setSectionPageMap({}); // fallback to empty map
      }
    };

    fetchHeadingMap();
  }, [sessionId]);


  // useEffect(() => {
  //   const loadSessionData = async () => {
  //     const saved = localStorage.getItem("previewData");
  //     const savedDownloads = localStorage.getItem("filledData");
  //     const savedOldDownloads = sessionStorage.getItem("oldFilledData");
  //     const storedSessionId = sessionStorage.getItem('sessionId');

  //     //  Set session ID first
  //     if (storedSessionId) {
  //       setSessionId(storedSessionId);
  //       // console.log("Loaded session_id:", storedSessionId);

  //       //  Try to sync data from backend
  //       try {
  //         // console.log("Syncing session data from backend...");
  //         const response = await API.get(`/api/sync_session_data/${storedSessionId}`);

  //         if (response.data.success) {
  //           // console.log(" Session data synced successfully");

  //           // Use backend data as source of truth
  //           const syncedData = {
  //             excel_data: response.data.excel_data,
  //             logo_mapping: response.data.logo_mapping
  //           };

  //           setDocumentType('excel');
  //           setData(syncedData);
  //           setOriginalData(JSON.parse(JSON.stringify(syncedData)));

  //           // Update localStorage with synced data
  //           localStorage.setItem("previewData", JSON.stringify(syncedData));

  //           if (Object.keys(syncedData.excel_data).length > 0) {
  //             setCurrentSheet(Object.keys(syncedData.excel_data)[0]);
  //           }

  //           // Load downloads info
  //           if (savedDownloads) {
  //             const parsedDownloads = JSON.parse(savedDownloads);
  //             const timestamp = new Date().getTime();
  //             setDownloads({
  //               ...parsedDownloads,
  //               pdf: parsedDownloads.pdf.includes("?")
  //                 ? `${parsedDownloads.pdf}&t=${timestamp}`
  //                 : `${parsedDownloads.pdf}?t=${timestamp}`,
  //             });
  //             setCurrentStage("filled");
  //           } else {
  //             setCurrentStage("initial");
  //           }

  //           if (savedOldDownloads) {
  //             const parsedOldDownloads = JSON.parse(savedOldDownloads);
  //             const timestamp = new Date().getTime();
  //             setOldDownloads({
  //               ...parsedOldDownloads,
  //               pdf: parsedOldDownloads.pdf?.includes("?")
  //                 ? `${parsedOldDownloads.pdf}&t=${timestamp}`
  //                 : parsedOldDownloads.pdf ? `${parsedOldDownloads.pdf}?t=${timestamp}` : null,
  //             });
  //           }

  //           return; // Exit early, data loaded from backend
  //         }
  //       } catch (err) {
  //         // console.warn("⚠️ Could not sync from backend, falling back to localStorage:", err);
  //         // Fall through to localStorage loading below
  //       }
  //     } else {
  //       // console.warn("⚠️ No session_id found in sessionStorage");
  //     }

  //     // Fallback: Load from localStorage (original logic)
  //     if (saved) {
  //       try {
  //         let parsedData = JSON.parse(saved);

  //         if (parsedData.excel_data) {
  //           setDocumentType('excel');

  //           const excelObj = {};
  //           const rawSheets = Array.isArray(parsedData.excel_data)
  //             ? parsedData.excel_data
  //             : Object.values(parsedData.excel_data);

  //           rawSheets.forEach((sheet) => {
  //             let sheetKey;
  //             let pageNumber = 1;
  //             let displayName = "Unknown Sheet";

  //             if (Array.isArray(parsedData.excel_data)) {
  //               sheetKey = sheet.sheet_name || "unknown";
  //               pageNumber = sheet.pageNumber || 1;
  //               displayName = sheet.sheet_name || sheetKey;
  //             } else {
  //               sheetKey = Object.keys(parsedData.excel_data).find(
  //                 key => parsedData.excel_data[key] === sheet
  //               ) || "unknown";

  //               if (sheet.pageNumber) {
  //                 if (typeof sheet.pageNumber === 'object' && sheet.pageNumber.pageNumber !== undefined) {
  //                   pageNumber = sheet.pageNumber.pageNumber;
  //                 } else {
  //                   pageNumber = Number(sheet.pageNumber) || 1;
  //                 }
  //               }

  //               displayName = sheet.display_name || sheetKey;
  //             }

  //             excelObj[sheetKey] = {
  //               columns: sheet.columns || [],
  //               rows: sheet.rows || [],
  //               pageNumber: pageNumber,
  //               display_name: displayName,
  //             };
  //           });

  //           parsedData.excel_data = excelObj;
  //           setData(parsedData);
  //           setOriginalData(JSON.parse(JSON.stringify(parsedData)));

  //           if (Object.keys(excelObj).length > 0) {
  //             setCurrentSheet(Object.keys(excelObj)[0]);
  //           }
  //         }
  //         else if (parsedData.message || parsedData.document_type === 'word') {
  //           setDocumentType('word');
  //           setData(parsedData);
  //         }
  //       } catch (err) {
  //         // console.error("Error parsing previewData:", err);
  //         alert("Failed to load preview data. Please try uploading again.");
  //       }
  //     }

  //     if (savedDownloads) {
  //       try {
  //         const parsedDownloads = JSON.parse(savedDownloads);
  //         const timestamp = new Date().getTime();
  //         setDownloads({
  //           ...parsedDownloads,
  //           pdf: parsedDownloads.pdf.includes("?")
  //             ? `${parsedDownloads.pdf}&t=${timestamp}`
  //             : `${parsedDownloads.pdf}?t=${timestamp}`,
  //         });
  //         setCurrentStage("filled");
  //       } catch (err) {
  //         // console.error("Error parsing filledData:", err);
  //         alert("Failed to load filled document data.");
  //       }
  //     } else {
  //       setCurrentStage("initial");
  //     }

  //     if (savedOldDownloads) {
  //       try {
  //         const parsedOldDownloads = JSON.parse(savedOldDownloads);
  //         const timestamp = new Date().getTime();
  //         setOldDownloads({
  //           ...parsedOldDownloads,
  //           pdf: parsedOldDownloads.pdf?.includes("?")
  //             ? `${parsedOldDownloads.pdf}&t=${timestamp}`
  //             : parsedOldDownloads.pdf ? `${parsedOldDownloads.pdf}?t=${timestamp}` : null,
  //         });
  //       } catch (err) {
  //         // console.error("Error parsing oldFilledData:", err);
  //       }
  //     }
  //   };

  //   loadSessionData();
  // }, []);


  //  Fetch Word data when document type is word and sessionId is available

  // Add new state to track the initial baseline

  // Update the initial load useEffect

  const resetBaseline = () => {
    const currentBaseline = JSON.parse(JSON.stringify(data));
    setBaselineData(currentBaseline);
    setOriginalData(currentBaseline);
    localStorage.setItem("baselineData", JSON.stringify(currentBaseline));

    // Optionally clear tracked changes
    setChanges([]);
    localStorage.removeItem("trackedChanges");

    // console.log("Baseline reset to current data");
  };

  useEffect(() => {
    const loadSessionData = async () => {
      const saved = localStorage.getItem("previewData");
      const savedDownloads = localStorage.getItem("filledData");
      const savedOldDownloads = sessionStorage.getItem("oldFilledData");
      const storedSessionId = sessionStorage.getItem('sessionId');
      const savedChanges = localStorage.getItem("trackedChanges");

      if (storedSessionId) {
        setSessionId(storedSessionId);
        // console.log("Loaded session_id:", storedSessionId);
      }

      //  Restore tracked changes
      if (savedChanges) {
        try {
          const parsedChanges = JSON.parse(savedChanges);
          setChanges(parsedChanges);
          // console.log(`Restored ${parsedChanges.length} tracked changes`);
        } catch (err) {
          // console.error("Error parsing tracked changes:", err);
        }
      }

      if (saved) {
        try {
          let parsedData = JSON.parse(saved);

          if (parsedData.excel_data) {
            setDocumentType('excel');

            const excelObj = {};
            const rawSheets = Array.isArray(parsedData.excel_data)
              ? parsedData.excel_data
              : Object.values(parsedData.excel_data);

            rawSheets.forEach((sheet) => {
              let sheetKey;
              let pageNumber = 1;
              let displayName = "Unknown Sheet";

              if (Array.isArray(parsedData.excel_data)) {
                sheetKey = sheet.sheet_name || "unknown";
                pageNumber = sheet.pageNumber || 1;
                displayName = sheet.sheet_name || sheetKey;
              } else {
                sheetKey = Object.keys(parsedData.excel_data).find(
                  key => parsedData.excel_data[key] === sheet
                ) || "unknown";

                if (sheet.pageNumber) {
                  if (typeof sheet.pageNumber === 'object' && sheet.pageNumber.pageNumber !== undefined) {
                    pageNumber = sheet.pageNumber.pageNumber;
                  } else {
                    pageNumber = Number(sheet.pageNumber) || 1;
                  }
                }

                displayName = sheet.display_name || sheetKey;
              }

              excelObj[sheetKey] = {
                columns: sheet.columns || [],
                rows: sheet.rows || [],
                pageNumber: pageNumber,
                display_name: displayName,
              };
            });

            parsedData.excel_data = excelObj;
            setData(parsedData);

            //  Check if we have baseline data saved
            const savedBaseline = localStorage.getItem("baselineData");
            if (savedBaseline) {
              setBaselineData(JSON.parse(savedBaseline));
              setOriginalData(JSON.parse(savedBaseline));
              // console.log("Restored baseline data for comparison");
            } else {
              // First time - set current data as baseline
              const baseline = JSON.parse(JSON.stringify(parsedData));
              setBaselineData(baseline);
              setOriginalData(baseline);
              localStorage.setItem("baselineData", JSON.stringify(baseline));
              // console.log("Set initial baseline data");
            }

            if (Object.keys(excelObj).length > 0) {
              setCurrentSheet(Object.keys(excelObj)[0]);
            }
          }
          else if (parsedData.message || parsedData.document_type === 'word') {
            setDocumentType('word');
            setData(parsedData);
          }
        } catch (err) {
          // console.error("Error parsing previewData:", err);
          alert("Failed to load preview data. Please try uploading again.");
        }
      }

      if (savedDownloads) {
        try {
          const parsedDownloads = JSON.parse(savedDownloads);
          const timestamp = new Date().getTime();
          setDownloads({
            ...parsedDownloads,
            pdf: parsedDownloads.pdf.includes("?")
              ? `${parsedDownloads.pdf}&t=${timestamp}`
              : `${parsedDownloads.pdf}?t=${timestamp}`,
          });
          setCurrentStage("filled");
        } catch (err) {
          // console.error("Error parsing filledData:", err);
          alert("Failed to load filled document data.");
        }
      } else {
        setCurrentStage("initial");
      }

      if (savedOldDownloads) {
        try {
          const parsedOldDownloads = JSON.parse(savedOldDownloads);
          const timestamp = new Date().getTime();
          setOldDownloads({
            ...parsedOldDownloads,
            pdf: parsedOldDownloads.pdf?.includes("?")
              ? `${parsedOldDownloads.pdf}&t=${timestamp}`
              : parsedOldDownloads.pdf ? `${parsedOldDownloads.pdf}?t=${timestamp}` : null,
          });
        } catch (err) {
          // console.error("Error parsing oldFilledData:", err);
        }
      }
    };

    loadSessionData();
  }, []);


  useEffect(() => {
    if (documentType === 'word' && sessionId) {
      fetchWordData();
    }
  }, [documentType, sessionId]);

  const fetchWordData = async () => {
    try {
      setIsLoadingWordData(true);

      if (!sessionId) {
        throw new Error("No session ID available");
      }

      //  Use session-specific endpoint
      const response = await API.get(`/api/word/extract_data/${sessionId}`);
      const wordDataFromBackend = response.data;

      if (!wordDataFromBackend || !wordDataFromBackend.headings) {
        throw new Error("Invalid Word data structure - missing headings");
      }

      setWordData(wordDataFromBackend);
      setOriginalData(JSON.parse(JSON.stringify(wordDataFromBackend)));
    } catch (err) {
      // console.error("Error fetching Word data:", err);
      alert(`Failed to load Word data: ${err.message}`);
      setWordData(null);
    } finally {
      setIsLoadingWordData(false);
    }
  };

  const stripTimestamp = useCallback((cell) => {
    if (typeof cell === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(cell)) {
      return cell.split("T")[0];
    }
    return cell ?? "";
  }, []);

  const createExcelBlob = useCallback((excelData) => {
    const workbook = XLSX.utils.book_new();
    Object.keys(excelData).forEach((sheetName) => {
      const sheetData = excelData[sheetName];
      const wsData = [sheetData.columns, ...sheetData.rows];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }, []);

  const handleExcelFill = async () => {
    if (!data || !data.excel_data) {
      alert("No data available to fill the document.");
      return;
    }

    if (!sessionId) {
      alert("No session ID found. Please upload files first.");
      return;
    }

    try {
      setIsFilling(true);

      // console.log("=== HANDLE EXCEL FILL START ===");
      // console.log(`Using session_id: ${sessionId}`);
      // console.log("Current data state:");

      Object.keys(data.excel_data).forEach(sheet => {
        // console.log(`  Sheet "${sheet}": ${data.excel_data[sheet].rows.length} rows`);
      });

      //  Use current data state, not localStorage
      const cleanedSheets = {};
      Object.keys(data.excel_data).forEach((sheetName) => {
        const rows = data.excel_data[sheetName].rows.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const columnName = data.excel_data[sheetName].columns[colIdx]?.toLowerCase() || "";
            const isLogoColumn = columnName.includes("logo") ||
              columnName.includes("picture") ||
              columnName.includes("image");

            if (isLogoColumn) {
              // If it's a File object, return the filename
              if (cell instanceof File) {
                return cell.name;
              }
              return cell;
            }

            if (typeof cell === "string" && /^\d{4}-\d{2}-\d{2}T/.test(cell)) {
              return cell.split("T")[0];
            }

            return cell;
          })
        );

        cleanedSheets[sheetName] = {
          columns: data.excel_data[sheetName].columns,
          rows,
          pageNumber: data.excel_data[sheetName].pageNumber,
          display_name: data.excel_data[sheetName].display_name,
        };

        // console.log(`  Cleaned sheet "${sheetName}": ${rows.length} rows`);
      });

      // console.log("Creating Excel blob with cleaned data...");
      const excelBlob = createExcelBlob(cleanedSheets);
      // console.log(` Excel blob created: ${excelBlob.size} bytes`);

      const formData = new FormData();
      formData.append('data', excelBlob, 'edited_data.xlsx');

      // console.log(`Sending to /api/fill/${sessionId}...`);
      const res = await API.post(`/api/fill/${sessionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const result = res.data;

      if (!result.success) {
        throw new Error(result.validation_report?.join("\n") || "Fill failed");
      }

      // console.log(" Fill successful:", result);

      if (downloads && downloads.docx && downloads.pdf) {
        const oldResult = {
          docx: downloads.docx,
          pdf: downloads.pdf,
          old_docx: result.old_docx || null,
          old_pdf: result.old_pdf || null
        };
        sessionStorage.setItem("oldFilledData", JSON.stringify(oldResult));
        setOldDownloads(oldResult);
        // console.log("Saved old downloads for track changes");
      }

      const timestamp = Date.now();
      const newDownloads = {
        ...result,
        pdf: result.pdf.includes("?")
          ? `${result.pdf}&t=${timestamp}`
          : `${result.pdf}?t=${timestamp}`,
        docx: result.docx?.includes("?")
          ? `${result.docx}&t=${timestamp}`
          : result.docx ? `${result.docx}?t=${timestamp}` : null
      };

      setDownloads(newDownloads);
      localStorage.setItem("filledData", JSON.stringify(newDownloads));
      // console.log("Saved new downloads to localStorage");

      setCurrentStage("filled");
      setHasChanges(false);

      // console.log("=== HANDLE EXCEL FILL END ===");
      toast.success("Document generated successfully!");

    } catch (err) {
      // console.error("Fill failed:", err);
      toast.error(`Failed to generate document: ${err.message}`);
    } finally {
      setIsFilling(false);
    }
  };

  const handleWordFill = async () => {
    if (!wordData) {
      alert("No Word data available to fill the document.");
      return;
    }

    if (!sessionId) {
      alert("No session ID found. Please upload files first.");
      return;
    }

    try {
      setIsFilling(true);
      const dummyBlob = new Blob(['dummy'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const formData = new FormData();
      formData.append('data', dummyBlob, 'dummy.docx');

      //  Use session-specific endpoint
      // console.log(`Sending to /api/fill/${sessionId}...`);
      const res = await API.post(`/api/fill/${sessionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const result = res.data;

      if (!result.pdf || !result.docx) {
        throw new Error("Missing PDF or DOCX path in response");
      }

      if (downloads && downloads.docx && downloads.pdf) {
        const oldResult = {
          docx: downloads.docx,
          pdf: downloads.pdf,
          old_docx: result.old_docx || null,
          old_pdf: result.old_pdf || null
        };
        sessionStorage.setItem("oldFilledData", JSON.stringify(oldResult));
        setOldDownloads(oldResult);
      }

      const timestamp = new Date().getTime();
      const newDownloads = {
        ...result,
        pdf: result.pdf.includes("?") ? `${result.pdf}&t=${timestamp}` : `${result.pdf}?t=${timestamp}`,
      };
      setDownloads(newDownloads);
      setHasChanges(false);
      setCurrentStage("filled");
      localStorage.setItem("filledData", JSON.stringify(result));
      setActivePanel(null);
    } catch (err) {
      // console.error("Fill error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsFilling(false);
    }
  };

  const handleFill = useCallback(async () => {
    if (documentType === 'excel') {
      await handleExcelFill();
    } else if (documentType === 'word') {
      await handleWordFill();
    } else {
      alert("Unknown document type");
    }
  }, [documentType, handleExcelFill, handleWordFill]);

  useEffect(() => {
    debouncedFillRef.current = debounce(handleFill, 1000);
  }, [handleFill]);

  const debouncedHandleFill = () => {
    debouncedFillRef.current?.();
  };

  const downloadFile = (path, filename) => {
    if (!path) {
      alert("File path not available");
      return;
    }

    const baseURL = API.defaults.baseURL || "";
    const fileURL = `${baseURL}${path}`;
    window.open(fileURL, "_blank");
  };

  const handlePanelToggle = (panelType) => {
    setActivePanel(activePanel === panelType ? null : panelType);
    if (panelType === "edit") setCurrentStage("editing");
    else if (panelType === null && hasChanges) setCurrentStage("initial");
    else if (panelType === null && downloads) setCurrentStage("filled");
  };

  const saveToLocalStorage = useCallback(() => {
    if (data) {
      // console.log("Saving current data to localStorage...");
      localStorage.setItem("previewData", JSON.stringify(data));
      // console.log(" Data saved to localStorage");
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      saveToLocalStorage();
    }
  }, [data, saveToLocalStorage]);

  const handleEditComplete = () => {
    // console.log("=== EDIT COMPLETE START ===");

    if (documentType === 'excel') {
      // console.log("Current data state:", data.excel_data);

      Object.keys(data.excel_data).forEach(sheet => {
        // console.log(`  Sheet "${sheet}": ${data.excel_data[sheet].rows.length} rows`);
      });

      const newChanges = [];

      //  ALWAYS compare against baseline (not originalData)
      const comparisonBase = baselineData || originalData;
      // console.log("Comparing against baseline data");

      if (comparisonBase && data) {
        Object.keys(data.excel_data).forEach((sheetName) => {
          const baselineRows = comparisonBase.excel_data[sheetName]?.rows || [];
          const currentRows = data.excel_data[sheetName].rows;

          if (currentRows.length !== baselineRows.length) {
            // console.log(`  Row count changed for "${sheetName}": ${baselineRows.length} → ${currentRows.length}`);

            if (currentRows.length > baselineRows.length) {
              for (let i = baselineRows.length; i < currentRows.length; i++) {
                newChanges.push({
                  id: `${Date.now()}-${sheetName}-${i}-added`,
                  sheet: sheetName,
                  row: i + 1,
                  column: "Entire Row",
                  before: "N/A",
                  after: "New Row Added",
                  type: "row_added",
                  timestamp: new Date().toISOString(),
                  pageNumber: data.excel_data[sheetName].pageNumber || 1,
                });
              }
            } else {
              const removedCount = baselineRows.length - currentRows.length;
              newChanges.push({
                id: `${Date.now()}-${sheetName}-removed`,
                sheet: sheetName,
                row: currentRows.length + 1,
                column: "Entire Row",
                before: `${removedCount} Row(s)`,
                after: "Removed",
                type: "row_removed",
                timestamp: new Date().toISOString(),
                pageNumber: data.excel_data[sheetName].pageNumber || 1,
              });
            }
          }

          currentRows.forEach((row, rowIndex) => {
            const baselineRow = baselineRows[rowIndex] || [];
            row.forEach((cell, colIndex) => {
              const baselineCell = baselineRow[colIndex] ?? "";
              const cleanedCell = stripTimestamp(cell);
              const cleanedBaseline = stripTimestamp(baselineCell);

              if (cell instanceof File) {
                return;
              }

              if (cleanedCell !== cleanedBaseline) {
                //  Check if this change already exists in tracked changes
                const existingChange = changes.find(c =>
                  c.sheet === sheetName &&
                  c.row === rowIndex + 1 &&
                  c.column === (data.excel_data[sheetName].columns[colIndex] || `Column ${colIndex + 1}`)
                );

                if (!existingChange) {
                  newChanges.push({
                    id: `${Date.now()}-${sheetName}-${rowIndex}-${colIndex}`,
                    sheet: sheetName,
                    row: rowIndex + 1,
                    column: data.excel_data[sheetName].columns[colIndex] || `Column ${colIndex + 1}`,
                    before: cleanedBaseline || "N/A",
                    after: cleanedCell || "N/A",
                    type: cleanedBaseline ? "modified" : "added",
                    timestamp: new Date().toISOString(),
                    pageNumber: data.excel_data[sheetName].pageNumber || 1,
                  });
                } else {
                  // Update existing change with new "after" value
                  // console.log(`Updating existing change for ${sheetName}[${rowIndex + 1}]`);
                  existingChange.after = cleanedCell || "N/A";
                  existingChange.timestamp = new Date().toISOString();
                }
              }
            });
          });
        });
      }

      // console.log(`Tracked ${newChanges.length} NEW changes`);

      //  Append new changes and save to localStorage
      setChanges((prevChanges) => {
        const allChanges = [...prevChanges, ...newChanges];
        // console.log(`Total changes: ${allChanges.length} (${prevChanges.length} previous + ${newChanges.length} new)`);

        //  Save changes to localStorage
        localStorage.setItem("trackedChanges", JSON.stringify(allChanges));

        return allChanges;
      });

      //  Save current data but DON'T update originalData yet
      const updatedData = JSON.parse(JSON.stringify(data));

      // console.log("Saving edited data to localStorage...");
      localStorage.setItem("previewData", JSON.stringify(updatedData));
      // console.log(" Edited data saved to localStorage");

      setHasChanges(true);
      setActivePanel(null);
      setCurrentStage("initial");

      // console.log("Triggering document fill with updated data...");
      // console.log("=== EDIT COMPLETE END ===");

      setTimeout(() => {
        debouncedHandleFill();
      }, 100);

    } else if (documentType === 'word') {
      if (wordData) {
        setOriginalData(JSON.parse(JSON.stringify(wordData)));
        localStorage.setItem("previewData", JSON.stringify({
          document_type: 'word',
          wordData: wordData
        }));
      }


      setHasChanges(true);
      setActivePanel(null);
      setCurrentStage("initial");

      setTimeout(() => {
        debouncedHandleFill();
      }, 100);
    }
  };


  const handleResultClick = (pageNumber, index, searchQuery) => {
    if (pdfViewerRef.current && pageNumber) {
      pdfViewerRef.current.scrollToPage(pageNumber, { text: searchQuery, paraIndex: index });
      setCurrentSearchIndex(index);
    }
  };

  const normalize = (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9]+/g, "_");

  const handleSheetChange = (sheet) => {
    setCurrentSheet(sheet);

    const pageNumber = sectionPageMap?.[normalize(sheet)] || 1;

    if (!sectionPageMap?.[normalize(sheet)]) {
      console.warn(`No page mapping for sheet: ${sheet}`);
    }

    setTimeout(() => {
      pdfViewerRef.current?.scrollToPage(pageNumber);
    }, 150);
  };



  const handleChangeClick = (changeId) => {
    setScrollToChangeId(changeId);
    setActivePanel("edit");
  };

  if (!data) {
    return (
      <p>
        No preview data found. Go back to
        <Link
          to="/"
          className="home-btn"
          onClick={() => {
            localStorage.removeItem("previewData");
            localStorage.removeItem("filledData");
            localStorage.removeItem("baselineData");
            localStorage.removeItem("trackedChanges");
            sessionStorage.removeItem("oldFilledData");
            sessionStorage.removeItem("sessionId");
          }}
        >
          Back to Home
        </Link>
      </p>
    );
  }

  return (
    <div>
      <div className="navbar">
        <div className="logo-title">
          <img src={logo} alt="Logo" />
          <div className="nav-title">
            <span className="line">Veritascribe</span>
          </div>
        </div>
        <Link
          to="/"
          className="home-btn"
          onClick={() => {
            localStorage.removeItem("previewData");
            localStorage.removeItem("filledData");
            localStorage.removeItem("baselineData");
            localStorage.removeItem("trackedChanges");
            sessionStorage.removeItem("oldFilledData");
            sessionStorage.removeItem("sessionId");
          }}
        >
          Back to Home
        </Link>
      </div>

      <div className="main-container">
        <div className="preview-wrapper">
          <div className="doc-title-wrapper">
            <h1 className="doc-title">
              {downloads?.pdf ? "Filled Document Preview" : "Template Preview"}
            </h1>
          </div>
          <PDFViewer
            key={pdfPath}
            pdfPath={pdfPath}
            ref={pdfViewerRef}
            searchResults={searchResults}
            currentSearchIndex={currentSearchIndex}
            className="pdf-viewer"
          />
          {downloads && (
            <div className="download-options">
              <button className="download-btn" onClick={() => downloadFile(downloads.pdf, "document.pdf")} disabled={isFilling}>
                Download PDF
              </button>
            </div>
          )}
        </div>

        <div className="editor-wrapper">
          {activePanel === null && (
            <RightPanel
              currentStage={currentStage}
              hasChanges={hasChanges}
              isFilling={isFilling}
              downloads={downloads}
              onFill={debouncedHandleFill}
              onDownload={downloadFile}
              onPanelToggle={handlePanelToggle}
            />
          )}
          {activePanel === "search" && (
            <SearchPanel
              onClose={() => setActivePanel(null)}
              onSearch={setSearchResults}
              onResultClick={handleResultClick}
              searchResults={searchResults}
              onSearchQueryChange={setSearchQuery}
              sessionId={sessionId}
            />
          )}
          {activePanel === "edit" && documentType === 'excel' && (
            <EditReviewPanel
              data={data}
              currentSheet={currentSheet}
              onSheetChange={handleSheetChange}
              onDataChange={setData}
              onHasChanges={setHasChanges}
              onClose={() => setActivePanel(null)}
              onEditComplete={handleEditComplete}
              stripTimestamp={stripTimestamp}
              scrollToChangeId={scrollToChangeId}
              changeRefs={changeRefs}
              sessionId={sessionId}
            />
          )}
          {activePanel === "edit" && documentType === 'word' && (
            <WordEditPanel
              wordData={wordData}
              onClose={() => setActivePanel(null)}
              onEditComplete={handleEditComplete}
              onDataChange={setWordData}
              onHasChanges={setHasChanges}
              isLoading={isLoadingWordData}
            />
          )}
          {activePanel === "track" && (
            <TrackChangesPanel
              editedFilePath={downloads?.docx}
              oldFilePath={oldDownloads?.old_docx}
              onClose={() => setActivePanel(null)}
              onScrollToChange={(target) => {
                if (pdfViewerRef.current) {
                  pdfViewerRef.current.scrollToPage(target.pageNumber, target);
                }
              }}
              setActivePanel={setActivePanel}
              sessionId={sessionId}
            />
          )}
          {activePanel === "summarization" && (
            <SummarizationPanel
              uploadedFiles={[downloads?.pdf, downloads?.docx].filter(Boolean)}
              onClose={() => setActivePanel(null)}
              setActivePanel={setActivePanel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Preview;