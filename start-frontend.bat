@echo off
echo ==================================================
echo Starting Alumni Election System - Frontend
echo ==================================================

cd frontend

if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting Vite dev server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ==================================================

npm run dev
