
class ModalXMLDownloader {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if (!window.location.href.includes('maintenance#!/logs')) {
      return;
    }

    this.observeForModals();

    this.checkExistingModals();
  }

  observeForModals() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {

            const modal = node.classList?.contains('modal-content')
              ? node
              : node.querySelector?.('.modal-content');

            if (modal) {
              this.addDownloadButton(modal);
            }
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  checkExistingModals() {
    const existingModals = document.querySelectorAll('.modal-content');
    existingModals.forEach(modal => {
      this.addDownloadButton(modal);
    });
  }

  addDownloadButton(modal) {
    if (modal.querySelector('.xml-download-btn')) {
      return;
    }

    const preElement = modal.querySelector('pre.pre-scrollable.ng-binding.ng-scope');
    if (!preElement) {
      return;
    }

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'xml-download-btn';
    downloadBtn.textContent = 'Download XML';
    downloadBtn.title = 'Download XML content from this modal';

    downloadBtn.addEventListener('click', () => {
      this.downloadXML(preElement, modal);
    });

    const modalHeader = modal.querySelector('.modal-header');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');

    if (modalHeader) {

      modalHeader.appendChild(downloadBtn);
    } else if (modalFooter) {

      modalFooter.appendChild(downloadBtn);
    } else if (modalBody) {

      modalBody.insertBefore(downloadBtn, modalBody.firstChild);
    } else {

      modal.insertBefore(downloadBtn, modal.firstChild);
    }
  }

  downloadXML(preElement, modal) {
    try {

      const xmlContent = preElement.textContent || preElement.innerText;

      if (!xmlContent.trim()) {
        alert('No XML content found to download.');
        return;
      }


      let filename = this.extractFilename(modal);


      const blob = new Blob([xmlContent], { type: 'application/xml' });


      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;


      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);


      URL.revokeObjectURL(url);

      console.log('XML file downloaded successfully as:', filename);
    } catch (error) {
      console.error('Error downloading XML:', error);
      alert('Error downloading XML file. Please try again.');
    }
  }

  extractFilename(modal) {
    try {

      const modalHeader = modal.querySelector('.modal-header.ng-scope');
      if (!modalHeader) {
        console.warn('Modal header not found, using default filename');
        return this.getDefaultFilename();
      }

      const strongElement = modalHeader.querySelector('strong.ng-binding');
      if (!strongElement) {
        console.warn('Strong element with ng-binding class not found, using default filename');
        return this.getDefaultFilename();
      }

      const fullText = strongElement.textContent || strongElement.innerText;
      if (!fullText.trim()) {
        console.warn('No text found in strong element, using default filename');
        return this.getDefaultFilename();
      }


      const lastSlashIndex = fullText.lastIndexOf('/');
      if (lastSlashIndex === -1) {
        console.warn('No "/" found in text, using full text as filename');
        return this.sanitizeFilename(fullText.trim());
      }

      const extractedFilename = fullText.substring(lastSlashIndex + 1).trim();
      if (!extractedFilename) {
        console.warn('Empty filename after last "/", using default filename');
        return this.getDefaultFilename();
      }

      console.log('Extracted filename from modal header:', extractedFilename);
      return this.sanitizeFilename(extractedFilename);

    } catch (error) {
      console.error('Error extracting filename:', error);
      return this.getDefaultFilename();
    }
  }

  sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*]/g, '_');
  }

  getDefaultFilename() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `modal-content-${timestamp}.xml`;
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.modalXMLDownloader = new ModalXMLDownloader();
  });
} else {
  window.modalXMLDownloader = new ModalXMLDownloader();
}