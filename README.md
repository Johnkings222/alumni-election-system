# Alumni Election System 2003

A modern web application for conducting secure alumni elections with real-time results.

## Features

- **Unique Voting Codes**: One-time use codes for secure anonymous voting
- **7 Leadership Positions**: President, VP, Gen. Sec., Fin. Sec., Treasurer, Auditor, PRO
- **Live Results**: Real-time vote counting and display
- **Admin Dashboard**: Manage candidates, voters, and election settings
- **Mobile Optimized**: Responsive design for all devices
- **Modern & Minimal UI**: Clean, professional interface

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router (navigation)
- Axios (API calls)

### Backend
- FastAPI (Python)
- SQLAlchemy (ORM)
- SQLite (database)
- Pydantic (validation)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+

### Installation

1. **Clone the repository**
   ```bash
   cd alumni-election-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend** (in backend directory)
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start the frontend** (in frontend directory)
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Admin Access

Default credentials (change in `.env` file):
- Username: `admin`
- Password: `changeme123`

## Usage Guide

### For Administrators

1. **Add Candidates**
   - Go to `/admin` and login
   - Add candidates for each of the 7 positions

2. **Generate Voting Codes**
   - Specify the number of voters
   - System generates unique codes
   - Distribute codes to verified alumni

3. **Monitor Election**
   - View live results
   - Track voter participation
   - Export results when complete

### For Voters

1. **Enter Voting Code**
   - Go to the homepage
   - Enter your unique code

2. **Cast Your Ballot**
   - Select one candidate for each position
   - Review your choices
   - Submit ballot

3. **View Results**
   - See live results after voting
   - Results update automatically

## Database Schema

- **Voters**: Stores voting codes and participation status
- **Candidates**: Contains candidate information for all positions
- **Votes**: Records individual votes (anonymous, linked to voters)
- **ElectionSettings**: Manages election timing and status

## Security Features

- One-time use voting codes
- Anonymous voting (votes not traceable to individuals)
- Input validation at API boundary
- CORS whitelist for production
- Environment variables for secrets

## Development

### Project Structure
```
alumni-election-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── styles/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── database/
│   │   └── main.py
│   └── requirements.txt
└── README.md
```

## License

MIT License - See LICENSE file for details
