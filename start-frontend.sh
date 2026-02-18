#!/bin/bash

echo "=================================================="
echo "Starting Alumni Election System - Frontend"
echo "=================================================="

cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting Vite dev server on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

npm run dev
