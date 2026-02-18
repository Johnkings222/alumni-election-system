from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.models.models import ElectionSettings
from app.schemas.schemas import ElectionSettingsResponse
from datetime import datetime, timedelta

router = APIRouter(prefix="/election", tags=["election"])

@router.get("/settings", response_model=ElectionSettingsResponse)
async def get_election_settings(db: Session = Depends(get_db)):
    settings = db.query(ElectionSettings).first()

    if not settings:
        settings = ElectionSettings(
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow() + timedelta(days=7),
            is_active=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings
