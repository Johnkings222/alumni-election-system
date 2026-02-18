from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import secrets
import string
import os
import io
import csv
from app.database.config import get_db
from app.models.models import Candidate, Voter, Vote
from app.schemas.schemas import (
    CandidateCreate, CandidateResponse,
    GenerateVotersRequest, GenerateVotersResponse,
    AdminLoginRequest, AdminLoginResponse,
    VoterResponse, Position
)

router = APIRouter(prefix="/admin", tags=["admin"])

def generate_code(length=8):
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(request: AdminLoginRequest):
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "changeme123")

    if request.username == admin_username and request.password == admin_password:
        return AdminLoginResponse(success=True, message="Login successful")

    return AdminLoginResponse(success=False, message="Invalid credentials")

@router.post("/candidates", response_model=CandidateResponse)
async def add_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    new_candidate = Candidate(
        name=candidate.name,
        position=candidate.position.value,
        bio=candidate.bio,
        photo_url=candidate.photo_url
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)
    return new_candidate

@router.get("/voters", response_model=List[VoterResponse])
async def list_voters(db: Session = Depends(get_db)):
    return db.query(Voter).order_by(Voter.created_at).all()

@router.post("/voters/generate", response_model=GenerateVotersResponse)
async def generate_voter_codes(request: GenerateVotersRequest, db: Session = Depends(get_db)):
    codes = []

    for _ in range(request.count):
        code = generate_code()
        while db.query(Voter).filter(Voter.code == code).first():
            code = generate_code()

        voter = Voter(code=code)
        db.add(voter)
        codes.append(code)

    db.commit()

    return GenerateVotersResponse(success=True, codes=codes)

@router.delete("/candidates/{candidate_id}")
async def remove_candidate(candidate_id: str, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    db.delete(candidate)
    db.commit()
    return {"success": True, "message": f"Candidate removed"}

@router.delete("/reset")
async def reset_election(db: Session = Depends(get_db)):
    db.query(Vote).delete()
    db.query(Voter).delete()
    db.query(Candidate).delete()
    db.commit()
    return {"success": True, "message": "Election reset successfully"}

@router.get("/export/csv")
async def export_results_csv(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(['Position', 'Rank', 'Candidate', 'Votes', 'Percentage'])

    for position in Position:
        vote_counts = db.query(
            Candidate.id,
            Candidate.name,
            func.count(Vote.id).label('vote_count')
        ).outerjoin(
            Vote,
            (Vote.candidate_id == Candidate.id) & (Vote.position == position.value)
        ).filter(
            Candidate.position == position.value
        ).group_by(
            Candidate.id, Candidate.name
        ).order_by(
            func.count(Vote.id).desc()
        ).all()

        total_votes = sum(count for _, _, count in vote_counts)

        for rank, (candidate_id, name, vote_count) in enumerate(vote_counts, 1):
            percentage = (vote_count / total_votes * 100) if total_votes > 0 else 0
            writer.writerow([
                position.value,
                rank,
                name,
                vote_count,
                f"{percentage:.1f}%"
            ])

        writer.writerow([])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=election-results.csv"}
    )

@router.get("/export/pdf")
async def export_results_pdf():
    raise HTTPException(
        status_code=501,
        detail="PDF export requires additional dependencies. Use CSV export instead or install reportlab."
    )
