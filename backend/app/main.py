from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.config import engine, Base
from app.routers import auth, candidates, votes, election, admin
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Alumni Election System", version="1.0.0")

# Get allowed origins from environment or use defaults
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost,http://127.0.0.1:3000"
).split(",")

# In production, you can set ALLOWED_ORIGINS="https://yourdomain.com"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(candidates.router, prefix="/api")
app.include_router(votes.router, prefix="/api")
app.include_router(election.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Alumni Election System API", "version": "1.0.0"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}
