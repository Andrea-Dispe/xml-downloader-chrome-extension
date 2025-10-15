@echo off
REM Build script for Chrome Extension - Multi-browser support
REM Creates packages for Chrome/Edge and Firefox

echo Building Modal XML Downloader for multiple browsers...

REM Create build directory
if exist build rmdir /s /q build
mkdir build

REM Chrome/Edge build
echo 📦 Building for Chrome/Edge...
mkdir build\chrome-edge
copy manifest.json build\chrome-edge\
copy content.js build\chrome-edge\
copy styles.css build\chrome-edge\
if exist icons xcopy icons build\chrome-edge\icons\ /e /i /q >nul 2>&1

REM Firefox build
echo 🦊 Building for Firefox...
mkdir build\firefox
copy manifest_firefox.json build\firefox\manifest.json
copy content.js build\firefox\
copy styles.css build\firefox\
if exist icons xcopy icons build\firefox\icons\ /e /i /q >nul 2>&1

REM Create ZIP packages (requires PowerShell)
echo 📁 Creating ZIP packages...
powershell -Command "Compress-Archive -Path 'build\chrome-edge\*' -DestinationPath 'build\modal-xml-downloader-chrome-edge.zip' -Force"
powershell -Command "Compress-Archive -Path 'build\firefox\*' -DestinationPath 'build\modal-xml-downloader-firefox.zip' -Force"

echo ✅ Build complete!
echo 📂 Files created:
echo    - build\modal-xml-downloader-chrome-edge.zip (for Chrome ^& Edge)
echo    - build\modal-xml-downloader-firefox.zip (for Firefox)
echo.
echo 🚀 Installation instructions:
echo    Chrome/Edge: Load unpacked extension from build\chrome-edge\ or upload ZIP to store
echo    Firefox: Load temporary add-on from build\firefox\ or submit ZIP to AMO

pause