from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.models.models import Voter
from app.schemas.schemas import VerifyCodeRequest, VerifyCodeResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/verify", response_model=VerifyCodeResponse)
async def verify_code(request: VerifyCodeRequest, db: Session = Depends(get_db)):
    voter = db.query(Voter).filter(Voter.code == request.code.upper()).first()

    if not voter:
        return VerifyCodeResponse(success=False, message="Invalid voting code")

    if voter.has_voted:
        return VerifyCodeResponse(success=False, message="This code has already been used")

    return VerifyCodeResponse(success=True, message="Code verified successfully")
