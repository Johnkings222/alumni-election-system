"""
Seed script to populate the database with sample data for testing.
Run this script from the backend directory: python seed_data.py
"""

import sys
import os
from datetime import datetime, timedelta
import secrets
import string

sys.path.append(os.path.dirname(__file__))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Base, Candidate, Voter, ElectionSettings
from app.database.config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def generate_code(length=8):
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

def seed_database():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")

    db = SessionLocal()

    try:
        print("\nClearing existing data...")
        db.query(Voter).delete()
        db.query(Candidate).delete()
        db.query(ElectionSettings).delete()
        db.commit()

        print("\nAdding election settings...")
        settings = ElectionSettings(
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow() + timedelta(days=7),
            is_active=True
        )
        db.add(settings)
        db.commit()
        print(f"✓ Election period: {settings.start_time.date()} to {settings.end_time.date()}")

        print("\nAdding candidates...")
        candidates_data = [
            # President
            {"name": "John Adeyemi", "position": "President"},
            {"name": "Sarah Okonkwo", "position": "President"},
            {"name": "Michael Bello", "position": "President"},

            # Vice President
            {"name": "Grace Ikenna", "position": "Vice President"},
            {"name": "David Musa", "position": "Vice President"},

            # General Secretary
            {"name": "Ngozi Eze", "position": "General Secretary"},
            {"name": "Ibrahim Yusuf", "position": "General Secretary"},
            {"name": "Chioma Nwosu", "position": "General Secretary"},

            # Financial Secretary
            {"name": "Ahmed Hassan", "position": "Financial Secretary"},
            {"name": "Blessing Okoro", "position": "Financial Secretary"},

            # Treasurer
            {"name": "Emeka Obi", "position": "Treasurer"},
            {"name": "Fatima Abdullahi", "position": "Treasurer"},
            {"name": "Tunde Ajayi", "position": "Treasurer"},

            # Auditor
            {"name": "Kemi Adebayo", "position": "Auditor"},
            {"name": "Chinedu Okafor", "position": "Auditor"},

            # PRO
            {"name": "Amina Mohammed", "position": "Public Relations Officer"},
            {"name": "Joseph Ojo", "position": "Public Relations Officer"},
            {"name": "Rita Chukwu", "position": "Public Relations Officer"},
        ]

        for candidate_data in candidates_data:
            candidate = Candidate(**candidate_data)
            db.add(candidate)
            print(f"✓ Added {candidate_data['name']} for {candidate_data['position']}")

        db.commit()
        print(f"\nTotal candidates added: {len(candidates_data)}")

        print("\nGenerating voting codes...")
        num_voters = 20
        codes = []

        for i in range(num_voters):
            code = generate_code()
            while db.query(Voter).filter(Voter.code == code).first():
                code = generate_code()

            voter = Voter(code=code)
            db.add(voter)
            codes.append(code)

        db.commit()
        print(f"✓ Generated {num_voters} voting codes")

        print("\n" + "="*50)
        print("SAMPLE VOTING CODES (for testing):")
        print("="*50)
        for i, code in enumerate(codes[:5], 1):
            print(f"{i}. {code}")
        print(f"... and {len(codes) - 5} more codes")
        print("="*50)

        print("\nAll voting codes:")
        for code in codes:
            print(code)

        with open("voting_codes.txt", "w") as f:
            f.write("Alumni Election 2003 - Voting Codes\n")
            f.write("="*50 + "\n\n")
            for i, code in enumerate(codes, 1):
                f.write(f"{i}. {code}\n")

        print(f"\n✓ All codes saved to voting_codes.txt")

        print("\n" + "="*50)
        print("DATABASE SEEDING COMPLETED SUCCESSFULLY!")
        print("="*50)
        print("\nYou can now:")
        print("1. Start the backend: uvicorn app.main:app --reload")
        print("2. Start the frontend: npm run dev")
        print("3. Use any of the voting codes above to test voting")
        print("4. Admin login - username: admin, password: changeme123")
        print("="*50)

    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("="*50)
    print("ALUMNI ELECTION SYSTEM - DATABASE SEEDING")
    print("="*50)
    seed_database()
