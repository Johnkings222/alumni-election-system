from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.config import get_db
from app.models.models import Candidate
from app.schemas.schemas import CandidateResponse

router = APIRouter(prefix="/candidates", tags=["candidates"])

@router.get("", response_model=List[CandidateResponse])
async def get_all_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).all()
    return candidates
