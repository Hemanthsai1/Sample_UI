
import React, { useState, useRef, useImperativeHandle, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../styles/pdfviewer.css";
// import * as pdfjs from "pdfjs-dist/legacy/build/pdf"; 
import API from '../api/api';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

const PDFViewer = React.forwardRef(({ pdfPath, searchResults = [], currentSearchIndex = -1 }, ref) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const pendingScrollRef = useRef(null);
  const lastHighlightedRef = useRef(null);
  const containerRef = useRef(null);
  const pdfDocumentRef = useRef(null);

  const documentOptions = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    verbosity: 0,
    maxImageSize: 50 * 1024 * 1024,
  }), []);

  // Fetch PDF using Axios
  useEffect(() => {
    if (!pdfPath) return;

    let isCancelled = false;
    setLoadingPdf(true);

    const fetchPdf = async () => {
      try {
        const response = await API.get(pdfPath, { responseType: "blob" });
        if (isCancelled) return;
        const blobUrl = URL.createObjectURL(response.data);
        setPdfBlobUrl(blobUrl);
        setError(null);
      } catch (err) {
        if (isCancelled) return;
        // console.error("Error fetching PDF:", err);
        setError("Failed to Generate the Document.");
        setPdfBlobUrl(null);
      } finally {
        if (!isCancelled) setLoadingPdf(false);
      }
    };

    fetchPdf();

    return () => {
      isCancelled = true;
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    };
  }, [pdfPath]);

  const onDocumentLoadSuccess = (pdf) => {
    pdfDocumentRef.current = pdf;
    setNumPages(pdf.numPages);
    setCurrentPage(1);
    setInputPage("1");
    setIsLoaded(true);

    if (pendingScrollRef.current) {
      setTimeout(() => {
        scrollToPage(pendingScrollRef.current.pageNumber, pendingScrollRef.current);
        pendingScrollRef.current = null;
      }, 500);
    }
  };

  const onDocumentLoadError = (err) => {
    // console.error("PDF load error:", err);
    setError(`Failed to load PDF: ${err.message}`);
    setIsLoaded(false);
    pdfDocumentRef.current = null;
  };

  const scrollToPage = (pageNumber, scrollTarget = {}) => {
    if (!isLoaded || !numPages) {
      pendingScrollRef.current = { pageNumber, scrollTarget };
      return;
    }

    if (pageNumber < 1 || pageNumber > numPages) return;

    setCurrentPage(pageNumber);
    setInputPage(pageNumber.toString());

    setTimeout(() => {
      const pageElement = containerRef.current?.querySelector(
        `.react-pdf__Page[data-page-number="${pageNumber}"]`
      );

      if (!pageElement) return;
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });

      if (!scrollTarget || (!scrollTarget.paraIndex && !scrollTarget.text)) return;

      setTimeout(() => {
        const textLayer = pageElement.querySelector(".react-pdf__Page__textContent");
        if (!textLayer) return;

        let targetEl = null;

        if (scrollTarget.text) {
          const searchText = scrollTarget.text.trim();
          const textDivs = Array.from(textLayer.querySelectorAll("div"));
          targetEl = textDivs.find(div => div.textContent.toLowerCase().includes(searchText.toLowerCase()));
          if (!targetEl) {
            const words = searchText.split(" ").filter(word => word);
            for (let word of words) {
              targetEl = textDivs.find(div => div.textContent.toLowerCase().includes(word.toLowerCase()));
              if (targetEl) break;
            }
          }
        }

        if (!targetEl && scrollTarget.paraIndex != null) {
          const textDivs = textLayer.querySelectorAll("div");
          if (scrollTarget.paraIndex < textDivs.length) targetEl = textDivs[scrollTarget.paraIndex];
        }

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          targetEl.classList.add("search-highlight");
          if (lastHighlightedRef.current) lastHighlightedRef.current.classList.remove("search-highlight");
          lastHighlightedRef.current = targetEl;
        }
      }, 750);
    }, 100);
  };

  useImperativeHandle(ref, () => ({
    scrollToPage: (page, target) => scrollToPage(page, target),
  }));

  const goToPreviousPage = () => scrollToPage(Math.max(currentPage - 1, 1));
  const goToNextPage = () => scrollToPage(Math.min(currentPage + 1, numPages || 1));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handlePageInputSubmit = () => {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum)) scrollToPage(pageNum);
    else setInputPage(currentPage.toString());
  };

  if (!pdfPath) return <div className="pdf-error">No PDF path provided</div>;
  if (error) return <div className="pdf-error">{error}</div>;
  if (loadingPdf) return <div className="pdf-loading">Loading PDF...</div>;

  return (
    <div className="pdf-viewer" ref={containerRef}>
      <div className="pdf-controls">
        <div className="pdf-pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 1 || !numPages}>Prev</button>
          <input
            type="text"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onBlur={handlePageInputSubmit}
            onKeyPress={(e) => e.key === "Enter" && handlePageInputSubmit()}
          />
          <span> / {numPages || "Loading..."} Pages</span>
          <button onClick={goToNextPage} disabled={currentPage === numPages || !numPages}>Next</button>
        </div>
        <div className="pdf-zoom-controls">
          <button onClick={zoomOut} disabled={scale <= 0.5}>-</button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button onClick={zoomIn} disabled={scale >= 2.0}>+</button>
        </div>
      </div>

      <div className="pdf-scroll-container">
        {pdfBlobUrl && (
          <Document
            file={pdfBlobUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            options={documentOptions}
            loading={<div className="pdf-loading">Loading PDF...</div>}
            error={<div className="pdf-error">Failed to load PDF. Please refresh the page.</div>}
          >
            {Array.from({ length: numPages || 0 }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className={searchResults[currentSearchIndex]?.pageNumber === index + 1 ? "highlight-page" : ""}
                loading={<div className="page-loading">Loading page {index + 1}...</div>}
                error={<div className="page-error">Error loading page {index + 1}</div>}
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
});

PDFViewer.displayName = 'PDFViewer';
export default PDFViewer;