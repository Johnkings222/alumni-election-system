@echo off
echo ==================================================
echo Starting Alumni Election System - Backend
echo ==================================================

cd backend

if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

if not exist "venv\.dependencies_installed" (
    echo Installing dependencies...
    pip install -r requirements.txt
    type nul > venv\.dependencies_installed
)

if not exist "data\election.db" (
    echo.
    echo Database not found. Running seed script...
    python seed_data.py
    echo.
)

echo Starting FastAPI server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ==================================================

uvicorn app.main:app --reload --port 8000
