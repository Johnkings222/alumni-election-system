from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
from app.database.config import get_db
from app.models.models import Vote, Voter, Candidate
from app.schemas.schemas import VoteSubmission, PositionResults, CandidateResultItem, Position

router = APIRouter(prefix="/votes", tags=["votes"])

@router.post("/submit")
async def submit_votes(submission: VoteSubmission, db: Session = Depends(get_db)):
    voter = db.query(Voter).filter(Voter.code == submission.votingCode.upper()).first()

    if not voter:
        raise HTTPException(status_code=400, detail="Invalid voting code")

    if voter.has_voted:
        raise HTTPException(status_code=400, detail="This code has already been used")

    if len(submission.votes) != 7:
        raise HTTPException(status_code=400, detail="Must vote for all 7 positions")

    try:
        for vote_item in submission.votes:
            candidate = db.query(Candidate).filter(Candidate.id == vote_item.candidateId).first()
            if not candidate:
                raise HTTPException(status_code=400, detail=f"Invalid candidate ID: {vote_item.candidateId}")

            vote = Vote(
                voter_id=voter.id,
                candidate_id=vote_item.candidateId,
                position=vote_item.position.value
            )
            db.add(vote)

        voter.has_voted = True
        voter.voted_at = datetime.utcnow()

        db.commit()

        return {"success": True, "message": "Votes submitted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results", response_model=List[PositionResults])
async def get_results(db: Session = Depends(get_db)):
    results = []

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
        ).all()

        candidate_results = [
            CandidateResultItem(
                candidateId=candidate_id,
                name=name,
                voteCount=vote_count
            )
            for candidate_id, name, vote_count in vote_counts
        ]

        results.append(PositionResults(
            position=position,
            candidates=candidate_results
        ))

    return results
