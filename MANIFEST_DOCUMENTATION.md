# Manifest.json Documentation

This file explains each field in the `manifest.json` file for the Modal XML Downloader Chrome extension.

## Complete Manifest Breakdown

```json
{
  "manifest_version": 3,
  "name": "Modal XML Downloader",
  "version": "1.0",
  "description": "Downloads XML content from modals on maintenance pages",
  "permissions": [
    "activeTab",
    "downloads"
  ],
  "content_scripts": [
    {
      "matches": [
        "*://*/maintenance*"
      ],
      "js": [
        "content.js"
      ],
      "css": [
        "styles.css"
      ],
      "run_at": "document_idle"
    }
  ]
}
```

## Field Explanations

### `manifest_version: 3`
- **Purpose**: Specifies the manifest format version
- **Current Standard**: Version 3 (Manifest V2 is deprecated)
- **Migration**: All new extensions should use V3
- **Benefits**: Better security, performance, and future-proofing

### `name: "Modal XML Downloader"`
- **Purpose**: Extension display name
- **Visibility**: Shown in Chrome Web Store, extension management, and user interfaces
- **Best Practices**:
  - Keep under 45 characters
  - Use descriptive, searchable keywords
  - Avoid special characters

### `version: "1.0"`
- **Purpose**: Extension version number
- **Format**: Must follow semantic versioning (major.minor.patch)
- **Auto-updates**: Chrome uses this to determine when to update
- **Example progression**: 1.0 → 1.1 → 1.2 → 2.0

### `description: "Downloads XML content from modals on maintenance pages"`
- **Purpose**: Brief extension description
- **Visibility**: Shown in Chrome Web Store and extension management
- **Best Practices**:
  - Keep under 132 characters
  - Clearly explain main functionality
  - Include relevant keywords for search

### `permissions: ["activeTab", "downloads"]`
Permissions define what Chrome APIs the extension can access:

#### `"activeTab"`
- **Scope**: Access to currently active tab when user interacts with extension
- **Security**: More secure than broad host permissions
- **Usage**: Perfect for extensions that work on-demand
- **Alternative**: `"tabs"` for access to all tabs (more intrusive)

#### `"downloads"`
- **Scope**: Access to Chrome's download system
- **Usage**: Required for `chrome.downloads` API (not used in current implementation)
- **Note**: Our extension uses Blob + URL.createObjectURL instead
- **Future-proofing**: Keeps option open for enhanced download features

### `content_scripts: [...]`
Defines JavaScript and CSS files to inject into web pages:

#### `"matches": ["*://*/maintenance*"]`
- **Purpose**: URL patterns where the script should run
- **Pattern Breakdown**:
  - `*://` - Any protocol (http:// or https://)
  - `*` - Any domain/subdomain
  - `/maintenance*` - Paths starting with "/maintenance"
- **Examples of matching URLs**:
  - `https://example.com/maintenance`
  - `http://app.company.com/maintenance#!/logs`
  - `https://subdomain.site.org/maintenance/dashboard`
- **Security**: Specific patterns reduce attack surface

#### `"js": ["content.js"]`
- **Purpose**: JavaScript files to inject
- **Execution Order**: Files are injected in array order
- **Context**: Runs in isolated environment (can't access page's JavaScript variables directly)
- **Best Practice**: One main file that imports others if needed

#### `"css": ["styles.css"]`
- **Purpose**: CSS files to inject
- **Scope**: Styles apply to the entire page
- **Specificity**: Use specific selectors to avoid conflicts with page styles
- **Performance**: Keep minimal and efficient

#### `"run_at": "document_idle"`
Controls when the script is injected:

**Options**:
- `"document_start"`: Before DOM construction (rare use cases)
- `"document_end"`: After DOM construction, before window.onload
- `"document_idle"`: After DOM and all resources load (recommended)

**Chosen Option Benefits**:
- DOM is fully constructed and ready
- Images and other resources are loaded
- Page is in stable state
- Best for most content script use cases

## Additional Manifest Fields (Not Used in This Extension)

### Background Scripts
```json
"background": {
  "service_worker": "background.js"
}
```
- Used for long-running tasks and event handling
- Replaces background pages from Manifest V2

### Extension Action (Popup/Badge)
```json
"action": {
  "default_popup": "popup.html",
  "default_title": "Extension Name",
  "default_icon": "icons/icon16.png"
}
```
- Creates clickable extension icon in toolbar
- Can show popup or just trigger background script

### Host Permissions
```json
"host_permissions": [
  "https://api.example.com/*"
]
```
- Broader permissions for specific hosts
- Required for cross-origin requests
- More intrusive than activeTab

### Web Accessible Resources
```json
"web_accessible_resources": [
  {
    "resources": ["images/*.png"],
    "matches": ["https://example.com/*"]
  }
]
```
- Makes extension files accessible to web pages
- Required for resources referenced by injected content

### Icons
```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```
- Different sizes for different contexts
- 16px: Favicon, extension pages
- 48px: Extension management page
- 128px: Chrome Web Store

### Options Page
```json
"options_page": "options.html"
```
- Settings/configuration page for the extension
- Accessible from Chrome's extension management

## Security Considerations

### Minimal Permissions Principle
This extension follows security best practices:
- Uses `activeTab` instead of broad host permissions
- Specific URL matching patterns
- No unnecessary API permissions

### Content Security Policy
Manifest V3 automatically enforces strict CSP:
- No inline scripts in extension pages
- No eval() or similar dynamic code execution
- External scripts must be bundled

### Permission Justification
Each permission should be justified:
- `activeTab`: Required to access page content for XML extraction
- `downloads`: Future-proofing for enhanced download features

## Best Practices Applied

1. **Specificity**: URL patterns are as specific as possible
2. **Minimal Permissions**: Only request what's absolutely needed
3. **Clear Naming**: Extension name and description are descriptive
4. **Future-Proofing**: Uses latest manifest version
5. **Performance**: Content script runs at optimal timing
6. **Security**: Follows Chrome's security guidelines

## Testing the Manifest

To validate your manifest:
1. Load extension in Developer mode
2. Check for warnings in chrome://extensions/
3. Verify permissions shown to users are acceptable
4. Test URL pattern matching on target sites
5. Confirm script injection timing works correctly

## Common Manifest Errors

### Invalid JSON
- Missing commas between fields
- Trailing commas (not allowed in JSON)
- Comments (use external documentation instead)

### Permission Issues
- Requesting more permissions than needed
- Using deprecated permission names
- Not requesting required permissions for APIs used

### URL Pattern Problems
- Overly broad patterns (security risk)
- Patterns that don't match target sites
- Incorrect pattern syntax

### Script Injection Issues
- Wrong run_at timing for script needs
- Missing required files
- File paths incorrect relative to extension root

This manifest is designed to be minimal yet effective, demonstrating Chrome extension best practices while providing a solid foundation for the XML downloader functionality.