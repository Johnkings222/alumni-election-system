from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class Position(str, Enum):
    PRESIDENT = "President"
    VP = "Vice President"
    GEN_SEC = "General Secretary"
    FIN_SEC = "Financial Secretary"
    TREASURER = "Treasurer"
    AUDITOR = "Auditor"
    PRO = "Public Relations Officer"

class VoterCreate(BaseModel):
    code: str

class VoterResponse(BaseModel):
    id: str
    code: str
    has_voted: bool
    voted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CandidateBase(BaseModel):
    name: str
    position: Position
    bio: Optional[str] = None
    photo_url: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    id: str

    class Config:
        from_attributes = True

class VoteItem(BaseModel):
    position: Position
    candidateId: str

class VoteSubmission(BaseModel):
    votingCode: str
    votes: List[VoteItem]

class VerifyCodeRequest(BaseModel):
    code: str

class VerifyCodeResponse(BaseModel):
    success: bool
    message: str

class CandidateResultItem(BaseModel):
    candidateId: str
    name: str
    voteCount: int

class PositionResults(BaseModel):
    position: Position
    candidates: List[CandidateResultItem]

class ElectionSettingsResponse(BaseModel):
    start_time: datetime
    end_time: datetime
    is_active: bool

    class Config:
        from_attributes = True

class GenerateVotersRequest(BaseModel):
    count: int

class GenerateVotersResponse(BaseModel):
    success: bool
    codes: List[str]

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    message: str
