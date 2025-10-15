# Modal XML Downloader Chrome Extension

A Chrome extension that adds a download button to modals on maintenance pages, allowing users to download XML content from specific pre elements.

## Features

- **Automatic Detection**: Detects when modals with class `modal-content` appear on pages ending with `maintenance#!/logs`
- **Smart Button Placement**: Automatically places download button in the most appropriate location within the modal
- **XML Content Extraction**: Extracts content from `pre` elements with classes `pre-scrollable ng-binding ng-scope`
- **One-Click Download**: Downloads the XML content as a timestamped file
- **Intelligent Filename Extraction**: Automatically extracts meaningful filenames from modal headers
- **Memory Management**: Properly cleans up observers and resources

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this extension directory
4. The extension will be automatically active on matching pages

## Usage

1. Navigate to a page with URL ending in `maintenance#!/logs`
2. Click on any link that opens a modal with class `modal-content`
3. If the modal contains XML content in a `pre` element with the required classes, a "Download XML" button will appear
4. Click the button to download the XML content as a file

## Technical Details

### Files Structure

- `manifest.json` - Extension configuration and permissions
- `content.js` - Main functionality for detecting modals and handling downloads (heavily commented)
- `styles.css` - Styling for the download button (with detailed comments)
- `icons/` - Extension icons (placeholder files needed)

### Documentation

This extension includes comprehensive documentation:

- **[CHROME_EXTENSION_GUIDE.md](./CHROME_EXTENSION_GUIDE.md)** - Complete guide to Chrome extension development best practices
- **[MANIFEST_DOCUMENTATION.md](./MANIFEST_DOCUMENTATION.md)** - Detailed explanation of every manifest.json field

### Code Architecture

The extension uses several best practices:

- **Class-based Architecture**: Organized using ES6 classes for better structure
- **Defensive Programming**: Extensive error handling and null checks
- **Memory Management**: Proper cleanup of observers and event listeners
- **Non-intrusive DOM Manipulation**: Safely adds functionality without breaking existing pages
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### Key Components

#### ModalXMLDownloader Class
- `init()` - Initializes the extension with URL validation
- `observeForModals()` - Sets up MutationObserver for dynamic content
- `checkExistingModals()` - Handles modals already present on page load
- `addDownloadButton()` - Intelligently places download button in modals
- `downloadXML()` - Handles file creation and download using Blob API
- `extractFilename()` - Extracts meaningful filenames from modal headers
- `destroy()` - Proper cleanup to prevent memory leaks

### Permissions

- `activeTab` - Access to the current tab to inject content scripts
- `downloads` - Permission to download files to the user's computer

### Browser Compatibility

- Chrome (Manifest V3)
- Chromium-based browsers

## Development

### Building

No build process required. This is a vanilla JavaScript extension with comprehensive commenting.

### Code Quality Features

- **Extensive Documentation**: Every function and code block is thoroughly commented
- **Error Handling**: Try-catch blocks with meaningful error messages
- **Logging**: Consistent console logging for debugging
- **Performance Optimization**: Efficient DOM queries and event handling
- **Security**: Input sanitization and XSS prevention

### Testing

1. Load the extension in developer mode
2. Navigate to a test page with the target URL pattern
3. Open a modal and verify the download button appears
4. Test the download functionality
5. Check browser console for any errors or warnings

### Customization

You can modify the following in `content.js`:

- **URL Pattern**: Change the URL matching pattern in the `init()` method
- **Modal Selector**: Modify the `.modal-content` selector to match your specific modal structure
- **Pre Element Selector**: Update the `pre.pre-scrollable.ng-binding.ng-scope` selector as needed
- **Button Placement**: Customize where the button appears in the modal
- **Styling**: Modify `styles.css` for different visual appearance

## Chrome Extension Best Practices Demonstrated

This extension serves as an educational example of Chrome extension development best practices:

1. **Manifest V3 Compliance**: Uses the latest manifest format
2. **Minimal Permissions**: Requests only necessary permissions
3. **Content Script Best Practices**: Proper initialization and cleanup
4. **DOM Manipulation Safety**: Non-destructive modifications
5. **Error Handling**: Comprehensive error handling and logging
6. **Performance**: Efficient observers and memory management
7. **Accessibility**: Proper ARIA attributes and keyboard support
8. **Security**: Input sanitization and secure coding practices

## Troubleshooting

### Button Not Appearing

1. Check that you're on the correct page (URL ends with `maintenance#!/logs`)
2. Verify the modal has class `modal-content`
3. Ensure the modal contains a `pre` element with the required classes
4. Check the browser console for any JavaScript errors
5. Verify the extension is enabled in `chrome://extensions/`

### Download Not Working

1. Verify the `pre` element contains content
2. Check that the browser allows downloads from the extension
3. Look for any popup blockers that might interfere with downloads
4. Check browser console for error messages

### Performance Issues

The extension uses MutationObserver to detect modals, which is efficient but may impact performance on pages with frequent DOM changes. The implementation includes:

- Throttled mutation processing
- Efficient DOM queries
- Proper observer cleanup
- Memory leak prevention

## Learning Resources

- Read the included guides for comprehensive Chrome extension development knowledge
- Examine the heavily commented source code
- Follow the security and performance best practices demonstrated
- Use this as a starting point for your own Chrome extension projects

## License

This project is open source and available under the MIT License.