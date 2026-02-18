from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database.config import Base

def generate_uuid():
    return str(uuid.uuid4())

class Voter(Base):
    __tablename__ = "voters"

    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(String, unique=True, nullable=False, index=True)
    has_voted = Column(Boolean, default=False)
    voted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    bio = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    votes = relationship("Vote", back_populates="candidate")

class Vote(Base):
    __tablename__ = "votes"

    id = Column(String, primary_key=True, default=generate_uuid)
    voter_id = Column(String, ForeignKey("voters.id"), nullable=False)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    position = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="votes")

class ElectionSettings(Base):
    __tablename__ = "election_settings"

    id = Column(Integer, primary_key=True, default=1)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
