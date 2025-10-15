#!/bin/bash

# Build script for Chrome Extension - Multi-browser support
# Creates packages for Chrome/Edge and Firefox

echo "Building Modal XML Downloader for multiple browsers..."

# Create build directory
mkdir -p build
rm -rf build/*

# Chrome/Edge build
echo "📦 Building for Chrome/Edge..."
mkdir -p build/chrome-edge
cp manifest.json build/chrome-edge/
cp content.js build/chrome-edge/
cp styles.css build/chrome-edge/
cp -r icons build/chrome-edge/ 2>/dev/null || echo "ℹ️  No icons directory found"

# Firefox build
echo "🦊 Building for Firefox..."
mkdir -p build/firefox
cp manifest_firefox.json build/firefox/manifest.json
cp content.js build/firefox/
cp styles.css build/firefox/
cp -r icons build/firefox/ 2>/dev/null || echo "ℹ️  No icons directory found"

# Create ZIP packages
echo "📁 Creating ZIP packages..."
cd build

# Chrome/Edge ZIP
cd chrome-edge
zip -r ../modal-xml-downloader-chrome-edge.zip . -q
cd ..

# Firefox ZIP
cd firefox
zip -r ../modal-xml-downloader-firefox.zip . -q
cd ..

cd ..

echo "✅ Build complete!"
echo "📂 Files created:"
echo "   - build/modal-xml-downloader-chrome-edge.zip (for Chrome & Edge)"
echo "   - build/modal-xml-downloader-firefox.zip (for Firefox)"
echo ""
echo "🚀 Installation instructions:"
echo "   Chrome/Edge: Load unpacked extension from build/chrome-edge/ or upload ZIP to store"
echo "   Firefox: Load temporary add-on from build/firefox/ or submit ZIP to AMO"