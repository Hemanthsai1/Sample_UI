// pdfWorkerConfig.js
// Global PDF.js worker configuration to prevent termination issues
// Import this file before any PDF.js usage in your main App.js or index.js

import { pdfjs } from 'react-pdf';

/**
 * Configure PDF.js worker with optimal settings to prevent termination
 */
export const configurePDFWorker = () => {
  // Set worker source - use exact version match
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.mjs`;

  // Alternative: Use local worker from node_modules
  // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  //   '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
  //   import.meta.url
  // ).href;

  // Configure global worker options
  pdfjs.GlobalWorkerOptions.workerPort = null; // Let PDF.js manage worker lifecycle

  // Set verbosity level (1 = errors only, 5 = all logs)
  pdfjs.GlobalWorkerOptions.verbosity = 1;

  // Disable certain features that might cause worker issues
  pdfjs.GlobalWorkerOptions.disableAutoFetch = false;
  pdfjs.GlobalWorkerOptions.disableStream = false;
};

/**
 * Default document loading options
 */
export const getDocumentLoadOptions = () => ({
  // Character maps for CJK languages
  cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/cmaps/',
  cMapPacked: true,
  
  // Standard fonts
  standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/standard_fonts/',
  
  // Memory and performance settings
  maxImageSize: 50 * 1024 * 1024, // 50MB max image size
  disableAutoFetch: false,
  disableStream: false,
  disableFontFace: false,
  
  // Error handling
  stopAtErrors: false, // Continue loading even if some pages have errors
  isEvalSupported: false, // Disable eval for security
  
  // Timeout settings
  httpHeaders: null,
  withCredentials: false,
  
  // Worker configuration
  useWorkerFetch: false,
  useSystemFonts: true,
  
  // Range requests for better streaming
  rangeChunkSize: 65536, // 64KB chunks
  
  // Verbosity
  verbosity: 1, // Errors only
});

/**
 * Page rendering options
 */
export const getPageRenderOptions = () => ({
  // Enable text layer for search and selection
  renderTextLayer: true,
  
  // Enable annotation layer for forms and links
  renderAnnotationLayer: true,
  
  // Rendering intent
  intent: 'display',
  
  // Image smoothing
  enableWebGL: false,
  renderInteractiveForms: true,
  
  // Text layer options
  textLayerMode: 1, // ENABLE
  
  // Annotation layer options
  annotationMode: 2, // ENABLE_FORMS
});

/**
 * Handle PDF.js errors gracefully
 */
export const handlePDFError = (error, context = 'PDF') => {
  // console.error(`${context} Error:`, error);
  
  // Check for specific error types
  if (error.message?.includes('Worker')) {
    // console.warn('Worker-related error detected. This is usually non-critical.');
    return {
      isWorkerError: true,
      shouldRetry: false,
      message: 'PDF worker encountered an issue, but rendering will continue'
    };
  }
  
  if (error.message?.includes('terminated')) {
    // console.warn('Worker was terminated. This can happen with large PDFs.');
    return {
      isWorkerError: true,
      shouldRetry: true,
      message: 'Worker was terminated, retrying...'
    };
  }
  
  if (error.message?.includes('Invalid PDF')) {
    return {
      isWorkerError: false,
      shouldRetry: false,
      message: 'The PDF file appears to be corrupted or invalid'
    };
  }
  
  return {
    isWorkerError: false,
    shouldRetry: false,
    message: error.message || 'Unknown PDF error'
  };
};

/**
 * Cleanup PDF resources
 */
export const cleanupPDFResources = (documentProxy) => {
  if (documentProxy) {
    try {
      documentProxy.cleanup();
      documentProxy.destroy();
    } catch (error) {
      // console.warn('Error during PDF cleanup:', error);
    }
  }
};

/**
 * Create a resilient document loader with retry logic
 */
export const loadDocumentWithRetry = async (source, maxRetries = 3) => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {      
      const loadingTask = pdfjs.getDocument({
        url: source,
        ...getDocumentLoadOptions()
      });
      
      const pdf = await loadingTask.promise;
      return { success: true, pdf };
      
    } catch (error) {
      lastError = error;
      const errorInfo = handlePDFError(error, 'Document Load');
      
      // console.warn(`Attempt ${attempt} failed:`, errorInfo.message);
      
      if (!errorInfo.shouldRetry || attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return {
    success: false,
    error: lastError,
    message: 'Failed to load PDF after multiple attempts'
  };
};

/**
 * Batch process PDF pages to avoid overwhelming the worker
 */
export const processPagesInBatches = async (pdf, batchSize = 5, processPage) => {
  const numPages = pdf.numPages;
  const results = [];
  
  for (let i = 1; i <= numPages; i += batchSize) {
    const batch = [];
    const endPage = Math.min(i + batchSize - 1, numPages);    
    for (let pageNum = i; pageNum <= endPage; pageNum++) {
      batch.push(
        pdf.getPage(pageNum)
          .then(page => processPage(page, pageNum))
          .catch(error => {
            // console.warn(`Error processing page ${pageNum}:`, error);
            return null; // Continue with other pages
          })
      );
    }
    
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    
    // Small delay between batches to prevent worker overload
    if (endPage < numPages) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results.filter(r => r !== null);
};

/**
 * Monitor worker health
 */
export const createWorkerHealthMonitor = () => {
  let workerErrors = 0;
  let lastErrorTime = null;
  
  return {
    recordError: () => {
      workerErrors++;
      lastErrorTime = Date.now();
      
      if (workerErrors > 5) {
        // console.warn('Multiple worker errors detected. Consider reducing concurrent page loads.');
      }
    },
    
    getStatus: () => ({
      errorCount: workerErrors,
      lastErrorTime,
      isHealthy: workerErrors < 10
    }),
    
    reset: () => {
      workerErrors = 0;
      lastErrorTime = null;
    }
  };
};

// Initialize configuration on module load
configurePDFWorker();

export default {
  configurePDFWorker,
  getDocumentLoadOptions,
  getPageRenderOptions,
  handlePDFError,
  cleanupPDFResources,
  loadDocumentWithRetry,
  processPagesInBatches,
  createWorkerHealthMonitor
};