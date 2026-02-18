#!/bin/bash

echo "=================================================="
echo "Starting Alumni Election System - Backend"
echo "=================================================="

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.dependencies_installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    touch venv/.dependencies_installed
fi

# Check if database exists
if [ ! -f "data/election.db" ]; then
    echo ""
    echo "Database not found. Running seed script..."
    python seed_data.py
    echo ""
fi

echo "Starting FastAPI server on http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

uvicorn app.main:app --reload --port 8000
