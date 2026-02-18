# Quick Start Guide

Get the Alumni Election System up and running in minutes!

## Prerequisites

- **Node.js** 18+ and npm (for frontend)
- **Python** 3.9+ (for backend)

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample data
python seed_data.py
```

This will create:
- 18 sample candidates across 7 positions
- 20 voting codes
- A `voting_codes.txt` file with all codes

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## Test the System

### As a Voter

1. Go to http://localhost:3000
2. Enter one of the voting codes from `backend/voting_codes.txt`
3. Vote for candidates (one per position)
4. Submit your ballot
5. View live results

### As an Administrator

1. Go to http://localhost:3000/admin
2. Login with:
   - Username: `admin`
   - Password: `changeme123`
3. Manage candidates, generate voter codes, or export results

## Sample Voting Codes

The seed script generates 20 codes. Check `backend/voting_codes.txt` for the complete list, or run the seed script again to see codes in the terminal.

## Features to Test

1. **Voting Flow**
   - Code verification
   - Ballot casting
   - One-time code usage

2. **Live Results**
   - Real-time vote counting
   - Auto-refresh every 5 seconds
   - Visual vote bars

3. **Admin Dashboard**
   - Add new candidates
   - Generate voting codes
   - Export results to CSV

4. **Mobile Responsive**
   - Test on different screen sizes
   - Works great on phones and tablets

## Troubleshooting

**Backend won't start?**
- Make sure Python virtual environment is activated
- Check that port 8000 is not in use

**Frontend won't start?**
- Make sure dependencies are installed: `npm install`
- Check that port 3000 is not in use

**Database issues?**
- Delete `backend/data/election.db` and run `python seed_data.py` again

**CORS errors?**
- Ensure backend is running on port 8000
- Frontend proxy is configured in `vite.config.ts`

## Next Steps

1. Customize candidate list in `backend/seed_data.py`
2. Update admin credentials in `backend/.env`
3. Modify styling in `frontend/src/styles/index.css`
4. Set election start/end dates in admin dashboard

## Production Deployment

Before deploying to production:

1. Change admin password in `.env`
2. Update CORS origins in `backend/app/main.py`
3. Use PostgreSQL instead of SQLite
4. Enable HTTPS
5. Set up proper authentication
6. Configure environment variables securely

Enjoy your election! 🗳️
