
/**
 * Chrome Extension Content Script: Modal XML Downloader
 *
 * This content script monitors maintenance pages for modal dialogs containing XML content
 * and automatically adds download buttons to save the XML content as files.
 *
 * Key Features:
 * - Uses MutationObserver to detect dynamically added modals
 * - Extracts XML content from pre elements within modals
 * - Generates appropriate filenames from modal headers
 * - Creates downloadable files using Blob API and URL.createObjectURL
 *
 * Best Practices Implemented:
 * - Class-based architecture for better organization
 * - Defensive programming with try-catch blocks
 * - Memory management (cleaning up observers and object URLs)
 * - Non-intrusive DOM manipulation
 * - Accessibility considerations (proper button attributes)
 */

class ModalXMLDownloader {
  /**
   * Constructor initializes the downloader instance
   * Sets up the MutationObserver reference and starts initialization
   */
  constructor() {
    // Initialize the MutationObserver reference to null
    // This will be used to watch for DOM changes and detect new modals
    this.observer = null;

    // Start the initialization process
    this.init();
  }

  /**
   * Main initialization method
   * Checks if we're on the correct page and sets up modal detection
   *
   * Chrome Extension Best Practice: Always check the current URL to ensure
   * the content script only operates on intended pages, even if manifest
   * URL patterns are restrictive
   */
  init() {
    // URL validation: Only run on maintenance log pages
    // This provides an additional layer of safety beyond manifest.json matching
    if (!window.location.href.includes('maintenance#!/logs')) {
      console.log('ModalXMLDownloader: Not on maintenance logs page, exiting');
      return;
    }

    console.log('ModalXMLDownloader: Initializing on maintenance logs page');

    // Start observing for new modals that might be added dynamically
    this.observeForModals();

    // Check for any modals that already exist on the page
    this.checkExistingModals();
  }

  /**
   * Sets up a MutationObserver to detect dynamically added modal elements
   *
   * MutationObserver API Best Practices:
   * - Observe only necessary changes (childList, subtree)
   * - Process mutations efficiently in batches
   * - Always disconnect observers when no longer needed to prevent memory leaks
   *
   * This is crucial for Single Page Applications (SPAs) where content
   * is dynamically loaded without full page refreshes
   */
  observeForModals() {
    // Create a new MutationObserver to watch for DOM changes
    this.observer = new MutationObserver((mutations) => {
      // Process each mutation (DOM change) that occurred
      mutations.forEach((mutation) => {
        // Check each newly added node
        mutation.addedNodes.forEach((node) => {
          // Only process element nodes (ignore text nodes, comments, etc.)
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node itself is a modal or contains a modal
            // This handles both cases:
            // 1. The modal-content div is added directly
            // 2. A parent container with modal-content inside is added
            const modal = node.classList?.contains('modal-content')
              ? node
              : node.querySelector?.('.modal-content');

            // If we found a modal, add our download button to it
            if (modal) {
              console.log('ModalXMLDownloader: New modal detected, adding download button');
              this.addDownloadButton(modal);
            }
          }
        });
      });
    });

    // Start observing the document body for changes
    // childList: true - observe direct children being added/removed
    // subtree: true - observe all descendants, not just direct children
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('ModalXMLDownloader: MutationObserver started');
  }

  /**
   * Checks for modals that already exist on the page when the script loads
   *
   * This is important because:
   * - Modals might already be open when the content script runs
   * - MutationObserver only catches NEW additions, not existing content
   * - Ensures complete coverage regardless of timing
   */
  checkExistingModals() {
    // Find all existing modal elements on the page
    const existingModals = document.querySelectorAll('.modal-content');
    console.log(`ModalXMLDownloader: Found ${existingModals.length} existing modals`);

    // Add download buttons to each existing modal
    existingModals.forEach(modal => {
      this.addDownloadButton(modal);
    });
  }

  /**
   * Adds a download button to a modal if it contains XML content
   *
   * @param {Element} modal - The modal DOM element to add the button to
   *
   * Key Design Principles:
   * - Non-destructive: Doesn't modify existing content
   * - Idempotent: Can be called multiple times safely
   * - Defensive: Handles missing elements gracefully
   * - Accessible: Provides proper button attributes
   */
  addDownloadButton(modal) {
    // Prevent duplicate buttons - check if button already exists
    if (modal.querySelector('.xml-download-btn')) {
      console.log('ModalXMLDownloader: Download button already exists in this modal');
      return;
    }

    // Look for the pre element that contains XML content
    // This selector is specific to the application's DOM structure
    const preElement = modal.querySelector('pre.pre-scrollable.ng-binding.ng-scope');
    if (!preElement) {
      console.log('ModalXMLDownloader: No XML content pre element found in modal');
      return;
    }

    console.log('ModalXMLDownloader: Creating download button for modal with XML content');

    // Create the download button element
    const downloadBtn = document.createElement('button');

    // Set CSS class for styling (defined in styles.css)
    downloadBtn.className = 'xml-download-btn';

    // Set button text
    downloadBtn.textContent = 'Download XML';

    // Add title attribute for accessibility and user guidance
    downloadBtn.title = 'Download XML content from this modal';

    // Add ARIA label for screen readers
    downloadBtn.setAttribute('aria-label', 'Download XML content as file');

    // Set button type to prevent form submission if inside a form
    downloadBtn.type = 'button';

    // Add click event listener to handle the download action
    downloadBtn.addEventListener('click', () => {
      console.log('ModalXMLDownloader: Download button clicked');
      this.downloadXML(preElement, modal);
    });

    // Insert the button in the most appropriate location within the modal
    // Priority order: header > footer > body > beginning of modal
    const modalHeader = modal.querySelector('.modal-header');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');

    if (modalHeader) {
      // Best location: in the header next to title/close button
      modalHeader.appendChild(downloadBtn);
      console.log('ModalXMLDownloader: Button added to modal header');
    } else if (modalFooter) {
      // Second choice: in the footer with other action buttons
      modalFooter.appendChild(downloadBtn);
      console.log('ModalXMLDownloader: Button added to modal footer');
    } else if (modalBody) {
      // Third choice: at the top of the modal body
      modalBody.insertBefore(downloadBtn, modalBody.firstChild);
      console.log('ModalXMLDownloader: Button added to modal body');
    } else {
      // Fallback: at the very beginning of the modal
      modal.insertBefore(downloadBtn, modal.firstChild);
      console.log('ModalXMLDownloader: Button added to beginning of modal');
    }
  }

  /**
   * Downloads XML content from a pre element as a file
   *
   * @param {Element} preElement - The pre element containing XML content
   * @param {Element} modal - The modal element (used for filename extraction)
   *
   * This method demonstrates several important web APIs:
   * - Blob API: For creating file-like objects
   * - URL.createObjectURL: For creating downloadable URLs
   * - Programmatic link clicking: For triggering downloads
   * - Proper cleanup: Revoking object URLs to prevent memory leaks
   */
  downloadXML(preElement, modal) {
    try {
      // Extract XML content from the pre element
      // Use textContent (preferred) or innerText as fallback
      // textContent preserves formatting better than innerHTML
      const xmlContent = preElement.textContent || preElement.innerText;

      // Validate that we have content to download
      if (!xmlContent.trim()) {
        console.warn('ModalXMLDownloader: No XML content found in pre element');
        alert('No XML content found to download.');
        return;
      }

      console.log(`ModalXMLDownloader: Preparing to download XML content (${xmlContent.length} characters)`);

      // Extract or generate an appropriate filename
      let filename = this.extractFilename(modal);

      // Create a Blob object containing the XML content
      // Blob constructor takes an array of content and options
      // MIME type 'application/xml' helps browsers handle the file correctly
      const blob = new Blob([xmlContent], { type: 'application/xml' });

      // Create a temporary URL for the blob
      // This creates a special URL that points to the blob in memory
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element for downloading
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // This attribute triggers download instead of navigation

      // Add the element to DOM (required for Firefox compatibility)
      document.body.appendChild(a);

      // Programmatically click the link to start the download
      a.click();

      // Clean up: remove the temporary element
      document.body.removeChild(a);

      // IMPORTANT: Revoke the object URL to free up memory
      // Object URLs persist until the document is unloaded or explicitly revoked
      URL.revokeObjectURL(url);

      console.log('ModalXMLDownloader: XML file downloaded successfully as:', filename);

      // Optional: Show success feedback to user
      // Could be replaced with a more elegant notification system
      console.log('✓ XML download completed successfully');

    } catch (error) {
      // Comprehensive error handling with logging and user feedback
      console.error('ModalXMLDownloader: Error downloading XML:', error);
      alert('Error downloading XML file. Please try again.');

      // In production, you might want to report errors to an analytics service
      // or provide more specific error messages based on the error type
    }
  }

  /**
   * Extracts a meaningful filename from the modal header
   *
   * @param {Element} modal - The modal element to extract filename from
   * @returns {string} A sanitized filename for the XML file
   *
   * Filename Extraction Strategy:
   * 1. Look for specific elements in modal header that contain file paths
   * 2. Extract the last part of the path (actual filename)
   * 3. Sanitize for filesystem compatibility
   * 4. Fallback to timestamp-based name if extraction fails
   */
  extractFilename(modal) {
    try {
      // Look for the modal header with Angular scope class
      // This is specific to the application's framework (AngularJS)
      const modalHeader = modal.querySelector('.modal-header.ng-scope');
      if (!modalHeader) {
        console.warn('ModalXMLDownloader: Modal header not found, using default filename');
        return this.getDefaultFilename();
      }

      // Look for strong element with ng-binding class that typically contains the file path
      // This selector is specific to how the application displays file information
      const strongElement = modalHeader.querySelector('strong.ng-binding');
      if (!strongElement) {
        console.warn('ModalXMLDownloader: Strong element with ng-binding class not found, using default filename');
        return this.getDefaultFilename();
      }

      // Extract text content from the element
      const fullText = strongElement.textContent || strongElement.innerText;
      if (!fullText.trim()) {
        console.warn('ModalXMLDownloader: No text found in strong element, using default filename');
        return this.getDefaultFilename();
      }

      console.log('ModalXMLDownloader: Full text from modal header:', fullText);

      // Extract filename from path by finding the last occurrence of '/'
      // This handles both Unix-style (/) and potentially Windows-style (\) paths
      const lastSlashIndex = fullText.lastIndexOf('/');
      if (lastSlashIndex === -1) {
        console.warn('ModalXMLDownloader: No "/" found in text, using full text as filename');
        return this.sanitizeFilename(fullText.trim());
      }

      // Get everything after the last slash
      const extractedFilename = fullText.substring(lastSlashIndex + 1).trim();
      if (!extractedFilename) {
        console.warn('ModalXMLDownloader: Empty filename after last "/", using default filename');
        return this.getDefaultFilename();
      }

      console.log('ModalXMLDownloader: Extracted filename from modal header:', extractedFilename);
      return this.sanitizeFilename(extractedFilename);

    } catch (error) {
      // Robust error handling - always provide a fallback filename
      console.error('ModalXMLDownloader: Error extracting filename:', error);
      return this.getDefaultFilename();
    }
  }

  /**
   * Sanitizes a filename to be safe for filesystem use
   *
   * @param {string} filename - The original filename
   * @returns {string} A sanitized filename safe for all operating systems
   *
   * Security and Compatibility Considerations:
   * - Removes characters that are invalid in Windows/Linux/Mac filenames
   * - Prevents directory traversal attacks
   * - Ensures compatibility across different file systems
   */
  sanitizeFilename(filename) {
    // Replace problematic characters with underscores
    // Characters to avoid: < > : " / \ | ? *
    // These characters have special meaning in various operating systems
    const sanitized = filename.replace(/[<>:"/\\|?*]/g, '_');

    console.log(`ModalXMLDownloader: Sanitized filename from "${filename}" to "${sanitized}"`);
    return sanitized;
  }

  /**
   * Generates a default filename when extraction fails
   *
   * @returns {string} A timestamp-based default filename
   *
   * Fallback Strategy:
   * - Uses ISO timestamp for uniqueness
   * - Replaces colons and dots to avoid filesystem issues
   * - Includes descriptive prefix for easy identification
   */
  getDefaultFilename() {
    // Create ISO timestamp and make it filesystem-safe
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultName = `modal-content-${timestamp}.xml`;

    console.log('ModalXMLDownloader: Using default filename:', defaultName);
    return defaultName;
  }

  /**
   * Cleanup method to properly dispose of the observer
   *
   * Best Practice: Always provide cleanup methods for objects that:
   * - Hold references to DOM elements
   * - Use event listeners or observers
   * - Could cause memory leaks if not properly disposed
   *
   * This method should be called when the extension is disabled or the page unloads
   */
  destroy() {
    if (this.observer) {
      console.log('ModalXMLDownloader: Disconnecting MutationObserver');
      this.observer.disconnect();
      this.observer = null; // Clear the reference to help with garbage collection
    }
  }
}

/**
 * CONTENT SCRIPT INITIALIZATION
 *
 * This section handles the proper initialization of the content script
 * depending on the document's ready state.
 *
 * Chrome Extension Best Practices:
 * 1. Check document.readyState to handle different loading scenarios
 * 2. Use DOMContentLoaded for scripts that need DOM access
 * 3. Consider both early and late script injection scenarios
 */

// Check if the DOM is still loading
if (document.readyState === 'loading') {
  // DOM is still loading, wait for it to be ready
  console.log('ModalXMLDownloader: DOM still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('ModalXMLDownloader: DOM loaded, initializing extension');
    new ModalXMLDownloader();
  });
} else {
  // DOM is already loaded (interactive or complete), initialize immediately
  console.log('ModalXMLDownloader: DOM already loaded, initializing extension immediately');
  new ModalXMLDownloader();
}